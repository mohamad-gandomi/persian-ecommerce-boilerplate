import { Logger } from '@nestjs/common';
import { ISmsDriver, SmsResult } from '../interfaces/sms-driver.interface';

export class MockDriver implements ISmsDriver {
  readonly id = 'mock';
  readonly title = 'حالت شبیه‌ساز (کنسول توسعه)';
  private readonly logger = new Logger('MockSmsDriver');

  async sendSimple(to: string, message: string): Promise<SmsResult> {
    this.logger.warn(`[SMS Mock Driver] Simple SMS -> To: ${to} | Message: "${message}"`);
    return {
      success: true,
      isDev: true,
      message: 'پیامک در محیط توسعه شبیه‌سازی شد (کنسول سرور)',
    };
  }

  async sendPattern(to: string, patternCodeOrName: string, params: Record<string, string>): Promise<SmsResult> {
    this.logger.warn(
      `[SMS Mock Driver] Pattern SMS -> To: ${to} | Pattern: [${patternCodeOrName}] | Params: ${JSON.stringify(params)}`,
    );
    return {
      success: true,
      isDev: true,
      message: 'ارسال الگوی پیامک در محیط توسعه شبیه‌سازی شد (کنسول سرور)',
    };
  }
}
