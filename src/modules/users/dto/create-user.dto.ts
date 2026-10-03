import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@/common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'customer@example.com' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'SecurePassword123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'James' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Miller' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+1 555-234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CUSTOMER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
