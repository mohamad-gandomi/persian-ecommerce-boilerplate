import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateShippingMethodDto {
  @ApiProperty({ example: 'Standard Fixed-Rate Delivery' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'FIXED', default: 'FIXED' })
  @IsOptional()
  @IsString()
  type?: string = 'FIXED';

  @ApiProperty({ example: 50.0, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'USD', default: 'USD' })
  @IsOptional()
  @IsString()
  currency?: string = 'USD';

  @ApiPropertyOptional({ example: 'Chapar / Standard Freight' })
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional({ example: '3-5 business days' })
  @IsOptional()
  @IsString()
  estimatedDays?: string;

  @ApiPropertyOptional({ example: 'Flat-rate secure furniture delivery with protective packaging.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean = false;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsNumber()
  displayOrder?: number = 0;
}

export class UpdateShippingMethodDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  carrier?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estimatedDays?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}
