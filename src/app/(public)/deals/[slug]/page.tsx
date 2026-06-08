import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import DealCard from '@/components/ui/DealCard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import AdminDealActions from '@/components/ui/AdminDealActions';

// Dynamically fetch deal by slug
function extractYouTubeId(url: string) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function getDealBySlug(slug: string) {
    const deal = await prisma.deal.findUnique({
        where: { slug },
        include: {
            merchant: true,
            network: true,
            category: true,
        }
    });

    if (!deal) return null;

    // Also fetch some similar deals in the same category
    const similarDeals = await prisma.deal.findMany({
        where: {
            categoryId: deal.categoryId,
            id: { not: deal.id }, // Don't include this same deal
            isActive: true
        },
        include: {
            merchant: true,
            network: true
        },
        take: 4,
        orderBy: { priorityScore: 'desc' }
    });

    return { deal, similarDeals };
}

// Generate SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDealBySlug(slug);

    if (!data?.deal) return { title: 'Deal Not Found' };

    return {
        title: `${data.deal.title} | ${data.deal.merchant.name} Deals via Dealsagent`,
        description: data.deal.description.slice(0, 160) + '...',
        openGraph: {
            images: data.deal.imageUrl ? [data.deal.imageUrl] : [],
        }
    };
}

export default async function DealDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const data = await getDealBySlug(slug);

    if (!data || !data.deal) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    const { deal, similarDeals } = data;
    const discountPercent = deal.discountRatio
        ? Math.round(deal.discountRatio * 100)
        : null;

    return (
        <div className={`container ${styles.detailContainer}`}>

            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span className={styles.separator}>/</span>
                <Link href="/deals">Deals</Link>
                <span className={styles.separator}>/</span>
                <Link href={`/deals?category=${deal.categoryId}`}>{deal.category.name}</Link>
                <span className={styles.separator}>/</span>
                <span className={styles.currentCrumb}>{deal.title}</span>
            </nav>

            {isAdmin && <AdminDealActions dealId={deal.id} dealSlug={deal.slug} />}

            <div className={styles.mainSection}>
                {/* Gallery / Image Area */}
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
                    
                    {deal.youtubeUrl && extractYouTubeId(deal.youtubeUrl) && (
                        <div style={{ marginTop: '1.5rem', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '8px' }}>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src={`https://www.youtube.com/embed/${extractYouTubeId(deal.youtubeUrl)}`} 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen>
                            </iframe>
                        </div>
                    )}
                </div>

                {/* Deal Info Area */}
                <div className={styles.infoSection}>
                    <Link href={`/restaurants/${deal.merchant.slug}`} className={styles.merchantHeader} style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        {deal.merchant.logoUrl ? (
                            <img src={deal.merchant.logoUrl} alt={deal.merchant.name} className={styles.merchantLogo} />
                        ) : (
                            <span className={styles.merchantText}>{deal.merchant.name}</span>
                        )}
                    </Link>

                    <h1 className={styles.title}>{deal.title}</h1>

                    <div className={styles.pricingRow}>
                        {deal.price && <span className={styles.currentPrice}>${deal.price.toFixed(2)}</span>}
                        {deal.originalPrice && <span className={styles.originalPrice}>${deal.originalPrice.toFixed(2)}</span>}
                    </div>

                    {deal.couponCode && (
                        <div className={styles.couponBox}>
                            <span className={styles.couponLabel}>Use Promo Code at Checkout:</span>
                            <div className={styles.couponCodeWrapper}>
                                <span className={styles.couponCode}>{deal.couponCode}</span>
                                {/* We could add a client-side copy button here */}
                            </div>
                        </div>
                    )}

                    <div className={styles.actionBox}>
                        <Link href={`/api/go/${deal.slug}`} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
                            Get Deal at {deal.merchant.name}
                            <svg xmlns="http://www.w3.org/Form/1999/xlink" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.btnIcon}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                        </Link>
                        <p className={styles.disclosureText}>
                            When you buy through links on our site, we may earn an affiliate commission.
                        </p>
                    </div>

                    <div className={styles.descriptionBox}>
                        <h3>About This Deal</h3>
                        <p className={styles.description}>{deal.description}</p>

                        <ul className={styles.metaList}>
                            {deal.expirationDate && (
                                <li>
                                    <strong>Expires:</strong> {new Date(deal.expirationDate).toLocaleDateString()}
                                </li>
                            )}
                            <li>
                                <strong>Category:</strong> {deal.category.name}
                            </li>
                            {deal.network && (
                                <li>
                                    <strong>Network:</strong> {deal.network.name}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Similar Deals */}
            {similarDeals.length > 0 && (
                <div className={styles.similarSection}>
                    <h2 className={styles.similarTitle}>Similar Deals You Might Like</h2>
                    <div className={styles.dealGrid}>
                        {similarDeals.map(similarDeal => (
                            <DealCard key={similarDeal.id} deal={similarDeal as any} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
