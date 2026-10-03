import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'SW-ARM-WAL-FOR', description: 'Unique SKU for this variation' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 530.0, description: 'Price for this variation' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 490.0, description: 'Discounted sale price' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ example: 10, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1567538096630' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 18.5, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ example: '82x86x78 cm' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: ['uuid-of-walnut-value', 'uuid-of-forest-velvet-value'],
    description: 'Array of AttributeValue UUIDs that define this variation',
  })
  @IsArray()
  @IsString({ each: true })
  attributeValueIds: string[];
}

export class UpdateVariantDto {
  @ApiPropertyOptional({ example: 'SW-ARM-WAL-FOR' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ example: 530.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 490.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: ['uuid-of-walnut-value', 'uuid-of-forest-velvet-value'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attributeValueIds?: string[];
}
