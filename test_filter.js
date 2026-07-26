const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
        const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                NOT: { category: { name: { contains: 'Smartphone', mode: 'insensitive' } } }
            },
            include: { merchant: true, network: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 30
        });
        const manualDeals = deals.filter(d => d.priorityScore !== 1).slice(0, 5);
        console.log("MANUAL DEALS:", manualDeals.map(d => d.title));
}
main().finally(() => prisma.$disconnect());
