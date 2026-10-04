import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class DepositWalletDto {
  @ApiProperty({ description: 'Amount to charge wallet (in Toman / base currency)', example: 100000 })
  @IsNumber()
  @IsPositive()
  @Min(10000, { message: 'حداقل مبلغ شارژ کیف پول ۱۰,۰۰۰ تومان است' })
  amount: number;

  @ApiProperty({ description: 'Payment gateway', default: 'ZARINPAL', required: false })
  @IsOptional()
  @IsString()
  gateway?: string;
}
