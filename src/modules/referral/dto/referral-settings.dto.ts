import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum GlobalRewardType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export class UpdateReferralSettingsDto {
  @ApiProperty({ description: 'Whether the referral and rewards module is active', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: 'Whether global default reward applies to all products (if false, only products with explicit custom rewards yield rewards)',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enableGlobalReward?: boolean;

  @ApiProperty({
    description: 'Default reward calculation type across store (FIXED or PERCENTAGE)',
    enum: GlobalRewardType,
    default: GlobalRewardType.PERCENTAGE,
    required: false,
  })
  @IsOptional()
  @IsEnum(GlobalRewardType)
  defaultRewardType?: GlobalRewardType;

  @ApiProperty({
    description: 'Default reward value for referrer (amount in Toman or percentage %)',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultReferrerValue?: number;

  @ApiProperty({
    description: 'Default reward value for referee/buyer (amount in Toman or percentage %)',
    example: 20000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  defaultRefereeValue?: number;

  @ApiProperty({
    description: 'Minimum order amount in Toman required to unlock referral rewards',
    default: 100000,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiProperty({
    description: 'Order status that triggers reward release (e.g. DELIVERED)',
    default: 'DELIVERED',
    required: false,
  })
  @IsOptional()
  @IsString()
  releaseOnStatus?: string;

  @ApiProperty({
    description: 'Number of days referral cookie remains valid',
    default: 30,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cookieDays?: number;
}
