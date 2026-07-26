const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Adding column 'country' directly to 'dl_Click' using raw SQL:");
    try {
        const resCountry = await prisma.$executeRawUnsafe(
            'ALTER TABLE "dl_Click" ADD COLUMN IF NOT EXISTS "country" VARCHAR(100);'
        );
        console.log(`country column check/add completed. Result code: ${resCountry}`);
        console.log("\nSuccess!");
    } catch (err) {
        console.error("Error executing SQL:", err);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
