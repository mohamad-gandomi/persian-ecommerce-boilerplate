import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { QueryMediaDto, UpdateMediaDto, UploadImageDto } from './dto/upload.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Media & Uploads')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse media catalog (filter by search or mimeType)' })
  findAll(@Query() query: QueryMediaDto) {
    return this.uploadService.findAll(query);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get media storage statistics (database catalog vs local disk)' })
  getStats() {
    return this.uploadService.getStorageStats();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get single media asset by ID' })
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(id);
  }

  @Post(['image', ''])
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Upload media image with optional local WebP optimization' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        altText: {
          type: 'string',
        },
        convertToWebp: {
          type: 'boolean',
          default: true,
          description: 'Convert to modern WebP format for fast web delivery',
        },
        quality: {
          type: 'number',
          default: 80,
          description: 'WebP compression quality (1-100)',
        },
        maxWidth: {
          type: 'number',
          default: 2048,
          description: 'Maximum width in pixels to downscale ultra-large photos (0 for original)',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|webp|svg\+xml|gif|tiff)$/)) {
          return cb(
            new BadRequestException('Only image files (jpg, jpeg, png, webp, svg, gif, tiff) are allowed!'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 15 * 1024 * 1024, // 15MB limit
      },
    }),
  )
  uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadImageDto,
  ) {
    const convertToWebp =
      body.convertToWebp === undefined
        ? true
        : body.convertToWebp === true || body.convertToWebp === 'true' || body.convertToWebp === '1';

    return this.uploadService.handleUploadedFile(file, {
      altText: body.altText,
      convertToWebp,
      quality: body.quality ? Number(body.quality) : 80,
      maxWidth: body.maxWidth !== undefined ? Number(body.maxWidth) : 2048,
    });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Update media metadata (altText, caption)' })
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.uploadService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin: Delete media asset from database and local storage' })
  remove(@Param('id') id: string) {
    return this.uploadService.remove(id);
  }
}
