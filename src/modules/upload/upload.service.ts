import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as sharpModule from 'sharp';
const sharp = (sharpModule as any).default || sharpModule;
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';
import { QueryMediaDto, UpdateMediaDto } from './dto/upload.dto';

export interface UploadProcessingOptions {
  altText?: string;
  convertToWebp?: boolean;
  quality?: number;
  maxWidth?: number;
}

@Injectable()
export class UploadService {
  private uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = path.resolve(
      process.cwd(),
      this.configService.get<string>('upload.dir') || './uploads',
    );
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async handleUploadedFile(file: Express.Multer.File, options?: UploadProcessingOptions) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    let originalExt = path.extname(file.originalname).toLowerCase();
    if (!originalExt && file.mimetype) {
      originalExt = '.' + file.mimetype.split('/')[1];
    }

    const inputBuffer = file.buffer || (file.path ? await fs.promises.readFile(file.path) : null);
    if (!inputBuffer) {
      throw new BadRequestException('File buffer or path missing');
    }

    const isConvertibleImage = ['image/jpeg', 'image/png', 'image/webp', 'image/tiff', 'image/gif'].includes(
      file.mimetype,
    );
    const shouldConvertToWebp = options?.convertToWebp !== false && isConvertibleImage;
    const quality = options?.quality ? Math.min(Math.max(Number(options.quality), 1), 100) : 80;
    const maxWidth = options?.maxWidth !== undefined ? Number(options.maxWidth) : 2048;

    let finalBuffer = inputBuffer;
    let finalExt = originalExt || '.jpg';
    let finalMimeType = file.mimetype;
    let width: number | null = null;
    let height: number | null = null;

    if (isConvertibleImage) {
      try {
        let pipeline = sharp(inputBuffer);
        const metadata = await pipeline.metadata();
        width = metadata.width || null;
        height = metadata.height || null;

        // Auto-orient based on EXIF camera metadata
        pipeline = pipeline.rotate();

        // Downscale ultra-large original photos if width exceeds maxWidth
        if (maxWidth > 0 && width && width > maxWidth) {
          pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
        }

        if (shouldConvertToWebp) {
          pipeline = pipeline.webp({ quality, effort: 4 });
          finalExt = '.webp';
          finalMimeType = 'image/webp';
        }

        const result = await pipeline.toBuffer({ resolveWithObject: true });
        finalBuffer = result.data;
        width = result.info.width;
        height = result.info.height;
      } catch (err) {
        console.warn('Sharp optimization fallback (using original):', err);
        finalBuffer = inputBuffer;
      }
    }

    const finalFilename = `furniture-${uniqueSuffix}${finalExt}`;
    const finalPath = path.join(this.uploadDir, finalFilename);
    await fs.promises.writeFile(finalPath, finalBuffer);

    // If temporary file on disk was created by multer, clean it up
    if (file.path && fs.existsSync(file.path)) {
      try {
        await fs.promises.unlink(file.path);
      } catch {
        // ignore
      }
    }

    const port = this.configService.get<number>('port', 4000);
    const relativeUrl = `http://localhost:${port}/uploads/${finalFilename}`;

    // If converted (e.g. to WebP), update the original name extension (e.g. front.jpg -> front.webp)
    const baseName = file.originalname.replace(/\.[^/.]+$/, '');
    const displayName = finalExt ? `${baseName}${finalExt}` : file.originalname;

    const media = await this.prisma.media.create({
      data: {
        filename: finalFilename,
        originalName: displayName,
        mimeType: finalMimeType,
        size: finalBuffer.length,
        width,
        height,
        url: relativeUrl,
        altText: options?.altText || baseName.replace(/[-_]/g, ' '),
      },
    });

    return media;
  }

  async findAll(query?: QueryMediaDto) {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { filename: { contains: query.search, mode: 'insensitive' } },
        { originalName: { contains: query.search, mode: 'insensitive' } },
        { altText: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.mimeType) {
      where.mimeType = { startsWith: query.mimeType };
    }

    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      throw new NotFoundException(`Media asset with ID "${id}" not found`);
    }

    return media;
  }

  async update(id: string, dto: UpdateMediaDto) {
    await this.findOne(id);

    return this.prisma.media.update({
      where: { id },
      data: {
        altText: dto.altText,
        caption: dto.caption,
      },
    });
  }

  async remove(id: string) {
    const media = await this.findOne(id);

    // Remove file from disk if it exists locally
    const filePath = path.join(this.uploadDir, media.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn(`Could not delete local file ${filePath}:`, err);
      }
    }

    await this.prisma.media.delete({
      where: { id },
    });

    return { success: true, id };
  }

  async getStorageStats() {
    const totalAssets = await this.prisma.media.count();
    const aggregate = await this.prisma.media.aggregate({
      _sum: { size: true },
    });

    let diskSize = 0;
    let localFilesCount = 0;
    if (fs.existsSync(this.uploadDir)) {
      const files = fs.readdirSync(this.uploadDir);
      for (const file of files) {
        if (file !== '.gitkeep') {
          try {
            const stat = fs.statSync(path.join(this.uploadDir, file));
            if (stat.isFile()) {
              diskSize += stat.size;
              localFilesCount++;
            }
          } catch {
            // no-op
          }
        }
      }
    }

    return {
      totalAssets,
      catalogSize: aggregate._sum.size || 0,
      diskSize,
      localFilesCount,
    };
  }
}

