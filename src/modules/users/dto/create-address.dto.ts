import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiPropertyOptional({ example: 'Home Residence', default: 'Home' })
  @IsOptional()
  @IsString()
  title?: string;

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

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefaultShipping?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefaultBilling?: boolean;
}
