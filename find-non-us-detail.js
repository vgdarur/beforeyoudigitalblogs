const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const deals = await prisma.deal.findMany({
        select: { id: true, title: true, description: true, affiliateUrl: true }
    });

    const foreignCurrencyRegex = /[£€¥₹]/;
    
    for (const d of deals) {
        if (foreignCurrencyRegex.test(d.title) || foreignCurrencyRegex.test(d.description)) {
            console.log("Title:", d.title);
            console.log("Description:", d.description);
            console.log("URL:", d.affiliateUrl);
            console.log("---");
        }
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
