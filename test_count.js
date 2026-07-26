const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const aiCount = await prisma.deal.count({ where: { priorityScore: 1 } });
    const manualCount = await prisma.deal.count({ where: { priorityScore: { not: 1 } } });
    const totalCount = await prisma.deal.count();
    
    console.log("Total Deals:", totalCount);
    console.log("AI Deals:", aiCount);
    console.log("Manual Deals:", manualCount);
    
    const top30 = await prisma.deal.findMany({
            where: {
                isActive: true,
                NOT: { category: { name: { contains: 'Smartphone', mode: 'insensitive' } } }
            },
            include: { merchant: true, network: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 30
    });
    
    console.log("Top 30 returned:", top30.length);
    console.log("Manual Deals in Top 30:", top30.filter(d => d.priorityScore !== 1).length);
    console.log("AI Deals in Top 30:", top30.filter(d => d.priorityScore === 1).length);
}
main().finally(() => prisma.$disconnect());
