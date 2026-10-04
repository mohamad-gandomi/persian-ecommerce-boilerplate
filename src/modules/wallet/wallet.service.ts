import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { WalletTransactionType, Prisma } from '@prisma/client';

export interface WalletOperationParams {
  userId: string;
  amount: number | Prisma.Decimal;
  type: WalletTransactionType;
  description?: string;
  referenceId?: string;
}

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

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
   * Get current wallet balance & status for a user.
   */
  async getBalance(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      walletId: wallet.id,
      balance: Number(wallet.balance),
      currency: wallet.currency,
      isActive: wallet.isActive,
    };
  }

  /**
   * Get paginated transaction history for a user.
   */
  async getTransactions(userId: string, limit = 50, offset = 0) {
    const wallet = await this.getOrCreateWallet(userId);

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

    return this.prisma.$transaction(async (tx) => {
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
  }

  /**
   * Atomically debit an amount from user wallet (Order Payment, Withdrawal, Partial Payment).
   */
  async debit(params: WalletOperationParams) {
    const amountNum = Number(params.amount);
    if (amountNum <= 0) {
      throw new BadRequestException('مبلغ کسر از کیف پول باید بزرگتر از صفر باشد');
    }

    return this.prisma.$transaction(async (tx) => {
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
