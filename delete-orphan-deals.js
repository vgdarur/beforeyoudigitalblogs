const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const startDate = new Date('2026-04-17T00:00:00-04:00');
    const endDate = new Date('2026-04-18T00:00:00-04:00');

    // Find all deals created on April 17th to get their IDs
    const dealsToDelete = await prisma.deal.findMany({
        where: {
            createdAt: { gte: startDate, lt: endDate }
        },
        select: { id: true }
    });

    const dealIds = dealsToDelete.map(d => d.id);
    
    if (dealIds.length > 0) {
        // Delete related clicks first for safety against foreign keys
        await prisma.click.deleteMany({
            where: { dealId: { in: dealIds } }
        });
        
        // Delete the deals
        const deleteCount = await prisma.deal.deleteMany({
            where: { id: { in: dealIds } }
        });
        
        console.log(`Successfully deleted ${deleteCount.count} orphaned deals from April 17th (Day before yesterday).`);
    } else {
        console.log("No deals found to delete on April 17th.");
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
