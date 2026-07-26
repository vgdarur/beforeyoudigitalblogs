const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deals = await prisma.deal.findMany({
    where: { title: { contains: 'Insta360' } },
    include: { category: true }
  });
  console.log(deals.map(d => d.category?.name));
}
main().finally(() => prisma.$disconnect());
