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
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting e-commerce database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.referralCode.deleteMany();
  await prisma.orderTransaction.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
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

  // 2. Create Users (Admin & Customer)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@store.local',
      passwordHash: adminPasswordHash,
      firstName: 'Store',
      lastName: 'Admin',
      phone: '+1 555-0199',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@store.local',
      passwordHash: customerPasswordHash,
      firstName: 'Alexander',
      lastName: 'Wright',
      phone: '+1 555-0245',
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            title: 'Home Residence',
            recipientName: 'Alexander Wright',
            phone: '+1 555-0245',
            street: '742 Evergreen Terrace',
            city: 'Portland',
            province: 'Oregon',
            postalCode: '97201',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'eleanor.vance@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'Eleanor',
      lastName: 'Vance',
      phone: '+1 555-0812',
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            title: 'Seattle Apartment',
            recipientName: 'Eleanor Vance',
            phone: '+1 555-0812',
            street: '1204 Pine Street, Apt 5B',
            city: 'Seattle',
            province: 'Washington',
            postalCode: '98101',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      email: 'marcus.chen@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'Marcus',
      lastName: 'Chen',
      phone: '+1 555-0934',
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            title: 'Design Studio Loft',
            recipientName: 'Marcus Chen',
            phone: '+1 555-0934',
            street: '550 NW 13th Ave',
            city: 'Portland',
            province: 'Oregon',
            postalCode: '97209',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  console.log(`👤 Users seeded: Admin (${admin.email}), Customers (${customer.email}, ${customer2.email}, ${customer3.email})`);

  // 3. Hierarchical Categories for Furniture
  const livingRoom = await prisma.category.create({
    data: {
      name: 'Living Room',
      slug: 'living-room',
      description: 'Handcrafted sofas, lounge chairs, and coffee tables built for elegance and comfort.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      displayOrder: 1,
    },
  });

  const sofasCategory = await prisma.category.create({
    data: {
      name: 'Sofas & Armchairs',
      slug: 'sofas-and-armchairs',
      description: 'Custom upholstered seating and accent armchairs.',
      parentId: livingRoom.id,
      displayOrder: 1,
    },
  });

  const diningRoom = await prisma.category.create({
    data: {
      name: 'Dining Room',
      slug: 'dining-room',
      description: 'Solid wood dining tables, benches, and ergonomic dining chairs.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
      displayOrder: 2,
    },
  });

  const diningTablesCategory = await prisma.category.create({
    data: {
      name: 'Dining Tables',
      slug: 'dining-tables',
      description: 'Hand-finished hardwood dining tables designed to last generations.',
      parentId: diningRoom.id,
      displayOrder: 1,
    },
  });

  console.log('🛋️ Categories seeded (Hierarchical).');

  // 4. Attributes & Values (WooCommerce Style)
  const woodFinishAttr = await prisma.attribute.create({
    data: {
      name: 'Wood Finish',
      slug: 'wood-finish',
      values: {
        create: [
          { name: 'Solid American Walnut', value: 'walnut', colorHex: '#5C4033' },
          { name: 'Natural White Oak', value: 'natural-oak', colorHex: '#C8AD7F' },
          { name: 'Smoked Teak', value: 'smoked-teak', colorHex: '#3D2817' },
        ],
      },
    },
    include: { values: true },
  });

  const fabricColorAttr = await prisma.attribute.create({
    data: {
      name: 'Fabric Color',
      slug: 'fabric-color',
      values: {
        create: [
          { name: 'Forest Velvet', value: 'forest-velvet', colorHex: '#1E3F20' },
          { name: 'Ivory Linen', value: 'ivory-linen', colorHex: '#F5F2EB' },
          { name: 'Charcoal Grey', value: 'charcoal-grey', colorHex: '#36454F' },
        ],
      },
    },
    include: { values: true },
  });

  const materialAttr = await prisma.attribute.create({
    data: {
      name: 'Material & Joinery',
      slug: 'material-and-joinery',
      values: {
        create: [
          { name: 'Solid European White Oak', value: 'solid-oak', colorHex: '#C8AD7F' },
          { name: 'Solid American Black Walnut', value: 'solid-walnut', colorHex: '#5C4033' },
          { name: 'Danish Kiln-Dried Teak', value: 'danish-teak', colorHex: '#8B5A2B' },
        ],
      },
    },
    include: { values: true },
  });

  console.log('🎨 Global Attributes & Values seeded.');

  // 5. Products
  // A. Variable Product: Nordic Lounge Armchair
  const variableArmchair = await prisma.product.create({
    data: {
      name: 'Nordic Minimalist Lounge Armchair',
      slug: 'nordic-minimalist-lounge-armchair',
      sku: 'SW-ARMCHAIR-01',
      productType: ProductType.VARIABLE,
      description:
        'A sculptured Danish-modern lounge chair celebrating clean lines, organic curves, and heirloom-grade joinery. Built from kiln-dried hardwood with premium velvet or breathable linen upholstery.',
      shortDescription: 'Modern Scandinavian armchair with customizable hardwood frame and upholstery.',
      basePrice: 450.0,
      dimensions: '82x86x78 cm',
      weight: 18.5,
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: sofasCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
            altText: 'Nordic Minimalist Lounge Armchair Front View',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1580481077198-1329621379c6',
            altText: 'Nordic Minimalist Lounge Armchair Profile Angle',
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

  // Map values for easy lookup
  const valMap: Record<string, string> = {};
  for (const v of [...woodFinishAttr.values, ...fabricColorAttr.values]) {
    valMap[v.value] = v.id;
  }

  // Create Variations for Armchair (e.g., combinations of finish & fabric)
  const variantsData = [
    {
      sku: 'SW-ARM-WAL-FOR',
      price: 530.0,
      salePrice: 490.0,
      stock: 8,
      finish: 'walnut',
      fabric: 'forest-velvet',
    },
    {
      sku: 'SW-ARM-WAL-IVO',
      price: 495.0,
      salePrice: null,
      stock: 14,
      finish: 'walnut',
      fabric: 'ivory-linen',
    },
    {
      sku: 'SW-ARM-WAL-CHA',
      price: 495.0,
      salePrice: null,
      stock: 9,
      finish: 'walnut',
      fabric: 'charcoal-grey',
    },
    {
      sku: 'SW-ARM-OAK-FOR',
      price: 480.0,
      salePrice: null,
      stock: 15,
      finish: 'natural-oak',
      fabric: 'forest-velvet',
    },
    {
      sku: 'SW-ARM-OAK-IVO',
      price: 450.0,
      salePrice: 420.0,
      stock: 22,
      finish: 'natural-oak',
      fabric: 'ivory-linen',
    },
    {
      sku: 'SW-ARM-OAK-CHA',
      price: 450.0,
      salePrice: null,
      stock: 11,
      finish: 'natural-oak',
      fabric: 'charcoal-grey',
    },
  ];

  const createdVariants: any[] = [];
  for (const item of variantsData) {
    const v = await prisma.productVariant.create({
      data: {
        productId: variableArmchair.id,
        sku: item.sku,
        price: item.price,
        salePrice: item.salePrice,
        stockQuantity: item.stock,
        weight: 18.5,
        dimensions: '82x86x78 cm',
        attributeValues: {
          create: [
            { attributeValueId: valMap[item.finish] },
            { attributeValueId: valMap[item.fabric] },
          ],
        },
      },
    });
    createdVariants.push({ ...v, finish: item.finish, fabric: item.fabric });
  }

  // B. Simple Product: Solid Oak Dining Table
  const diningTable = await prisma.product.create({
    data: {
      name: 'Aalborg Solid White Oak Dining Table (8-Seater)',
      slug: 'aalborg-solid-white-oak-dining-table',
      sku: 'SW-DT-001',
      productType: ProductType.SIMPLE,
      description:
        'Crafted from selected European White Oak planks with a natural low-sheen hardwax oil finish. Seats 8-10 comfortably with chamfered edge profiling and interlocking trestle joinery.',
      shortDescription: 'Generous 8-10 person dining table handcrafted from solid European White Oak.',
      basePrice: 1250.0,
      salePrice: 1099.0,
      stockQuantity: 7,
      dimensions: '240x100x76 cm',
      weight: 72.0,
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: diningTablesCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
            altText: 'Aalborg Solid White Oak Dining Table',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  console.log('📦 Products seeded (Variable & Simple).');

  // 6. Blog Section
  const blogCategory = await prisma.blogCategory.create({
    data: {
      name: 'Woodcraft & Design Guides',
      slug: 'woodcraft-and-design-guides',
      description: 'Expert advice on woodworking, interior styling, and furniture longevity.',
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'The Art of Hardwood Joinery: Why Solid Oak & Walnut Endure for Decades',
      slug: 'the-art-of-hardwood-joinery-why-solid-oak-walnut-endure',
      excerpt:
        'Discover the difference between commercial veneer furniture and generational mortise-and-tenon craftsmanship.',
      content: `
# The Enduring Value of Hardwood Furniture

When investing in furniture for your home, understanding construction techniques transforms the way you view everyday pieces.

## 1. Kiln-Dried Hardwoods vs. Engineered Particle Boards
Kiln drying stabilizes the moisture content in natural timber to between 6% and 8%, preventing warping, bowing, or seasonal splitting when climate control conditions fluctuate in your home.

## 2. Mortise and Tenon Joinery
Traditional interlocking joinery disperses mechanical loads across interlocking wood fibers rather than relying solely on metallic fasteners or glue seams.

## 3. Natural Oil and Hardwax Finishes
Unlike polyurethane plastic coatings that flake or yellow over time, hardwax oils penetrate into the pores of oak and walnut, preserving tactile wood grains and allowing effortless spot repairs without strip-sanding the whole piece.
      `,
      featuredImage: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: blogCategory.id,
      publishedAt: new Date(),
    },
  });

  console.log('✍️ Blog posts and categories seeded.');

  // 6. Media Library Assets
  await prisma.media.createMany({
    data: [
      {
        filename: 'furniture-armchair-living-room.jpg',
        originalName: 'nordic-minimalist-armchair.jpg',
        mimeType: 'image/jpeg',
        size: 348200,
        url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
        altText: 'Nordic minimalist lounge armchair in American walnut and velvet',
        caption: 'Nordic Minimalist Living Room Setup',
        width: 1920,
        height: 1280,
      },
      {
        filename: 'furniture-dining-table-oak.jpg',
        originalName: 'copenhagen-dining-table.jpg',
        mimeType: 'image/jpeg',
        size: 512400,
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
        altText: 'Copenhagen solid white oak extending dining table',
        caption: 'Dining Room Showcase Table',
        width: 2400,
        height: 1600,
      },
      {
        filename: 'furniture-wood-joinery-detail.jpg',
        originalName: 'artisan-wood-joinery.jpg',
        mimeType: 'image/jpeg',
        size: 289100,
        url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
        altText: 'Close up mortise and tenon joinery in solid walnut wood',
        caption: 'Handcrafted Joint Detail',
        width: 1800,
        height: 1200,
      },
      {
        filename: 'furniture-interior-showcase.jpg',
        originalName: 'living-room-interior-sofa.jpg',
        mimeType: 'image/jpeg',
        size: 620500,
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        altText: 'Contemporary Scandinavian living room interior with green sofa',
        caption: 'Scandinavian Living Space',
        width: 2560,
        height: 1440,
      },
      {
        filename: 'furniture-walnut-credenza.jpg',
        originalName: 'walnut-sideboard-credenza.jpg',
        mimeType: 'image/jpeg',
        size: 441000,
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2',
        altText: 'Mid-century modern walnut credenza sideboard cabinet',
        caption: 'Storage & Credenza Detail',
        width: 2000,
        height: 1333,
      },
      {
        filename: 'furniture-fabric-swatch-linen.jpg',
        originalName: 'ivory-linen-texture.jpg',
        mimeType: 'image/jpeg',
        size: 195000,
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        altText: 'Tactile natural ivory linen upholstery swatch texture',
        caption: 'Ivory Linen Fabric Texture',
        width: 1600,
        height: 1600,
      },
    ],
  });

  console.log('🖼️ Media library assets seeded.');

  // 7. Promotional Coupons
  const couponWelcome = await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      description: '10% off your entire first handcrafted furniture order',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      minOrderAmount: 200,
      maxDiscountAmount: 150,
      usageLimit: 500,
      usageCount: 14,
      isActive: true,
    },
  });

  const couponWoodcraft = await prisma.coupon.create({
    data: {
      code: 'WOODCRAFT15',
      description: '15% seasonal discount on handcrafted living & dining furniture',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minOrderAmount: 500,
      maxDiscountAmount: 200,
      usageLimit: 100,
      usageCount: 32,
      isActive: true,
    },
  });

  const couponSolidWood = await prisma.coupon.create({
    data: {
      code: 'SOLIDWOOD50',
      description: '$50 flat discount on orders over $300',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 50,
      minOrderAmount: 300,
      usageLimit: 200,
      usageCount: 45,
      isActive: true,
    },
  });

  const couponFreeShip = await prisma.coupon.create({
    data: {
      code: 'FREESHIP',
      description: 'Free white-glove freight delivery ($75 value)',
      discountType: DiscountType.FIXED_AMOUNT,
      discountValue: 75,
      minOrderAmount: 400,
      usageLimit: 50,
      usageCount: 18,
      isActive: true,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'EXPIRED20',
      description: 'Expired summer promotion 20% off',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minOrderAmount: 100,
      endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      isActive: false,
    },
  });

  console.log('🏷️ Promotional Coupons seeded (WELCOME10, WOODCRAFT15, SOLIDWOOD50, FREESHIP, EXPIRED20).');

  // 8. Orders, Order Items, and Timelines
  const daysAgo = (days: number) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000);

  // Variant helper lookups
  const walForVariant = createdVariants.find((v) => v.sku === 'SW-ARM-WAL-FOR') || createdVariants[0];
  const oakIvoVariant = createdVariants.find((v) => v.sku === 'SW-ARM-OAK-IVO') || createdVariants[4];
  const walChaVariant = createdVariants.find((v) => v.sku === 'SW-ARM-WAL-CHA') || createdVariants[2];
  const oakForVariant = createdVariants.find((v) => v.sku === 'SW-ARM-OAK-FOR') || createdVariants[3];
  const walIvoVariant = createdVariants.find((v) => v.sku === 'SW-ARM-WAL-IVO') || createdVariants[1];

  // Order 1: DELIVERED
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1001',
      userId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'CREDIT_CARD',
      transactionId: 'ch_3N82xL2eZvKYlo2C019842',
      paidAt: daysAgo(18),
      subtotal: 2079.0,
      discountAmount: 200.0,
      shippingAmount: 75.0,
      taxAmount: 156.0,
      totalAmount: 2110.0,
      currency: 'USD',
      couponId: couponWoodcraft.id,
      couponCode: 'WOODCRAFT15',
      shippingAddress: {
        recipientName: 'Alexander Wright',
        phone: '+1 555-0245',
        street: '742 Evergreen Terrace',
        city: 'Portland',
        province: 'Oregon',
        postalCode: '97201',
        country: 'United States',
      },
      shippingMethod: 'White Glove Freight Delivery',
      shippingCarrier: 'FedEx Freight',
      trackingNumber: 'FEDEX-FRT-98214819',
      trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=98214819',
      shippedAt: daysAgo(9),
      deliveredAt: daysAgo(5),
      createdAt: daysAgo(18),
      customerNotes: 'Please place the dining table directly in the formal dining room.',
      internalNotes: 'White glove crew reported flawless installation. Customer signed delivery manifest.',
      items: {
        create: [
          {
            productId: diningTable.id,
            productName: 'Aalborg Solid White Oak Dining Table (8-Seater)',
            productSku: 'SW-DT-001',
            productImage: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
            unitPrice: 1099.0,
            quantity: 1,
            totalPrice: 1099.0,
            selectedAttributes: { Finish: 'Natural Low-Sheen Hardwax' },
          },
          {
            productId: variableArmchair.id,
            variantId: walForVariant.id,
            productName: 'Nordic Minimalist Lounge Armchair',
            productSku: walForVariant.sku,
            variantName: 'American Black Walnut / Forest Green Velvet',
            productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
            unitPrice: 490.0,
            quantity: 2,
            totalPrice: 980.0,
            selectedAttributes: { 'Wood Finish': 'American Black Walnut', 'Fabric Material': 'Forest Green Velvet' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'STRIPE',
            transactionId: 'ch_3N82xL2eZvKYlo2C019842',
            status: TransactionStatus.SUCCESS,
            amount: 2110.0,
            currency: 'USD',
            cardPan: '4242-****-****-4242',
            trackingCode: 'STRIPE-AUTH-918239',
            createdAt: daysAgo(18),
            gatewayResponse: { brand: 'visa', funding: 'credit', country: 'US', network_status: 'approved_by_network' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order created via checkout', createdAt: daysAgo(18) },
          { status: OrderStatus.PROCESSING, note: 'Payment authorized via Stripe ($2,110.00)', createdAt: daysAgo(18) },
          { status: OrderStatus.PROCESSING, note: 'Passed to master workshop for assembly & inspection', createdAt: daysAgo(14) },
          { status: OrderStatus.SHIPPED, note: 'Handed over to FedEx Freight (Tracking: FEDEX-FRT-98214819)', createdAt: daysAgo(9) },
          { status: OrderStatus.DELIVERED, note: 'Delivered and assembled at Portland residence', createdAt: daysAgo(5) },
        ],
      },
    },
  });

  // Order 2: PROCESSING
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1002',
      userId: customer2.id,
      customerName: `${customer2.firstName} ${customer2.lastName}`,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'STRIPE',
      transactionId: 'pi_3L71wM2eZvKYlo2C889104',
      paidAt: daysAgo(2),
      subtotal: 420.0,
      discountAmount: 42.0,
      shippingAmount: 35.0,
      taxAmount: 30.24,
      totalAmount: 443.24,
      currency: 'USD',
      couponId: couponWelcome.id,
      couponCode: 'WELCOME10',
      shippingAddress: {
        recipientName: 'Eleanor Vance',
        phone: '+1 555-0812',
        street: '1204 Pine Street, Apt 5B',
        city: 'Seattle',
        province: 'Washington',
        postalCode: '98101',
        country: 'United States',
      },
      shippingMethod: 'Standard Express Courier',
      shippingCarrier: 'Tipax Express Courier',
      trackingNumber: 'TPX-99823104',
      trackingUrl: 'https://tipaxco.com/tracking?id=TPX-99823104',
      createdAt: daysAgo(2),
      customerNotes: 'Elevator access available on north side of apartment building.',
      internalNotes: 'Customer requested extra beeswax protective balm applied to armrests before dispatch.',
      items: {
        create: [
          {
            productId: variableArmchair.id,
            variantId: oakIvoVariant.id,
            productName: 'Nordic Minimalist Lounge Armchair',
            productSku: oakIvoVariant.sku,
            variantName: 'Natural White Oak / Tactile Ivory Linen',
            productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
            unitPrice: 420.0,
            quantity: 1,
            totalPrice: 420.0,
            selectedAttributes: { 'Wood Finish': 'Solid White Oak', 'Fabric Material': 'Ivory Linen' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'ZARINPAL',
            transactionId: 'A000000000000000000000000002002',
            status: TransactionStatus.FAILED,
            amount: 443.24,
            currency: 'USD',
            cardPan: '6037-99**-****-8812',
            errorMessage: 'کاربر تراکنش را در درگاه شاپرک لغو کرد (User cancelled at Shaparak gateway)',
            createdAt: daysAgo(2),
            gatewayResponse: { code: -51, message: 'Session is not active, user cancelled' },
          },
          {
            gateway: 'STRIPE',
            transactionId: 'pi_3L71wM2eZvKYlo2C889104',
            status: TransactionStatus.SUCCESS,
            amount: 443.24,
            currency: 'USD',
            cardPan: '5022-29**-****-8104',
            trackingCode: 'STRIPE-AUTH-441920',
            createdAt: daysAgo(2),
            gatewayResponse: { brand: 'mastercard', funding: 'debit', status: 'succeeded' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order placed by customer', createdAt: daysAgo(2) },
          { status: OrderStatus.PROCESSING, note: 'Payment verified ($443.24)', createdAt: daysAgo(2) },
          { status: OrderStatus.PROCESSING, note: 'Custom upholstery staging in progress', createdAt: daysAgo(1) },
        ],
      },
    },
  });

  // Order 3: SHIPPED
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1003',
      userId: customer3.id,
      customerName: `${customer3.firstName} ${customer3.lastName}`,
      customerEmail: customer3.email,
      customerPhone: customer3.phone,
      status: OrderStatus.SHIPPED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'BANK_TRANSFER',
      transactionId: 'wire_ref_89172648',
      paidAt: daysAgo(5),
      subtotal: 1099.0,
      discountAmount: 50.0,
      shippingAmount: 75.0,
      taxAmount: 83.92,
      totalAmount: 1207.92,
      currency: 'USD',
      couponId: couponSolidWood.id,
      couponCode: 'SOLIDWOOD50',
      shippingAddress: {
        recipientName: 'Marcus Chen',
        phone: '+1 555-0934',
        street: '550 NW 13th Ave',
        city: 'Portland',
        province: 'Oregon',
        postalCode: '97209',
        country: 'United States',
      },
      shippingMethod: 'Specialized Freight Logistics',
      shippingCarrier: 'Old Dominion Freight Line',
      trackingNumber: 'ODFL-FRT-7721839',
      trackingUrl: 'https://www.odfl.com/trace/?pro=7721839',
      shippedAt: daysAgo(2),
      createdAt: daysAgo(6),
      internalNotes: 'Reinforced corner packaging applied to protect oak tabletop corners.',
      items: {
        create: [
          {
            productId: diningTable.id,
            productName: 'Aalborg Solid White Oak Dining Table (8-Seater)',
            productSku: 'SW-DT-001',
            productImage: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
            unitPrice: 1099.0,
            quantity: 1,
            totalPrice: 1099.0,
            selectedAttributes: { Finish: 'Natural Low-Sheen Hardwax' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'BANK_TRANSFER',
            transactionId: 'wire_ref_89172648',
            status: TransactionStatus.SUCCESS,
            amount: 1207.92,
            currency: 'USD',
            trackingCode: 'ACH-WIRE-89172648',
            createdAt: daysAgo(5),
            gatewayResponse: { bank: 'Chase Commercial', confirmation: 'CLEARED_FUNDS' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order placed, awaiting wire transfer', createdAt: daysAgo(6) },
          { status: OrderStatus.PROCESSING, note: 'Bank wire verified ($1,207.92)', createdAt: daysAgo(5) },
          { status: OrderStatus.PROCESSING, note: 'Crate packaged and timber sealed', createdAt: daysAgo(3) },
          { status: OrderStatus.SHIPPED, note: 'Dispatched via Old Dominion Freight Line (Pro: ODFL-FRT-7721839)', createdAt: daysAgo(2) },
        ],
      },
    },
  });

  // Order 4: PENDING
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1004',
      userId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: 'BANK_TRANSFER',
      subtotal: 990.0,
      discountAmount: 0.0,
      shippingAmount: 50.0,
      taxAmount: 79.2,
      totalAmount: 1119.2,
      currency: 'USD',
      shippingAddress: {
        recipientName: 'Alexander Wright',
        phone: '+1 555-0245',
        street: '742 Evergreen Terrace',
        city: 'Portland',
        province: 'Oregon',
        postalCode: '97201',
        country: 'United States',
      },
      shippingMethod: 'Standard Freight',
      shippingCarrier: 'Chapar Logistics',
      trackingNumber: 'CHP-4491028',
      trackingUrl: 'https://chapar.post/track?id=CHP-4491028',
      createdAt: hoursAgo(6),
      customerNotes: 'Please ring front doorbell upon delivery.',
      items: {
        create: [
          {
            productId: variableArmchair.id,
            variantId: walChaVariant.id,
            productName: 'Nordic Minimalist Lounge Armchair',
            productSku: walChaVariant.sku,
            variantName: 'American Black Walnut / Charcoal Grey',
            productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
            unitPrice: 495.0,
            quantity: 2,
            totalPrice: 990.0,
            selectedAttributes: { 'Wood Finish': 'American Black Walnut', 'Fabric Material': 'Charcoal Grey' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'BANK_TRANSFER',
            transactionId: 'wire_pending_1004',
            status: TransactionStatus.PENDING,
            amount: 1119.20,
            currency: 'USD',
            createdAt: hoursAgo(6),
            gatewayResponse: { instructions: 'Deposit reference: SW-1004' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order created, awaiting bank payment clearance', createdAt: hoursAgo(6) },
        ],
      },
    },
  });

  // Order 5: CANCELLED
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1005',
      userId: customer3.id,
      customerName: `${customer3.firstName} ${customer3.lastName}`,
      customerEmail: customer3.email,
      customerPhone: customer3.phone,
      status: OrderStatus.CANCELLED,
      paymentStatus: PaymentStatus.REFUNDED,
      paymentMethod: 'CREDIT_CARD',
      transactionId: 'ch_3K99qP2eZvKYlo2C991823',
      paidAt: daysAgo(15),
      subtotal: 480.0,
      discountAmount: 0.0,
      shippingAmount: 35.0,
      taxAmount: 38.4,
      totalAmount: 553.4,
      currency: 'USD',
      shippingAddress: {
        recipientName: 'Marcus Chen',
        phone: '+1 555-0934',
        street: '550 NW 13th Ave',
        city: 'Portland',
        province: 'Oregon',
        postalCode: '97209',
        country: 'United States',
      },
      shippingMethod: 'Standard Express Courier',
      shippingCarrier: 'Tipax Express Courier',
      trackingNumber: 'TPX-55192831',
      trackingUrl: 'https://tipaxco.com/tracking?id=TPX-55192831',
      createdAt: daysAgo(15),
      internalNotes: 'Customer requested order cancellation due to unexpected studio relocation. 100% refund processed.',
      items: {
        create: [
          {
            productId: variableArmchair.id,
            variantId: oakForVariant.id,
            productName: 'Nordic Minimalist Lounge Armchair',
            productSku: oakForVariant.sku,
            variantName: 'Natural White Oak / Forest Green Velvet',
            productImage: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
            unitPrice: 480.0,
            quantity: 1,
            totalPrice: 480.0,
            selectedAttributes: { 'Wood Finish': 'Solid White Oak', 'Fabric Material': 'Forest Green Velvet' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'STRIPE',
            transactionId: 'ch_3K99qP2eZvKYlo2C991823',
            status: TransactionStatus.SUCCESS,
            amount: 553.40,
            currency: 'USD',
            cardPan: '4111-11**-****-1111',
            trackingCode: 'STRIPE-AUTH-551982',
            createdAt: daysAgo(15),
            gatewayResponse: { brand: 'visa', status: 'succeeded' },
          },
          {
            gateway: 'STRIPE',
            transactionId: 're_3K99qP2eZvKYlo2C991823_rfnd',
            status: TransactionStatus.REFUNDED,
            amount: 553.40,
            currency: 'USD',
            trackingCode: 'RFND-STRIPE-991823',
            createdAt: daysAgo(14),
            gatewayResponse: { refund_status: 'succeeded', reason: 'requested_by_customer' },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order submitted by customer', createdAt: daysAgo(15) },
          { status: OrderStatus.PROCESSING, note: 'Payment captured via Stripe ($553.40)', createdAt: daysAgo(15) },
          { status: OrderStatus.CANCELLED, note: 'Customer requested cancellation prior to packing', createdAt: daysAgo(14) },
          { status: OrderStatus.REFUNDED, note: 'Full refund ($553.40) refunded to credit card', createdAt: daysAgo(14) },
        ],
      },
    },
  });

  // Order 6: DELIVERED
  await prisma.order.create({
    data: {
      orderNumber: 'SW-1006',
      userId: customer2.id,
      customerName: `${customer2.firstName} ${customer2.lastName}`,
      customerEmail: customer2.email,
      customerPhone: customer2.phone,
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'ZARINPAL',
      transactionId: 'A000000000000000000000000001006',
      paidAt: daysAgo(25),
      subtotal: 990.0,
      discountAmount: 148.5,
      shippingAmount: 50.0,
      taxAmount: 71.32,
      totalAmount: 962.82,
      currency: 'USD',
      couponId: couponWoodcraft.id,
      couponCode: 'WOODCRAFT15',
      shippingAddress: {
        recipientName: 'Eleanor Vance',
        phone: '+1 555-0812',
        street: '1204 Pine Street, Apt 5B',
        city: 'Seattle',
        province: 'Washington',
        postalCode: '98101',
        country: 'United States',
      },
      shippingMethod: 'Freight Logistics',
      shippingCarrier: 'UPS Freight',
      trackingNumber: 'UPS-FRT-9182319',
      trackingUrl: 'https://www.ups.com/track?tracknum=9182319',
      shippedAt: daysAgo(20),
      deliveredAt: daysAgo(16),
      createdAt: daysAgo(25),
      items: {
        create: [
          {
            productId: variableArmchair.id,
            variantId: walIvoVariant.id,
            productName: 'Nordic Minimalist Lounge Armchair',
            productSku: walIvoVariant.sku,
            variantName: 'American Black Walnut / Tactile Ivory Linen',
            productImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
            unitPrice: 495.0,
            quantity: 2,
            totalPrice: 990.0,
            selectedAttributes: { 'Wood Finish': 'American Black Walnut', 'Fabric Material': 'Ivory Linen' },
          },
        ],
      },
      transactions: {
        create: [
          {
            gateway: 'ZARINPAL',
            transactionId: 'A000000000000000000000000001006',
            status: TransactionStatus.SUCCESS,
            amount: 962.82,
            currency: 'USD',
            cardPan: '6037-99**-****-9102',
            trackingCode: 'ZP-RRN-992148201',
            createdAt: daysAgo(25),
            gatewayResponse: {
              code: 100,
              message: 'عملیات پرداخت با موفقیت انجام شد (Payment verified successfully)',
              card_hash: '1E8276D38F7A8...',
              card_pan: '603799******9102',
              ref_id: 992148201,
              fee_type: 'Merchant',
              fee: 1000,
            },
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'Order placed by customer', createdAt: daysAgo(25) },
          { status: OrderStatus.PROCESSING, note: 'Payment processed ($962.82)', createdAt: daysAgo(25) },
          { status: OrderStatus.SHIPPED, note: 'Shipped via UPS Freight', createdAt: daysAgo(20) },
          { status: OrderStatus.DELIVERED, note: 'Signed & accepted at Seattle delivery address', createdAt: daysAgo(16) },
        ],
      },
    },
  });

  console.log('🛍️ Orders seeded: SW-1001 (DELIVERED), SW-1002 (PROCESSING), SW-1003 (SHIPPED), SW-1004 (PENDING), SW-1005 (CANCELLED), SW-1006 (DELIVERED).');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
