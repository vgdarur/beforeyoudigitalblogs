import Image from 'next/image';
import Link from 'next/link';
import styles from './DealCard.module.css';

interface DealCardProps {
    deal: {
        slug: string;
        title: string;
        description: string;
        imageUrl: string | null;
        price: number | null;
        originalPrice: number | null;
        discountRatio: number | null;
        couponCode: string | null;
        merchant: {
            name: string;
            slug: string;
            logoUrl: string | null;
        };
    };
}

export default function DealCard({ deal }: DealCardProps) {
    const discountPercent = deal.discountRatio
        ? Math.round(deal.discountRatio * 100)
        : null;

    return (
        <div className={styles.card}>
            <Link href={`/deals/${deal.slug}`} className={styles.imageContainer}>
                {discountPercent && (
                    <div className={styles.badge}>
                        {discountPercent}% OFF
                    </div>
                )}
                <div className={styles.imagePlaceholder}>
                    {deal.imageUrl ? (
                        <img
                            src={deal.imageUrl}
                            alt={deal.title}
                            className={styles.image}
                            loading="lazy"
                        />
                    ) : (
                        <div className={styles.gradientFallback}>
                            <span className={styles.gradientText}>
                                {discountPercent ? `${discountPercent}% OFF` : 'EXCLUSIVE OFFER'}
                            </span>
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                <Link href={`/restaurants/${deal.merchant.slug}`} className={styles.merchantInfo} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                    {deal.merchant.logoUrl ? (
                        <img
                            src={deal.merchant.logoUrl}
                            alt={deal.merchant.name}
                            className={styles.merchantLogo}
                        />
                    ) : (
                        <span className={styles.merchantNameStore}>{deal.merchant.name}</span>
                    )}
                </Link>

                <Link href={`/deals/${deal.slug}`}>
                    <h3 className={styles.title}>{deal.title}</h3>
                </Link>

                <div className={styles.pricing}>
                    {deal.price ? (
                        <span className={styles.currentPrice}>${deal.price.toFixed(2)}</span>
                    ) : null}
                    {deal.originalPrice ? (
                        <span className={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</span>
                    ) : null}
                </div>

                {deal.couponCode && (
                    <div className={styles.coupon}>
                        <span className={styles.couponLabel}>Code:</span>
                        <span className={styles.couponCode}>{deal.couponCode}</span>
                    </div>
                )}

                <div className={styles.actions}>
                    <Link href={`/api/go/${deal.slug}`} className={styles.goBtn} target="_blank" rel="noopener noreferrer">
                        Get Deal
                        <svg xmlns="http://www.w3.org/Form/1999/xlink" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
