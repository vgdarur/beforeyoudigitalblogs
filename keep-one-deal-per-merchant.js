const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Fetching all merchants...");
    const merchants = await prisma.merchant.findMany({
        include: {
            deals: {
                select: { id: true },
                orderBy: { priorityScore: 'desc' }
            }
        }
    });

    let dealsToDelete = [];

    for (const merchant of merchants) {
        if (merchant.deals.length > 1) {
            // Keep the first one, delete the rest
            const toDelete = merchant.deals.slice(1).map(d => d.id);
            dealsToDelete.push(...toDelete);
        }
    }

    console.log(`Found ${dealsToDelete.length} deals to delete.`);

    if (dealsToDelete.length > 0) {
        // Delete in batches to avoid query size limits if there are many deals
        const batchSize = 1000;
        for (let i = 0; i < dealsToDelete.length; i += batchSize) {
            const batch = dealsToDelete.slice(i, i + batchSize);
            
            console.log(`Deleting clicks for batch ${i / batchSize + 1}...`);
            const clickRes = await prisma.click.deleteMany({
                where: { dealId: { in: batch } }
            });
            console.log(`Deleted ${clickRes.count} clicks.`);

            console.log(`Deleting deals for batch ${i / batchSize + 1}...`);
            const dealRes = await prisma.deal.deleteMany({
                where: { id: { in: batch } }
            });
            console.log(`Deleted ${dealRes.count} deals.`);
        }
    } else {
        console.log("No deals to delete.");
    }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
