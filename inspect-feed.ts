import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const record = await prisma.newsAlert.findUnique({
        where: { id: 'amazon-goldbox-feed' }
    });
    if (!record || !record.aiReport) {
        console.log('Feed is empty or missing!');
        return;
    }
    const products = JSON.parse(record.aiReport);
    console.log('Total products in database feed:', products.length);
    console.log('ASINs present:');
    products.forEach((p: any, idx: number) => {
        console.log(`${idx + 1}. ASIN: ${p.asin} | Title: ${p.title.slice(0, 40)}`);
    });
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
