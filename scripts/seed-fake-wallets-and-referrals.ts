import { PrismaClient, Role, WalletTransactionType, RewardType, ReferralStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const isWalletEnabled = process.env.FEATURE_WALLET !== 'false';
  const isReferralEnabled = process.env.FEATURE_REFERRAL !== 'false';

  if (!isWalletEnabled && !isReferralEnabled) {
    console.log('⏩ Both Wallet and Referral features are disabled in .env. Skipping fake data seed.');
    return;
  }

  console.log('🚀 Seeding Fake Wallets, Transactions, Referral Codes & Products Reward Data...');

  // 1. Ensure realistic users exist
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Customer@123456', salt);

  const existingUsers = await prisma.user.findMany();
  console.log(`Found ${existingUsers.length} existing users in database.`);

  const additionalUsers = [
    { email: 'sara.ahmadi@example.com', firstName: 'سارا', lastName: 'احمدی', phone: '09121112233' },
    { email: 'reza.mohammadi@example.com', firstName: 'رضا', lastName: 'محمدی', phone: '09123334455' },
    { email: 'niloofar.kamali@example.com', firstName: 'نیلوفر', lastName: 'کمالی', phone: '09351234567' },
    { email: 'arash.rad@example.com', firstName: 'آرش', lastName: 'راد', phone: '09198765432' },
  ];

  for (const u of additionalUsers) {
    const exists = await prisma.user.findUnique({ where: { email: u.email } });
    if (!exists) {
      await prisma.user.create({
        data: {
          email: u.email,
          passwordHash,
          firstName: u.firstName,
          lastName: u.lastName,
          phone: u.phone,
          role: Role.CUSTOMER,
        },
      });
      console.log(`+ Created customer: ${u.firstName} ${u.lastName} (${u.email})`);
    }
  }

  const allUsers = await prisma.user.findMany();

  // 2. Clear previous referrals and transactions to guarantee consistent data
  await prisma.order.updateMany({ data: { referralId: null } });
  await prisma.referral.deleteMany();
  await prisma.referralCode.deleteMany();
  await prisma.walletTransaction.deleteMany();

  // 3. Upsert Wallets with realistic balances (in Tomans - IRT)
  if (isWalletEnabled) {
    const walletPresets: Record<string, number> = {
    'admin@store.local': 5000000,
    'customer@store.local': 1250000,
    'eleanor.vance@example.com': 840000,
    'marcus.chen@example.com': 2100000,
    'sara.ahmadi@example.com': 450000,
    'reza.mohammadi@example.com': 3200000,
    'niloofar.kamali@example.com': 950000,
    'arash.rad@example.com': 150000,
  };

  const userWallets: Record<string, any> = {};

  for (const user of allUsers) {
    const bal = walletPresets[user.email] ?? 600000;
    const wallet = await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {
        balance: bal,
        currency: 'IRT',
        isActive: true,
      },
      create: {
        userId: user.id,
        balance: bal,
        currency: 'IRT',
        isActive: true,
      },
    });
    userWallets[user.email] = wallet;
  }
  console.log(`💼 Wallets initialized for ${allUsers.length} users.`);

  // 4. Seed Wallet Transactions Ledger
  const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000);
  const orders = await prisma.order.findMany({ take: 6 });

  for (const user of allUsers) {
    const wallet = userWallets[user.email];
    if (!wallet) continue;

    // Transaction 1: Initial Deposit
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WalletTransactionType.DEPOSIT,
        amount: 1000000,
        balanceBefore: 0,
        balanceAfter: 1000000,
        description: 'شارژ آنلاین از طریق درگاه پرداخت',
        referenceId: `ZP-${Math.floor(10000000 + Math.random() * 90000000)}`,
        createdAt: daysAgo(30),
      },
    });

    // Transaction 2: Referral Reward
    await prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: WalletTransactionType.REFERRAL_REWARD,
        amount: 250000,
        balanceBefore: 1000000,
        balanceAfter: 1250000,
        description: 'پاداش نقدی معرف برای تکمیل سفارش کاربر دعوت‌شده',
        referenceId: `REF-${Math.floor(10000 + Math.random() * 90000)}`,
        createdAt: daysAgo(20),
      },
    });

    // Transaction 3: Order Payment
    if (orders.length > 0) {
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.ORDER_PAYMENT,
          amount: -300000,
          balanceBefore: 1250000,
          balanceAfter: 950000,
          description: `پرداخت سفارش ${orders[0].orderNumber || 'SW-1001'} از اعتبار کیف‌پول`,
          referenceId: orders[0].id,
          createdAt: daysAgo(12),
        },
      });
    }

    // Transaction 4: Admin adjustment
    if (user.email === 'reza.mohammadi@example.com' || user.email === 'customer@store.local') {
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.ADMIN_ADJUSTMENT,
          amount: 500000,
          balanceBefore: 950000,
          balanceAfter: 1450000,
          description: 'شارژ تشویقی و وفاداری توسط مدیر سیستم (کمپین تخفیف بهاره)',
          referenceId: 'ADM-ADJUST',
          createdAt: daysAgo(5),
        },
      });
    }

    // Transaction 5: Refund
    if (user.email === 'marcus.chen@example.com' || user.email === 'sara.ahmadi@example.com') {
      await prisma.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.REFUND,
          amount: 150000,
          balanceBefore: 950000,
          balanceAfter: 1100000,
          description: 'استرداد وجه لغو سفارش به کیف پول کاربر',
          referenceId: orders[1]?.id || 'SW-REFUND',
          createdAt: daysAgo(2),
        },
      });
    }
  }
    console.log('📊 Ledger transactions seeded.');
  } else {
    console.log('⏩ Wallet feature is disabled (FEATURE_WALLET=false), skipping wallet seeding.');
  }

  // 5. Seed Referral Codes
  if (isReferralEnabled) {
    const referralCodesConfig = [
    { email: 'customer@store.local', code: 'ALEX2026', clickCount: 142, successfulReferrals: 18, totalEarned: 950000 },
    { email: 'eleanor.vance@example.com', code: 'ELEANOR', clickCount: 89, successfulReferrals: 11, totalEarned: 540000 },
    { email: 'marcus.chen@example.com', code: 'MARCUS_VIP', clickCount: 215, successfulReferrals: 27, totalEarned: 1350000 },
    { email: 'sara.ahmadi@example.com', code: 'SARA_MODA', clickCount: 64, successfulReferrals: 8, totalEarned: 400000 },
    { email: 'reza.mohammadi@example.com', code: 'REZA99', clickCount: 178, successfulReferrals: 22, totalEarned: 1100000 },
  ];

  const createdCodes: Record<string, any> = {};

  for (const item of referralCodesConfig) {
    const user = allUsers.find((u) => u.email === item.email);
    if (!user) continue;

    const refCode = await prisma.referralCode.create({
      data: {
        ownerId: user.id,
        code: item.code,
        clickCount: item.clickCount,
        successfulReferrals: item.successfulReferrals,
        totalEarned: item.totalEarned,
        isActive: true,
      },
    });
    createdCodes[item.code] = refCode;
    console.log(`🔗 Referral code: ${item.code} for ${user.firstName} ${user.lastName}`);
  }

  // 6. Seed Referrals (Binding referees to referrers)
  const alexUser = allUsers.find((u) => u.email === 'customer@store.local');
  const eleanorUser = allUsers.find((u) => u.email === 'eleanor.vance@example.com');
  const rezaUser = allUsers.find((u) => u.email === 'reza.mohammadi@example.com');
  const saraUser = allUsers.find((u) => u.email === 'sara.ahmadi@example.com');
  const niloofarUser = allUsers.find((u) => u.email === 'niloofar.kamali@example.com');
  const arashUser = allUsers.find((u) => u.email === 'arash.rad@example.com');

  if (alexUser && saraUser && createdCodes['ALEX2026']) {
    const ref1 = await prisma.referral.create({
      data: {
        referralCodeId: createdCodes['ALEX2026'].id,
        referrerId: alexUser.id,
        refereeId: saraUser.id,
        status: ReferralStatus.COMPLETED,
        rewardAmountReferrer: 92500,
        rewardAmountReferee: 30000,
        rewardedAt: daysAgo(5),
        createdAt: daysAgo(12),
      },
    });
    if (orders[0]) {
      await prisma.order.update({ where: { id: orders[0].id }, data: { referralId: ref1.id } });
    }
  }

  if (alexUser && rezaUser && createdCodes['ALEX2026']) {
    const ref2 = await prisma.referral.create({
      data: {
        referralCodeId: createdCodes['ALEX2026'].id,
        referrerId: alexUser.id,
        refereeId: rezaUser.id,
        status: ReferralStatus.COMPLETED,
        rewardAmountReferrer: 160000,
        rewardAmountReferee: 30000,
        rewardedAt: daysAgo(3),
        createdAt: daysAgo(8),
      },
    });
    if (orders[1]) {
      await prisma.order.update({ where: { id: orders[1].id }, data: { referralId: ref2.id } });
    }
  }

  if (rezaUser && niloofarUser && createdCodes['REZA99']) {
    const ref3 = await prisma.referral.create({
      data: {
        referralCodeId: createdCodes['REZA99'].id,
        referrerId: rezaUser.id,
        refereeId: niloofarUser.id,
        status: ReferralStatus.PENDING,
        rewardAmountReferrer: 47500,
        rewardAmountReferee: 20000,
        createdAt: daysAgo(1),
      },
    });
    if (orders[2]) {
      await prisma.order.update({ where: { id: orders[2].id }, data: { referralId: ref3.id } });
    }
  }

  if (eleanorUser && arashUser && createdCodes['ELEANOR']) {
    await prisma.referral.create({
      data: {
        referralCodeId: createdCodes['ELEANOR'].id,
        referrerId: eleanorUser.id,
        refereeId: arashUser.id,
        status: ReferralStatus.PENDING,
        rewardAmountReferrer: 60000,
        rewardAmountReferee: 25000,
        createdAt: daysAgo(2),
      },
    });
  }

  console.log('🤝 Referrals seeded (COMPLETED & PENDING).');

  // 7. Update products with referral reward overrides
  const products = await prisma.product.findMany({ take: 6 });
  if (products.length > 0) {
    await prisma.product.update({
      where: { id: products[0].id },
      data: {
        rewardType: RewardType.PERCENTAGE,
        referrerRewardValue: 8.0,
        refereeRewardValue: 3.0,
      },
    });
    console.log(`🎁 Product [${products[0].name}] set to 8% referrer / 3% referee reward.`);

    if (products.length > 1) {
      await prisma.product.update({
        where: { id: products[1].id },
        data: {
          rewardType: RewardType.FIXED,
          referrerRewardValue: 75000,
          refereeRewardValue: 35000,
        },
      });
      console.log(`🎁 Product [${products[1].name}] set to 75,000 / 35,000 Toman reward.`);
    }

    if (products.length > 2) {
      await prisma.product.update({
        where: { id: products[2].id },
        data: {
          rewardType: RewardType.DISABLED,
        },
      });
      console.log(`🚫 Product [${products[2].name}] set to DISABLED reward.`);
    }
  }

  console.log('✨ Referral fake data seeded successfully!');
  } else {
    console.log('⏩ Referral feature is disabled (FEATURE_REFERRAL=false), skipping referral seeding.');
  }

  console.log('✨ All active fake data seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
