import DealCard from '@/components/ui/DealCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
                NOT: [
                    { category: { name: { contains: 'Smartphone', mode: 'insensitive' } } },
                    { merchant: { slug: { in: ['shopify', 'tiktok-shop', 'best-buy', 'target', 'walmart', 'home-depot'] } } }
                ]
            },
            include: { merchant: true, network: true, category: true },
            orderBy: { createdAt: 'desc' },
            take: 30,
        });

        let aiScrapedDeals: DealWithRelations[] = [];
        try {
            const res = await fetch('https://api.aidealsofamerica.com/api/news/active', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                const activeReport = data && data.length > 0 ? data[0] : null;
                if (activeReport && activeReport.aiReport) {
                    const parsed = JSON.parse(activeReport.aiReport);
                    const deals = parsed.deals || [];
                    aiScrapedDeals = deals.map((d: any, index: number) => {
                        let rawPrice = null;
                        if (d.exact_price) {
                            const cleanedPrice = d.exact_price.replace(/[^0-9.]/g, '');
                            if (cleanedPrice) {
                                rawPrice = parseFloat(cleanedPrice);
                            }
                        }
                        return {
                            id: `ai-deal-${index}`,
                            slug: d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                            title: d.title,
                            description: d.reason || d.description || '',
                            imageUrl: null,
                            price: rawPrice,
                            originalPrice: null,
                            discountRatio: null,
                            couponCode: null,
                            affiliateUrl: d.url,
                            priorityScore: 1,
                            merchant: {
                                name: d.merchant || d.trend_source || 'Retailer',
                                slug: (d.merchant || d.trend_source || 'retailer').toLowerCase().replace(/[^a-z0-9]+/g, '-')
                            }
                        };
                    });
                }
            }
        } catch (e) {
            console.error("Failed to fetch or parse active AI news deals on home page:", e);
        }

        return {
            manualDeals: manualDeals as unknown as DealWithRelations[],
            aiScrapedDeals
        };
    } catch (err) {
        console.error("Failed fetching deals", err);
        return { manualDeals: [], aiScrapedDeals: [] };
    }
}

export default async function Home() {
    const { manualDeals, aiScrapedDeals } = await getDeals();
    const session = await getServerSession(authOptions);
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header Padding */}
            <div style={{ paddingTop: '2rem' }}></div>

            {/* Premium Call to Action Banner / Ribbon for AI Suggested Deals */}
            <div className="container" style={{ margin: '1.5rem auto' }}>
                <Link href="/trending" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
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
                                    AI Mode is Active: Today's Top Searches
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

            <div className="container">
                <div className={styles.homeLayout}>
                    {/* Left Column: Manual Deals */}
                    <div className={styles.mainContentColumn}>
                        {manualDeals.length > 0 ? (
                            <section style={{ padding: '0 0 2rem' }}>
                                <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                                    <h2 className="section-title">Today's Deals</h2>
                                    <a href="/deals" className={styles.viewAllBtn}>View All →</a>
                                </div>

                                <div className={styles.dealGrid}>
                                    {manualDeals.map(deal => (
                                        <DealCard key={deal.id} deal={deal as any} />
                                    ))}
                                </div>
                            </section>
                        ) : (
                            <div className={styles.emptyState}>
                                <p>No active manual deals available right now. Check back later!</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Trending AI Deals Sidebar */}
                    <div className={styles.sidebarColumn}>
                        <div className={styles.sidebarWidget}>
                            <div className={styles.sidebarHeader}>
                                <h3 className={styles.sidebarTitle}>
                                    <span>🤖</span> Trending AI Deals
                                </h3>
                            </div>
                            <ul className={styles.sidebarList}>
                                {aiScrapedDeals.length > 0 ? (
                                    aiScrapedDeals.map((deal) => {
                                        const merchantName = deal.merchant?.name || 'Retailer';
                                        const merchantLower = merchantName.toLowerCase();
                                        let catBg = '#f1f5f9';
                                        let catColor = '#334155';
                                        if (merchantLower.includes('amazon')) { catBg = '#fff7ed'; catColor = '#c2410c'; }
                                        else if (merchantLower.includes('target')) { catBg = '#fdf2f8'; catColor = '#be123c'; }
                                        else if (merchantLower.includes('best buy')) { catBg = '#eff6ff'; catColor = '#1d4ed8'; }
                                        else if (merchantLower.includes('home depot')) { catBg = '#fff7ed'; catColor = '#c2410c'; }
                                        else if (merchantLower.includes('tiktok')) { catBg = '#f1f5f9'; catColor = '#0f172a'; }
                                        else if (merchantLower.includes('walmart')) { catBg = '#eff6ff'; catColor = '#1d4ed8'; }
                                        else if (merchantLower.includes('shopify')) { catBg = '#ecfdf5'; catColor = '#047857'; }
                                        else if (merchantLower.includes('slickdeals')) { catBg = '#f0fdf4'; catColor = '#16a34a'; }
                                        else if (merchantLower.includes('costco')) { catBg = '#fee2e2'; catColor = '#dc2626'; }

                                        const queryTitle = deal.title.toLowerCase();
                                        let placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Trending+Deal';
                                        if (queryTitle.includes("iphone")) {
                                            placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=iPhone+Deal';
                                        } else if (queryTitle.includes("samsung") || queryTitle.includes("galaxy")) {
                                            placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Samsung+Deal';
                                        } else if (queryTitle.includes("pixel")) {
                                            placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Google+Pixel+Deal';
                                        }

                                        return (
                                            <li key={deal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', padding: '0.25rem 0' }}>
                                                <Link 
                                                    href={deal.affiliateUrl || '#'} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className={styles.sidebarItemLink}
                                                    style={{ flex: 1, borderBottom: 'none' }}
                                                >
                                                    <h4 className={styles.sidebarItemTitle}>{deal.title}</h4>
                                                    <div className={styles.sidebarItemMeta}>
                                                        <span style={{ 
                                                            background: catBg, 
                                                            color: catColor, 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.7rem', 
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.02em'
                                                        }}>
                                                            {merchantName}
                                                        </span>
                                                        <span className={styles.sidebarItemPrice}>
                                                            {deal.price ? `$${deal.price.toFixed(2)}` : 'Special Price'}
                                                        </span>
                                                    </div>
                                                </Link>
                                                {isAdmin && (
                                                    <Link 
                                                        href={`/admin/deals/new?title=${encodeURIComponent(deal.title)}&affiliateUrl=${encodeURIComponent(`https://www.amazon.com/s?k=${encodeURIComponent(deal.title)}&tag=aidealsagent-20`)}&description=${encodeURIComponent(deal.description || '')}&price=${encodeURIComponent(deal.price || '')}&merchantName=${encodeURIComponent('Amazon')}&imageUrl=${encodeURIComponent(placeholderImage)}`}
                                                        target="_blank"
                                                        title="Import as Manual Deal"
                                                        style={{
                                                            padding: '6px 8px',
                                                            background: '#fee2e2',
                                                            border: '1px solid #fca5a5',
                                                            borderRadius: '6px',
                                                            color: '#991b1b',
                                                            textDecoration: 'none',
                                                            fontSize: '0.9rem',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            alignSelf: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'background-color 0.2s'
                                                        }}
                                                    >
                                                        📥
                                                    </Link>
                                                )}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ padding: '2rem 1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                        No trending AI deals at the moment.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
