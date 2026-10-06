import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SettingsModule } from '../settings/settings.module';
import { SmsService } from './sms.service';

@Global()
@Module({
  imports: [ConfigModule, SettingsModule],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
