const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding of premium deals...");

  // Networks
  const amazonNetwork = await prisma.network.upsert({
    where: { slug: 'amazon' },
    update: {},
    create: { name: 'Amazon Associates', slug: 'amazon' }
  });

  const directNetwork = await prisma.network.upsert({
    where: { slug: 'direct' },
    update: {},
    create: { name: 'Direct Offer', slug: 'direct' }
  });

  // Categories
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Home & Kitchen', slug: 'home-kitchen' },
    { name: 'Apparel & Fashion', slug: 'fashion' },
    { name: 'Toys & Games', slug: 'toys-games' },
    { name: 'Beauty & Personal Care', slug: 'beauty' },
    { name: 'Sports & Outdoors', slug: 'sports' }
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug }
    });
  }

  // Merchants (Note: we avoid placing them in the excluded list)
  const merchantsData = [
    { name: 'Amazon', slug: 'amazon', logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.amazon.com/?tag=aidealsagent-20' },
    { name: 'Apple', slug: 'apple', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.apple.com/' },
    { name: 'Nike', slug: 'nike', logoUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.nike.com/' },
    { name: 'Samsung', slug: 'samsung', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.samsung.com/' },
    { name: 'Dyson', slug: 'dyson', logoUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.dyson.com/' },
    { name: 'Sony', slug: 'sony', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.sony.com/' },
    { name: 'Dell', slug: 'dell', logoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.dell.com/' },
    { name: 'Adidas', slug: 'adidas', logoUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.adidas.com/' },
    { name: 'Lego', slug: 'lego', logoUrl: 'https://images.unsplash.com/photo-1585366119957-e5733f3000cd?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.lego.com/' },
    { name: 'Nintendo', slug: 'nintendo', logoUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.nintendo.com/' },
    { name: 'Breville', slug: 'breville', logoUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=150&auto=format&fit=crop&q=80', affiliateUrl: 'https://www.breville.com/' }
  ];

  const merchants = {};
  for (const merch of merchantsData) {
    merchants[merch.slug] = await prisma.merchant.upsert({
      where: { slug: merch.slug },
      update: { name: merch.name, logoUrl: merch.logoUrl, affiliateUrl: merch.affiliateUrl },
      create: { name: merch.name, slug: merch.slug, logoUrl: merch.logoUrl, affiliateUrl: merch.affiliateUrl }
    });
  }

  // Deals
  const dealsData = [
    {
      title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      slug: 'sony-wh1000xm5-headphones-deal',
      description: 'Experience industry-leading noise cancellation with the Sony WH-1000XM5. Features 30-hour battery life, premium sound quality, and crystal-clear hands-free calling.',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      price: 328.00,
      originalPrice: 398.00,
      discountRatio: 0.17,
      affiliateUrl: 'https://www.amazon.com/dp/B09XS7JWHH?tag=aidealsagent-20',
      priorityScore: 100,
      merchantSlug: 'amazon',
      categorySlug: 'electronics'
    },
    {
      title: 'Apple MacBook Air 13-inch M3 Chip (8GB RAM, 256GB SSD)',
      slug: 'apple-macbook-air-m3-deal',
      description: 'The superlight, incredibly fast MacBook Air with the M3 chip breezes through work and play. Up to 18 hours of battery life so you can go all day.',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      price: 899.00,
      originalPrice: 1099.00,
      discountRatio: 0.18,
      affiliateUrl: 'https://www.amazon.com/dp/B0CX21C8S9?tag=aidealsagent-20',
      priorityScore: 95,
      merchantSlug: 'apple',
      categorySlug: 'electronics'
    },
    {
      title: 'Dyson V11 Extra Cordless Vacuum Cleaner',
      slug: 'dyson-v11-extra-cordless-vacuum',
      description: 'Dyson power in a lightweight, cordless format. Dynamically senses and adapts to different floor types to deep clean everywhere.',
      imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80',
      price: 449.99,
      originalPrice: 599.99,
      discountRatio: 0.25,
      affiliateUrl: 'https://www.amazon.com/dp/B08M87123A?tag=aidealsagent-20',
      priorityScore: 90,
      merchantSlug: 'dyson',
      categorySlug: 'home-kitchen'
    },
    {
      title: 'Apple iPad Air 11-inch (M2 Chip, Wi-Fi, 128GB)',
      slug: 'apple-ipad-air-m2-11inch',
      description: 'iPad Air is now available in an 11-inch design, supercharged by the incredibly fast Apple M2 chip. Features a stunning Liquid Retina display, landscape front camera, and up to 10 hours of battery.',
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
      price: 549.00,
      originalPrice: 599.00,
      discountRatio: 0.08,
      affiliateUrl: 'https://www.amazon.com/dp/B0D3J1F2R5?tag=aidealsagent-20',
      priorityScore: 85,
      merchantSlug: 'apple',
      categorySlug: 'electronics'
    },
    {
      title: 'Nintendo Switch - OLED Model w/ White Joy-Con',
      slug: 'nintendo-switch-oled-white',
      description: 'Play at home on the TV or on-the-go with a vibrant 7-inch OLED screen, a wide adjustable stand, a wired LAN port, 64 GB of internal storage, and enhanced audio.',
      imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&auto=format&fit=crop&q=80',
      price: 319.99,
      originalPrice: 349.99,
      discountRatio: 0.08,
      affiliateUrl: 'https://www.amazon.com/dp/B098RL6SBJ?tag=aidealsagent-20',
      priorityScore: 80,
      merchantSlug: 'nintendo',
      categorySlug: 'electronics'
    },
    {
      title: 'Breville the Barista Express Espresso Machine',
      slug: 'breville-barista-express-espresso',
      description: 'Create third wave specialty coffee at home from bean to espresso in less than a minute. The Barista Express allows you to grind the beans right before extraction for rich full flavor.',
      imageUrl: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
      price: 549.95,
      originalPrice: 749.95,
      discountRatio: 0.26,
      affiliateUrl: 'https://www.amazon.com/dp/B00CH9QWOU?tag=aidealsagent-20',
      priorityScore: 88,
      merchantSlug: 'breville',
      categorySlug: 'home-kitchen'
    },
    {
      title: 'Nike Pegasus 41 Running Shoes (Men/Women)',
      slug: 'nike-pegasus-41-running-shoes',
      description: 'Responsive cushioning in the Pegasus 41 provides an energized ride for everyday road running. Experience lighter weight energy return with dual ReactX foam units.',
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      price: 112.50,
      originalPrice: 140.00,
      discountRatio: 0.20,
      affiliateUrl: 'https://www.nike.com/t/pegasus-41-road-running-shoes',
      priorityScore: 78,
      merchantSlug: 'nike',
      categorySlug: 'fashion'
    },
    {
      title: 'Samsung 55-Inch Class OLED S90D Series Smart TV',
      slug: 'samsung-55-inch-oled-s90d-tv',
      description: 'Discover the OLED difference. Watch your favorite movies, games, and sports in beautiful color and deep blacks, powered by Samsung’s Quantum Processor 4K.',
      imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&auto=format&fit=crop&q=80',
      price: 1297.99,
      originalPrice: 1597.99,
      discountRatio: 0.18,
      affiliateUrl: 'https://www.amazon.com/dp/B0CXBFH8Y3?tag=aidealsagent-20',
      priorityScore: 82,
      merchantSlug: 'samsung',
      categorySlug: 'electronics'
    },
    {
      title: 'Dell XPS 13 Laptop - Intel Core Ultra 7',
      slug: 'dell-xps-13-intel-core-ultra-7',
      description: 'Dell’s thinnest and lightest 13-inch laptop is designed for a life on the go. Featuring Intel Core Ultra 7 processor and a gorgeous InfinityEdge display.',
      imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
      price: 1099.00,
      originalPrice: 1399.00,
      discountRatio: 0.21,
      affiliateUrl: 'https://www.dell.com/en-us/shop/dell-laptops/xps-13-laptop',
      priorityScore: 75,
      merchantSlug: 'dell',
      categorySlug: 'electronics'
    },
    {
      title: 'Adidas Ultraboost Light Running Shoes',
      slug: 'adidas-ultraboost-light-shoes',
      description: 'Experience epic energy with the new Adidas Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole, a new generation of Adidas BOOST.',
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
      price: 144.00,
      originalPrice: 190.00,
      discountRatio: 0.24,
      affiliateUrl: 'https://www.adidas.com/us/ultraboost-light-shoes',
      priorityScore: 73,
      merchantSlug: 'adidas',
      categorySlug: 'fashion'
    },
    {
      title: 'Lego Star Wars Millennium Falcon 75257',
      slug: 'lego-star-wars-millennium-falcon-75257',
      description: 'Inspire kids and adults with this Lego Star Wars Millennium Falcon model. This brick-built version of the iconic Corellian freighter features an array of details.',
      imageUrl: 'https://images.unsplash.com/photo-1585366119957-e5733f3000cd?w=800&auto=format&fit=crop&q=80',
      price: 135.99,
      originalPrice: 169.99,
      discountRatio: 0.20,
      affiliateUrl: 'https://www.amazon.com/dp/B07QMXR5HP?tag=aidealsagent-20',
      priorityScore: 70,
      merchantSlug: 'lego',
      categorySlug: 'toys-games'
    },
    {
      title: 'Hydro Flask Standard Mouth Water Bottle with Flex Cap (32 oz)',
      slug: 'hydro-flask-32oz-standard-mouth',
      description: 'Stay hydrated with the 32 oz Hydro Flask Standard Mouth bottle. TempShield double-wall vacuum insulation keeps drinks cold up to 24 hours or hot up to 12.',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80',
      price: 29.95,
      originalPrice: 39.95,
      discountRatio: 0.25,
      affiliateUrl: 'https://www.amazon.com/dp/B083F89KKN?tag=aidealsagent-20',
      priorityScore: 68,
      merchantSlug: 'amazon',
      categorySlug: 'sports'
    },
    {
      title: 'Theragun Prime Smart Percussive Therapy Device',
      slug: 'theragun-prime-massage-gun',
      description: 'This simplified smart percussive therapy device prioritizes the essential features you need while maintaining the power and effectiveness of Theragun.',
      imageUrl: 'https://images.unsplash.com/photo-1627998426027-2c974c5d5e51?w=800&auto=format&fit=crop&q=80',
      price: 249.00,
      originalPrice: 299.00,
      discountRatio: 0.17,
      affiliateUrl: 'https://www.amazon.com/dp/B088K4NF6H?tag=aidealsagent-20',
      priorityScore: 72,
      merchantSlug: 'amazon',
      categorySlug: 'beauty'
    },
    {
      title: 'AirPods Pro (2nd Generation) with USB-C Charging Case',
      slug: 'apple-airpods-pro-2-usbc',
      description: 'AirPods Pro features up to 2x more Active Noise Cancellation, plus Adaptive Audio and Transparency mode to hear the world around you.',
      imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
      price: 189.99,
      originalPrice: 249.00,
      discountRatio: 0.24,
      affiliateUrl: 'https://www.amazon.com/dp/B0CHWRXH8B?tag=aidealsagent-20',
      priorityScore: 92,
      merchantSlug: 'apple',
      categorySlug: 'electronics'
    }
  ];

  for (const deal of dealsData) {
    const merch = merchants[deal.merchantSlug];
    const cat = categories[deal.categorySlug];

    await prisma.deal.upsert({
      where: { slug: deal.slug },
      update: {
        title: deal.title,
        description: deal.description,
        imageUrl: deal.imageUrl,
        price: deal.price,
        originalPrice: deal.originalPrice,
        discountRatio: deal.discountRatio,
        affiliateUrl: deal.affiliateUrl,
        priorityScore: deal.priorityScore,
        merchantId: merch.id,
        categoryId: cat.id,
        networkId: deal.merchantSlug === 'amazon' ? amazonNetwork.id : directNetwork.id,
        isActive: true
      },
      create: {
        title: deal.title,
        slug: deal.slug,
        description: deal.description,
        imageUrl: deal.imageUrl,
        price: deal.price,
        originalPrice: deal.originalPrice,
        discountRatio: deal.discountRatio,
        affiliateUrl: deal.affiliateUrl,
        priorityScore: deal.priorityScore,
        merchantId: merch.id,
        categoryId: cat.id,
        networkId: deal.merchantSlug === 'amazon' ? amazonNetwork.id : directNetwork.id,
        isActive: true
      }
    });
    console.log(`Seeded: ${deal.title}`);
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch(e => console.error("Seeding failed: ", e))
  .finally(() => prisma.$disconnect());
