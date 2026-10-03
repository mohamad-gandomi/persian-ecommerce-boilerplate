import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    example: '09123456789',
    description: 'Iranian or international mobile phone number for OTP verification',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+98|0)?9\d{9}$|^[0-9+ ]{10,16}$/, {
    message: 'Please provide a valid mobile phone number (e.g. 09123456789)',
  })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: '09123456789',
    description: 'Mobile phone number associated with the OTP request',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '48291',
    description: 'The 5-digit verification code received via SMS',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ChangePhoneSendOtpDto {
  @ApiProperty({
    example: '09123456789',
    description: 'New mobile phone number to verify and assign to profile',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(\+98|0)?9\d{9}$|^[0-9+ ]{10,16}$/, {
    message: 'Please provide a valid mobile phone number (e.g. 09123456789)',
  })
  newPhone: string;
}

export class ChangePhoneVerifyDto {
  @ApiProperty({
    example: '09123456789',
    description: 'New mobile phone number being verified',
  })
  @IsString()
  @IsNotEmpty()
  newPhone: string;

  @ApiProperty({
    example: '48291',
    description: 'The 5-digit verification code received via SMS',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
