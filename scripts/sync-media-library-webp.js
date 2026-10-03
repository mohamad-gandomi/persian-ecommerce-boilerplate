const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const uploadsDir = path.resolve(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storefrontImages = [
  {
    src: path.resolve(__dirname, '../frontend/public/images/hero-bedroom-zen.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/hero-bedroom-zen.webp'),
    filename: 'hero-bedroom-zen.webp',
    altText: 'Zen Minimalist Platform Bed in Morning Light',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/hero-living-zen.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/hero-living-zen.webp'),
    filename: 'hero-living-zen.webp',
    altText: 'Architectural Minimalist Living Room Showcase',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/showcase-credenza.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/showcase-credenza.webp'),
    filename: 'showcase-credenza.webp',
    altText: 'Heritage Walnut Credenza Sideboard',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/showcase-lounge-duo.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/showcase-lounge-duo.webp'),
    filename: 'showcase-lounge-duo.webp',
    altText: 'Nordic Boucle Armchair Duo with Morning Sunlight',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/showcase-bookshelf.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/showcase-bookshelf.webp'),
    filename: 'showcase-bookshelf.webp',
    altText: 'Minimalist Architectural Wood Bookshelf and Ceramics',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/material-craft-wood.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/material-craft-wood.webp'),
    filename: 'material-craft-wood.webp',
    altText: 'Artisan Wood Joinery and Natural Timber Grain',
  },
];

const productImages = [
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/kyoto-bed.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/kyoto-bed.webp'),
    filename: 'furniture-kyoto-bed.webp',
    productSlug: 'kyoto-solid-walnut-platform-bed',
    altText: 'Kyoto Solid Walnut Platform Bed',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/sora-coffee-table.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/sora-coffee-table.webp'),
    filename: 'furniture-sora-coffee-table.webp',
    productSlug: 'sora-sculptural-organic-coffee-table',
    altText: 'Sora Sculptural Organic Coffee Table',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/heritage-credenza.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/heritage-credenza.webp'),
    filename: 'furniture-heritage-credenza.webp',
    productSlug: 'heritage-6-drawer-walnut-credenza',
    altText: 'Heritage 6-Drawer Walnut Credenza',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/hana-nightstand.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/hana-nightstand.webp'),
    filename: 'furniture-hana-nightstand.webp',
    productSlug: 'hana-solid-walnut-bedside-nightstand',
    altText: 'Hana Solid Walnut Bedside Nightstand',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/kanso-chair.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/kanso-chair.webp'),
    filename: 'furniture-kanso-chair.webp',
    productSlug: 'kanso-curved-white-oak-dining-chair',
    altText: 'Kanso Curved White Oak Dining Chair',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/minka-trestle-table.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/minka-trestle-table.webp'),
    filename: 'furniture-minka-trestle-table.webp',
    productSlug: 'minka-solid-ash-trestle-dining-table',
    altText: 'Minka Solid Ash Trestle Dining Table',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/takumi-end-table.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/takumi-end-table.webp'),
    filename: 'furniture-takumi-end-table.webp',
    productSlug: 'takumi-solid-oak-block-end-table',
    altText: 'Takumi Solid Oak Block End Table',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/shizuka-lounge-sofa.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/shizuka-lounge-sofa.webp'),
    filename: 'furniture-shizuka-lounge-sofa.webp',
    productSlug: 'shizuka-low-profile-lounge-sofa',
    altText: 'Shizuka Low-Profile Lounge Sofa',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/nordic-armchair.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/nordic-armchair.webp'),
    filename: 'furniture-nordic-armchair.webp',
    productSlug: 'nordic-minimalist-lounge-armchair',
    altText: 'Nordic Minimalist Lounge Armchair',
  },
  {
    src: path.resolve(__dirname, '../frontend/public/images/products/aalborg-dining-table.webp'),
    destFrontend: path.resolve(__dirname, '../frontend/public/images/products/aalborg-dining-table.webp'),
    filename: 'furniture-aalborg-dining-table.webp',
    productSlug: 'aalborg-solid-white-oak-dining-table',
    altText: 'Aalborg Solid White Oak Dining Table',
  },
];

async function sync() {
  console.log('🚀 Starting Media Library WebP Synchronization...');
  const allItems = [...storefrontImages, ...productImages];

  for (const item of allItems) {
    if (!fs.existsSync(item.src)) {
      console.warn(`⚠️ Source file not found: ${item.src}`);
      continue;
    }

    console.log(`\n📦 Converting: ${path.basename(item.src)} -> ${item.filename}`);
    const inputBuffer = fs.readFileSync(item.src);
    const { data: webpBuffer, info } = await sharp(inputBuffer)
      .rotate()
      .webp({ quality: 85, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    // 1. Write to backend ./uploads
    const uploadFilePath = path.join(uploadsDir, item.filename);
    fs.writeFileSync(uploadFilePath, webpBuffer);
    console.log(`   ✅ Saved to backend uploads: ${uploadFilePath} (${(info.size / 1024).toFixed(1)} KB)`);

    // 2. Write to frontend public as webp fallback
    if (item.destFrontend) {
      const destDir = path.dirname(item.destFrontend);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.writeFileSync(item.destFrontend, webpBuffer);
      console.log(`   ✅ Saved to frontend fallback: ${item.destFrontend}`);
    }

    // 3. Register / Upsert in Prisma Media
    const mediaUrl = `http://localhost:4000/uploads/${item.filename}`;
    const mediaRecord = await prisma.media.upsert({
      where: { filename: item.filename },
      update: {
        originalName: item.filename,
        mimeType: 'image/webp',
        size: info.size,
        width: info.width,
        height: info.height,
        url: mediaUrl,
        altText: item.altText,
      },
      create: {
        filename: item.filename,
        originalName: item.filename,
        mimeType: 'image/webp',
        size: info.size,
        width: info.width,
        height: info.height,
        url: mediaUrl,
        altText: item.altText,
      },
    });
    console.log(`   ✅ Media library record synced: [${mediaRecord.id}] ${mediaRecord.url}`);

    // 4. If productSlug is defined, update Product and ProductImage in PostgreSQL
    if (item.productSlug) {
      const product = await prisma.product.findUnique({
        where: { slug: item.productSlug },
        include: { images: true },
      });

      if (product) {
        // Demote any existing primary images
        await prisma.productImage.updateMany({
          where: { productId: product.id },
          data: { isPrimary: false },
        });

        const primaryImg = product.images.find(img => img.isPrimary) || product.images[0];
        if (primaryImg) {
          await prisma.productImage.update({
            where: { id: primaryImg.id },
            data: {
              url: mediaUrl,
              altText: item.altText,
              isPrimary: true,
              displayOrder: 0,
            },
          });
          console.log(`   ✅ Updated existing primary image for product: ${product.title}`);
        } else {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: mediaUrl,
              altText: item.altText,
              isPrimary: true,
              displayOrder: 0,
            },
          });
          console.log(`   ✅ Created new primary image for product: ${product.title}`);
        }
      } else {
        console.warn(`   ⚠️ Product with slug "${item.productSlug}" not found in DB`);
      }
    }
  }

  // Also verify total media count and products count
  const totalMedia = await prisma.media.count();
  console.log(`\n🎉 Completed! Total assets in Media Library: ${totalMedia}`);
}

sync()
  .catch((err) => {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
