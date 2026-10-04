import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@/common/enums/role.enum';
import { IsIranianNationalId } from '@/common/validators/is-national-id.validator';

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

  @ApiPropertyOptional({ example: '0012345678', description: '10-digit Iranian National ID' })
  @IsOptional()
  @IsString()
  @IsIranianNationalId()
  nationalId?: string;

  @ApiPropertyOptional({ example: '1990-05-15T00:00:00.000Z', description: 'Birth date in Gregorian ISO format' })
  @IsOptional()
  @IsDateString({}, { message: 'تاریخ تولد باید با فرمت معتبر میلادی (ISO) ارسال شود' })
  birthDate?: string;

  @ApiPropertyOptional({ enum: Role, default: Role.CUSTOMER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
