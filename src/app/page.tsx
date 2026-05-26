import DealCard from '@/components/ui/DealCard';
import AIDealCard from '@/components/ui/AIDealCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

function parseAIReport(report: string) {
    try {
        const parsed = JSON.parse(report);
        return parsed.deals || [];
    } catch (e) {
        console.error("Failed to parse AI JSON report", e);
        return [];
    }
}

async function getAiReport() {
    try {
        const res = await fetch('https://api.aidealsofamerica.com/api/news/active', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            return data && data.length > 0 ? data[0] : null;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

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
            take: 5,
        });

        return deals as unknown as DealWithRelations[];
    } catch (err) {
        console.error("Failed fetching deals", err);
        return [];
    }
}
export default async function Home() {
    const deals = await getFeaturedDeals();
    const newsAlert = await getAiReport();

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

            <div className="container" style={{ marginTop: '3rem' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', marginBottom: '3rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '2rem', color: '#0f172a', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
                        <span style={{ fontSize: '1.75rem' }}>✨</span> AI Curated Top 15 Deals
                    </h2>
                    
                    {newsAlert?.aiReport ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {parseAIReport(newsAlert.aiReport).map((deal: any, idx: number) => (
                                <AIDealCard key={idx} deal={deal} index={idx} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#64748b' }}>No AI report generated yet. The AI scheduler runs every few hours.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
