import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'customer@store.local', description: 'Customer registered email address' })
  @IsEmail({}, { message: 'لطفاً یک آدرس ایمیل معتبر وارد فرمایید' })
  @IsNotEmpty({ message: 'آدرس ایمیل الزامی است' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset JWT token' })
  @IsString()
  @IsNotEmpty({ message: 'توکن بازنشانی الزامی است' })
  token: string;

  @ApiProperty({ example: 'NewSecret123!', description: 'New account password' })
  @IsString()
  @MinLength(6, { message: 'کلمه عبور باید حداقل ۶ کاراکتر باشد' })
  newPassword: string;
}
