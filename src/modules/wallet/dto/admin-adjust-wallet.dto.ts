import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminAdjustWalletDto {
  @ApiProperty({
    description: 'Amount to adjust. Positive value credits wallet, negative value debits wallet.',
    example: 50000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Reason / Note for this administrative adjustment',
    example: 'پاداش وفاداری مشتری / اصلاحیه حسابداری',
  })
  @IsString()
  @IsNotEmpty({ message: 'علت و توضیح تغییر موجودی الزامی است' })
  description: string;
}
