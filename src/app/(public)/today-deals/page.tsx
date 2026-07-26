import { getAmazonGoldboxDeals, ScrapedProduct } from '@/lib/amazon-scraper';
import styles from './page.module.css';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function getFilteredDeals(allDeals: ScrapedProduct[], searchParams: { [key: string]: string | string[] | undefined }) {
    const category = searchParams.category as string || '';
    const priceRange = searchParams.priceRange as string || '';
    const minDiscount = searchParams.minDiscount as string || '';

    let filteredDeals = allDeals;

    if (category) {
        filteredDeals = filteredDeals.filter(d => d.categoryName === category);
    }

    if (minDiscount) {
        const minRatio = parseFloat(minDiscount) / 100;
        filteredDeals = filteredDeals.filter(d => {
            const ratio = (d.originalPrice - d.price) / d.originalPrice;
            return ratio >= minRatio;
        });
    }

    if (priceRange) {
        filteredDeals = filteredDeals.filter(d => {
            if (priceRange === 'under-25') return d.price <= 25;
            if (priceRange === '25-50') return d.price >= 25 && d.price <= 50;
            if (priceRange === '50-100') return d.price >= 50 && d.price <= 100;
            if (priceRange === '100-plus') return d.price >= 100;
            return true;
        });
    }

    return filteredDeals;
}

// Simple helper to generate a stable pseudo-random percentage claimed based on ASIN / ID hash
function getClaimedPercent(asin: string): number {
    let hash = 0;
    for (let i = 0; i < asin.length; i++) {
        hash = asin.charCodeAt(i) + ((hash << 5) - hash);
    }
    const percent = Math.abs(hash % 65) + 25; // Random value between 25% and 90%
    return percent;
}

export default async function TodayDealsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const allDeals = await getAmazonGoldboxDeals();
    const deals = getFilteredDeals(allDeals, sp);

    // Extract unique categories from JSON deals
    const uniqueCategoryNames = Array.from(new Set(allDeals.map(d => d.categoryName)));
    const categories = uniqueCategoryNames.map(name => ({
        id: name,
        name: name
    }));

    return (
        <div className={`container ${styles.dealsContainer}`}>
            {/* Amazon Goldbox style Banner */}
            <div className={styles.goldboxBanner}>
                <div className={styles.bannerContent}>
                    <span className={styles.goldboxBadge}>SPECIAL EVENT</span>
                    <h1 className={styles.bannerTitle}>Today's Deals</h1>
                    <p className={styles.bannerSubtitle}>
                        Your daily destination for top-selling Amazon deals, lightning offers, and limited-time savings. Updates hourly!
                    </p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* Left Sidebar Filters */}
                <aside className={styles.sidebar}>
                    {/* Department Filter */}
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Departments</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, category: '' }).toString()}`}
                                    className={!sp.category ? styles.activeFilter : ''}
                                >
                                    All Departments
                                </Link>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <Link 
                                        href={`/today-deals?${new URLSearchParams({ ...sp, category: cat.id }).toString()}`}
                                        className={sp.category === cat.id ? styles.activeFilter : ''}
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price Filter */}
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Price</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, priceRange: '' }).toString()}`}
                                    className={!sp.priceRange ? styles.activeFilter : ''}
                                >
                                    Any Price
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, priceRange: 'under-25' }).toString()}`}
                                    className={sp.priceRange === 'under-25' ? styles.activeFilter : ''}
                                >
                                    Under $25
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, priceRange: '25-50' }).toString()}`}
                                    className={sp.priceRange === '25-50' ? styles.activeFilter : ''}
                                >
                                    $25 to $50
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, priceRange: '50-100' }).toString()}`}
                                    className={sp.priceRange === '50-100' ? styles.activeFilter : ''}
                                >
                                    $50 to $100
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, priceRange: '100-plus' }).toString()}`}
                                    className={sp.priceRange === '100-plus' ? styles.activeFilter : ''}
                                >
                                    $100 & Over
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Discount Filter */}
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Discount</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, minDiscount: '' }).toString()}`}
                                    className={!sp.minDiscount ? styles.activeFilter : ''}
                                >
                                    All Discounts
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, minDiscount: '20' }).toString()}`}
                                    className={sp.minDiscount === '20' ? styles.activeFilter : ''}
                                >
                                    20% Off or More
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, minDiscount: '30' }).toString()}`}
                                    className={sp.minDiscount === '30' ? styles.activeFilter : ''}
                                >
                                    30% Off or More
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    href={`/today-deals?${new URLSearchParams({ ...sp, minDiscount: '50' }).toString()}`}
                                    className={sp.minDiscount === '50' ? styles.activeFilter : ''}
                                >
                                    50% Off or More
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <Link href="/today-deals" className={styles.clearFiltersBtn}>Clear All Filters</Link>
                </aside>

                {/* Main Deals Grid */}
                <main className={styles.mainContent}>
                    {deals.length > 0 ? (
                        <div className={styles.goldboxGrid}>
                            {deals.map((deal) => {
                                const discountPercent = deal.originalPrice && deal.price
                                    ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100) 
                                    : 0;
                                const claimed = getClaimedPercent(deal.asin);
                                const isLightning = claimed > 45; // Simulate lightning deals status

                                return (
                                    <div key={deal.asin} className={styles.dealCard}>
                                        <Link 
                                            href={`/today-deals/${deal.asin}`} 
                                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}
                                        >
                                            <div className={styles.imageContainer}>
                                                <img src={deal.imageUrl} alt={deal.title} className={styles.dealImage} />
                                                {discountPercent > 0 && (
                                                    <span className={styles.discountBadge}>
                                                        {discountPercent}% OFF
                                                    </span>
                                                )}
                                            </div>

                                            <div className={styles.cardBody}>
                                                <span className={isLightning ? styles.lightningBadge : styles.dealOfDayBadge}>
                                                    {isLightning ? '⚡ LIGHTNING DEAL' : '🏷️ DEAL OF THE DAY'}
                                                </span>

                                                <h3 className={styles.dealTitle} title={deal.title}>
                                                    {deal.title}
                                                </h3>

                                                <div className={styles.pricing}>
                                                    <span className={styles.currentPrice}>
                                                        ${deal.price.toFixed(2)}
                                                    </span>
                                                    {deal.originalPrice && deal.originalPrice > deal.price && (
                                                        <span className={styles.originalPrice}>
                                                            List: ${deal.originalPrice.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                {isLightning && (
                                                    <div className={styles.progressContainer}>
                                                        <div className={styles.progressBar}>
                                                            <div className={styles.progressFill} style={{ width: `${claimed}%` }}></div>
                                                        </div>
                                                        <div className={styles.progressLabel}>
                                                            {claimed}% claimed
                                                        </div>
                                                    </div>
                                                )}

                                                <span className={styles.shopBtn} style={{ marginTop: 'auto' }}>
                                                    View Deal
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No Amazon Deals Found</h3>
                            <p>No automated Amazon deals match your selected filters. Try broadening your criteria or trigger a manual scrape.</p>
                            <Link href="/today-deals" className={styles.resetBtn}>Reset Filters</Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
