import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DiscountType } from '@prisma/client';

export class AddDealItemDto {
  @ApiProperty({ description: 'Product ID to add to deal' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiPropertyOptional({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @ApiProperty({ example: 12, description: 'Percentage or fixed amount discount' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discountValue: number;

  @ApiPropertyOptional({ example: 198000, description: 'Direct special price (calculated if omitted)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  specialPrice?: number;

  @ApiPropertyOptional({ example: 12000, description: 'Extra cashback in Toman' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cashbackAmount?: number;

  @ApiPropertyOptional({ example: 15000, description: 'Referrer reward in Toman' })
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
