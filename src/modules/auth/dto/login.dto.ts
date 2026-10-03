import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@store.local', description: 'User email, username, or phone number' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Admin@123456', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
