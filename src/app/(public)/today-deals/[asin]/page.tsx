import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAmazonGoldboxDeals } from '@/lib/amazon-scraper';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import styles from './page.module.css';
import ImportDealButton from './ImportDealButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ asin: string }> }) {
    const { asin } = await params;
    const allDeals = await getAmazonGoldboxDeals();
    const deal = allDeals.find(d => d.asin.toUpperCase() === asin.toUpperCase());

    if (!deal) return { title: 'Deal Not Found' };

    return {
        title: `${deal.title} | Today's Amazon Deals`,
        description: deal.description.slice(0, 160) + '...',
        openGraph: {
            images: deal.imageUrl ? [deal.imageUrl] : [],
        }
    };
}

export default async function TodayDealDetailPage({ params }: { params: Promise<{ asin: string }> }) {
    const { asin } = await params;
    const allDeals = await getAmazonGoldboxDeals();
    const deal = allDeals.find(d => d.asin.toUpperCase() === asin.toUpperCase());

    if (!deal) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    const discountPercent = deal.originalPrice && deal.price
        ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
        : null;

    // Fetch up to 4 other trending deals in the same category
    const similarDeals = allDeals
        .filter(d => d.categoryName === deal.categoryName && d.asin !== deal.asin)
        .slice(0, 4);

    return (
        <div className={`container ${styles.detailContainer}`}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span className={styles.separator}>/</span>
                <Link href="/today-deals">Today's Deals</Link>
                <span className={styles.separator}>/</span>
                <span className={styles.currentCrumb}>{deal.title.slice(0, 50)}...</span>
            </nav>

            <div className={styles.mainSection}>
                {/* Image Section */}
                <div className={styles.imageSection}>
                    <div className={styles.imageWrapper}>
                        {discountPercent && (
                            <div className={styles.badge}>{discountPercent}% OFF</div>
                        )}
                        {deal.imageUrl ? (
                            <img
                                src={deal.imageUrl}
                                alt={deal.title}
                                className={styles.mainImage}
                            />
                        ) : (
                            <div className={styles.noImage}>No Image Available</div>
                        )}
                    </div>
                </div>

                {/* Deal Info Section */}
                <div className={styles.infoSection}>
                    <div className={styles.merchantHeader}>
                        <span className={styles.merchantText}>Amazon / {deal.brand}</span>
                    </div>

                    <h1 className={styles.title}>{deal.title}</h1>

                    <div className={styles.pricingRow}>
                        <span className={styles.currentPrice}>${deal.price.toFixed(2)}</span>
                        {deal.originalPrice && deal.originalPrice > deal.price && (
                            <span className={styles.originalPrice}>List: ${deal.originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    {isAdmin && <ImportDealButton asin={deal.asin} />}

                    <div className={styles.actionBox}>
                        <a href={deal.detailUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                            Buy Deal at Amazon
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </a>
                        <p className={styles.disclosureText}>
                            When you buy through links on our site, we may earn an affiliate commission.
                        </p>
                    </div>

                    <div className={styles.descriptionBox}>
                        <h3>About This Deal</h3>
                        <p className={styles.description}>{deal.description}</p>
                        
                        <ul className={styles.metaList}>
                            <li>
                                <strong>Category:</strong> {deal.categoryName}
                            </li>
                            <li>
                                <strong>ASIN:</strong> {deal.asin}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Similar Deals Section */}
            {similarDeals.length > 0 && (
                <div className={styles.similarSection}>
                    <h2 className={styles.similarTitle}>More Deals in {deal.categoryName}</h2>
                    <div className={styles.dealGrid}>
                        {similarDeals.map(similarDeal => {
                            const simDiscount = similarDeal.originalPrice && similarDeal.originalPrice > similarDeal.price
                                ? Math.round(((similarDeal.originalPrice - similarDeal.price) / similarDeal.originalPrice) * 100)
                                : 0;
                            return (
                                <div key={similarDeal.asin} className={styles.similarCard}>
                                    <Link href={`/today-deals/${similarDeal.asin}`} className={styles.similarCardLink}>
                                        <div className={styles.similarImageContainer}>
                                            <img src={similarDeal.imageUrl} alt={similarDeal.title} className={styles.similarImage} />
                                            {simDiscount > 0 && (
                                                <span className={styles.similarBadge}>{simDiscount}% OFF</span>
                                            )}
                                        </div>
                                        <div className={styles.similarCardBody}>
                                            <h4 className={styles.similarCardTitle}>{similarDeal.title}</h4>
                                            <div className={styles.similarPricing}>
                                                <span className={styles.similarCurrentPrice}>${similarDeal.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
