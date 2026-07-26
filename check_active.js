const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deals = await prisma.deal.findMany({
    where: { title: { contains: 'Insta360' } }
  });
  console.log(deals.map(d => ({ title: d.title, isActive: d.isActive })));
}
main().finally(() => prisma.$disconnect());
