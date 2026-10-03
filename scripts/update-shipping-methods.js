const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚚 Updating and Persianizing Shipping Methods in database...');

  // Remove existing or clear to recreate clean list
  await prisma.shippingMethod.deleteMany();

  const methods = [
    {
      name: 'باربری اختصاصی و کالارسان (هماهنگی و استعلام تلفنی هزینه)',
      type: 'FIXED',
      price: 0,
      currency: 'IRR',
      carrier: 'باربری اختصاصی (پس‌کرایه)',
      estimatedDays: '۳ الی ۵ روز کاری',
      description:
        'هزینه باربری بر اساس شهر، طبقه و مسافت، پس از ثبت سفارش محاسبه و به صورت تلفنی هماهنگ خواهد شد (پرداخت کرایه حمل به صورت پس‌کرایه هنگام تحویل کالا).',
      isActive: true,
      isDefault: true,
      displayOrder: 1,
    },
    {
      name: 'ارسال سریع تیپاکس / پست پیشتاز',
      type: 'FIXED',
      price: 150000,
      currency: 'IRR',
      carrier: 'تیپاکس / شرکت پست',
      estimatedDays: '۱ الی ۳ روز کاری',
      description:
        'ارسال سریع سفارشات با بسته‌بندی ایمن و کد رهگیری پستی به سراسر کشور.',
      isActive: true,
      isDefault: false,
      displayOrder: 2,
    },
    {
      name: 'تحویل حضوری در انبار مرکزی فروشگاه',
      type: 'LOCAL_PICKUP',
      price: 0,
      currency: 'IRR',
      carrier: 'تحویل حضوری (انبار مرکزی فروشگاه)',
      estimatedDays: '۱ الی ۲ روز کاری',
      description:
        'تحویل مستقیم سفارش از انبار مرکزی فروشگاه همراه با هماهنگی زمان تحویل.',
      isActive: true,
      isDefault: false,
      displayOrder: 3,
    },
  ];

  for (const m of methods) {
    const created = await prisma.shippingMethod.create({ data: m });
    console.log(`  ✓ Created shipping method: ${created.name} (Price: ${created.price})`);
  }

  console.log('✅ All shipping methods updated and Persianized successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error updating shipping methods:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
