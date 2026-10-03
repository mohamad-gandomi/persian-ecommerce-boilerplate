import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class UpdateOrderDto {
  @ApiPropertyOptional({ example: 'FEDEX-FRT-98214819' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ example: 'https://www.fedex.com/fedextrack/?trknbr=98214819' })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @ApiPropertyOptional({ example: 'White Glove Freight Delivery' })
  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @ApiPropertyOptional({ example: 'FedEx Freight' })
  @IsOptional()
  @IsString()
  shippingCarrier?: string;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ example: 'Customer requested protective cover inspection before dispatch' })
  @IsOptional()
  @IsString()
  internalNotes?: string;
}
