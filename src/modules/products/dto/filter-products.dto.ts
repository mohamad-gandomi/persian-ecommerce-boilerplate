import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ProductStatus } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export enum ProductSortBy {
  NEWEST = 'newest',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
}

export class FilterProductsDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Search term for name, description, material, or SKU' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by category slug' })
  @IsOptional()
  @IsString()
  categorySlug?: string;

  @ApiPropertyOptional({ description: 'Filter products by minimum base price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Filter products by maximum base price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Filter only featured furniture items' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ enum: ProductStatus, description: 'Product publication status' })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ enum: ProductSortBy, default: ProductSortBy.NEWEST })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy = ProductSortBy.NEWEST;
}
