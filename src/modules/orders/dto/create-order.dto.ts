import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemInputDto {
  @ApiPropertyOptional({ example: 'product-uuid' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class OrderAddressInputDto {
  @ApiProperty({ example: 'Alexander Wright' })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiProperty({ example: '+1 555-0245' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '742 Evergreen Terrace' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: 'Portland' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'Oregon' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ example: '97201' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiPropertyOptional({ example: 'United States', default: 'United States' })
  @IsOptional()
  @IsString()
  country?: string = 'United States';
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Alexander Wright' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiPropertyOptional({ example: 'customer@store.local' })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({ example: '+1 555-0245' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemInputDto)
  items: OrderItemInputDto[];

  @ApiPropertyOptional({ example: 'WOODCRAFT15' })
  @IsOptional()
  @IsString()
  couponCode?: string;

  @ApiPropertyOptional({ example: 'CREDIT_CARD', default: 'CREDIT_CARD' })
  @IsOptional()
  @IsString()
  paymentMethod?: string = 'CREDIT_CARD';

  @ApiProperty({ type: OrderAddressInputDto })
  @ValidateNested()
  @Type(() => OrderAddressInputDto)
  shippingAddress: OrderAddressInputDto;

  @ApiPropertyOptional({ type: OrderAddressInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => OrderAddressInputDto)
  billingAddress?: OrderAddressInputDto;

  @ApiPropertyOptional({ example: 'White Glove Freight Delivery' })
  @IsOptional()
  @IsString()
  shippingMethod?: string;

  @ApiPropertyOptional({ example: 'FedEx Freight' })
  @IsOptional()
  @IsString()
  shippingCarrier?: string;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiPropertyOptional({ example: 'Please place the dining table directly in dining room' })
  @IsOptional()
  @IsString()
  customerNotes?: string;
}
