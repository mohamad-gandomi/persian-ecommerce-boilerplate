import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VerifyPaymentDto {
  @ApiPropertyOptional({ example: 'A000000000000000000000000001006' })
  @IsOptional()
  @IsString()
  Authority?: string;

  @ApiPropertyOptional({ example: 'OK' })
  @IsOptional()
  @IsString()
  Status?: string;

  @ApiPropertyOptional({ example: 'order-uuid' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  session_id?: string;
}
