import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '@prisma/client';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'The Art of Hardwood Joinery: Why Solid Oak Endures' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'the-art-of-hardwood-joinery' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'Full markdown or HTML content of the article...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'A brief preview summary for cards and search snippets' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1540574163026' })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({ enum: PostStatus, default: PostStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({ example: 'category-uuid' })
  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class UpdateBlogPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  categoryId?: string;
}
