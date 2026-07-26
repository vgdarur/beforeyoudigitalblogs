const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== DB CHECK ===");
  const merchants = await prisma.merchant.findMany();
  console.log("Merchants count:", merchants.length);
  merchants.forEach(m => console.log(`  - ${m.name} (slug: ${m.slug})`));

  const categories = await prisma.category.findMany();
  console.log("Categories count:", categories.length);
  categories.forEach(c => console.log(`  - ${c.name} (slug: ${c.slug})`));

  const deals = await prisma.deal.findMany({
    include: { merchant: true, category: true }
  });
  console.log("Deals count:", deals.length);
  deals.forEach(d => {
    console.log(`  - [${d.isActive ? 'ACTIVE' : 'INACTIVE'}] ${d.title} (slug: ${d.slug})`);
    console.log(`    Price: $${d.price}, Merchant: ${d.merchant.name}, Category: ${d.category.name}, Priority: ${d.priorityScore}`);
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
