import { prisma } from '@/lib/prisma';
import styles from '../categories/page.module.css';
import Link from 'next/link';
import BlogUploader from './BlogUploader';

export const dynamic = 'force-dynamic';

export default async function BlogsAdminPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;
    const errorMsg = sp.error as string | undefined;

    let blogs: any[] = [];
    try {
        blogs = await prisma.blog.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (e) {
        console.warn('Error fetching blogs in admin:', e);
    }

    let editBlog = null;
    if (editId) {
        editBlog = blogs.find(b => b.id === editId);
    }

    return (
        <div className={styles.container} style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem' }}>
            <div className={styles.header} style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 className={styles.title} style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                        Blogger CMS & Publisher
                    </h1>
                    <p className={styles.subtitle} style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Upload Claude or Antigravity generated HTML/PDF articles. Automatically monetize with Impact.com banners & AI Deals of America ads.
                    </p>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fca5a5' }}>
                    <strong>Error: </strong>
                    {errorMsg === 'FailedToSave' && 'Failed to save blog. The slug might already exist.'}
                    {errorMsg === 'MissingFields' && 'Title, slug, and content are required.'}
                    {!['FailedToSave', 'MissingFields'].includes(errorMsg) && errorMsg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 1.25fr)', gap: '2rem', alignItems: 'start' }}>
                
                {/* Left Side: Published & Draft Articles List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                            Published Articles ({blogs.length})
                        </h2>
                        {editBlog && (
                            <Link href="/admin/blogs" style={{ fontSize: '0.82rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                                + New Article
                            </Link>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {blogs.length > 0 ? (
                            blogs.map(blog => (
                                <div key={blog.id} style={{
                                    background: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '10px',
                                    padding: '16px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.3 }}>
                                                {blog.title}
                                            </h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#64748b' }}>
                                                <span>/{blog.slug}</span>
                                                <span>&bull;</span>
                                                <span style={{
                                                    color: blog.published ? '#16a34a' : '#ea580c',
                                                    fontWeight: 600
                                                }}>
                                                    {blog.published ? 'Live (Public)' : 'Draft'}
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <a
                                                href={`/blog/${blog.slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: '#10b981',
                                                    color: 'white',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                View Live
                                            </a>
                                            <Link
                                                href={`/admin/blogs?edit=${blog.id}`}
                                                style={{
                                                    background: '#f1f5f9',
                                                    color: '#334155',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.78rem',
                                                    fontWeight: 600,
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                Edit
                                            </Link>
                                            <form action="/api/admin/blogs/delete" method="POST">
                                                <input type="hidden" name="id" value={blog.id} />
                                                <button
                                                    type="submit"
                                                    style={{
                                                        background: '#fee2e2',
                                                        color: '#dc2626',
                                                        border: 'none',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                                No articles published yet. Upload your first Claude or Antigravity HTML/PDF on the right!
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Interactive Drag & Drop Uploader */}
                <div>
                    <BlogUploader initialBlog={editBlog} />
                </div>
            </div>
        </div>
    );
}
