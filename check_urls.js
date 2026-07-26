const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const deals = await prisma.deal.findMany({ where: { priorityScore: 1 }, take: 10, select: { title: true, affiliateUrl: true } });
  console.log(deals);
}
main().catch(console.error).finally(() => prisma.$disconnect());
