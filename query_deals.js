const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const date1Start = new Date('2026-07-27T00:00:00.000Z');
  const date1End = new Date('2026-07-27T23:59:59.999Z');
  
  const date2Start = new Date('2026-08-03T00:00:00.000Z');
  const date2End = new Date('2026-08-03T23:59:59.999Z');

  const deals1 = await prisma.deal.findMany({
    where: {
      createdAt: {
        gte: date1Start,
        lte: date1End
      }
    },
    select: { title: true, slug: true, price: true }
  });

  const deals2 = await prisma.deal.findMany({
    where: {
      createdAt: {
        gte: date2Start,
        lte: date2End
      }
    },
    select: { title: true, slug: true, price: true }
  });

  console.log("=== DEALS POSTED ON 2026-07-27 ===");
  deals1.forEach(d => console.log(`- ${d.title} ($${d.price}) -> https://aidealsofamerica.com/deals/${d.slug}`));
  console.log(`\nTotal: ${deals1.length}\n`);

  console.log("=== DEALS POSTED ON 2026-08-03 ===");
  deals2.forEach(d => console.log(`- ${d.title} ($${d.price}) -> https://aidealsofamerica.com/deals/${d.slug}`));
  console.log(`\nTotal: ${deals2.length}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
