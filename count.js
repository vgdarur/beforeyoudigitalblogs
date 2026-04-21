const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const merchants = await prisma.merchant.count();
    const deals = await prisma.deal.count();
    console.log(`Current DB Stats: ${merchants} Merchants, ${deals} Deals.`);
}
main().finally(() => prisma.$disconnect());
