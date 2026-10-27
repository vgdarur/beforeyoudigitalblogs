import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import TrendingDealsBottom from '@/components/ui/TrendingDealsBottom';
import ImpactBanner from '@/components/ads/ImpactBanner';

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
    let blogs: any[] = [];
    let dbError = false;

    try {
        blogs = await prisma.blog.findMany({
            where: { published: true },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (err) {
        console.warn('Database query failed in BlogListPage:', err);
        dbError = true;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '850px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', letterSpacing: '-0.02em' }}>
                Latest Articles & Shopping Guides
            </h1>
            <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem', fontSize: '1.05rem' }}>
                Curated insights, deals intelligence, and smart consumer advice from AI Deals of America.
            </p>

            {/* Impact.com Top Featured Sponsor Banner */}
            <ImpactBanner />

            {dbError && (
                <div style={{ padding: '12px 16px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                    Note: The remote database is currently throttled (Neon quota). Any articles stored locally or newly published will appear once quota resets or local DB is active.
                </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog.id} style={{ 
                            padding: '1.75rem', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '12px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s ease'
                        }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem', color: '#0f172a' }}>
                                <Link href={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {blog.title}
                                </Link>
                            </h2>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                {blog.author?.name ? `By ${blog.author.name} • ` : ''}
                                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                            <Link 
                                href={`/blog/${blog.slug}`} 
                                style={{ 
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    color: '#2563eb', 
                                    fontWeight: '600',
                                    textDecoration: 'none'
                                }}
                            >
                                Read article &rarr;
                            </Link>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>No articles published yet. New guides coming soon!</p>
                    </div>
                )}
            </div>

            <TrendingDealsBottom />
        </div>
    );
}
