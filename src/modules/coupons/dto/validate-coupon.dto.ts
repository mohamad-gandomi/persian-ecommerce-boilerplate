import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ValidateCouponDto {
  @ApiProperty({ example: 'WELCOME10', description: 'Coupon code to test' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 450.0, description: 'Cart subtotal to validate eligibility and calculate discount' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  cartSubtotal: number;
}
