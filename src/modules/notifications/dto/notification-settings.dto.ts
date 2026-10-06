import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TestSmsDto {
  @ApiProperty({ example: 'kavenegar' })
  @IsNotEmpty()
  @IsString()
  providerId: string;

  @ApiProperty({ example: '09121234567' })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  credentials?: Record<string, any>;
}

export class UpdateNotificationSettingsDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  sms?: Record<string, any>;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  events?: Record<string, any>;
}
