const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deals = await prisma.deal.findMany({
        include: { merchant: true }
    });

    const foreignCurrencyRegex = /[£€¥₹]/;
    const nonUsKeywords = [' FR', ' UK', ' India', ' Nederland', ' België', ' AU', ' DE'];
    
    let dealIdsToDelete = [];

    for (const d of deals) {
        let isNonUs = false;
        
        if (foreignCurrencyRegex.test(d.title) || foreignCurrencyRegex.test(d.description)) {
            isNonUs = true;
        }

        for (const kw of nonUsKeywords) {
            if (d.merchant.name.includes(kw) || d.title.includes(kw)) {
                isNonUs = true;
            }
        }

        if (isNonUs) {
            dealIdsToDelete.push(d.id);
        }
    }

    console.log(`Found ${dealIdsToDelete.length} Non-USA Deals. Removing them now...`);
    
    if (dealIdsToDelete.length > 0) {
        const deletedClicks = await prisma.click.deleteMany({
            where: { dealId: { in: dealIdsToDelete } }
        });
        const result = await prisma.deal.deleteMany({
            where: { id: { in: dealIdsToDelete } }
        });
        console.log(`Successfully wiped ${result.count} foreign deals from the platform!`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
