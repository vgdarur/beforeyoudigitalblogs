const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // Find matching deals
    const recentDeals = await prisma.deal.findMany({
        where: { createdAt: { gte: halfHourAgo } },
        select: { id: true, title: true }
    });
    
    const dealIds = recentDeals.map(d => d.id);
    console.log(`Found ${dealIds.length} deals inserted in the last 30 minutes to rollback.`);
    
    if (dealIds.length > 0) {
        // Delete related clicks first
        await prisma.click.deleteMany({
            where: { dealId: { in: dealIds } }
        });
        
        // Delete the deals
        const deleteResult = await prisma.deal.deleteMany({
            where: { id: { in: dealIds } }
        });
        console.log(`Successfully deleted ${deleteResult.count} Euro deals.`);
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
