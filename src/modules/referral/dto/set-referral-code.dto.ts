import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class SetReferralCodeDto {
  @ApiProperty({
    description: 'Custom alphanumeric referral code (3 to 20 characters)',
    example: 'MOHAMAD',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'کد معرف باید حداقل ۳ کاراکتر باشد' })
  @MaxLength(20, { message: 'کد معرف نمی‌تواند بیشتر از ۲۰ کاراکتر باشد' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'کد معرف فقط می‌تواند شامل حروف انگلیسی، اعداد، خط فاصله و زیرخط باشد',
  })
  code: string;
}
