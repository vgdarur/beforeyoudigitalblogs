const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    await prisma.$executeRawUnsafe('ALTER TABLE "dl_Merchant" ADD COLUMN "affiliateUrl" TEXT;');
    console.log("Column added successfully!");
}
main().catch(console.error).finally(() => prisma.$disconnect());
