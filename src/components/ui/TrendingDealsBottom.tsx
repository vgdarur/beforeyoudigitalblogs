import { prisma } from '@/lib/prisma';
import DealCard from '@/components/ui/DealCard';
import styles from '@/app/page.module.css';

async function getTrendingDeals() {
    try {
        const startOfToday = new Date();
        startOfToday.setUTCHours(4, 0, 0, 0); // 12 AM EST is 4 AM UTC

        const todayClicks = await prisma.click.groupBy({
            by: ['dealId'],
            where: {
                timestamp: {
                    gte: startOfToday
                }
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10
        });

        const dealIds = todayClicks.map(c => c.dealId);

        if (dealIds.length === 0) return [];

        const deals = await prisma.deal.findMany({
            where: {
                id: { in: dealIds },
                isActive: true,
                priorityScore: { not: 1 }
            },
            include: {
                merchant: true,
                network: true,
                category: true
            }
        });

        return todayClicks
            .map(c => deals.find(d => d.id === c.dealId))
            .filter((d): d is NonNullable<typeof d> => !!d)
            .slice(0, 4);
    } catch (e) {
        console.error("Failed fetching trending deals", e);
        return [];
    }
}

export default async function TrendingDealsBottom() {
    const trendingDeals = await getTrendingDeals();

    if (trendingDeals.length === 0) {
        return null;
    }

    return (
        <div style={{ marginTop: '4rem', borderTop: '1px solid var(--border)', paddingTop: '4rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>🔥 Trending Deals Today</h2>
            <div className={styles.dealGrid}>
                {trendingDeals.map(deal => (
                    <DealCard key={deal.id} deal={deal as any} />
                ))}
            </div>
        </div>
    );
}
