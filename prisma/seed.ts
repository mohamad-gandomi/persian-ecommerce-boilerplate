import {
  PrismaClient,
  Role,
  ProductType,
  ProductStatus,
  PostStatus,
  OrderStatus,
  PaymentStatus,
  TransactionStatus,
  DiscountType,
  ReferralStatus,
  RewardType,
  WalletTransactionType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const PLACEHOLDER_IMAGE = 'http://localhost:4000/uploads/placeholder.webp';

async function ensurePlaceholderImage() {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const placeholderPath = path.join(uploadsDir, 'placeholder.webp');
  if (!fs.existsSync(placeholderPath)) {
    try {
      const { execSync } = require('child_process');
      execSync('node scripts/generate-placeholder.js', { stdio: 'inherit' });
    } catch {
      // fallback
    }
  }
}

async function main() {
  console.log('🌱 Starting 100% Persian e-commerce database seed...');
  await ensurePlaceholderImage();

  // 1. Clean existing records in reverse dependency order
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.orderTransaction.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.referralCode.deleteMany();
  await prisma.flashDealItem.deleteMany();
  await prisma.flashDeal.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.media.deleteMany();
  await prisma.variantAttributeValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned previous data.');

  // 2. Create Users (Admin, Referrer, Customers with Iranian details)
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Admin@123456', salt);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@store.local',
      passwordHash,
      firstName: 'مدیر',
      lastName: 'کل سیستم',
      phone: '09121111111',
      role: Role.ADMIN,
      nationalId: '0010350810',
      birthDate: new Date('1990-03-21T00:00:00.000Z'),
    },
  });

  // کاربر معرف فعال
  const referrerUser = await prisma.user.create({
    data: {
      email: 'mohamad@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'محمد',
      lastName: 'گندمی',
      phone: '09122222222',
      role: Role.CUSTOMER,
      nationalId: '0499370856',
      birthDate: new Date('1992-06-15T00:00:00.000Z'),
      addresses: {
        create: [
          {
            title: 'منزل و آتلیه',
            recipientName: 'محمد گندمی',
            phone: '09122222222',
            street: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، پلاک ۱۲',
            city: 'تهران',
            province: 'تهران',
            postalCode: '1998812345',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  // مشتری ۱ (معرفی‌شده توسط محمد گندمی)
  const refereeCustomer1 = await prisma.user.create({
    data: {
      email: 'sara.rezaei@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'سارا',
      lastName: 'رضایی',
      phone: '09123333333',
      role: Role.CUSTOMER,
      nationalId: '1270425897',
      birthDate: new Date('1996-08-20T00:00:00.000Z'),
      addresses: {
        create: [
          {
            title: 'منزل تهران',
            recipientName: 'سارا رضایی',
            phone: '09123333333',
            street: 'تهران، پاسداران، بوستان دوم، تقاطع پایدارفرد، پلاک ۱۴، واحد ۳',
            city: 'تهران',
            province: 'تهران',
            postalCode: '1668744112',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  // مشتری ۲
  const customer2 = await prisma.user.create({
    data: {
      email: 'ali.hosseini@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'علی',
      lastName: 'حسینی',
      phone: '09124444444',
      role: Role.CUSTOMER,
      nationalId: '0082146901',
      birthDate: new Date('1989-11-05T00:00:00.000Z'),
      addresses: {
        create: [
          {
            title: 'دفتر اصفهان',
            recipientName: 'علی حسینی',
            phone: '09124444444',
            street: 'اصفهان، خیابان چهارباغ بالا، کوچه کاج، پلاک ۸، مجتمع پارسیان',
            city: 'اصفهان',
            province: 'اصفهان',
            postalCode: '8164812345',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  // مشتری ۳
  const customer3 = await prisma.user.create({
    data: {
      email: 'zahra.karimi@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'زهرا',
      lastName: 'کریمی',
      phone: '09125555555',
      role: Role.CUSTOMER,
      nationalId: '0065432190',
      birthDate: new Date('1994-02-12T00:00:00.000Z'),
      addresses: {
        create: [
          {
            title: 'منزل شیراز',
            recipientName: 'زهرا کریمی',
            phone: '09125555555',
            street: 'شیراز، خیابان عفیف‌آباد، کوچه ۱۲، ساختمان مهر، پلاک ۲۲',
            city: 'شیراز',
            province: 'فارس',
            postalCode: '7193612345',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  console.log(`👤 Iranian Users seeded: Admin, Referrer (${referrerUser.firstName} ${referrerUser.lastName}), and Customers.`);

  // 3. Referral Program & Codes
  const referralCode = await prisma.referralCode.create({
    data: {
      code: 'SHAD-MOHAMAD',
      ownerId: referrerUser.id,
      clickCount: 38,
      successfulReferrals: 1,
      totalEarned: 250000,
      isActive: true,
    },
  });

  // ثبت پیوند معرفی برای خرید سارا رضایی
  const referralRelation = await prisma.referral.create({
    data: {
      referralCodeId: referralCode.id,
      referrerId: referrerUser.id,
      refereeId: refereeCustomer1.id,
      status: ReferralStatus.COMPLETED,
      rewardAmountReferrer: 250000, // ۲۵۰ هزار تومان پاداش معرفی
      rewardAmountReferee: 50000, // ۵۰ هزار تومان پاداش هدیه خرید اول خریدار
      rewardedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
  });

  // کیف پول معرف و خریدار
  await prisma.wallet.create({
    data: {
      userId: referrerUser.id,
      balance: 250000,
      currency: 'IRT',
      transactions: {
        create: [
          {
            amount: 250000,
            balanceBefore: 0,
            balanceAfter: 250000,
            type: WalletTransactionType.REFERRAL_REWARD,
            description: 'پاداش معرفی برای خرید سفارش SW-1001 توسط سارا رضایی',
            referenceId: 'SW-1001',
          },
        ],
      },
    },
  });

  await prisma.wallet.create({
    data: {
      userId: refereeCustomer1.id,
      balance: 50000,
      currency: 'IRT',
      transactions: {
        create: [
          {
            amount: 50000,
            balanceBefore: 0,
            balanceAfter: 50000,
            type: WalletTransactionType.REFERRAL_REWARD,
            description: 'هدیه خرید اول با کد معرف SHAD-MOHAMAD برای سفارش SW-1001',
            referenceId: 'SW-1001',
          },
        ],
      },
    },
  });

  console.log('🤝 Referral Code (SHAD-MOHAMAD), completed referral record, and matching Wallets seeded.');

  // 4. Shipping Methods (روش‌های ارسال با واحد تومان)
  const shippingCount = await prisma.shippingMethod.count();
  if (shippingCount === 0) {
    await prisma.shippingMethod.createMany({
      data: [
        {
          name: 'ارسال پیشتاز سراسری',
          type: 'FIXED',
          price: 65000,
          currency: 'IRT',
          carrier: 'شرکت ملی پست / تیپاکس',
          estimatedDays: '۲ الی ۴ روز کاری',
          description: 'ارسال سریع به کلیه شهرهای کشور با کد رهگیری آنلاین و پیامکی',
          isActive: true,
          isDefault: true,
          displayOrder: 1,
        },
        {
          name: 'ارسال اکسپرس فوری (تهران)',
          type: 'FIXED',
          price: 110000,
          currency: 'IRT',
          carrier: 'پیک ویژه اختصاصی',
          estimatedDays: 'کمتر از ۳ ساعت',
          description: 'تحویل سریع در همان روز ویژه سفارش‌های داخل شهر تهران',
          isActive: true,
          isDefault: false,
          displayOrder: 2,
        },
        {
          name: 'باربری اختصاصی مبلمان و دکوراسیون سنگین',
          type: 'FIXED',
          price: 350000,
          currency: 'IRT',
          carrier: 'باربری تخصصی مبلمان با پتوپیچ و بیمه سلامت بار',
          estimatedDays: '۳ الی ۵ روز کاری',
          description: 'حمل حرفه‌ای وسایل چوبی و مبلمان با بیمه کامل سلامت فیزیکی محصول تا درب منزل',
          isActive: true,
          isDefault: false,
          displayOrder: 3,
        },
      ],
    });
    console.log('🚚 Iranian shipping methods seeded.');
  }

  // 5. System Settings
  await prisma.systemSetting.upsert({
    where: { key: 'store' },
    update: {},
    create: {
      key: 'store',
      value: {
        name: 'صنایع چوب و دکوراسیون شادچوب',
        email: 'info@shadwood.ir',
        phone: '۰۲۱-۸۸۲۲۳۳۴۴',
        address: 'تهران، خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۸۴',
        currency: 'IRT',
      },
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'referral_settings' },
    update: {},
    create: {
      key: 'referral_settings',
      value: {
        enabled: true,
        enableGlobalReward: true,
        defaultRewardType: 'PERCENTAGE',
        defaultReferrerValue: 5,
        defaultRefereeValue: 50000,
        minOrderAmount: 200000,
        releaseOnStatus: 'DELIVERED',
        cookieDays: 30,
      },
    },
  });

  // 6. Hierarchical Categories (دسته‌بندی‌های اصیل مبلمان و صنایع چوب)
  const livingRoom = await prisma.category.create({
    data: {
      name: 'اتاق نشیمن و پذیرایی',
      slug: 'living-room',
      description: 'مبلمان راحتی، کاناپه‌های مدرن و میزهای جلو مبلی ساخته‌شده از چوب طبیعی.',
      image: PLACEHOLDER_IMAGE,
      displayOrder: 1,
    },
  });

  const sofasCategory = await prisma.category.create({
    data: {
      name: 'مبلمان و صندلی راحتی',
      slug: 'sofas-and-armchairs',
      description: 'انواع مبل‌های تک‌نفره و چندنفره با اسکلت چوب راش و رویه‌کوبی درجه یک.',
      parentId: livingRoom.id,
      displayOrder: 1,
    },
  });

  const coffeeTablesCategory = await prisma.category.create({
    data: {
      name: 'میز جلو مبلی و عسلی',
      slug: 'coffee-tables',
      description: 'میزهای روستیک و مینیمال چوب گردو و بلوط با روکش ضدآب و روغن گیاهی.',
      parentId: livingRoom.id,
      displayOrder: 2,
    },
  });

  const diningRoom = await prisma.category.create({
    data: {
      name: 'سرویس غذاخوری',
      slug: 'dining-room',
      description: 'میزهای ناهارخوری تمام چوب، نیمکت‌های ارگونومیک و صندلی‌های ناهارخوری.',
      image: PLACEHOLDER_IMAGE,
      displayOrder: 2,
    },
  });

  const diningTablesCategory = await prisma.category.create({
    data: {
      name: 'میز ناهارخوری',
      slug: 'dining-tables',
      description: 'میزهای ناهارخوری دست‌ساز از چوب راش و گردو با ضمانت استحکام مادام‌العمر.',
      parentId: diningRoom.id,
      displayOrder: 1,
    },
  });

  const diningChairsCategory = await prisma.category.create({
    data: {
      name: 'صندلی غذاخوری',
      slug: 'dining-chairs',
      description: 'صندلی‌های چوبی استاندارد با ارگونومی بالا و نشیمن فوق‌العاده راحت.',
      parentId: diningRoom.id,
      displayOrder: 2,
    },
  });

  const decorCategory = await prisma.category.create({
    data: {
      name: 'دکوراسیون و کنسول چوبی',
      slug: 'wooden-decor',
      description: 'کنسول، دراور، آینه‌های روستیک و قفسه‌های کتابخانه چوب طبیعی.',
      image: PLACEHOLDER_IMAGE,
      displayOrder: 3,
    },
  });

  console.log('🛋️ Categories seeded in Persian.');

  // 7. Global Attributes & Terms
  const woodFinishAttr = await prisma.attribute.create({
    data: {
      name: 'نوع و پوشش چوب',
      slug: 'wood-finish',
      values: {
        create: [
          { name: 'چوب گردوی تیره طبیعی', value: 'walnut', colorHex: '#4A2E1B' },
          { name: 'چوب راش طبیعی گرجستان', value: 'beech', colorHex: '#D4A373' },
          { name: 'چوب بلوط ارگانیک دودی', value: 'smoked-oak', colorHex: '#6F4E37' },
        ],
      },
    },
    include: { values: true },
  });

  const fabricColorAttr = await prisma.attribute.create({
    data: {
      name: 'رنگ و جنس پارچه',
      slug: 'fabric-color',
      values: {
        create: [
          { name: 'مخمل سبز زمردی', value: 'forest-velvet', colorHex: '#1B4332' },
          { name: 'کتان کرم عاجی', value: 'ivory-linen', colorHex: '#F3EFE0' },
          { name: 'طوسی ذغالی مدرن', value: 'charcoal-grey', colorHex: '#333533' },
        ],
      },
    },
    include: { values: true },
  });

  console.log('🎨 Attributes seeded in Persian.');

  // Map values for easy lookup
  const valMap: Record<string, string> = {};
  for (const v of [...woodFinishAttr.values, ...fabricColorAttr.values]) {
    valMap[v.value] = v.id;
  }

  // 8. Products (100% Persian with realistic Toman prices & Referral Rewards)
  // کالا ۱: محصول متغیر - مبل راحتی تک‌نفره مینیمال
  const variableArmchair = await prisma.product.create({
    data: {
      name: 'مبل راحتی تک‌نفره مینیمال شادچوب',
      slug: 'nordic-minimalist-lounge-armchair',
      sku: 'SW-ARMCHAIR-01',
      productType: ProductType.VARIABLE,
      description:
        'مبل راحتی تک‌نفره شادچوب، حاصل تلفیق ظرافت معماری مینیمال و اتصالات سنتی نجاری ایرانی. اسکلت اصلی از چوب سخت کوره رفته ساخته شده و با پوشش روغن گیاهی مونوکوت محافظت می‌شود. این مبل با نشیمن فوم سرد ۳۵ کیلویی ویژه و پارچه‌های تنفس‌پذیر ترک، نهایت آرامش را به فضای خانه شما هدیه می‌دهد.',
      shortDescription: 'صندلی راحتی دست‌ساز با اسکلت تمام چوب طبیعی و پارچه کتان یا مخمل درجه یک.',
      basePrice: 8500000, // ۸ میلیون و ۵۰۰ هزار تومان
      dimensions: '۸۲×۸۶×۷۸ سانتی‌متر',
      weight: 18.5,
      featured: true,
      rewardType: RewardType.FIXED,
      referrerRewardValue: 150000, // ۱۵۰ هزار تومان پاداش معرفی
      refereeRewardValue: 50000, // ۵۰ هزار تومان پاداش خرید اول
      status: ProductStatus.PUBLISHED,
      categoryId: sofasCategory.id,
      images: {
        create: [
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'نمای روبروی مبل راحتی تک‌نفره چوبی شادچوب',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'نمای جانبی مبل راحتی با چوب گردوی تیره',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
      attributes: {
        create: [
          { attributeId: woodFinishAttr.id, isVariation: true },
          { attributeId: fabricColorAttr.id, isVariation: true },
        ],
      },
    },
  });

  // تنوع‌های مبل راحتی
  const armchairVariants = [
    { sku: 'SW-ARM-WAL-FOR', price: 9200000, salePrice: 8800000, stock: 8, finish: 'walnut', fabric: 'forest-velvet' },
    { sku: 'SW-ARM-WAL-IVO', price: 8900000, salePrice: null, stock: 12, finish: 'walnut', fabric: 'ivory-linen' },
    { sku: 'SW-ARM-WAL-CHA', price: 8900000, salePrice: null, stock: 9, finish: 'walnut', fabric: 'charcoal-grey' },
    { sku: 'SW-ARM-BEE-FOR', price: 8500000, salePrice: null, stock: 15, finish: 'beech', fabric: 'forest-velvet' },
    { sku: 'SW-ARM-BEE-IVO', price: 8200000, salePrice: 7900000, stock: 20, finish: 'beech', fabric: 'ivory-linen' },
    { sku: 'SW-ARM-BEE-CHA', price: 8200000, salePrice: null, stock: 10, finish: 'beech', fabric: 'charcoal-grey' },
  ];

  const createdArmchairVariants: any[] = [];
  for (const item of armchairVariants) {
    const v = await prisma.productVariant.create({
      data: {
        productId: variableArmchair.id,
        sku: item.sku,
        price: item.price,
        salePrice: item.salePrice,
        stockQuantity: item.stock,
        weight: 18.5,
        dimensions: '۸۲×۸۶×۷۸ سانتی‌متر',
        attributeValues: {
          create: [
            { attributeValueId: valMap[item.finish] },
            { attributeValueId: valMap[item.fabric] },
          ],
        },
      },
    });
    createdArmchairVariants.push({ ...v, finish: item.finish, fabric: item.fabric });
  }

  // کالا ۲: محصول ساده - میز ناهارخوری ۸ نفره چوب راش مدل آلبورگ
  const diningTable = await prisma.product.create({
    data: {
      name: 'میز ناهارخوری ۸ نفره چوب راش مدل آلبورگ',
      slug: 'aalborg-solid-beech-dining-table',
      sku: 'SW-DT-001',
      productType: ProductType.SIMPLE,
      description:
        'میز ناهارخوری ۸ نفره آلبورگ از چوب یکپارچه راش گرجستان ساخته شده است. این میز با طراحی ارگانیک لبه‌ها و پایه‌های مخروطی تراش‌خورده، اصالت طبیعت را به اتاق غذاخوری شما می‌آورد. صفحه میز با روغن گیاهی ضدآب و ضدلک محافظت شده که در برابر مایعات گرم و خراشیدگی‌های روزمره کاملاً مقاوم است.',
      shortDescription: 'میز ناهارخوری هشت‌نفره مستطیلی ساخته‌شده از اسلب چوب راش سوپر گرجستان.',
      basePrice: 18500000, // ۱۸ میلیون و ۵۰۰ هزار تومان
      salePrice: 16800000, // قیمت حراج ۱۶ میلیون و ۸۰۰ هزار تومان
      stockQuantity: 14,
      dimensions: '۲۰۰×۱۰۰×۷۶ سانتی‌متر',
      weight: 58.0,
      featured: true,
      rewardType: RewardType.FIXED,
      referrerRewardValue: 250000, // ۲۵۰ هزار تومان پاداش معرفی
      refereeRewardValue: 50000, // ۵۰ هزار تومان پاداش خریدار
      status: ProductStatus.PUBLISHED,
      categoryId: diningTablesCategory.id,
      images: {
        create: [
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'نمای پرسپکتیو میز ناهارخوری ۸ نفره چوب راش آلبورگ',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'جزئیات رگه‌ها و گره‌های طبیعی چوب صفحه میز',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
    },
  });

  // کالا ۳: محصول ساده - میز جلو مبلی روستیک چوب گردو
  const coffeeTable = await prisma.product.create({
    data: {
      name: 'میز جلو مبلی روستیک چوب گردوی تیره',
      slug: 'rustic-solid-walnut-coffee-table',
      sku: 'SW-CT-001',
      productType: ProductType.SIMPLE,
      description:
        'میز جلو مبلی مدل روستیک با سطح منحنی و الهام‌گرفته از جریان رودخانه. تلفیق بافت چوب گردوی کوهستانی با پایه‌های فلزی مشکی مات، هماهنگی فوق‌العاده‌ای میان سبک مدرن و روستیک ایجاد کرده است.',
      shortDescription: 'میز جلو مبلی بیضی شکل تمام چوب گردو با پوشش نانو ضدآب و پایه‌های مشکی کوره.',
      basePrice: 4900000, // ۴ میلیون و ۹۰۰ هزار تومان
      salePrice: 4500000, // ۴ میلیون و ۵۰۰ هزار تومان
      stockQuantity: 22,
      dimensions: '۱۱۰×۶۰×۴۵ سانتی‌متر',
      weight: 14.0,
      featured: true,
      rewardType: RewardType.FIXED,
      referrerRewardValue: 120000,
      refereeRewardValue: 40000,
      status: ProductStatus.PUBLISHED,
      categoryId: coffeeTablesCategory.id,
      images: {
        create: [
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'میز جلو مبلی روستیک چوب گردو در فضای نشیمن مدرن',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // کالا ۴: محصول ساده - صندلی غذاخوری ارگونومیک مدل پینار
  const diningChair = await prisma.product.create({
    data: {
      name: 'صندلی ناهارخوری ارگونومیک چوب راش مدل پینار',
      slug: 'pinar-ergonomic-beech-dining-chair',
      sku: 'SW-DC-001',
      productType: ProductType.SIMPLE,
      description:
        'صندلی ناهارخوری پینار با تکیه‌گاه قوس‌دار ارگونومیک، تکیه‌گاه ستون فقرات را در نشستن‌های طولانی حفظ می‌کند. ساختار پایه‌ها کاملاً یکپارچه و فاق و زبانه‌ای اجرا شده است.',
      shortDescription: 'صندلی ناهارخوری چوبی خوش‌نشین با پوشش روغن گیاهی و اتصالات تمام چوب.',
      basePrice: 2400000, // ۲ میلیون و ۴۰۰ هزار تومان
      salePrice: null,
      stockQuantity: 40,
      dimensions: '۵۰×۵۴×۸۲ سانتی‌متر',
      weight: 6.5,
      featured: false,
      rewardType: RewardType.FIXED,
      referrerRewardValue: 60000,
      refereeRewardValue: 20000,
      status: ProductStatus.PUBLISHED,
      categoryId: diningChairsCategory.id,
      images: {
        create: [
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'صندلی ناهارخوری ارگونومیک چوب راش پینار',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // کالا ۵: محصول ساده - کنسول ۳ درب مدرن چوب بلوط
  const consoleTable = await prisma.product.create({
    data: {
      name: 'کنسول ۳ درب مدرن چوب بلوط دودی',
      slug: 'modern-smoked-oak-sideboard-console',
      sku: 'SW-CN-001',
      productType: ProductType.SIMPLE,
      description:
        'میز کنسول مدرن با ۳ درب فشاری آرام‌بند و پایه‌های چوبی ظریف. فضای داخلی کنسول دارای طبقات متحرک بوده و برای ساماندهی ظروف پذیرایی، کتاب یا اکسسوری‌ها ایده‌آل است.',
      shortDescription: 'کنسول لوکس ۳ درب ساخته‌شده از چوب بلوط طبیعی با یراق‌آلات آرام‌بند بلوم اتریش.',
      basePrice: 12800000, // ۱۲ میلیون و ۸۰۰ هزار تومان
      salePrice: 11900000, // ۱۱ میلیون و ۹۰۰ هزار تومان
      stockQuantity: 6,
      dimensions: '۱۶۰×۴۵×۸۵ سانتی‌متر',
      weight: 42.0,
      featured: true,
      rewardType: RewardType.FIXED,
      referrerRewardValue: 250000,
      refereeRewardValue: 50000,
      status: ProductStatus.PUBLISHED,
      categoryId: decorCategory.id,
      images: {
        create: [
          {
            url: PLACEHOLDER_IMAGE,
            altText: 'کنسول ۳ درب چوب بلوط دودی شادچوب',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  console.log('📦 5 Authentic Persian Products created.');

  // 9. Promotional Coupons
  const isCouponsEnabled = process.env.FEATURE_COUPONS !== 'false';
  let couponNoorooz: any = null;
  let couponWelcome: any = null;

  if (isCouponsEnabled) {
    couponNoorooz = await prisma.coupon.create({
      data: {
        code: 'NOOROOZ',
        description: 'کد تخفیف ویژه بهاره — ۵۰۰,۰۰۰ تومان تخفیف برای سفارش‌های بالای ۵ میلیون تومان',
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 500000,
        minOrderAmount: 5000000,
        usageLimit: 100,
        usageCount: 14,
        isActive: true,
      },
    });

    couponWelcome = await prisma.coupon.create({
      data: {
        code: 'WELCOME10',
        description: 'تخفیف ۱۰ درصدی اولین خرید مشتریان جدید',
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minOrderAmount: 1000000,
        maxDiscountAmount: 1000000,
        usageLimit: 200,
        usageCount: 28,
        isActive: true,
      },
    });

    await prisma.coupon.create({
      data: {
        code: 'FREESHIP',
        description: 'کد ارسال رایگان برای سفارش‌های سراسر کشور',
        discountType: DiscountType.FIXED_AMOUNT,
        discountValue: 65000,
        minOrderAmount: 3000000,
        usageLimit: 150,
        usageCount: 42,
        isActive: true,
      },
    });
    console.log('🏷️ Persian Coupons seeded (NOOROOZ, WELCOME10, FREESHIP).');
  }

  // 10. Flash Deals (فروش‌های شگفت‌انگیز با پاداش معرف و پاداش خریدار هماهنگ)
  const isFlashDealsEnabled = process.env.FEATURE_FLASH_DEALS !== 'false';
  if (isFlashDealsEnabled) {
    const flashDeal = await prisma.flashDeal.create({
      data: {
        title: 'تخفیف شگفت‌انگیز پایان هفته',
        slug: 'weekend-flash-deal',
        description: 'تا پایان زمان، فرصت خرید با پاداش بیشتر داری.',
        badgeText: 'فروش ویژه',
        startDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // ۲ ساعت پیش (در حال برگزاری)
        endDate: new Date(Date.now() + 10 * 60 * 60 * 1000), // ۱۰ ساعت آینده
        isActive: true,
        defaultCashback: 120000, // ۱۲۰ هزار تومان پاداش خرید پیش‌فرض
        defaultReferrerReward: 150000, // ۱۵۰ هزار تومان پاداش معرف پیش‌فرض
        items: {
          create: [
            {
              productId: coffeeTable.id,
              discountType: DiscountType.PERCENTAGE,
              discountValue: 14,
              specialPrice: 4200000, // قیمت شگفت‌انگیز ۴ میلیون و ۲۰۰ هزار تومان
              cashbackAmount: 120000, // ۱۲۰ هزار تومان پاداش خرید
              referrerReward: 180000, // ۱۸۰ هزار تومان پاداش معرف
              stockLimit: 30,
              soldCount: 8,
            },
            {
              productId: variableArmchair.id,
              discountType: DiscountType.PERCENTAGE,
              discountValue: 15,
              specialPrice: 7200000, // قیمت شگفت‌انگیز ۷ میلیون و ۲۰۰ هزار تومان
              cashbackAmount: 150000, // ۱۵۰ هزار تومان پاداش خرید
              referrerReward: 250000, // ۲۵۰ هزار تومان پاداش معرف
              stockLimit: 20,
              soldCount: 6,
            },
          ],
        },
      },
    });
    console.log(`⚡ Flash Deal seeded: "${flashDeal.title}" with 2 products.`);
  }

  // 11. Orders & Coordinated Transactions (هماهنگ با معرف و کیف پول)
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

  const beechIvoryVariant = createdArmchairVariants.find((v) => v.sku === 'SW-ARM-BEE-IVO') || createdArmchairVariants[0];
  const walnutForestVariant = createdArmchairVariants.find((v) => v.sku === 'SW-ARM-WAL-FOR') || createdArmchairVariants[0];

  // سفارش ۱: تحویل داده شده (DELIVERED) - متصل به معرف و کیف پول!
  // سارا رضایی میز ناهارخوری ۱۶,۸۰۰,۰۰۰ تومانی را با کد تخفیف NOOROOZ خرید کرده است.
  // پاداش معرف دقیقاً ۲۵۰,۰۰۰ تومان به کیف پول محمد گندمی واریز شده و با تراکنش کیف پول همخوانی دارد.
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'SW-1001',
      userId: refereeCustomer1.id,
      customerName: `${refereeCustomer1.firstName} ${refereeCustomer1.lastName}`,
      customerEmail: refereeCustomer1.email,
      customerPhone: refereeCustomer1.phone,
      referralId: referralRelation.id,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'ZARINPAL',
      transactionId: 'ZP-1001-99824',
      paidAt: daysAgo(5),
      subtotal: 16800000,
      discountAmount: 500000,
      shippingAmount: 0, // ارسال رایگان
      taxAmount: 0,
      totalAmount: 16300000, // ۱۶ میلیون و ۳۰۰ هزار تومان
      currency: 'IRT',
      couponId: couponNoorooz?.id || null,
      couponCode: couponNoorooz ? 'NOOROOZ' : null,
      shippingAddress: {
        recipientName: 'سارا رضایی',
        phone: '09123333333',
        street: 'تهران، پاسداران، بوستان دوم، تقاطع پایدارفرد، پلاک ۱۴، واحد ۳',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1668744112',
        country: 'ایران',
      },
      shippingMethod: 'باربری اختصاصی مبلمان و دکوراسیون سنگین',
      shippingCarrier: 'باربری تخصصی سلامت بار تهران',
      trackingNumber: 'SLM-998214',
      trackingUrl: 'https://tipaxco.com/tracking?id=SLM-998214',
      shippedAt: daysAgo(3),
      deliveredAt: daysAgo(1),
      createdAt: daysAgo(5),
      customerNotes: 'لطفاً هنگام حمل میز ناهارخوری به طبقه سوم از آسانسور باربری استفاده شود.',
      internalNotes: 'میز به سلامت در محل مشتری تحویل و مونتاژ شد. پاداش معرف به کیف پول معرف واریز گردید.',
      items: {
        create: [
          {
            productId: diningTable.id,
            productName: diningTable.name,
            productSku: diningTable.sku,
            productImage: PLACEHOLDER_IMAGE,
            unitPrice: 16800000,
            quantity: 1,
            totalPrice: 16800000,
            cashbackEarned: 50000,
            selectedAttributes: { 'رنگ چوب': 'چوب راش طبیعی سوپر گرجستان' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'ZARINPAL',
            transactionId: 'ZP-1001-99824',
            status: TransactionStatus.SUCCESS,
            amount: 16300000,
            currency: 'IRT',
            cardPan: '6037-99**-****-4412',
            trackingCode: 'ZP-RRN-99812401',
            createdAt: daysAgo(5),
            gatewayResponse: {
              code: 100,
              message: 'عملیات پرداخت با موفقیت در شاپرک تایید شد',
              card_pan: '603799******4412',
              ref_id: 99812401,
            },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'سفارش توسط خریدار در سایت ثبت شد', createdAt: daysAgo(5) },
          { status: OrderStatus.PROCESSING, note: 'پرداخت ۱۶,۳۰۰,۰۰۰ تومان از طریق درگاه زرین‌پال تایید شد', createdAt: daysAgo(5) },
          { status: OrderStatus.PROCESSING, note: 'بسته‌بندی و کنترل کیفیت در انبار مرکزی شادچوب', createdAt: daysAgo(4) },
          { status: OrderStatus.SHIPPED, note: 'تحویل به باربری سلامت بار تهران (کد: SLM-998214)', createdAt: daysAgo(3) },
          { status: OrderStatus.DELIVERED, note: 'سفارش تحویل خریدار شد. پاداش معرف (۲۵۰,۰۰۰ تومان) آزاد شد.', createdAt: daysAgo(1) },
        ],
      },
    },
  });

  // سفارش ۲: در حال پردازش (PROCESSING)
  // علی حسینی مبل راحتی تک‌نفره شگفت‌انگیز را خریده است.
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1002',
      userId: customer2.id,
      customerName: `${customer2.firstName} ${customer2.lastName}`,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'MELLAT',
      transactionId: 'MEL-2002-88192',
      paidAt: daysAgo(1),
      subtotal: 7200000, // مبل با قیمت تخفیف شگفت‌انگیز
      discountAmount: 0,
      shippingAmount: 65000,
      taxAmount: 0,
      totalAmount: 7265000,
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'علی حسینی',
        phone: '09124444444',
        street: 'اصفهان، خیابان چهارباغ بالا، کوچه کاج، پلاک ۸، مجتمع پارسیان',
        city: 'اصفهان',
        province: 'اصفهان',
        postalCode: '8164812345',
        country: 'ایران',
      },
      shippingMethod: 'ارسال پیشتاز سراسری',
      shippingCarrier: 'شرکت ملی پست',
      trackingNumber: 'PST-8819203',
      trackingUrl: 'https://tracking.post.ir/?id=PST-8819203',
      createdAt: daysAgo(1),
      items: {
        create: [
          {
            productId: variableArmchair.id,
            variantId: beechIvoryVariant.id,
            productName: variableArmchair.name,
            productSku: beechIvoryVariant.sku,
            variantName: 'چوب راش طبیعی / کتان کرم عاجی',
            productImage: PLACEHOLDER_IMAGE,
            unitPrice: 7200000,
            quantity: 1,
            totalPrice: 7200000,
            cashbackEarned: 150000,
            selectedAttributes: { 'نوع چوب': 'چوب راش طبیعی', 'رنگ پارچه': 'کتان کرم عاجی' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'MELLAT',
            transactionId: 'MEL-2002-88192',
            status: TransactionStatus.SUCCESS,
            amount: 7265000,
            currency: 'IRT',
            cardPan: '5022-29**-****-8810',
            trackingCode: 'BPM-RES-448102',
            createdAt: daysAgo(1),
            gatewayResponse: { ResCode: '0', SaleOrderId: '2002', SaleReferenceId: '448102' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'ثبت سفارش توسط خریدار در جشنواره شگفت‌انگیز', createdAt: daysAgo(1) },
          { status: OrderStatus.PROCESSING, note: 'پرداخت ۷,۲۶۵,۰۰۰ تومان از درگاه بانک ملت با موفقیت تایید شد', createdAt: daysAgo(1) },
          { status: OrderStatus.PROCESSING, note: 'آماده‌سازی پارچه و کنترل فوم در کارگاه', createdAt: hoursAgo(8) },
        ],
      },
    },
  });

  // سفارش ۳: ارسال شده (SHIPPED)
  // زهرا کریمی میز جلو مبلی روستیک سفارش داده و ارسال شده است.
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1003',
      userId: customer3.id,
      customerName: `${customer3.firstName} ${customer3.lastName}`,
      customerEmail: customer3.email,
      customerPhone: customer3.phone,
      status: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'SAMAN',
      transactionId: 'SEP-3003-77218',
      paidAt: daysAgo(3),
      subtotal: 4200000,
      discountAmount: 0,
      shippingAmount: 65000,
      taxAmount: 0,
      totalAmount: 4265000,
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'زهرا کریمی',
        phone: '09125555555',
        street: 'شیراز، خیابان عفیف‌آباد، کوچه ۱۲، ساختمان مهر، پلاک ۲۲',
        city: 'شیراز',
        province: 'فارس',
        postalCode: '7193612345',
        country: 'ایران',
      },
      shippingMethod: 'ارسال پیشتاز سراسری',
      shippingCarrier: 'تیپاکس اکسپرس',
      trackingNumber: 'TPX-98214819',
      trackingUrl: 'https://tipaxco.com/tracking?id=TPX-98214819',
      shippedAt: daysAgo(1),
      createdAt: daysAgo(3),
      items: {
        create: [
          {
            productId: coffeeTable.id,
            productName: coffeeTable.name,
            productSku: coffeeTable.sku,
            productImage: PLACEHOLDER_IMAGE,
            unitPrice: 4200000,
            quantity: 1,
            totalPrice: 4200000,
            cashbackEarned: 120000,
            selectedAttributes: { 'پوشش چوب': 'چوب گردوی کوهستانی با روغن گیاهی' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'SAMAN',
            transactionId: 'SEP-3003-77218',
            status: TransactionStatus.SUCCESS,
            amount: 4265000,
            currency: 'IRT',
            cardPan: '5892-10**-****-3319',
            trackingCode: 'SEP-TRN-77218',
            createdAt: daysAgo(3),
            gatewayResponse: { Status: 1, RRN: '77218991' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'ثبت سفارش در فروشگاه اینترنتی', createdAt: daysAgo(3) },
          { status: OrderStatus.PROCESSING, note: 'پرداخت ۴,۲۶۵,۰۰۰ تومان از درگاه سامان تایید شد', createdAt: daysAgo(3) },
          { status: OrderStatus.SHIPPED, note: 'مرسوله با بارنامه TPX-98214819 تحویل تیپاکس شیراز گردید', createdAt: daysAgo(1) },
        ],
      },
    },
  });

  // سفارش ۴: در انتظار پرداخت (PENDING)
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1004',
      userId: refereeCustomer1.id,
      customerName: `${refereeCustomer1.firstName} ${refereeCustomer1.lastName}`,
      customerEmail: refereeCustomer1.email,
      customerPhone: refereeCustomer1.phone,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: 'BANK_TRANSFER',
      subtotal: 4800000,
      discountAmount: 0,
      shippingAmount: 65000,
      taxAmount: 0,
      totalAmount: 4865000,
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'سارا رضایی',
        phone: '09123333333',
        street: 'تهران، پاسداران، بوستان دوم، تقاطع پایدارفرد، پلاک ۱۴، واحد ۳',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1668744112',
        country: 'ایران',
      },
      shippingMethod: 'ارسال پیشتاز سراسری',
      createdAt: hoursAgo(4),
      items: {
        create: [
          {
            productId: diningChair.id,
            productName: diningChair.name,
            productSku: diningChair.sku,
            productImage: PLACEHOLDER_IMAGE,
            unitPrice: 2400000,
            quantity: 2,
            totalPrice: 4800000,
            cashbackEarned: 40000,
            selectedAttributes: { 'چوب': 'راش گرجستان' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'سفارش ثبت شده و در انتظار پرداخت یا فیش واریزی بانکی است', createdAt: hoursAgo(4) },
        ],
      },
    },
  });

  // سفارش ۵: لغو شده و بازگشت وجه (CANCELLED)
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1005',
      userId: customer2.id,
      customerName: `${customer2.firstName} ${customer2.lastName}`,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      status: OrderStatus.CANCELLED,
      paymentStatus: PaymentStatus.REFUNDED,
      paymentMethod: 'ZARINPAL',
      transactionId: 'ZP-5005-CANCEL',
      paidAt: daysAgo(10),
      subtotal: 4900000,
      discountAmount: 0,
      shippingAmount: 65000,
      taxAmount: 0,
      totalAmount: 4965000,
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'علی حسینی',
        phone: '09124444444',
        street: 'اصفهان، چهارباغ بالا، کوچه کاج، پلاک ۸',
        city: 'اصفهان',
        province: 'اصفهان',
        postalCode: '8164812345',
        country: 'ایران',
      },
      shippingMethod: 'ارسال پیشتاز سراسری',
      createdAt: daysAgo(10),
      internalNotes: 'مشتری پیش از مرحله خروج کالا از انبار، درخواست لغو و عودت به شماره شبا را ثبت کرد. وجه ۱۰۰٪ عودت داده شد.',
      items: {
        create: [
          {
            productId: coffeeTable.id,
            productName: coffeeTable.name,
            productSku: coffeeTable.sku,
            productImage: PLACEHOLDER_IMAGE,
            unitPrice: 4900000,
            quantity: 1,
            totalPrice: 4900000,
            selectedAttributes: { 'پوشش چوب': 'چوب گردو' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'سفارش ثبت گردید', createdAt: daysAgo(10) },
          { status: OrderStatus.PROCESSING, note: 'پرداخت با موفقیت انجام شد', createdAt: daysAgo(10) },
          { status: OrderStatus.CANCELLED, note: 'به درخواست مشتری پیش از ارسال لغو شد', createdAt: daysAgo(9) },
        ],
      },
    },
  });

  console.log('🛍️ 5 Iranian Orders seeded: SW-1001 (DELIVERED with Referral), SW-1002 (PROCESSING), SW-1003 (SHIPPED), SW-1004 (PENDING), SW-1005 (CANCELLED).');

  // 12. Blog Categories & Posts (وبلاگ آموزشی و دکوراسیون کاملاً فارسی)
  const blogCatDecor = await prisma.blogCategory.create({
    data: {
      name: 'راهنمای چیدمان و دکوراسیون منزل',
      slug: 'home-decor-guide',
      description: 'اصول ترکیب مبلمان، نورپردازی و هماهنگی بافت‌های چوبی در خانه‌های ایرانی.',
    },
  });

  const blogCatWoodCare = await prisma.blogCategory.create({
    data: {
      name: 'نگهداری و مراقبت از چوب طبیعی',
      slug: 'wood-care-and-maintenance',
      description: 'نکات کاربردی برای افزایش طول عمر و درخشش مبلمان و میزهای چوب گردو و راش.',
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'راهنمای جامع واکس‌زدن و مراقبت از مبلمان چوب طبیعی در منزل',
      slug: 'natural-wood-furniture-waxing-care-guide',
      excerpt: 'چگونه با روغن‌های گیاهی ارگانیک و واکس زنبور عسل، چوب طبیعی را در برابر خشکی و ترک‌خوردگی محافظت کنیم.',
      content: `### چرا چوب طبیعی نیاز به رسیدگی دوره‌ای دارد؟
چوب یک متریال زنده و تنفس‌پذیر است. تغییرات رطوبت فصل و گرمایش منازل در زمستان می‌تواند رطوبت طبیعی چوب را کاهش دهد. استفاده دوره‌ای از روغن‌های گیاهی استاندارد (مانند روغن بزرک تصفیه‌شده یا روغن زیتون بدون بو) و واکس بر پایه موم عسل، رگه‌ها و گره‌های چوب را زنده نگاه می‌دارد.

#### سه مرحله طلایی برای تمیزکاری و جلا دادن:
1. **گردگیری اولیه:** ابتدا با دستمال میکروفایبر کاملاً نرم و نم‌دار گرد و غبار سطحی را بزدایید.
2. **اعمال واکس محافظ:** مقدار کمی موم عسل مخصوص چوب را با اسفنج تمیز در جهت رگه‌های چوب ماساژ دهید.
3. **پرداخت نهایی:** پس از ۱۵ دقیقه، با یک پارچه خشک نخی سطح را مالش دهید تا درخشش ابریشمی ملایمی ایجاد شود.`,
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: blogCatWoodCare.id,
      featuredImage: PLACEHOLDER_IMAGE,
      publishedAt: daysAgo(8),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'چگونه چوب گردو و راش را در چیدمان مدرن با یکدیگر هماهنگ کنیم؟',
      slug: 'matching-walnut-and-beech-in-modern-interior',
      excerpt: 'ترکیب تناژهای تیره و روشن چوب در اتاق نشیمن و پذیرایی برای ایجاد عمق و گرما در دکوراسیون.',
      content: `### هنر تضاد در دکوراسیون داخلی
بسیاری تصور می‌کنند تمامی اجزای خانه باید دقیقاً از یک رنگ چوب باشند، در حالی که طراحان برجسته معتقدند ترکیب چوب گرم گردو در کنار گرمای روشن چوب راش، پویایی و عمق بصری شگفت‌انگیزی خلق می‌کند.

#### نکات کلیدی برای چیدمان ترکیبی:
* **تعیین عنصر شاخص:** میز ناهارخوری بزرگ را با چوب تیره گردو انتخاب کنید تا نقطه کانونی فضا باشد.
* **ایجاد تعادل با پارچه:** از پارچه‌های خنثی مانند کتان کرم عاجی یا طوسی روشن برای صندلی‌ها استفاده کنید تا پل ارتباطی بین دو تناژ چوب باشند.`,
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: blogCatDecor.id,
      featuredImage: PLACEHOLDER_IMAGE,
      publishedAt: daysAgo(3),
    },
  });

  console.log('✍️ Persian Blog Categories & Articles seeded.');
  console.log('🎉 100% Persian Seed completed with perfect synchronization across Orders, Referrals, Wallets, and Flash Deals!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
