import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Kourosh' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Rad' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'kourosh@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;
}
