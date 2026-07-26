const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const clicks = await prisma.click.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10,
        include: { 
            deal: {
                select: { title: true, affiliateUrl: true }
            }
        }
    });
    console.log("Recent Clicks Registered in Database:");
    if (clicks.length === 0) {
        console.log("No clicks registered yet.");
    } else {
        clicks.forEach((c, i) => {
            console.log(`${i+1}. [${c.timestamp.toISOString()}] Deal: "${c.deal?.title || 'Unknown'}"`);
            console.log(`   Device: ${c.device} | Referrer: ${c.referrer}`);
            console.log(`   Target URL: ${c.deal?.affiliateUrl || 'None'}`);
        });
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
