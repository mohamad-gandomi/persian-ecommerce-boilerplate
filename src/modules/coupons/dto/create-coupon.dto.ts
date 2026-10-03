import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class CreateCouponDto {
  @ApiProperty({ example: 'WELCOME10', description: 'Unique coupon promo code' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: '10% off your entire first furniture order' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ example: 10, description: 'Percentage or fixed dollar amount' })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  discountValue: number;

  @ApiPropertyOptional({ example: 200, description: 'Minimum cart subtotal to qualify' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({ example: 150, description: 'Maximum discount ceiling for percentage coupons' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiPropertyOptional({ example: '2026-01-01T00:00:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 500, description: 'Maximum total redemptions allowed' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
