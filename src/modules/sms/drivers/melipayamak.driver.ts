import { Logger } from '@nestjs/common';
import { ISmsDriver, SmsResult, SmsProviderConfig } from '../interfaces/sms-driver.interface';

export class MelipayamakDriver implements ISmsDriver {
  readonly id = 'melipayamak';
  readonly title = 'ملی‌پیامک (Melipayamak)';
  private readonly logger = new Logger('MelipayamakDriver');
  private readonly username: string;
  private readonly password: string;
  private readonly sender: string;

  constructor(config: SmsProviderConfig) {
    this.username = (config.username || config.apiKey || '').trim();
    this.password = (config.password || '').trim();
    this.sender = (config.sender || '').trim();
  }

  private isMock(): boolean {
    return !this.username || !this.password || this.username === 'username' || this.password === 'password';
  }

  async sendSimple(to: string, message: string): Promise<SmsResult> {
    const cleanPhone = to.trim();

    if (this.isMock()) {
      this.logger.warn(`[Melipayamak Dev Mode] Simple SMS to ${cleanPhone}: "${message}"`);
      return { success: true, isDev: true, message: 'Dev Mode: Melipayamak SMS logged to console' };
    }

    try {
      const response = await fetch('https://rest.payamak-panel.com/api/SendSMS/SendSMS', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          to: cleanPhone,
          from: this.sender || '50004',
          text: message,
          isFlash: false,
        }),
      });

      const data = await response.json();

      // Melipayamak returns RetStatus = 1 on success and Value contains the recId
      if (response.ok && (data?.RetStatus === 1 || data?.Value?.length > 10 || Number(data?.Value) > 0)) {
        this.logger.log(`[Melipayamak] SMS sent to ${cleanPhone}. RecID: ${data.Value}`);
        return { success: true, messageId: String(data.Value) };
      }

      this.logger.error(`[Melipayamak] SendSMS failed: ${JSON.stringify(data)}`);
      return { success: false, message: data?.StrRetStatus || 'خطا در ارسال پیامک با ملی‌پیامک' };
    } catch (err: any) {
      this.logger.error(`[Melipayamak] Error sending SMS to ${cleanPhone}: ${err.message}`);
      return { success: false, message: err.message };
    }
  }

  async sendPattern(to: string, patternCodeOrName: string, params: Record<string, string>): Promise<SmsResult> {
    const cleanPhone = to.trim();

    if (this.isMock()) {
      this.logger.warn(
        `[Melipayamak Dev Mode] Pattern [${patternCodeOrName}] to ${cleanPhone}: ${JSON.stringify(params)}`,
      );
      return { success: true, isDev: true, message: 'Dev Mode: Melipayamak pattern logged to console' };
    }

    try {
      // Convert params values into array or semicolon-separated string for Melipayamak
      const textArgs = Object.values(params).map((v) => String(v || '').trim());

      const response = await fetch('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          password: this.password,
          text: textArgs,
          to: cleanPhone,
          bodyId: Number(patternCodeOrName) || 0,
        }),
      });

      const data = await response.json();

      if (response.ok && (data?.RetStatus === 1 || Number(data?.Value) > 0 || data?.Value?.length > 10)) {
        this.logger.log(`[Melipayamak] Pattern [${patternCodeOrName}] sent to ${cleanPhone}. ID: ${data.Value}`);
        return { success: true, messageId: String(data.Value) };
      }

      this.logger.error(`[Melipayamak] BaseServiceNumber failed: ${JSON.stringify(data)}`);
      return { success: false, message: data?.StrRetStatus || 'خطا در ارسال پترن خدماتی ملی‌پیامک' };
    } catch (err: any) {
      this.logger.error(`[Melipayamak] Pattern error sending to ${cleanPhone}: ${err.message}`);
      return { success: false, message: err.message };
    }
  }
}
