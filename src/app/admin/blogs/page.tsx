import { prisma } from '@/lib/prisma';
import styles from '../categories/page.module.css'; // Reusing categories styles
import Link from 'next/link';

export default async function BlogsAdminPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;
    const errorMsg = sp.error as string | undefined;

    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: 'desc' }
    });

    let editBlog = null;
    if (editId) {
        editBlog = blogs.find(b => b.id === editId);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Blogs</h1>
                    <p className={styles.subtitle}>Manage your blog posts and articles.</p>
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

            <div className={styles.layout}>
                {/* Left Side: List of Blogs */}
                <div>
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div key={blog.id} className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <div>
                                        <h3 className={styles.categoryName}>{blog.title}</h3>
                                        <span className={styles.categorySlug}>{blog.slug} &bull; {blog.published ? 'Published' : 'Draft'}</span>
                                    </div>
                                    <div className={styles.categoryActions}>
                                        <a href={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer" className={styles.editBtn} style={{ backgroundColor: '#10b981', color: 'white' }}>
                                            View
                                        </a>
                                        <Link href={`/admin/blogs?edit=${blog.id}`} className={styles.editBtn}>
                                            Edit
                                        </Link>
                                        <form action="/api/admin/blogs/delete" method="POST">
                                            <input type="hidden" name="id" value={blog.id} />
                                            <button type="submit" className={styles.deleteBtn}>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No blogs created yet.</p>
                    )}
                </div>

                {/* Right Side: Form (Create or Edit) */}
                <div>
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>
                            {editBlog ? `Edit Blog` : 'Add New Blog'}
                        </h2>

                        <form action="/api/admin/blogs" method="POST">
                            {editBlog && <input type="hidden" name="id" value={editBlog.id} />}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    defaultValue={editBlog?.title || ''}
                                    placeholder="e.g. How to save money"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    required
                                    defaultValue={editBlog?.slug || ''}
                                    placeholder="e.g. how-to-save-money"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Content (HTML) *</label>
                                <textarea
                                    name="content"
                                    required
                                    defaultValue={editBlog?.content || ''}
                                    placeholder="<p>Write your HTML content here...</p>"
                                    className={styles.input}
                                    style={{ minHeight: '300px', resize: 'vertical' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        name="published"
                                        value="true"
                                        defaultChecked={editBlog ? editBlog.published : true}
                                    />
                                    Published
                                </label>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {editBlog ? 'Save Changes' : 'Create Blog'}
                            </button>

                            {editBlog && (
                                <Link href="/admin/blogs" className={styles.cancelEditBtn} style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#6b7280', textDecoration: 'none' }}>
                                    Cancel Edit
                                </Link>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
