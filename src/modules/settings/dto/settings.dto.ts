import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSettingDto {
  @ApiProperty({ description: 'Setting value (object, primitive, or array)' })
  @IsNotEmpty()
  value: any;
}
