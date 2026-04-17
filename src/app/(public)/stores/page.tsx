import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import styles from './Stores.module.css';

// Revalidate this page once a day (SSG)
export const revalidate = 86400;

export default async function StoresPage() {
    const merchants = await prisma.merchant.findMany({
        where: {
            affiliateUrl: { not: null }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Partner Brands & Stores</h1>
                <p className={styles.subtitle}>Shop directly with our approved partners to unlock exclusive deals.</p>
            </div>

            {merchants.length === 0 ? (
                <div className={styles.empty}>
                    <p>New partner stores arriving soon.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {merchants.map((merchant) => (
                        <div key={merchant.id} className={styles.card}>
                            <div className={styles.logoWrapper}>
                                {merchant.logoUrl ? (
                                    <img 
                                        src={merchant.logoUrl} 
                                        alt={merchant.name}
                                        className={styles.logo}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className={styles.nameFallback}>
                                        {merchant.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className={styles.info}>
                                <h2>{merchant.name}</h2>
                            </div>
                            <Link href={`/api/go-store/${merchant.slug}`} target="_blank" rel="noopener noreferrer" className={styles.actionBtn}>
                                Shop Now
                                <svg xmlns="http://www.w3.org/Form/1999/xlink" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                </svg>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
