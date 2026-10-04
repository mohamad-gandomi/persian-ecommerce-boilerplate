import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from '@/common/enums/role.enum';
import { IsIranianNationalId } from '@/common/validators/is-national-id.validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'customer@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'NewSecurePassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
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

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
