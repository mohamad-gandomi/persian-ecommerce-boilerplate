import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMediaDto {
  @ApiPropertyOptional({ description: 'Alternative descriptive text for accessibility & SEO' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Display caption or subtitle for media asset' })
  @IsOptional()
  @IsString()
  caption?: string;
}

export class QueryMediaDto {
  @ApiPropertyOptional({ description: 'Search term for filename, original name, or alt text' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by MIME type (e.g. image/jpeg, image/png)' })
  @IsOptional()
  @IsString()
  mimeType?: string;
}

export class UploadImageDto {
  @ApiPropertyOptional({ description: 'Alternative descriptive text for accessibility & SEO' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ description: 'Convert image to optimized WebP format (default: true)', default: true })
  @IsOptional()
  convertToWebp?: boolean | string;

  @ApiPropertyOptional({ description: 'Compression quality (1-100, default: 80)', default: 80 })
  @IsOptional()
  quality?: number | string;

  @ApiPropertyOptional({ description: 'Maximum pixel width for downscaling large originals (default: 2048)', default: 2048 })
  @IsOptional()
  maxWidth?: number | string;
}
