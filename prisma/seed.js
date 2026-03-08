const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seeding...');

  try {
    // Networks
    const cj = await prisma.network.upsert({
      where: { slug: 'cj' },
      update: {},
      create: { name: 'CJ Affiliate', slug: 'cj' },
    });
    
    const amazon = await prisma.network.upsert({
      where: { slug: 'amazon' },
      update: {},
      create: { name: 'Amazon Associates', slug: 'amazon' },
    });

    // Categories
    const tech = await prisma.category.upsert({
      where: { slug: 'tech' },
      update: {},
      create: { name: 'Technology & Electronics', slug: 'tech' },
    });
    
    const fashion = await prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: { name: 'Apparel & Fashion', slug: 'fashion' },
    });

    // Merchants
    const bestbuy = await prisma.merchant.upsert({
      where: { slug: 'bestbuy' },
      update: {},
      create: { 
        name: 'Best Buy', 
        slug: 'bestbuy',
        logoUrl: 'https://via.placeholder.com/150?text=Best+Buy'
      },
    });

    const nike = await prisma.merchant.upsert({
      where: { slug: 'nike' },
      update: {},
      create: { 
        name: 'Nike', 
        slug: 'nike',
        logoUrl: 'https://via.placeholder.com/150?text=Nike'
      },
    });

    // Deals
    const deal1 = await prisma.deal.upsert({
      where: { slug: 'sony-headphones-sale' },
      update: {},
      create: {
        title: 'Sony WH-1000XM5 Wireless Headphones',
        slug: 'sony-headphones-sale',
        description: 'Industry leading noise canceling headphones at an unbeatable price.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Sony+Headphones',
        price: 348.00,
        originalPrice: 398.00,
        discountRatio: 0.12,
        affiliateUrl: 'https://cj.com/track?id=sample1',
        isActive: true,
        isFeatured: true,
        priorityScore: 10,
        merchantId: bestbuy.id,
        networkId: cj.id,
        categoryId: tech.id,
        expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      }
    });

    const deal2 = await prisma.deal.upsert({
      where: { slug: 'nike-air-max' },
      update: {},
      create: {
        title: 'Nike Air Max 270',
        slug: 'nike-air-max',
        description: 'Classic comfort gets a modern update. Extra 20% off with code.',
        imageUrl: 'https://via.placeholder.com/400x300?text=Nike+Air+Max',
        price: 120.00,
        originalPrice: 160.00,
        discountRatio: 0.25,
        couponCode: 'SAVE20',
        affiliateUrl: 'https://amazon.com/track?id=sample2',
        isActive: true,
        isFeatured: true,
        priorityScore: 8,
        merchantId: nike.id,
        networkId: amazon.id,
        categoryId: fashion.id,
        expirationDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days
      }
    });

    // Admin User
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        password: 'password123', // Note: In production, hash this!
        name: 'System Admin',
        role: 'SUPERADMIN'
      }
    });

    console.log('Seeding completed successfully!');
    console.log(`Created ${[cj, amazon].length} networks`);
    console.log(`Created ${[tech, fashion].length} categories`);
    console.log(`Created ${[bestbuy, nike].length} merchants`);
    console.log(`Created ${[deal1, deal2].length} deals`);

  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
