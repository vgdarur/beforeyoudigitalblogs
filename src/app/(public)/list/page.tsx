import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function DealsListPage() {
    // Fetch latest active deals
    const deals = await prisma.deal.findMany({
        where: {
            isActive: true,
            OR: [
                { expirationDate: null },
                { expirationDate: { gt: new Date() } }
            ]
        },
        include: {
            merchant: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 500 // Limit to avoid massive pages, could add pagination later
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>All Deals (List View)</h1>
                <p className={styles.subtitle}>A compact view of all active offers.</p>
            </div>

            <div className={styles.listWrapper}>
                {deals.map(deal => (
                    <Link href={`/deals/${deal.slug}`} key={deal.id} className={styles.dealRow}>
                        <div className={styles.dealInfo}>
                            <span className={styles.merchantBadge}>
                                {deal.merchant?.name || 'Store'}
                            </span>
                            <h3 className={styles.dealTitle}>
                                {deal.title}
                            </h3>
                        </div>
                        <div className={styles.dealPricing}>
                            {deal.price !== null ? (
                                <span className={styles.price}>${deal.price.toFixed(2)}</span>
                            ) : (
                                <span className={styles.price} style={{ color: '#4b5563' }}>See Price</span>
                            )}
                            {deal.originalPrice !== null && deal.originalPrice > (deal.price || 0) && (
                                <span className={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</span>
                            )}
                        </div>
                    </Link>
                ))}

                {deals.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
                        No active deals found.
                    </div>
                )}
            </div>
        </div>
    );
}
