import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FilterBlogPostsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search title, content, or excerpt' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by blog category slug' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ enum: PostStatus })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;
}
