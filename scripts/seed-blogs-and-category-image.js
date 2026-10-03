const { PrismaClient, PostStatus } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('--- 1. Updating Category Images & Text ---');

  // Update bedroom category with the newly generated image
  const bedroom = await prisma.category.findUnique({ where: { slug: 'bedroom' } });
  if (bedroom) {
    const updatedBedroom = await prisma.category.update({
      where: { slug: 'bedroom' },
      data: {
        name: 'Bedroom Sanctuary',
        description: 'Handcrafted solid wood platform beds, nightstands, and dressers.',
        image: 'http://localhost:4000/uploads/bedroom-sanctuary.webp',
      },
    });
    console.log('Updated bedroom category with generated image:', updatedBedroom);
  } else {
    const createdBedroom = await prisma.category.create({
      data: {
        name: 'Bedroom Sanctuary',
        slug: 'bedroom',
        description: 'Handcrafted solid wood platform beds, nightstands, and dressers.',
        image: 'http://localhost:4000/uploads/bedroom-sanctuary.webp',
        displayOrder: 3,
      },
    });
    console.log('Created bedroom category with generated image:', createdBedroom);
  }

  // Ensure living-room and dining-room have clean descriptions and images
  const living = await prisma.category.findUnique({ where: { slug: 'living-room' } });
  if (living && !living.image) {
    await prisma.category.update({
      where: { slug: 'living-room' },
      data: {
        image: 'http://localhost:4000/uploads/hero-living-zen.webp',
      },
    });
  }

  const dining = await prisma.category.findUnique({ where: { slug: 'dining-room' } });
  if (dining && !dining.image) {
    await prisma.category.update({
      where: { slug: 'dining-room' },
      data: {
        image: 'http://localhost:4000/uploads/aalborg-dining-table.webp',
      },
    });
  }

  console.log('--- 2. Ensuring Author & Blog Categories ---');
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'studio@store.local',
        passwordHash: 'dummy',
        firstName: 'Studio',
        lastName: 'Admin',
        role: 'ADMIN',
        isActive: true,
      },
    });
  }

  // Blog categories
  let blogCatCraft = await prisma.blogCategory.findFirst({ where: { slug: 'timber-craft' } });
  if (!blogCatCraft) {
    blogCatCraft = await prisma.blogCategory.create({
      data: {
        name: 'Timber & Craft',
        slug: 'timber-craft',
        description: 'Traditional joinery, material selection, and workshop practices.',
      },
    });
  }

  let blogCatCare = await prisma.blogCategory.findFirst({ where: { slug: 'timber-care' } });
  if (!blogCatCare) {
    blogCatCare = await prisma.blogCategory.create({
      data: {
        name: 'Care & Preservation',
        slug: 'timber-care',
        description: 'Guides on preserving raw oil and beeswax finishes across generations.',
      },
    });
  }

  let blogCatDesign = await prisma.blogCategory.findFirst({ where: { slug: 'design-philosophy' } });
  if (!blogCatDesign) {
    blogCatDesign = await prisma.blogCategory.create({
      data: {
        name: 'Design Philosophy',
        slug: 'design-philosophy',
        description: 'Japandi architectural proportions, wabi-sabi aesthetics, and quiet living.',
      },
    });
  }

  console.log('--- 3. Seeding 2 Additional Blog Posts ---');

  // Post 2: Care & Maintenance
  const post2Slug = 'living-with-natural-timber-caring-for-oil-finishes';
  const existingPost2 = await prisma.blogPost.findUnique({ where: { slug: post2Slug } });
  if (!existingPost2) {
    const post2 = await prisma.blogPost.create({
      data: {
        title: 'Living with Natural Timber: Caring for Plant-Oil & Beeswax Finishes',
        slug: post2Slug,
        excerpt:
          'Simple, organic practices to preserve the warm tactile luster and breathability of raw solid wood surfaces in everyday home life.',
        content: `
# Living with Natural Timber: Caring for Plant-Oil & Beeswax Finishes

Solid wood is a living, breathing material. Unlike factory polyurethane varnishes that seal timber under an artificial plastic film, artisan pieces are hand-buffed with pure cold-pressed natural linseed oils and organic beeswax.

## 1. Daily Tactile Care
For everyday dust and spills, a soft, dry or slightly damp organic cotton cloth is all you need. Wipe along the grain lines to honor the wood fiber structure. Never use chemical aerosol polishes or synthetic detergents containing silicone or ammonia.

## 2. Maintaining Ambient Equilibrium
Hardwood naturally expands in high humidity and contracts in arid winter environments. Keeping your indoor relative humidity between 40% and 55% helps maintain pristine mortise-and-tenon joint tension.

## 3. The Annual Oil Ritual
Once a year, warm a dime-sized amount of natural timber balm in your hands and massage it into the tabletop or armrest. Within fifteen minutes, buff away any excess with a clean lint-free cloth to restore that unmistakable silky glow.
        `.trim(),
        featuredImage: 'http://localhost:4000/uploads/material-craft-wood.webp',
        status: PostStatus.PUBLISHED,
        authorId: user.id,
        categoryId: blogCatCare.id,
        publishedAt: new Date(Date.now() - 86400000 * 3),
      },
    });
    console.log('Created Blog Post 2:', post2.title);
  } else {
    console.log('Blog Post 2 already exists.');
  }

  // Post 3: Japandi Design Philosophy
  const post3Slug = 'japandi-proportions-finding-calm-in-restrained-furniture-forms';
  const existingPost3 = await prisma.blogPost.findUnique({ where: { slug: post3Slug } });
  if (!existingPost3) {
    const post3 = await prisma.blogPost.create({
      data: {
        title: 'Japandi Proportions: Finding Calm in Restrained Furniture Forms',
        slug: post3Slug,
        excerpt:
          'How the quiet balance between Japanese mortise-and-tenon joinery and Scandinavian modernism guides our handcrafted designs.',
        content: `
# Japandi Proportions: Finding Calm in Restrained Furniture Forms

At the intersection of Japanese minimalism and Scandinavian hygge lies an aesthetic devotion to restraint, honest materials, and serene architectural proportions.

## Form Follows Quiet
Our designs prioritize low-profile horizontal planes. By lowering the center of gravity in our platform beds, credenzas, and tea tables, we leave vertical air space open to natural daylight.

## The Honesty of the Joint
Rather than concealing connections behind metal fasteners, exposed joinery becomes the quiet ornamentation of the piece. When you glance at the corner of a handcrafted credenza, the interlocking finger joints tell the story of the artisan hands that cut them.

## Heirloom Longevity
Furniture shouldn't be replaced every few years. When built with solid walnut and white oak, every scuff and patina change becomes a recorded memory in the timber's grain.
        `.trim(),
        featuredImage: 'http://localhost:4000/uploads/showcase-lounge-duo.webp',
        status: PostStatus.PUBLISHED,
        authorId: user.id,
        categoryId: blogCatDesign.id,
        publishedAt: new Date(Date.now() - 86400000 * 7),
      },
    });
    console.log('Created Blog Post 3:', post3.title);
  } else {
    console.log('Blog Post 3 already exists.');
  }

  console.log('--- All Done! ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
