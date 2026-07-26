const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                NOT: {
                    category: {
                        name: {
                            contains: 'Smartphone',
                            mode: 'insensitive'
                        }
                    }
                }
            },
            include: {
                merchant: true,
                network: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 30, // Fetch more to split into manual and AI
        });
  console.log("Total returned:", deals.length);
  console.log("Manual Deals:", deals.filter(d => d.priorityScore !== 1).length);
  console.log("AI Deals:", deals.filter(d => d.priorityScore === 1).length);
  deals.filter(d => d.priorityScore !== 1).forEach(d => console.log(d.title, d.priorityScore));
}
main().finally(() => prisma.$disconnect());
