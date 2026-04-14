import RestaurantCard from '@/components/ui/RestaurantCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 3600;

async function getPopularMerchants() {
    try {
        const merchants = await prisma.merchant.findMany({
            include: {
                _count: {
                    select: { deals: true }
                }
            },
            orderBy: {
                deals: {
                    _count: 'desc'
                }
            }
        });
        return merchants;
    } catch (err) {
        console.error("Failed fetching merchants", err);
        return [];
    }
}

export default async function MerchantsPage() {
    const merchants = await getPopularMerchants();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', paddingTop: '2rem' }}>
            <div className="container">
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--foreground)' }}>Popular Merchants</h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Browse all stores offering sweet deals.</p>
                </div>

                {merchants.length > 0 ? (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                        gap: '1.5rem',
                        marginBottom: '4rem'
                    }}>
                        {merchants.map(merchant => (
                            <RestaurantCard key={merchant.id} merchant={merchant} />
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>No merchants found in the database.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
