import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Wood Finish' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'wood-finish', description: 'Generated from name if not provided' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'COLOR', description: 'Swatch display type: COLOR, IMAGE, or TEXT', default: 'TEXT' })
  @IsOptional()
  @IsString()
  displayType?: string;
}

export class UpdateAttributeDto {
  @ApiPropertyOptional({ example: 'Wood Finish' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'wood-finish' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'COLOR', description: 'Swatch display type: COLOR, IMAGE, or TEXT' })
  @IsOptional()
  @IsString()
  displayType?: string;
}

