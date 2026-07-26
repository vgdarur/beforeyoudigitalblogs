const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deals = await prisma.deal.findMany({
    where: { title: { contains: 'Insta360' } },
    include: { merchant: true }
  });
  console.log(deals.map(d => d.merchant));
}
main().finally(() => prisma.$disconnect());
