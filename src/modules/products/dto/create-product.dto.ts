import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductStatus, ProductType, RewardType } from '@prisma/client';
import { CreateVariantDto } from './create-variant.dto';

export class ProductImageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  createdAt?: any;

  @ApiPropertyOptional()
  @IsOptional()
  updatedAt?: any;

  @ApiProperty({ example: 'https://images.unsplash.com/photo-1567538096630' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({ example: 'Front view of chair' })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class ProductAttributeLinkDto {
  @ApiProperty({ example: 'attribute-uuid' })
  @IsString()
  @IsNotEmpty()
  attributeId: string;

  @ApiPropertyOptional({ default: true, description: 'True if used for variations, false if for specification display' })
  @IsOptional()
  @IsBoolean()
  isVariation?: boolean;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Nordic Minimalist Lounge Armchair' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'nordic-minimalist-lounge-armchair' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'SW-ARM-001' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ enum: ProductType, default: ProductType.SIMPLE })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiProperty({ example: 'Detailed description of the furniture item...' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ example: 'Short summary for card previews' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ example: 450.0, description: 'Base price or starting-at price for variations' })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiPropertyOptional({ example: 399.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  manageStock?: boolean;

  @ApiPropertyOptional({ example: '82x86x78 cm' })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiPropertyOptional({ example: 18.5, description: 'Weight in kg' })
  @IsOptional()
  @IsNumber()
  weight?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.PUBLISHED })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ example: 'category-uuid' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ type: [ProductImageDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images?: ProductImageDto[];

  @ApiPropertyOptional({ type: [ProductAttributeLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductAttributeLinkDto)
  attributes?: ProductAttributeLinkDto[];

  @ApiPropertyOptional({ type: [CreateVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];

  @ApiPropertyOptional({
    example: [{ label: 'Timber Origin', value: 'Sustainably Harvested European White Oak' }],
    description: 'Repeater key-value list of artisanal specifications',
  })
  @IsOptional()
  @IsArray()
  specifications?: Array<{ label: string; value: string }>;

  @ApiPropertyOptional({ enum: RewardType, default: RewardType.INHERIT })
  @IsOptional()
  @IsEnum(RewardType)
  rewardType?: RewardType;

  @ApiPropertyOptional({ description: 'Referrer reward value override (amount or %)', example: 10 })
  @IsOptional()
  @IsNumber()
  referrerRewardValue?: number;

  @ApiPropertyOptional({ description: 'Referee/buyer reward value override (amount or %)', example: 15000 })
  @IsOptional()
  @IsNumber()
  refereeRewardValue?: number;
}
