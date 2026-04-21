const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentDeals = await prisma.deal.findMany({
        where: { createdAt: { gte: oneHourAgo } },
        select: { id: true }
    });
    
    const dealIds = recentDeals.map(d => d.id);
    console.log(`Found ${dealIds.length} deals inserted in the last hour to rollback.`);
    
    if (dealIds.length > 0) {
        // Delete related clicks first to satisfy foreign key constraints
        await prisma.click.deleteMany({
            where: { dealId: { in: dealIds } }
        });
        
        const deleteResult = await prisma.deal.deleteMany({
            where: { id: { in: dealIds } }
        });
        console.log(`Successfully deleted ${deleteResult.count} deals.`);
    }

    const deleteMerchants = await prisma.merchant.deleteMany({
        where: { createdAt: { gte: oneHourAgo } }
    });
    console.log(`Successfully deleted ${deleteMerchants.count} new merchants.`);
}

main().finally(() => prisma.$disconnect());
