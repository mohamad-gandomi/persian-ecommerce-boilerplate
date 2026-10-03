import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PROCESSING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiPropertyOptional({ example: 'Passed to master workshop for assembly & inspection' })
  @IsOptional()
  @IsString()
  note?: string;
}
