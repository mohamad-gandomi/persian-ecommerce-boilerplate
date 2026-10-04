import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/database/prisma.service';

export const DEFAULT_SETTINGS: Record<string, any> = {
  media: {
    convertToWebp: true,
    qualityPreset: 80,
    maxWidthOption: 2048,
    showOptimizationOptions: false,
  },
  store: {
    name: 'Online Store',
    email: 'info@store.local',
    phone: '+98 21 1234 5678',
    address: 'Tehran, Iran',
  },
};

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getFeatures(): Record<string, boolean> {
    return {
      blog: this.configService.get<boolean>('features.blog', true),
      wallet: this.configService.get<boolean>('features.wallet', true),
      referral: this.configService.get<boolean>('features.referral', true),
      coupons: this.configService.get<boolean>('features.coupons', true),
      attributes: this.configService.get<boolean>('features.attributes', true),
    };
  }


  async get(key: string): Promise<any> {
    const record = await this.prisma.systemSetting.findUnique({
      where: { key },
    });

    if (!record) {
      return DEFAULT_SETTINGS[key] ?? null;
    }

    if (
      DEFAULT_SETTINGS[key] &&
      typeof DEFAULT_SETTINGS[key] === 'object' &&
      typeof record.value === 'object' &&
      record.value !== null
    ) {
      return {
        ...DEFAULT_SETTINGS[key],
        ...(record.value as object),
      };
    }

    return record.value;
  }

  async set(key: string, value: any): Promise<any> {
    // If value is an object, merge with existing stored value
    let finalValue = value;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      const existing = await this.get(key);
      if (typeof existing === 'object' && existing !== null && !Array.isArray(existing)) {
        finalValue = { ...existing, ...value };
      }
    }

    const record = await this.prisma.systemSetting.upsert({
      where: { key },
      create: { key, value: finalValue },
      update: { value: finalValue },
    });

    this.logger.log(`Setting '${key}' updated successfully`);
    return record.value;
  }

  async getAll(): Promise<Record<string, any>> {
    const records = await this.prisma.systemSetting.findMany();
    const result: Record<string, any> = { ...DEFAULT_SETTINGS };

    for (const r of records) {
      if (
        result[r.key] &&
        typeof result[r.key] === 'object' &&
        typeof r.value === 'object' &&
        r.value !== null
      ) {
        result[r.key] = { ...result[r.key], ...(r.value as object) };
      } else {
        result[r.key] = r.value;
      }
    }

    return result;
  }
}
