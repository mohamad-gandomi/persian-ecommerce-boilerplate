import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Living Room' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'living-room', description: 'Generated from name if omitted' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Handcrafted wooden sofas, tables, and lounge chairs.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'c4e3e3b1-4f4e-4b4e-8f4e-4f4e4b4e4b4e', description: 'Parent category UUID if this is a subcategory' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
