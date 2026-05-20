import DealCard from '@/components/ui/DealCard';
import styles from '../page.module.css';
import { prisma } from '@/lib/prisma';

export const revalidate = 0; // Dynamic rendering

async function getSmartphoneDeals() {
    try {
        const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                category: {
                    name: {
                        contains: 'Smartphone',
                        mode: 'insensitive'
                    }
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
            take: 20,
        });

        return deals as any[];
    } catch (err) {
        console.error("Failed fetching smartphone deals", err);
        return [];
    }
}

export default async function SmartphonesPage() {
    const deals = await getSmartphoneDeals();

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: '#f8fafc' }}>
            <div style={{ paddingTop: '2rem' }}></div>
            
            <div className="container">
                <section className={styles.featuredSection} style={{ padding: 0 }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                        <h1 className="section-title">Latest Smartphone Deals</h1>
                        <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Top daily deals for iPhone, Samsung, Pixel, OnePlus, Motorola, and LG.</p>
                    </div>

                    {deals.length > 0 ? (
                        <div className={styles.dealGrid}>
                            {deals.map(deal => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No active smartphone deals available right now. Check back later!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
