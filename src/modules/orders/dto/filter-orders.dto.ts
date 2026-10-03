import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class FilterOrdersDto extends PaginationDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsOptional()
  @Transform(({ value }) => (value === 'ALL' || value === '' ? undefined : value))
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ enum: PaymentStatus })
  @IsOptional()
  @Transform(({ value }) => (value === 'ALL' || value === '' ? undefined : value))
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Search by Order Number, Customer Name, or Email' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string;
}
