import DealCard from '@/components/ui/DealCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

// Type matching what the Prisma query returns
type DealWithRelations = {
    id: string;
    slug: string;
    title: string;
    description: string;
    imageUrl: string | null;
    price: number | null;
    originalPrice: number | null;
    discountRatio: number | null;
    couponCode: string | null;
    affiliateUrl: string;
    merchant: { name: string; slug: string; logoUrl: string | null };
};

export const revalidate = 3600;

async function getFeaturedDeals() {
    try {
        const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                imageUrl: { contains: 'http' },
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
            take: 24,
        });

        return deals as unknown as DealWithRelations[];
    } catch (err) {
        console.error("Failed fetching deals", err);
        return [];
    }
}
export default async function Home() {
    const deals = await getFeaturedDeals();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header Padding */}
            <div style={{ paddingTop: '2rem' }}></div>

            <section className={styles.featuredSection}>
                <div className="container">
                    <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                        <h2 className="section-title">Today's Deals</h2>
                        <a href="/deals" className={styles.viewAllBtn}>View All →</a>
                    </div>

                    {deals.length > 0 ? (
                        <div className={styles.dealGrid}>
                            {deals.map(deal => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No active deals available right now. Check back later!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
