const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deals = await prisma.deal.findMany({
        select: { id: true, title: true, description: true, affiliateUrl: true }
    });

    let nonUsDeals = [];

    const foreignCurrencyRegex = /[£€¥₹]/;
    const foreignDomainRegex = /\.(co\.uk|de|fr|it|es|nl|ca|au|in|jp)\//;

    for (const d of deals) {
        if (
            foreignCurrencyRegex.test(d.title) || 
            foreignCurrencyRegex.test(d.description) ||
            foreignDomainRegex.test(d.affiliateUrl)
        ) {
            nonUsDeals.push(d);
        }
    }

    console.log(`Found ${nonUsDeals.length} potential non-USA deals out of ${deals.length} total deals.`);
    
    if (nonUsDeals.length > 0) {
        console.log("Samples:");
        nonUsDeals.slice(0, 10).forEach(d => console.log(`- ${d.title.slice(0, 60)}`));
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
