import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'alexander@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecretPassword123!', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ example: 'Alexander', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Wright', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: '+1 555-0199', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}
