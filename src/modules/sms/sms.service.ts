import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';
import { ISmsDriver, SmsProviderConfig, SmsResult } from './interfaces/sms-driver.interface';
import { KavenegarDriver } from './drivers/kavenegar.driver';
import { MelipayamakDriver } from './drivers/melipayamak.driver';
import { MockDriver } from './drivers/mock.driver';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private readonly settingsService: SettingsService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Resolves the active SMS driver and credentials from SystemSetting or Env
   */
  async getActiveDriver(): Promise<{ driver: ISmsDriver; providerId: string }> {
    const notifSettings = await this.settingsService.get('notification_settings');
    const smsConfig = notifSettings?.sms || {};
    const activeProvider = smsConfig.activeProvider || 'kavenegar';
    const providersConfig = smsConfig.providers || {};

    let driver: ISmsDriver;

    switch (activeProvider) {
      case 'melipayamak': {
        const conf: SmsProviderConfig = providersConfig.melipayamak || {};
        driver = new MelipayamakDriver(conf);
        break;
      }
      case 'kavenegar': {
        const conf: SmsProviderConfig = {
          apiKey: providersConfig.kavenegar?.apiKey || this.configService.get<string>('KAVENEGAR_API_KEY') || '',
          sender: providersConfig.kavenegar?.sender || this.configService.get<string>('KAVENEGAR_SENDER') || '',
        };
        driver = new KavenegarDriver(conf);
        break;
      }
      case 'mock':
      default: {
        // If kavenegar has env key, default to kavenegar, else mock
        const envKey = this.configService.get<string>('KAVENEGAR_API_KEY');
        if (activeProvider === 'kavenegar' || envKey) {
          driver = new KavenegarDriver({
            apiKey: envKey || '',
            sender: this.configService.get<string>('KAVENEGAR_SENDER') || '',
          });
        } else {
          driver = new MockDriver();
        }
        break;
      }
    }

    return { driver, providerId: activeProvider };
  }

  /**
   * Send OTP Verification Code
   */
  async sendOtp(phone: string, code: string): Promise<SmsResult> {
    const cleanPhone = phone.trim();
    const notifSettings = await this.settingsService.get('notification_settings');
    const eventConfig = notifSettings?.events?.auth_otp;
    const { driver, providerId } = await this.getActiveDriver();

    let patternCodeOrName = '';
    if (providerId === 'melipayamak') {
      patternCodeOrName =
        eventConfig?.userMelipayamakPatternCode || eventConfig?.melipayamakPatternCode || '';
    } else {
      patternCodeOrName =
        eventConfig?.userKavenegarTemplate ||
        eventConfig?.kavenegarTemplate ||
        this.configService.get<string>('KAVENEGAR_TEMPLATE') ||
        'verify';
    }

    if (!patternCodeOrName) {
      this.logger.error(`No OTP template configured for provider ${providerId}`);
      return { success: false, message: 'الگوی ارسال کد ورود در سیستم تنظیم نشده است' };
    }

    return driver.sendPattern(cleanPhone, patternCodeOrName, { token: code, code });
  }

  /**
   * Send notification SMS for a specific domain event (targeted to customer or admin)
   */
  async sendEventSms(
    to: string,
    eventKey: string,
    params: Record<string, string>,
    fallbackText?: string,
    targetRole: 'CUSTOMER' | 'ADMIN' = 'CUSTOMER',
  ): Promise<SmsResult> {
    const cleanPhone = to.trim();
    const notifSettings = await this.settingsService.get('notification_settings');
    const eventConfig = notifSettings?.events?.[eventKey];
    const { driver, providerId } = await this.getActiveDriver();

    let patternCodeOrName = '';
    if (providerId === 'melipayamak') {
      patternCodeOrName =
        targetRole === 'ADMIN'
          ? eventConfig?.adminMelipayamakPatternCode || eventConfig?.melipayamakPatternCode || ''
          : eventConfig?.userMelipayamakPatternCode || eventConfig?.melipayamakPatternCode || '';
    } else {
      patternCodeOrName =
        targetRole === 'ADMIN'
          ? eventConfig?.adminKavenegarTemplate || eventConfig?.kavenegarTemplate || ''
          : eventConfig?.userKavenegarTemplate || eventConfig?.kavenegarTemplate || '';
    }

    // If pattern code is defined, send pattern
    if (patternCodeOrName) {
      const res = await driver.sendPattern(cleanPhone, patternCodeOrName, params);
      if (res.success) return res;
      this.logger.warn(`Event SMS pattern [${patternCodeOrName}] failed: ${res.message}. Falling back to text...`);
    }

    // Fallback or Direct Text
    let messageText =
      targetRole === 'ADMIN'
        ? eventConfig?.adminCustomText || eventConfig?.customText || fallbackText || ''
        : eventConfig?.userCustomText || eventConfig?.customText || fallbackText || '';

    if (messageText) {
      // Interpolate placeholders
      Object.keys(params).forEach((key) => {
        messageText = messageText.replace(new RegExp(`{${key}}`, 'g'), params[key]);
      });
      return driver.sendSimple(cleanPhone, messageText);
    }

    return { success: false, message: `هیچ الگو یا متنی برای رویداد ${eventKey} تنظیم نشده است` };
  }

  /**
   * Send arbitrary direct SMS
   */
  async sendDirect(to: string, message: string): Promise<SmsResult> {
    const { driver } = await this.getActiveDriver();
    return driver.sendSimple(to, message);
  }

  /**
   * Test SMS Driver with custom credentials before saving
   */
  async testConnection(
    providerId: string,
    credentials: SmsProviderConfig,
    testPhone: string,
  ): Promise<SmsResult> {
    let driver: ISmsDriver;

    if (providerId === 'melipayamak') {
      driver = new MelipayamakDriver(credentials);
    } else if (providerId === 'kavenegar') {
      driver = new KavenegarDriver(credentials);
    } else {
      driver = new MockDriver();
    }

    const testMsg = 'این یک پیامک آزمایشی جهت بررسی اتصال درگاه پیامک فروشگاه است.';
    return driver.sendSimple(testPhone, testMsg);
  }
}
