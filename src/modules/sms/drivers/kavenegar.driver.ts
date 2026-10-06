import { Logger } from '@nestjs/common';
import { ISmsDriver, SmsResult, SmsProviderConfig } from '../interfaces/sms-driver.interface';

export class KavenegarDriver implements ISmsDriver {
  readonly id = 'kavenegar';
  readonly title = 'کاوه‌نگار (Kavenegar)';
  private readonly logger = new Logger('KavenegarDriver');
  private readonly apiKey: string;
  private readonly sender: string;

  constructor(config: SmsProviderConfig) {
    this.apiKey = (config.apiKey || '').trim();
    this.sender = (config.sender || '').trim();
  }

  private isMock(): boolean {
    return !this.apiKey || this.apiKey === 'your-kavenegar-api-key' || this.apiKey === '';
  }

  async sendSimple(to: string, message: string): Promise<SmsResult> {
    const cleanPhone = to.trim();

    if (this.isMock()) {
      this.logger.warn(`[Kavenegar Dev Mode] Simple SMS to ${cleanPhone}: "${message}"`);
      return { success: true, isDev: true, message: 'Dev Mode: Simple SMS logged to console' };
    }

    try {
      const url = new URL(`https://api.kavenegar.com/v1/${this.apiKey}/sms/send.json`);
      url.searchParams.append('receptor', cleanPhone);
      url.searchParams.append('message', message);
      if (this.sender) {
        url.searchParams.append('sender', this.sender);
      }

      const res = await fetch(url.toString(), { method: 'POST' });
      const data = await res.json();

      if (res.ok && data?.return?.status === 200) {
        const messageId = data?.entries?.[0]?.messageid ? String(data.entries[0].messageid) : undefined;
        this.logger.log(`[Kavenegar] SMS dispatched to ${cleanPhone}. Message ID: ${messageId}`);
        return { success: true, messageId };
      }

      this.logger.error(`[Kavenegar] Simple SMS failed: ${JSON.stringify(data?.return)}`);
      return { success: false, message: data?.return?.message || 'ارسال پیامک با کاوه‌نگار ناموفق بود' };
    } catch (err: any) {
      this.logger.error(`[Kavenegar] Error sending simple SMS to ${cleanPhone}: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async sendPattern(to: string, patternCodeOrName: string, params: Record<string, string>): Promise<SmsResult> {
    const cleanPhone = to.trim();

    if (this.isMock()) {
      this.logger.warn(
        `[Kavenegar Dev Mode] Pattern [${patternCodeOrName}] to ${cleanPhone}: ${JSON.stringify(params)}`,
      );
      return { success: true, isDev: true, message: 'Dev Mode: Pattern SMS logged to console' };
    }

    try {
      const url = new URL(`https://api.kavenegar.com/v1/${this.apiKey}/verify/lookup.json`);
      url.searchParams.append('receptor', cleanPhone);
      url.searchParams.append('template', patternCodeOrName);

      // Kavenegar expects token, token2, token3, token10, token20
      const tokenKeys = Object.keys(params);
      tokenKeys.forEach((key, idx) => {
        const val = String(params[key] || '').replace(/\s+/g, '-');
        if (key.startsWith('token')) {
          url.searchParams.append(key, val);
        } else if (idx === 0) {
          url.searchParams.append('token', val);
        } else if (idx === 1) {
          url.searchParams.append('token2', val);
        } else if (idx === 2) {
          url.searchParams.append('token3', val);
        } else {
          url.searchParams.append(`token${idx + 1}`, val);
        }
      });

      const res = await fetch(url.toString(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const data = await res.json();

      if (res.ok && data?.return?.status === 200) {
        const messageId = data?.entries?.[0]?.messageid ? String(data.entries[0].messageid) : undefined;
        this.logger.log(`[Kavenegar] Pattern [${patternCodeOrName}] dispatched to ${cleanPhone}. ID: ${messageId}`);
        return { success: true, messageId };
      }

      this.logger.warn(`[Kavenegar] Lookup API error: ${JSON.stringify(data?.return)}`);
      return { success: false, message: data?.return?.message || 'ارسال الگوی کاوه‌نگار با خطا مواجه شد' };
    } catch (err: any) {
      this.logger.error(`[Kavenegar] Pattern error sending to ${cleanPhone}: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}
