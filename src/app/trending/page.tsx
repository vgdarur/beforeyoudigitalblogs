import ReactMarkdown from 'react-markdown';
import DealCard from '@/components/ui/DealCard';
import styles from '../page.module.css';
import { prisma } from '@/lib/prisma';
import markdownStyles from './markdown.module.css';
import AIDealCard from '@/components/ui/AIDealCard';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

function parseAIReport(report: string) {
    try {
        const parsed = JSON.parse(report);
        return parsed.deals || [];
    } catch (e) {
        console.error("Failed to parse AI JSON report", e);
        return [];
    }
}
export const revalidate = 0; // Dynamic rendering

async function getFeaturedDeals() {
    try {
        const deals = await prisma.deal.findMany({
            where: {
                isActive: true,
                priorityScore: { not: 1 },
                imageUrl: { contains: 'http' },
                NOT: {
                    merchant: { slug: { in: ['shopify', 'tiktok-shop', 'best-buy', 'target', 'walmart', 'home-depot'] } }
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
            take: 5,
        });

        return deals as any[];
    } catch (err) {
        console.error("Failed fetching deals", err);
        return [];
    }
}

async function getAiReport() {
    try {
        const res = await fetch('https://api.aidealsofamerica.com/api/news/active', { cache: 'no-store' });
        if (res.ok) {
            const data = await res.json();
            return data && data.length > 0 ? data[0] : null;
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

export default async function TrendingPage() {
    const deals = await getFeaturedDeals();
    const newsAlert = await getAiReport();

    const session = await getServerSession(authOptions);
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    return (
        <div style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: '#f8fafc' }}>
            <div style={{ paddingTop: '2rem' }}></div>
            
            <div className="container">
                {/* AI Report Section */}
                <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)', marginBottom: '3rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '2rem', color: '#0f172a', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>
                        <span style={{ fontSize: '1.75rem' }}>✨</span> AI Mode: Today's Top Searches
                    </h1>
                    
                    {newsAlert?.aiReport ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                            {parseAIReport(newsAlert.aiReport).map((deal: any, idx: number) => (
                                <AIDealCard key={idx} deal={deal} index={idx} isAdmin={isAdmin} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: '#64748b' }}>No AI report generated yet. The AI scheduler runs every few hours.</p>
                    )}
                    

                </div>

                {/* Manual Deals Section */}
                <section className={styles.featuredSection} style={{ padding: 0 }}>
                    <div className={styles.sectionHeader} style={{ marginBottom: '2rem' }}>
                        <h2 className="section-title">Our Top Manually Verified Deals</h2>
                    </div>

                    {deals.length > 0 ? (
                        <div className={styles.dealGrid}>
                            {deals.map(deal => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No active deals available right now. Check back later!</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
