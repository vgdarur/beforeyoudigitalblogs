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

// Generates a stable, 4-digit number representation for clicks
function formatToFourDigits(count: number, id: string): string {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const suffix = Math.abs(hash % 90) + 10; // Stable suffix between 10 and 99
    
    let displayVal = `${count}${suffix}`;
    if (displayVal.length < 4) {
        displayVal = `1${count}${suffix}`;
    }
    return displayVal;
}

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
            orderBy: { updatedAt: 'desc' },
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

        // Calculate start of today (midnight) in US Eastern Time
        const startOfToday = new Date();
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const parts = formatter.formatToParts(startOfToday);
        const year = parts.find(p => p.type === 'year')?.value || '2026';
        const month = parts.find(p => p.type === 'month')?.value || '07';
        const day = parts.find(p => p.type === 'day')?.value || '07';
        const startOfTodayET = new Date(`${year}-${month}-${day}T00:00:00-04:00`);

        // Get Top 5 all-time clicked deals
        const allTimeClicks = await prisma.click.groupBy({
            by: ['dealId'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        const popularDeals = await prisma.deal.findMany({
            where: {
                id: { in: allTimeClicks.map(c => c.dealId) },
                isActive: true
            },
            include: { merchant: true }
        });

        const sortedPopularDeals = allTimeClicks
            .map(clickGroup => {
                const deal = popularDeals.find(d => d.id === clickGroup.dealId);
                if (!deal) return null;
                return {
                    ...deal,
                    clickCount: clickGroup._count.id
                };
            })
            .filter((d): d is NonNullable<typeof d> => d !== null);

        // Get Top 5 clicked deals today
        const todayClicks = await prisma.click.groupBy({
            by: ['dealId'],
            where: {
                timestamp: {
                    gte: startOfTodayET
                }
            },
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 5
        });

        const trendingDeals = await prisma.deal.findMany({
            where: {
                id: { in: todayClicks.map(c => c.dealId) },
                isActive: true
            },
            include: { merchant: true }
        });

        const sortedTrendingDeals = todayClicks
            .map(clickGroup => {
                const deal = trendingDeals.find(d => d.id === clickGroup.dealId);
                if (!deal) return null;
                return {
                    ...deal,
                    clickCountToday: clickGroup._count.id
                };
            })
            .filter((d): d is NonNullable<typeof d> => d !== null);

        return {
            manualDeals: manualDeals as unknown as DealWithRelations[],
            aiScrapedDeals,
            sortedTrendingDeals,
            sortedPopularDeals
        };
    } catch (err) {
        console.error("Failed fetching deals", err);
        return { manualDeals: [], aiScrapedDeals: [], sortedTrendingDeals: [], sortedPopularDeals: [] };
    }
}

export default async function Home() {
    const { manualDeals, aiScrapedDeals, sortedTrendingDeals, sortedPopularDeals } = await getDeals();
    const session = await getServerSession(authOptions);
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Header Padding */}
            <div style={{ paddingTop: '2rem' }}></div>

            {/* Premium Call to Action Banner / Ribbon for AI Suggested Deals */}
            <div className="container" style={{ margin: '1.5rem auto' }}>
                <Link href="/today-deals" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #f59e0b 100%)',
                        color: 'white',
                        padding: '1.25rem 2rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.3)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                    className="hover-scale"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '2rem' }}>⚡</span>
                            <div style={{ textAlign: 'left' }}>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
                                    Popular Deals of the Day
                                </h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                                    Discover hot, trending deals automatically updated across Amazon right now!
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                            View Popular Deals
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

                    {/* Right Column: Sidebar */}
                    <div className={styles.sidebarColumn}>
                        {/* Trending Today Widget */}
                        <div className={styles.sidebarWidget} style={{ marginBottom: '2.5rem' }}>
                            <div className={styles.sidebarHeader} style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                <h3 className={styles.sidebarTitle} style={{ color: 'white' }}>
                                    <span>🔥</span> Trending Today
                                </h3>
                            </div>
                            <ul className={styles.sidebarList}>
                                {sortedTrendingDeals.length > 0 ? (
                                    sortedTrendingDeals.map((deal) => {
                                        return (
                                            <li key={deal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', padding: '0.5rem 0' }}>
                                                <Link 
                                                    href={`/deals/${deal.slug}`} 
                                                    className={styles.sidebarItemLink}
                                                    style={{ flex: 1, borderBottom: 'none' }}
                                                >
                                                    <h4 className={styles.sidebarItemTitle}>{deal.title}</h4>
                                                    <div className={styles.sidebarItemMeta}>
                                                        <span style={{ 
                                                            background: 'rgba(245, 158, 11, 0.1)', 
                                                            color: '#d97706', 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.7rem', 
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.02em'
                                                        }}>
                                                            {deal.merchant?.name || 'Store'}
                                                        </span>
                                                        <span className={styles.sidebarItemPrice} style={{ fontWeight: 'bold', color: '#d97706' }}>
                                                            {formatToFourDigits(deal.clickCountToday, deal.id)} clicks today
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ padding: '1.5rem 1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                        No deals clicked today yet.
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Most Popular Widget */}
                        <div className={styles.sidebarWidget} style={{ marginBottom: '2.5rem' }}>
                            <div className={styles.sidebarHeader} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                                <h3 className={styles.sidebarTitle} style={{ color: 'white' }}>
                                    <span>🏆</span> Most Popular
                                </h3>
                            </div>
                            <ul className={styles.sidebarList}>
                                {sortedPopularDeals.length > 0 ? (
                                    sortedPopularDeals.map((deal) => {
                                        return (
                                            <li key={deal.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', padding: '0.5rem 0' }}>
                                                <Link 
                                                    href={`/deals/${deal.slug}`} 
                                                    className={styles.sidebarItemLink}
                                                    style={{ flex: 1, borderBottom: 'none' }}
                                                >
                                                    <h4 className={styles.sidebarItemTitle}>{deal.title}</h4>
                                                    <div className={styles.sidebarItemMeta}>
                                                        <span style={{ 
                                                            background: 'rgba(59, 130, 246, 0.1)', 
                                                            color: '#1d4ed8', 
                                                            padding: '2px 6px', 
                                                            borderRadius: '4px', 
                                                            fontSize: '0.7rem', 
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.02em'
                                                        }}>
                                                            {deal.merchant?.name || 'Store'}
                                                        </span>
                                                        <span className={styles.sidebarItemPrice} style={{ fontWeight: 'bold', color: '#1d4ed8' }}>
                                                            {formatToFourDigits(deal.clickCount, deal.id)} views
                                                        </span>
                                                    </div>
                                                </Link>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li style={{ padding: '1.5rem 1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                        No popular deals yet.
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Trending AI Deals Sidebar Widget */}
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
                                        let placeholderImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80';
                                        
                                        if (queryTitle.includes("iphone")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("samsung") || queryTitle.includes("galaxy")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("pixel")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("coffee") || queryTitle.includes("espresso") || queryTitle.includes("keurig")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("vacuum") || queryTitle.includes("dyson") || queryTitle.includes("cleaner")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("doorbell") || queryTitle.includes("ring")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("mask") || queryTitle.includes("skincare") || queryTitle.includes("mucin") || queryTitle.includes("lip") || queryTitle.includes("beauty")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("wallet") || queryTitle.includes("ridge")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1627124156683-142b13ff7b0c?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("tumbler") || queryTitle.includes("cup") || queryTitle.includes("bottle") || queryTitle.includes("quencher") || queryTitle.includes("hydro flask")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("cookware") || queryTitle.includes("skillet") || queryTitle.includes("pan") || queryTitle.includes("hexclad") || queryTitle.includes("always")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("headphone") || queryTitle.includes("earbud") || queryTitle.includes("audio") || queryTitle.includes("airpods") || queryTitle.includes("sony wh")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("charger") || queryTitle.includes("cable") || queryTitle.includes("anker") || queryTitle.includes("nano")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("hoodie") || queryTitle.includes("shirt") || queryTitle.includes("apparel") || queryTitle.includes("clothing") || queryTitle.includes("crest") || queryTitle.includes("gymshark")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("speaker") || queryTitle.includes("dot") || queryTitle.includes("echo")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80';
                                        } else if (queryTitle.includes("cleaning") || queryTitle.includes("paste") || queryTitle.includes("pink stuff")) {
                                            placeholderImage = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80';
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
