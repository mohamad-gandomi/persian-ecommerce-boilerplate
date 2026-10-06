import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { WalletTransactionType, Prisma } from '@prisma/client';

import { EventEmitter2 } from '@nestjs/event-emitter';

export interface WalletOperationParams {
  userId: string;
  amount: number | Prisma.Decimal;
  type: WalletTransactionType;
  description?: string;
  referenceId?: string;
}

@Injectable()
export class WalletService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    // Initial check after boot, then check every 6 hours
    setTimeout(() => {
      this.checkAndExpireAllWallets().catch(() => {});
    }, 10000);

    setInterval(() => {
      this.checkAndExpireAllWallets().catch(() => {});
    }, 1000 * 60 * 60 * 6);
  }

  /**
   * Returns existing wallet or creates one atomically if not found.
   */
  async getOrCreateWallet(userId: string) {
    const existing = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (existing) return existing;

    return this.prisma.wallet.create({
      data: {
        userId,
        balance: 0,
        currency: 'IRT',
        isActive: true,
      },
    });
  }

  /**
   * Retrieves wallet expiry settings from systemSettings.
   */
  async getWalletExpiryConfig(): Promise<{ enabled: boolean; days: number }> {
    try {
      const setting = await this.prisma.systemSetting.findUnique({
        where: { key: 'referral_settings' },
      });
      const data = (setting?.value as any) || {};
      return {
        enabled: Boolean(data.walletExpiryEnabled),
        days: Math.max(1, Number(data.walletExpiryDays) || 90),
      };
    } catch {
      return { enabled: false, days: 90 };
    }
  }

  /**
   * Checks if an individual wallet has exceeded the expiry duration since its last credit/deposit.
   * If expired, resets balance to 0 and records an expiration transaction in the ledger.
   */
  async checkAndExpireSingleWallet(wallet: any): Promise<any> {
    const balanceNum = Number(wallet.balance);
    if (balanceNum <= 0) return wallet;

    const { enabled, days } = await this.getWalletExpiryConfig();
    if (!enabled || days <= 0) return wallet;

    // Find the latest credit transaction (amount > 0)
    const lastCredit = await this.prisma.walletTransaction.findFirst({
      where: {
        walletId: wallet.id,
        amount: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const lastCreditDate = lastCredit ? lastCredit.createdAt : wallet.createdAt;
    const now = new Date();
    const diffMs = now.getTime() - lastCreditDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays >= days) {
      const expiredAmountDecimal = new Prisma.Decimal(wallet.balance);

      const [updatedWallet] = await this.prisma.$transaction([
        this.prisma.wallet.update({
          where: { id: wallet.id },
          data: { balance: 0 },
        }),
        this.prisma.walletTransaction.create({
          data: {
            walletId: wallet.id,
            amount: expiredAmountDecimal.negated(),
            balanceBefore: expiredAmountDecimal,
            balanceAfter: new Prisma.Decimal(0),
            type: WalletTransactionType.ADMIN_ADJUSTMENT,
            description: `انقضای موجودی کیف پول به دلیل عدم فعالیت پس از ${days} روز از آخرین واریز`,
          },
        }),
      ]);

      // Emit dedicated wallet.expired event and wallet.debited
      this.prisma.user
        .findUnique({
          where: { id: wallet.userId },
          select: { phone: true, firstName: true, lastName: true },
        })
        .then((user) => {
          const customerName = user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'کاربر گرامی'
            : 'کاربر گرامی';

          this.eventEmitter.emit('wallet.expired', {
            userId: wallet.userId,
            amount: balanceNum,
            days,
            lastDepositDate: lastCreditDate.toLocaleDateString('fa-IR'),
            userPhone: user?.phone,
            customerName,
          });

          this.eventEmitter.emit('wallet.debited', {
            userId: wallet.userId,
            amount: balanceNum,
            balanceAfter: 0,
            description: `انقضای موجودی کیف پول به دلیل عدم فعالیت پس از ${days} روز از آخرین واریز`,
            userPhone: user?.phone,
          });
        })
        .catch(() => {});

      return updatedWallet;
    }

    return wallet;
  }

  /**
   * Scans all active wallets in the system with positive balance and expires those that exceeded inactivity threshold.
   */
  async checkAndExpireAllWallets(): Promise<{
    success: boolean;
    expiredWalletsCount: number;
    totalExpiredAmount: number;
    details: Array<{ walletId: string; userId: string; expiredAmount: number }>;
  }> {
    const { enabled, days } = await this.getWalletExpiryConfig();
    if (!enabled || days <= 0) {
      return {
        success: true,
        expiredWalletsCount: 0,
        totalExpiredAmount: 0,
        details: [],
      };
    }

    const activeWallets = await this.prisma.wallet.findMany({
      where: {
        balance: { gt: 0 },
        isActive: true,
      },
    });

    let expiredWalletsCount = 0;
    let totalExpiredAmount = 0;
    const details: Array<{ walletId: string; userId: string; expiredAmount: number }> = [];

    for (const wallet of activeWallets) {
      const initialBalance = Number(wallet.balance);
      const afterWallet = await this.checkAndExpireSingleWallet(wallet);
      if (Number(afterWallet.balance) === 0 && initialBalance > 0) {
        expiredWalletsCount++;
        totalExpiredAmount += initialBalance;
        details.push({
          walletId: wallet.id,
          userId: wallet.userId,
          expiredAmount: initialBalance,
        });
      }
    }

    return {
      success: true,
      expiredWalletsCount,
      totalExpiredAmount,
      details,
    };
  }

  /**
   * Get current wallet balance & status for a user.
   */
  async getBalance(userId: string) {
    let wallet = await this.getOrCreateWallet(userId);
    wallet = await this.checkAndExpireSingleWallet(wallet);

    const { enabled, days } = await this.getWalletExpiryConfig();
    let expiresAt: string | null = null;
    let daysRemaining: number | null = null;

    if (enabled && days > 0 && Number(wallet.balance) > 0) {
      const lastCredit = await this.prisma.walletTransaction.findFirst({
        where: {
          walletId: wallet.id,
          amount: { gt: 0 },
        },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      });
      const lastCreditDate = lastCredit ? lastCredit.createdAt : wallet.createdAt;
      const expDate = new Date(lastCreditDate.getTime() + days * 24 * 60 * 60 * 1000);
      expiresAt = expDate.toISOString();
      const diffMs = expDate.getTime() - Date.now();
      daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return {
      walletId: wallet.id,
      balance: Number(wallet.balance),
      currency: wallet.currency,
      isActive: wallet.isActive,
      expiryConfig: {
        enabled,
        days,
        expiresAt,
        daysRemaining,
      },
    };
  }

  /**
   * Get paginated transaction history for a user.
   */
  async getTransactions(userId: string, limit = 50, offset = 0) {
    let wallet = await this.getOrCreateWallet(userId);
    wallet = await this.checkAndExpireSingleWallet(wallet);

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        balanceBefore: Number(t.balanceBefore),
        balanceAfter: Number(t.balanceAfter),
      })),
      total,
      walletBalance: Number(wallet.balance),
    };
  }

  /**
   * Atomically credit an amount to user wallet (Deposit, Refund, Referral Reward, Cashback).
   */
  async credit(params: WalletOperationParams) {
    const amountNum = Number(params.amount);
    if (amountNum <= 0) {
      throw new BadRequestException('مبلغ واریز به کیف پول باید بزرگتر از صفر باشد');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Fetch or create wallet
      let wallet = await tx.wallet.findUnique({
        where: { userId: params.userId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId: params.userId,
            balance: 0,
            currency: 'IRT',
            isActive: true,
          },
        });
      }

      if (!wallet.isActive) {
        throw new ForbiddenException('کیف پول کاربر غیرفعال یا مسدود است');
      }

      const balanceBefore = new Prisma.Decimal(wallet.balance);
      const balanceAfter = balanceBefore.add(new Prisma.Decimal(amountNum));

      // 2. Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      // 3. Record transaction in ledger
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: new Prisma.Decimal(amountNum),
          balanceBefore,
          balanceAfter,
          type: params.type,
          description: params.description || 'افزایش موجودی کیف پول',
          referenceId: params.referenceId,
        },
      });

      return {
        success: true,
        walletId: updatedWallet.id,
        balance: Number(updatedWallet.balance),
        transaction: {
          ...transaction,
          amount: Number(transaction.amount),
          balanceBefore: Number(transaction.balanceBefore),
          balanceAfter: Number(transaction.balanceAfter),
        },
      };
    });

    // Emit wallet.credited event asynchronously
    this.prisma.user
      .findUnique({ where: { id: params.userId }, select: { phone: true } })
      .then((user) => {
        this.eventEmitter.emit('wallet.credited', {
          userId: params.userId,
          amount: amountNum,
          balanceAfter: result.balance,
          description: params.description,
          userPhone: user?.phone,
        });
      })
      .catch(() => {});

    return result;
  }

  /**
   * Atomically debit an amount from user wallet (Order Payment, Withdrawal, Partial Payment).
   */
  async debit(params: WalletOperationParams) {
    const amountNum = Number(params.amount);
    if (amountNum <= 0) {
      throw new BadRequestException('مبلغ کسر از کیف پول باید بزرگتر از صفر باشد');
    }

    // Check and expire if inactive before attempting debit
    const existingWallet = await this.prisma.wallet.findUnique({
      where: { userId: params.userId },
    });
    if (existingWallet) {
      await this.checkAndExpireSingleWallet(existingWallet);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: params.userId },
      });

      if (!wallet) {
        throw new NotFoundException('کیف پول برای این کاربر یافت نشد');
      }

      if (!wallet.isActive) {
        throw new ForbiddenException('کیف پول کاربر مسدود است');
      }

      const balanceBefore = new Prisma.Decimal(wallet.balance);
      const deduction = new Prisma.Decimal(amountNum);

      if (balanceBefore.lessThan(deduction)) {
        throw new BadRequestException('موجودی کیف پول برای انجام این تراکنش کافی نیست');
      }

      const balanceAfter = balanceBefore.sub(deduction);

      // Update wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      // Record transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          amount: new Prisma.Decimal(-amountNum), // recorded as negative
          balanceBefore,
          balanceAfter,
          type: params.type,
          description: params.description || 'کسر از موجودی کیف پول',
          referenceId: params.referenceId,
        },
      });

      return {
        success: true,
        walletId: updatedWallet.id,
        balance: Number(updatedWallet.balance),
        transaction: {
          ...transaction,
          amount: Number(transaction.amount),
          balanceBefore: Number(transaction.balanceBefore),
          balanceAfter: Number(transaction.balanceAfter),
        },
      };
    });

    // Emit wallet.debited event asynchronously
    this.prisma.user
      .findUnique({ where: { id: params.userId }, select: { phone: true } })
      .then((user) => {
        this.eventEmitter.emit('wallet.debited', {
          userId: params.userId,
          amount: amountNum,
          balanceAfter: result.balance,
          description: params.description,
          userPhone: user?.phone,
          orderNumber: params.referenceId,
        });
      })
      .catch(() => {});

    return result;
  }

  /**
   * Admin manual balance adjustment (positive or negative).
   */
  async adminAdjust(userId: string, amount: number, description: string) {
    if (amount === 0) {
      throw new BadRequestException('مبلغ تغییر موجودی نمی‌تواند صفر باشد');
    }

    if (amount > 0) {
      return this.credit({
        userId,
        amount,
        type: WalletTransactionType.ADMIN_ADJUSTMENT,
        description: `تغییر دستی توسط مدیر: ${description}`,
      });
    } else {
      return this.debit({
        userId,
        amount: Math.abs(amount),
        type: WalletTransactionType.ADMIN_ADJUSTMENT,
        description: `تغییر دستی توسط مدیر: ${description}`,
      });
    }
  }

  /**
   * Admin: List all wallets with user profiles and stats.
   */
  async listAllWallets(query: { search?: string; limit?: number; offset?: number }) {
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    const where: Prisma.WalletWhereInput = {};
    if (query.search) {
      const q = query.search.trim();
      where.user = {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' } },
          { lastName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
          { phone: { contains: q, mode: 'insensitive' } },
        ],
      };
    }

    const [wallets, total] = await Promise.all([
      this.prisma.wallet.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              role: true,
            },
          },
          _count: {
            select: { transactions: true },
          },
        },
        orderBy: { balance: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.wallet.count({ where }),
    ]);

    // Calculate total money held across all wallets, active wallets, and total transactions
    const [aggregates, activeWalletsCount, totalTransactionsCount] = await Promise.all([
      this.prisma.wallet.aggregate({
        _sum: { balance: true },
        _count: { id: true },
      }),
      this.prisma.wallet.count({ where: { isActive: true } }),
      this.prisma.walletTransaction.count(),
    ]);

    return {
      wallets: wallets.map((w) => ({
        ...w,
        balance: Number(w.balance),
        transactionsCount: w._count.transactions,
      })),
      total,
      stats: {
        totalSystemBalance: Number(aggregates._sum.balance || 0),
        totalWalletsCount: aggregates._count.id,
        activeWalletsCount,
        totalTransactionsCount,
      },
    };
  }

  /**
   * Admin: Get all transactions across entire store.
   */
  async getAllTransactions(query: { limit?: number; offset?: number; walletId?: string }) {
    const limit = query.limit || 30;
    const offset = query.offset || 0;

    const where: Prisma.WalletTransactionWhereInput = {};
    if (query.walletId) {
      where.walletId = query.walletId;
    }

    const [transactions, total] = await Promise.all([
      this.prisma.walletTransaction.findMany({
        where,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.walletTransaction.count({ where }),
    ]);

    return {
      transactions: transactions.map((t) => ({
        ...t,
        amount: Number(t.amount),
        balanceBefore: Number(t.balanceBefore),
        balanceAfter: Number(t.balanceAfter),
      })),
      total,
    };
  }

  /**
   * Admin: Enable or disable a wallet by user ID or wallet ID.
   */
  async toggleStatus(targetId: string, isActive: boolean) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        OR: [{ id: targetId }, { userId: targetId }],
      },
    });

    if (!wallet) {
      throw new NotFoundException('کیف پول کاربر یافت نشد');
    }

    const updated = await this.prisma.wallet.update({
      where: { id: wallet.id },
      data: { isActive },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return {
      ...updated,
      balance: Number(updated.balance),
    };
  }
}
