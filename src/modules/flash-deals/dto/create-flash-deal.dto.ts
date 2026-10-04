import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class FlashDealItemInputDto {
  @ApiProperty({ description: 'ID of the product' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiProperty({ example: 12, description: 'Percentage or fixed discount value' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ example: 198000, description: 'Special sale price (calculated if omitted)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  specialPrice?: number;

  @ApiPropertyOptional({ example: 12000, description: 'Extra cashback added to wallet on purchase' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cashbackAmount?: number;

  @ApiPropertyOptional({ example: 15000, description: 'Referrer reward for this deal item (in Toman)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  referrerReward?: number;

  @ApiPropertyOptional({ example: 50, description: 'Max units allowed at special price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stockLimit?: number;
}

export class CreateFlashDealDto {
  @ApiProperty({ example: 'تخفیف شگفت‌انگیز' })
  @IsString()
  @IsNotEmpty({ message: 'عنوان کمپین شگفت‌انگیز الزامی است' })
  title: string;

  @ApiPropertyOptional({ example: 'flash-deal-summer' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'تا پایان زمان، فرصت خرید با پاداش بیشتر داری.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'فروش ویژه', default: 'پیشنهاد شگفت‌انگیز' })
  @IsOptional()
  @IsString()
  badgeText?: string;

  @ApiPropertyOptional({ example: 'http://localhost:4000/uploads/banner.webp' })
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @ApiProperty({ example: '2026-10-04T08:00:00.000Z' })
  @IsDateString({}, { message: 'تاریخ شروع باید با فرمت معتبر ISO باشد' })
  @IsNotEmpty({ message: 'تاریخ و ساعت شروع الزامی است' })
  startDate: string;

  @ApiProperty({ example: '2026-10-04T22:00:00.000Z' })
  @IsDateString({}, { message: 'تاریخ پایان باید با فرمت معتبر ISO باشد' })
  @IsNotEmpty({ message: 'تاریخ و ساعت پایان الزامی است' })
  endDate: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 12000, description: 'Default cashback for items (in Toman)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultCashback?: number;

  @ApiPropertyOptional({ example: 15000, description: 'Default referrer reward for items (in Toman)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  defaultReferrerReward?: number;

  @ApiPropertyOptional({ type: [FlashDealItemInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FlashDealItemInputDto)
  items?: FlashDealItemInputDto[];
}
