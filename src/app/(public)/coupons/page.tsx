import { prisma } from '@/lib/prisma';
import Link from 'next/link';

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
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 100,
        });

        // Strict filter
        return coupons.filter(c => c.couponCode && c.couponCode.trim() !== '');
    } catch (err) {
        console.error("Failed fetching coupons", err);
        return [];
    }
}

export default async function CouponsPage() {
    const coupons = await getCoupons();

    return (
        <div style={{ minHeight: '100vh', padding: '2rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                    Verified Promo Codes
                </h1>
                
                {coupons.length > 0 ? (
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {coupons.map(coupon => (
                            <li key={coupon.id} style={{ fontSize: '1.125rem', color: '#334155' }}>
                                <Link 
                                    href={`/api/go/${coupon.merchant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}
                                >
                                    {coupon.title} ({coupon.merchant.name})
                                </Link>
                                {' '} - [Use Code: <strong style={{color: '#0f172a'}}>{coupon.couponCode}</strong>]
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#64748b' }}>No promo codes available right now.</p>
                )}
            </div>
        </div>
    );
}
