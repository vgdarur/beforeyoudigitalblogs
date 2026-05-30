import DealCard from '@/components/ui/DealCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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
    priorityScore: number | null;
    category?: { name: string; slug: string; } | null;
    merchant?: { name: string; slug: string; logoUrl: string | null } | null;
};

export const dynamic = 'force-dynamic';

async function getDeals() {
    try {
        const manualDeals = await prisma.deal.findMany({
            where: {
                isActive: true,
                priorityScore: { not: 1 },
                NOT: { category: { name: { contains: 'Smartphone', mode: 'insensitive' } } }
            },
            include: { merchant: true, network: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        return {
            manualDeals: manualDeals as unknown as DealWithRelations[]
        };
    } catch (err) {
        console.error("Failed fetching deals", err);
        return { manualDeals: [] };
    }
}

export default async function Home() {
    const { manualDeals } = await getDeals();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header Padding */}
            <div style={{ paddingTop: '2rem' }}></div>

            {/* Premium Call to Action Banner / Ribbon for AI Suggested Deals */}
            <div className="container" style={{ margin: '1.5rem auto' }}>
                <Link href="/trending" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                        color: 'white',
                        padding: '1.25rem 2rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.3)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    className="hover-scale"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>🤖</span>
                            <div style={{ textAlign: 'left' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
                                    AI Mode is Active: Today's Top Google Searches
                                </h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                                    Discover 15 hot, trending deals automatically scraped across major US retailers right now!
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                            View AI Deals
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14"></path>
                                <path d="m12 5 7 7-7 7"></path>
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>

            {manualDeals.length > 0 && (
                <section className={styles.featuredSection} style={{ padding: '2rem 0' }}>
                    <div className="container">
                        <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                            <h2 className="section-title">Today's Deals</h2>
                            <a href="/deals" className={styles.viewAllBtn}>View All →</a>
                        </div>

                        <div className={styles.dealGrid}>
                            {manualDeals.map(deal => (
                                <DealCard key={deal.id} deal={deal as any} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
