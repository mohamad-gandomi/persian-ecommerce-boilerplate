import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({ example: 'Woodcraft & Design Guides' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'woodcraft-and-design-guides' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Expert advice on woodworking and styling.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'uuid-parent-id' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;
}
