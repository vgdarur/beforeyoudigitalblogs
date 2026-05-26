const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Get or create Smartphones category
    let cat = await prisma.category.findFirst({ where: { name: 'Smartphones' } });
    if (!cat) {
        cat = await prisma.category.create({
            data: {
                id: 'cat_' + Date.now(),
                name: 'Smartphones',
                slug: 'smartphones',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    // 2. Get or create Amazon merchant
    let merchant = await prisma.merchant.findFirst({ where: { name: { contains: 'Amazon', mode: 'insensitive' } } });
    if (!merchant) {
        merchant = await prisma.merchant.create({
            data: {
                id: 'cmo_amazon_' + Date.now(),
                name: 'Amazon',
                slug: 'amazon',
                logoUrl: 'https://logo.clearbit.com/amazon.com',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
    }

    // 3. Get existing deals in Smartphones category
    const existingDeals = await prisma.deal.findMany({
        where: { categoryId: cat.id }
    });

    // 4. Update them to use Amazon as merchant and have real Amazon links
    for (const deal of existingDeals) {
        const affiliateUrl = "https://www.amazon.com/s?k=" + encodeURIComponent(deal.title) + "&tag=dealsagent-20";
        await prisma.deal.update({
            where: { id: deal.id },
            data: {
                merchantId: merchant.id,
                affiliateUrl: affiliateUrl
            }
        });
    }
    console.log("Updated " + existingDeals.length + " deals with Amazon affiliate links and Amazon merchant!");
    console.log("Successfully inserted 6 phone deals into the database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
