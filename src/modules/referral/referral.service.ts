import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { WalletService } from '@/modules/wallet/wallet.service';
import {
  ReferralStatus,
  RewardType,
  WalletTransactionType,
  Prisma,
} from '@prisma/client';
import {
  GlobalRewardType,
  UpdateReferralSettingsDto,
} from './dto/referral-settings.dto';
import { ConfigService } from '@nestjs/config';

export const DEFAULT_REFERRAL_SETTINGS: UpdateReferralSettingsDto = {
  enabled: true,
  enableGlobalReward: true, // If false, only products with explicit custom rewards yield rewards
  defaultRewardType: GlobalRewardType.PERCENTAGE,
  defaultReferrerValue: 5, // 5% commission to referrer
  defaultRefereeValue: 20000, // 20,000 Toman welcome credit to buyer
  minOrderAmount: 100000, // 100,000 Toman min order
  releaseOnStatus: 'DELIVERED',
  cookieDays: 30,
};

@Injectable()
export class ReferralService {
  private readonly SETTING_KEY = 'referral_settings';

  constructor(
    private readonly prisma: PrismaService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get store-wide referral configuration.
   */
  async getSettings(): Promise<UpdateReferralSettingsDto> {
    const setting = await this.prisma.systemSetting.findUnique({
      where: { key: this.SETTING_KEY },
    });

    if (!setting) {
      return DEFAULT_REFERRAL_SETTINGS;
    }

    return {
      ...DEFAULT_REFERRAL_SETTINGS,
      ...(setting.value as unknown as UpdateReferralSettingsDto),
    };
  }

  /**
   * Update store-wide referral configuration.
   */
  async updateSettings(dto: UpdateReferralSettingsDto) {
    const current = await this.getSettings();
    const merged = { ...current, ...dto };

    const updated = await this.prisma.systemSetting.upsert({
      where: { key: this.SETTING_KEY },
      create: {
        key: this.SETTING_KEY,
        value: merged as unknown as Prisma.InputJsonValue,
      },
      update: {
        value: merged as unknown as Prisma.InputJsonValue,
      },
    });

    return updated.value;
  }

  /**
   * Get or automatically generate unique referral code for a user.
   */
  async getOrCreateUserReferralCode(userId: string) {
    let referralCode = await this.prisma.referralCode.findUnique({
      where: { ownerId: userId },
      include: {
        referrals: {
          include: {
            referee: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                createdAt: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!referralCode) {
      // Generate clean unique code: e.g. REF-7A39
      const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const codeStr = `REF-${randomSuffix}`;

      referralCode = await this.prisma.referralCode.create({
        data: {
          ownerId: userId,
          code: codeStr,
        },
        include: {
          referrals: {
            include: {
              referee: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  createdAt: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return {
      code: referralCode.code,
      clickCount: referralCode.clickCount,
      successfulReferrals: referralCode.successfulReferrals,
      totalEarned: Number(referralCode.totalEarned),
      isActive: referralCode.isActive,
      referralLink: `/?ref=${referralCode.code}`,
      invitedUsers: referralCode.referrals.map((r) => ({
        id: r.id,
        refereeName: `${r.referee.firstName} ${r.referee.lastName}`,
        status: r.status,
        rewardEarned: Number(r.rewardAmountReferrer || 0),
        joinedAt: r.createdAt,
      })),
    };
  }

  /**
   * User can customize their referral code (vanity code).
   */
  async customizeReferralCode(userId: string, newCode: string) {
    const cleanCode = newCode.trim().toUpperCase();

    // Check if new code is already used by someone else
    const existing = await this.prisma.referralCode.findUnique({
      where: { code: cleanCode },
    });

    if (existing && existing.ownerId !== userId) {
      throw new ConflictException('این کد معرف قبلاً توسط کاربر دیگری ثبت شده است');
    }

    const referralCode = await this.prisma.referralCode.upsert({
      where: { ownerId: userId },
      create: {
        ownerId: userId,
        code: cleanCode,
      },
      update: {
        code: cleanCode,
      },
    });

    return {
      success: true,
      code: referralCode.code,
      referralLink: `/?ref=${referralCode.code}`,
    };
  }

  /**
   * Public: Track click count when a referral link is accessed.
   */
  async trackClick(code: string) {
    const cleanCode = code.trim().toUpperCase();
    const existing = await this.prisma.referralCode.findUnique({
      where: { code: cleanCode },
    });

    if (!existing || !existing.isActive) return { valid: false };

    await this.prisma.referralCode.update({
      where: { id: existing.id },
      data: { clickCount: { increment: 1 } },
    });

    return { valid: true, code: cleanCode };
  }

  /**
   * Validate if a referral code is eligible for use by referee.
   */
  async validateCode(code: string, currentUserId?: string) {
    const cleanCode = code.trim().toUpperCase();
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: cleanCode },
      include: {
        owner: {
          select: { id: true, firstName: true, lastName: true },
        },
      },
    });

    if (!referralCode || !referralCode.isActive) {
      throw new NotFoundException('کد معرف معتبر نمی‌باشد');
    }

    if (currentUserId && referralCode.ownerId === currentUserId) {
      throw new BadRequestException('نمی‌توانید از کد معرف خودتان استفاده کنید');
    }

    return {
      valid: true,
      code: referralCode.code,
      referrerName: `${referralCode.owner.firstName} ${referralCode.owner.lastName}`,
    };
  }

  /**
   * Permanently bind a new user (referee) to a referrer code upon signup or checkout.
   */
  async bindReferee(refereeId: string, code: string) {
    const settings = await this.getSettings();
    if (!settings.enabled) return null;

    const cleanCode = code.trim().toUpperCase();
    const referralCode = await this.prisma.referralCode.findUnique({
      where: { code: cleanCode },
    });

    if (!referralCode || !referralCode.isActive) {
      throw new NotFoundException('کد معرف نامعتبر است');
    }

    if (referralCode.ownerId === refereeId) {
      throw new BadRequestException('نمی‌توانید کد معرف خودتان را ثبت کنید');
    }

    // Check if referee is already bound
    const existing = await this.prisma.referral.findUnique({
      where: { refereeId },
    });

    if (existing) {
      // Already attached to a referrer
      return existing;
    }

    // Bind referee to referrer
    const referral = await this.prisma.referral.create({
      data: {
        referralCodeId: referralCode.id,
        referrerId: referralCode.ownerId,
        refereeId,
        status: ReferralStatus.PENDING,
      },
    });

    // Increment successful referrals count on code
    await this.prisma.referralCode.update({
      where: { id: referralCode.id },
      data: { successfulReferrals: { increment: 1 } },
    });

    return referral;
  }

  /**
   * Calculate potential rewards for an order based on product overrides vs global rules.
   */
  async calculateOrderRewards(orderId: string) {
    const settings = await this.getSettings();
    if (!settings.enabled) return { referrerReward: 0, refereeReward: 0 };

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) return { referrerReward: 0, refereeReward: 0 };

    const orderTotal = Number(order.totalAmount);
    if (orderTotal < settings.minOrderAmount) {
      return { referrerReward: 0, refereeReward: 0, reason: 'سفارش به حداقل مبلغ مشمول پاداش نرسیده است' };
    }

    let totalReferrerReward = 0;
    let totalRefereeReward = 0;

    for (const item of order.items) {
      const product = item.product;
      const itemTotal = Number(item.totalPrice);
      const qty = item.quantity;

      if (!product) continue;

      // Check if product was purchased under an active flash deal with a custom referrer reward
      const isFlashDealsEnabled = this.configService.get<boolean>('features.flashDeals', true);
      const flashDealItem = isFlashDealsEnabled
        ? await this.prisma.flashDealItem.findFirst({
            where: {
              productId: product.id,
              deal: {
                isActive: true,
                startDate: { lte: order.createdAt },
                endDate: { gte: order.createdAt },
              },
            },
          })
        : null;

      if (flashDealItem && flashDealItem.referrerReward !== null && Number(flashDealItem.referrerReward) > 0) {
        totalReferrerReward += Number(flashDealItem.referrerReward) * qty;
        if (product.rewardType === RewardType.FIXED && product.refereeRewardValue) {
          totalRefereeReward += Number(product.refereeRewardValue) * qty;
        } else if (product.rewardType === RewardType.PERCENTAGE && product.refereeRewardValue) {
          totalRefereeReward += (itemTotal * Number(product.refereeRewardValue)) / 100;
        } else if (settings.enableGlobalReward !== false) {
          totalRefereeReward +=
            settings.defaultRewardType === GlobalRewardType.PERCENTAGE
              ? (itemTotal * settings.defaultRefereeValue) / 100
              : settings.defaultRefereeValue * qty;
        }
        continue;
      }

      if (product.rewardType === RewardType.DISABLED) {
        // Product excluded from rewards
        continue;
      } else if (product.rewardType === RewardType.FIXED) {
        // Specific fixed amount defined for product
        totalReferrerReward += Number(product.referrerRewardValue || 0) * qty;
        totalRefereeReward += Number(product.refereeRewardValue || 0) * qty;
      } else if (product.rewardType === RewardType.PERCENTAGE) {
        // Specific percentage defined for product
        const referrerPct = Number(product.referrerRewardValue || 0);
        const refereePct = Number(product.refereeRewardValue || 0);
        totalReferrerReward += (itemTotal * referrerPct) / 100;
        totalRefereeReward += (itemTotal * refereePct) / 100;
      } else {
        // INHERIT from storewide settings
        // If enableGlobalReward is false (Per-Product Only mode), no reward for inherited products!
        if (settings.enableGlobalReward === false) {
          continue;
        }

        if (settings.defaultRewardType === GlobalRewardType.PERCENTAGE) {
          totalReferrerReward += (itemTotal * settings.defaultReferrerValue) / 100;
          totalRefereeReward += (itemTotal * settings.defaultRefereeValue) / 100;
        } else {
          // Fixed storewide reward distributed proportionately
          totalReferrerReward += settings.defaultReferrerValue * qty;
          totalRefereeReward += settings.defaultRefereeValue * qty;
        }
      }
    }

    return {
      referrerReward: Math.round(totalReferrerReward),
      refereeReward: Math.round(totalRefereeReward),
    };
  }

  /**
   * Release rewards into user wallets once order reaches target status (e.g. DELIVERED).
   */
  async releaseOrderReward(orderId: string) {
    const settings = await this.getSettings();
    if (!settings.enabled) return null;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        referral: {
          include: {
            referralCode: true,
          },
        },
      },
    });

    if (!order || !order.referral) return null;

    const referral = order.referral;
    // Prevent double rewarding
    if (referral.status === ReferralStatus.COMPLETED) return null;

    const rewards = await this.calculateOrderRewards(orderId);

    return this.prisma.$transaction(async (tx) => {
      // 1. Credit Referrer Wallet
      if (rewards.referrerReward > 0) {
        await this.walletService.credit({
          userId: referral.referrerId,
          amount: rewards.referrerReward,
          type: WalletTransactionType.REFERRAL_REWARD,
          description: `پاداش معرفی برای خرید سفارش ${order.orderNumber}`,
          referenceId: order.id,
        });
      }

      // 2. Credit Referee (Buyer) Wallet
      if (rewards.refereeReward > 0) {
        await this.walletService.credit({
          userId: referral.refereeId,
          amount: rewards.refereeReward,
          type: WalletTransactionType.REFERRAL_REWARD,
          description: `هدیه خرید اول از طریق کد معرف برای سفارش ${order.orderNumber}`,
          referenceId: order.id,
        });
      }

      // 3. Mark Referral as COMPLETED
      const updatedReferral = await tx.referral.update({
        where: { id: referral.id },
        data: {
          status: ReferralStatus.COMPLETED,
          rewardAmountReferrer: rewards.referrerReward,
          rewardAmountReferee: rewards.refereeReward,
          rewardedAt: new Date(),
        },
      });

      // 4. Update ReferralCode total earned
      await tx.referralCode.update({
        where: { id: referral.referralCodeId },
        data: {
          totalEarned: { increment: rewards.referrerReward },
        },
      });

      return updatedReferral;
    });
  }

  /**
   * Admin: List all referrals with pagination and search.
   */
  async listReferralsAdmin(query: { limit?: number; offset?: number; search?: string; status?: ReferralStatus }) {
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    const where: Prisma.ReferralWhereInput = {};
    if (query.status) {
      where.status = query.status;
    }
    if (query.search) {
      const q = query.search.trim();
      where.OR = [
        { referralCode: { code: { contains: q, mode: 'insensitive' } } },
        { referrer: { email: { contains: q, mode: 'insensitive' } } },
        { referrer: { firstName: { contains: q, mode: 'insensitive' } } },
        { referrer: { lastName: { contains: q, mode: 'insensitive' } } },
        { referee: { email: { contains: q, mode: 'insensitive' } } },
        { referee: { firstName: { contains: q, mode: 'insensitive' } } },
        { referee: { lastName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    const [referrals, total] = await Promise.all([
      this.prisma.referral.findMany({
        where,
        include: {
          referralCode: true,
          referrer: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          referee: {
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          },
          orders: {
            select: { id: true, orderNumber: true, totalAmount: true, status: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.referral.count({ where }),
    ]);

    // Aggregate stats for dashboard
    const [totalCodes, totalPaidRewards] = await Promise.all([
      this.prisma.referralCode.count(),
      this.prisma.referralCode.aggregate({
        _sum: { totalEarned: true, clickCount: true, successfulReferrals: true },
      }),
    ]);

    return {
      referrals: referrals.map((r) => ({
        ...r,
        rewardAmountReferrer: Number(r.rewardAmountReferrer || 0),
        rewardAmountReferee: Number(r.rewardAmountReferee || 0),
      })),
      total,
      stats: {
        totalCodes,
        totalClicks: totalPaidRewards._sum.clickCount || 0,
        totalSuccessfulReferrals: totalPaidRewards._sum.successfulReferrals || 0,
        totalRewardsPaid: Number(totalPaidRewards._sum.totalEarned || 0),
      },
    };
  }
}
