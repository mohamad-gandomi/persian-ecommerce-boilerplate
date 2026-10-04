import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function ensurePlaceholderImage() {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const placeholderPath = path.join(uploadsDir, 'placeholder.webp');
  if (!fs.existsSync(placeholderPath)) {
    try {
      // Check if scripts/generate-placeholder.js exists and run it
      const { execSync } = require('child_process');
      execSync('node scripts/generate-placeholder.js', { stdio: 'inherit' });
    } catch {
      // If script fails or sharp is absent, create a minimal dummy file
      fs.writeFileSync(placeholderPath, Buffer.from([]));
    }
  }
}

async function main() {
  console.log('🚀 Initializing clean database structure and essential configurations...');

  await ensurePlaceholderImage();

  // 1. Ensure Super Admin Account
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@store.local';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Admin@123456', salt);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'مدیر',
        lastName: 'سیستم',
        phone: '09120000000',
        role: Role.ADMIN,
      },
    });
    console.log(`👤 Super Admin created: ${adminEmail} (Password: Admin@123456)`);
  } else {
    console.log(`👤 Super Admin already exists: ${adminEmail}`);
  }

  // 2. Ensure Core Store Settings
  await prisma.systemSetting.upsert({
    where: { key: 'store' },
    update: {},
    create: {
      key: 'store',
      value: {
        name: 'فروشگاه اینترنتی',
        email: 'info@store.local',
        phone: '۰۲۱-۸۸۹۹۰۰۱۱',
        address: 'تهران، خیابان ولیعصر',
        currency: 'IRT',
      },
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'media' },
    update: {},
    create: {
      key: 'media',
      value: {
        convertToWebp: true,
        qualityPreset: 80,
        maxWidthOption: 2048,
        showOptimizationOptions: false,
      },
    },
  });
  console.log('⚙️ Essential store and media system settings initialized.');

  // 3. Ensure Default Shipping Method (Core Feature)
  const shippingCount = await prisma.shippingMethod.count();
  if (shippingCount === 0) {
    await prisma.shippingMethod.create({
      data: {
        name: 'ارسال پیشتاز / استاندارد',
        type: 'FIXED',
        price: 45000,
        currency: 'IRT',
        carrier: 'شرکت ملی پست / تیپاکس',
        estimatedDays: '۲ الی ۴ روز کاری',
        description: 'تحویل سریع مرسوله با رهگیری لحظه‌ای پیامکی و بسته‌بندی ایمن',
        isActive: true,
        isDefault: true,
        displayOrder: 1,
      },
    });
    console.log('🚚 Default shipping method initialized.');
  }

  console.log('✨ Clean database setup completed successfully! (No demo data populated)');
}

main()
  .catch((e) => {
    console.error('❌ Error during database initialization:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
