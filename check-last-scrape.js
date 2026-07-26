const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Find the latest deals
    const latestDeals = await prisma.deal.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        take: 10,
        include: {
            merchant: true
        }
    });

    if (latestDeals.length > 0) {
        console.log("SUCCESS");
        console.log(`Found ${latestDeals.length} recent deals:`);
        for (const d of latestDeals) {
            console.log(`- [${d.createdAt.toISOString()}] [${d.merchant?.name}] (Score: ${d.priorityScore}) ${d.title}`);
        }
    } else {
        console.log("No deals found in the database.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
