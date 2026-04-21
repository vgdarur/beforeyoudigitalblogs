import CouponCard from '@/components/ui/CouponCard';
import { prisma } from '@/lib/prisma';
import styles from '../deals/page.module.css'; // Reuse container layout from Deals page

export const revalidate = 3600;

export const metadata = {
    title: 'Coupon Codes & Promos | Dealsagent',
    description: 'Find the latest and greatest verified coupon codes and promo codes from top brands.',
};

async function getCoupons() {
    try {
        const coupons = await prisma.deal.findMany({
            where: {
                isActive: true,
                couponCode: {
                    not: null, // Basic Prisma check for not null
                }
            },
            include: {
                merchant: true,
                network: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        // Prisma sometimes allows empty strings even if it's not null.
        // We will formally filter them out in JS to ensure strict text coupons.
        return coupons.filter(c => c.couponCode && c.couponCode.trim() !== '');
    } catch (err) {
        console.error("Failed fetching coupons", err);
        return [];
    }
}

export default async function CouponsPage() {
    const coupons = await getCoupons();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', background: '#f8fafc' }}>
            {/* Header Padding */}
            <div style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem', background: '#ffffff', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                <div className="container">
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                        Verified Promo Codes
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1.125rem' }}>
                        Copy active codes instantly and save big on your favorite brands.
                    </p>
                </div>
            </div>

            <section>
                <div className="container">
                    {coupons.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                            {coupons.map(coupon => (
                                <CouponCard 
                                    key={coupon.id} 
                                    deal={{
                                        title: coupon.title,
                                        description: coupon.description,
                                        couponCode: coupon.couponCode,
                                        affiliateUrl: coupon.affiliateUrl,
                                        merchant: {
                                            name: coupon.merchant.name,
                                            logoUrl: coupon.merchant.logoUrl
                                        }
                                    }} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎟️</div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a' }}>No promo codes available</h3>
                            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Check back later for new exclusive discount codes.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
