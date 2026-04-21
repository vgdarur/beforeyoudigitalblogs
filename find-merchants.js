const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const merchants = await prisma.merchant.findMany({ select: { name: true } });
    console.log(merchants.map(m => m.name).join(', '));
}
main().catch(console.error).finally(() => prisma.$disconnect());
