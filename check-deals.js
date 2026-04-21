const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // The user's timezone is EDT (-04:00), so the target day is April 17th, 2026.
    // Local April 17th EDT:
    // Start: 2026-04-17T00:00:00-04:00 -> 2026-04-17T04:00:00.000Z
    // End: 2026-04-18T00:00:00-04:00 -> 2026-04-18T04:00:00.000Z
    
    const startDate = new Date('2026-04-17T00:00:00-04:00');
    const endDate = new Date('2026-04-18T00:00:00-04:00');

    const result = await prisma.deal.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lt: endDate
            }
        },
        include: {
            merchant: true
        }
    });

    console.log(`Found ${result.length} deals created on April 17th, 2026.`);
    
    if (result.length > 0) {
        console.log("Sample Deals:");
        for (let i = 0; i < Math.min(5, result.length); i++) {
            console.log(`- [${result[i].merchant.name}] ${result[i].title.slice(0, 50)}...`);
        }
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
