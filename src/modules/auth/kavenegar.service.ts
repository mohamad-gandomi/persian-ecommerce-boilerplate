import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  isDev?: boolean;
  message?: string;
}

@Injectable()
export class KavenegarService {
  private readonly logger = new Logger(KavenegarService.name);
  private readonly apiKey: string;
  private readonly template: string;
  private readonly sender: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('KAVENEGAR_API_KEY') || process.env.KAVENEGAR_API_KEY || '';
    this.template = this.configService.get<string>('KAVENEGAR_TEMPLATE') || process.env.KAVENEGAR_TEMPLATE || 'verify';
    this.sender = this.configService.get<string>('KAVENEGAR_SENDER') || process.env.KAVENEGAR_SENDER || '';
  }

  async sendVerificationCode(phone: string, code: string): Promise<SendOtpResult> {
    const cleanPhone = phone.trim();

    // Development / Mock mode if API key is not configured
    if (!this.apiKey || this.apiKey.trim() === '' || this.apiKey === 'your-kavenegar-api-key') {
      this.logger.warn(`[Kavenegar Dev Mode] SMS to ${cleanPhone} -> Verification Code: [ ${code} ]`);
      return {
        success: true,
        isDev: true,
        message: 'Dev mode: verification code logged to server console',
      };
    }

    // Live Kavenegar Verify Lookup API
    try {
      const url = new URL(`https://api.kavenegar.com/v1/${this.apiKey}/verify/lookup.json`);
      url.searchParams.append('receptor', cleanPhone);
      url.searchParams.append('token', code);
      url.searchParams.append('template', this.template);

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = await response.json();

      if (response.ok && data?.return?.status === 200) {
        const messageId = data?.entries?.[0]?.messageid ? String(data.entries[0].messageid) : undefined;
        this.logger.log(`[Kavenegar] OTP successfully dispatched to ${cleanPhone}. Message ID: ${messageId}`);
        return { success: true, messageId };
      }

      this.logger.warn(`[Kavenegar] Lookup API error: ${JSON.stringify(data?.return)}. Attempting standard SMS fallback...`);
      return await this.sendFallbackSms(cleanPhone, code);
    } catch (err: any) {
      this.logger.error(`[Kavenegar] Network error sending OTP to ${cleanPhone}: ${err.message}. Trying fallback...`);
      return await this.sendFallbackSms(cleanPhone, code);
    }
  }

  private async sendFallbackSms(phone: string, code: string): Promise<SendOtpResult> {
    try {
      const url = new URL(`https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json`);
      url.searchParams.append('receptor', phone);
      url.searchParams.append('message', `کد تایید ورود به فروشگاه: ${code}`);
      if (this.sender) {
        url.searchParams.append('sender', this.sender);
      }

      const response = await fetch(url.toString(), { method: 'POST' });
      const data = await response.json();

      if (response.ok && data?.return?.status === 200) {
        const messageId = data?.entries?.[0]?.messageid ? String(data.entries[0].messageid) : undefined;
        return { success: true, messageId };
      }

      this.logger.error(`[Kavenegar] Fallback SMS failed: ${JSON.stringify(data?.return)}`);
      return { success: false, message: data?.return?.message || 'Kavenegar SMS delivery failed' };
    } catch (err: any) {
      this.logger.error(`[Kavenegar] Fallback SMS request error: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}
