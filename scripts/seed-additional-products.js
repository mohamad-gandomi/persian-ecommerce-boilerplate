const { PrismaClient, ProductType, ProductStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 8 additional handcrafted products...');

  // 1. Ensure categories exist
  let bedroom = await prisma.category.findUnique({ where: { slug: 'bedroom' } });
  if (!bedroom) {
    bedroom = await prisma.category.create({
      data: {
        name: 'Bedroom Sanctuary',
        slug: 'bedroom',
        description: 'Handcrafted solid wood platform beds, nightstands, and dressers.',
        displayOrder: 3,
      },
    });
  }

  let coffeeTables = await prisma.category.findUnique({ where: { slug: 'coffee-tables' } });
  if (!coffeeTables) {
    const living = await prisma.category.findUnique({ where: { slug: 'living-room' } });
    coffeeTables = await prisma.category.create({
      data: {
        name: 'Coffee & Accent Tables',
        slug: 'coffee-tables',
        description: 'Sculptural organic coffee tables and solid timber end blocks.',
        parentId: living?.id,
        displayOrder: 2,
      },
    });
  }

  let diningChairs = await prisma.category.findUnique({ where: { slug: 'dining-chairs' } });
  if (!diningChairs) {
    const dining = await prisma.category.findUnique({ where: { slug: 'dining-room' } });
    diningChairs = await prisma.category.create({
      data: {
        name: 'Dining Chairs & Benches',
        slug: 'dining-chairs',
        description: 'Steam-bent solid hardwood chairs with Danish paper cord weaving.',
        parentId: dining?.id,
        displayOrder: 2,
      },
    });
  }

  // 2. Define the 8 new products
  const productsToSeed = [
    {
      name: 'Kyoto Solid Walnut Platform Bed',
      slug: 'kyoto-solid-walnut-platform-bed',
      sku: 'SW-BED-01',
      productType: ProductType.SIMPLE,
      description: 'Handcrafted from continuous planks of kiln-dried American black walnut with concealed mortise and tenon joinery, an inclined solid headboard, and organic beeswax seal.',
      shortDescription: 'Minimalist low-profile platform bed in solid American black walnut.',
      basePrice: 1850.0,
      stockQuantity: 8,
      dimensions: '215x165x85 cm',
      weight: 65,
      featured: true,
      categoryId: bedroom.id,
      images: ['/images/products/kyoto-bed.webp'],
    },
    {
      name: 'Sora Sculptural Organic Coffee Table',
      slug: 'sora-sculptural-organic-coffee-table',
      sku: 'SW-TABLE-SORA',
      productType: ProductType.SIMPLE,
      description: 'An organic curved freeform solid walnut coffee table resting securely upon three rounded cylindrical timber pillars. Hand-buffed with cold-pressed natural plant oil.',
      shortDescription: 'Freeform curved solid walnut coffee table with cylindrical pillars.',
      basePrice: 620.0,
      stockQuantity: 12,
      dimensions: '130x75x38 cm',
      weight: 22,
      featured: true,
      categoryId: coffeeTables.id,
      images: ['/images/products/sora-coffee-table.webp'],
    },
    {
      name: 'Heritage 6-Drawer Walnut Credenza',
      slug: 'heritage-6-drawer-walnut-credenza',
      sku: 'SW-CREDENZA-01',
      productType: ProductType.SIMPLE,
      description: 'Continuous grain matched drawer fronts hand-cut from a single 12-foot slab of certified black walnut with precision finger joints and soft-close under-mount slides.',
      shortDescription: 'Continuous-grain 6-drawer dresser in solid American walnut.',
      basePrice: 2100.0,
      stockQuantity: 4,
      dimensions: '180x50x76 cm',
      weight: 78,
      featured: true,
      categoryId: coffeeTables.id,
      images: ['/images/products/heritage-credenza.webp'],
    },
    {
      name: 'Hana Solid Walnut Bedside Nightstand',
      slug: 'hana-solid-walnut-bedside-nightstand',
      sku: 'SW-NIGHTSTAND-01',
      productType: ProductType.SIMPLE,
      description: 'Handcrafted floating-effect bedside nightstand with a single soft-close drawer, hand-cut dovetail corners, and an open lower gallery shelf for reading books.',
      shortDescription: 'Dovetail solid walnut nightstand with gallery shelf.',
      basePrice: 380.0,
      stockQuantity: 15,
      dimensions: '55x42x52 cm',
      weight: 14,
      featured: true,
      categoryId: bedroom.id,
      images: ['/images/products/hana-nightstand.webp'],
    },
    {
      name: 'Kanso Curved White Oak Dining Chair',
      slug: 'kanso-curved-white-oak-dining-chair',
      sku: 'SW-CHAIR-KANSO',
      productType: ProductType.SIMPLE,
      description: 'Steam-bent European white oak backrest seamlessly paired with natural Danish hand-woven paper cord seat. Exceptionally lightweight, durable, and comfortable.',
      shortDescription: 'Steam-bent white oak dining chair with Danish woven paper cord.',
      basePrice: 290.0,
      stockQuantity: 24,
      dimensions: '54x52x74 cm',
      weight: 6.5,
      featured: true,
      categoryId: diningChairs.id,
      images: ['/images/products/kanso-chair.webp'],
    },
    {
      name: 'Minka Solid Ash Trestle Dining Table',
      slug: 'minka-solid-ash-trestle-dining-table',
      sku: 'SW-TABLE-MINKA',
      productType: ProductType.SIMPLE,
      description: 'Architectural 8-person dining table crafted from solid natural white ash, featuring angled trestle legs with exposed wedge through-tenon joinery.',
      shortDescription: 'Architectural 8-person solid ash dining table with trestle base.',
      basePrice: 1450.0,
      stockQuantity: 6,
      dimensions: '220x95x76 cm',
      weight: 68,
      featured: true,
      categoryId: diningChairs.id,
      images: ['/images/products/minka-trestle-table.webp'],
    },
    {
      name: 'Takumi Solid Oak Block End Table',
      slug: 'takumi-solid-oak-block-end-table',
      sku: 'SW-BLOCK-TAKUMI',
      productType: ProductType.SIMPLE,
      description: 'Sculpted from a single solid European white oak log block. Celebrates natural growth rings, heartwood cracks, and natural organic wood movement.',
      shortDescription: 'Sculptural solid oak log block accent side table.',
      basePrice: 340.0,
      stockQuantity: 9,
      dimensions: '36x36x45 cm',
      weight: 28,
      featured: true,
      categoryId: coffeeTables.id,
      images: ['/images/products/takumi-end-table.webp'],
    },
    {
      name: 'Shizuka Low-Profile Lounge Sofa',
      slug: 'shizuka-low-profile-lounge-sofa',
      sku: 'SW-SOFA-SHIZUKA',
      productType: ProductType.SIMPLE,
      description: 'Grounding low-profile 3-seater sofa with exposed solid white oak perimeter frame and oatmeal Italian linen upholstery filled with natural down-blend cushions.',
      shortDescription: 'Deep low-profile oak sofa in textured oatmeal linen.',
      basePrice: 2400.0,
      stockQuantity: 5,
      dimensions: '240x95x72 cm',
      weight: 85,
      featured: true,
      categoryId: coffeeTables.id,
      images: ['/images/products/shizuka-lounge-sofa.webp'],
    },
  ];

  for (const item of productsToSeed) {
    const existing = await prisma.product.findUnique({ where: { slug: item.slug } });
    if (existing) {
      console.log(`Product "${item.name}" already exists, skipping.`);
      continue;
    }

    await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        productType: item.productType,
        description: item.description,
        shortDescription: item.shortDescription,
        basePrice: item.basePrice,
        stockQuantity: item.stockQuantity,
        manageStock: true,
        dimensions: item.dimensions,
        weight: item.weight,
        featured: item.featured,
        status: ProductStatus.PUBLISHED,
        categoryId: item.categoryId,
        images: {
          create: item.images.map((url, idx) => ({
            url,
            altText: `${item.name} View ${idx + 1}`,
            isPrimary: idx === 0,
            displayOrder: idx,
          })),
        },
      },
    });
    console.log(`+ Created product: ${item.name}`);
  }

  const count = await prisma.product.count();
  console.log(`Total products in database: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
