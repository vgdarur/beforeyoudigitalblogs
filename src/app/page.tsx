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
    merchant: { name: string; logoUrl: string | null };
};

// Next.js static fetching config
export const revalidate = 3600; // revalidate every 1 hour minimum for public pages

async function getFeaturedDeals() {
    try {
        const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                priorityScore: { gt: 50 },
                OR: [
                    { expirationDate: null },
                    { expirationDate: { gt: new Date() } }
                ]
            },
            include: {
                merchant: true,
                network: true,
                category: true,
            },
            orderBy: {
                priorityScore: 'desc',
            },
            take: 8,
        });

        return deals as unknown as DealWithRelations[];
    } catch (err) {
        console.error("Failed fetching deals from DB", err);
        return [];
    }
}

export default async function Home() {
    const deals = await getFeaturedDeals();

    return (
        <>
            <section className={styles.hero}>
                <div className={`container ${styles.heroContainer}`}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>Exclusive Curated Offers</span>
                        <h1 className={styles.heroTitle}>
                            Don't Overpay.<br />
                            <span className={styles.textGradient}>Save Today.</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            We aggregate the web's best discounts and secret coupon codes across hundreds of top merchants. Fresh deals updated hourly.
                        </p>
                        <div className={styles.heroActions}>
                            <a href="/deals" className={styles.btnPrimary}>Browse All Deals</a>
                            <a href="/deals?category=tech" className={styles.btnSecondary}>Shop Tech</a>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        {/* Minimal CSS Illustration instead of an image to keep it lightweight */}
                        <div className={styles.heroMockup}>
                            <div className={styles.mockupHeader}>
                                <div className={styles.mockupDot}></div>
                                <div className={styles.mockupDot}></div>
                                <div className={styles.mockupDot}></div>
                            </div>
                            <div className={styles.mockupBody}>
                                <div className={styles.mockupCard}></div>
                                <div className={styles.mockupCard}></div>
                                <div className={styles.mockupCard}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.featuredSection}>
                <div className="container">
                    <div className={styles.sectionHeader}>
                        <h2 className="section-title">Today's Top Deals</h2>
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
                            <p>No featured deals available right now. Check back later!</p>
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.newsletterSection}>
                <div className={`container ${styles.nlContainer}`}>
                    <div className={styles.nlContent}>
                        <h2>Never Miss a Deal Again</h2>
                        <p>Join 50,000+ smart shoppers who get our top 5 hand-picked deals delivered to their inbox every morning.</p>
                    </div>
                    <form className={styles.nlForm}>
                        <input type="email" placeholder="Enter your email address" required className={styles.nlInput} />
                        <button type="submit" className={styles.nlBtn}>Subscribe</button>
                    </form>
                </div>
            </section>
        </>
    );
}
