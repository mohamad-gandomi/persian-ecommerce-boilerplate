import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BindReferralDto {
  @ApiProperty({
    description: 'The referral code of the inviter',
    example: 'REF-8492',
  })
  @IsString()
  @IsNotEmpty({ message: 'کد معرف نمی‌تواند خالی باشد' })
  code: string;
}
