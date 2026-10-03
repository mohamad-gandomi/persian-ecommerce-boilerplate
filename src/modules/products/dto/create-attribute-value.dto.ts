import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAttributeValueDto {
  @ApiProperty({ example: 'Solid Walnut' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'walnut', description: 'Internal value/slug' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: '#5C4033', description: 'Hex color code for visual color swatches' })
  @IsOptional()
  @IsString()
  colorHex?: string;

  @ApiPropertyOptional({ example: 'http://localhost:4000/uploads/fabric.webp', description: 'Image swatch URL for fabrics/textures' })
  @IsOptional()
  @IsString()
  image?: string;
}

export class UpdateAttributeValueDto {
  @ApiPropertyOptional({ example: 'Solid Walnut' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'walnut' })
  @IsOptional()
  @IsString()
  value?: string;

  @ApiPropertyOptional({ example: '#5C4033' })
  @IsOptional()
  @IsString()
  colorHex?: string;

  @ApiPropertyOptional({ example: 'http://localhost:4000/uploads/fabric.webp' })
  @IsOptional()
  @IsString()
  image?: string;
}

