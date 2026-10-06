import { Injectable, Logger } from '@nestjs/common';
import { SmsService } from '../sms/sms.service';

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  isDev?: boolean;
  message?: string;
}

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);

  constructor(private readonly smsService: SmsService) {}

  async sendVerificationCode(phone: string, code: string): Promise<SendOtpResult> {
    const res = await this.smsService.sendOtp(phone, code);
    return {
      success: res.success,
      messageId: res.messageId,
      isDev: res.isDev,
      message: res.message,
    };
  }
}
