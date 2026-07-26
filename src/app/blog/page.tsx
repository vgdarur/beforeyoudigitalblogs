import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        include: { author: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
                Latest Articles
            </h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {blogs.length > 0 ? (
                    blogs.map(blog => (
                        <div key={blog.id} style={{ 
                            padding: '1.5rem', 
                            border: '1px solid #e5e7eb', 
                            borderRadius: '8px', 
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1d1d1f' }}>
                                <Link href={`/blog/${blog.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {blog.title}
                                </Link>
                            </h2>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
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
                                    display: 'inline-block',
                                    color: '#0071e3', 
                                    fontWeight: '500',
                                    textDecoration: 'none'
                                }}
                            >
                                Read more &rarr;
                            </Link>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>No articles published yet. Check back soon!</p>
                )}
            </div>
        </div>
    );
}
