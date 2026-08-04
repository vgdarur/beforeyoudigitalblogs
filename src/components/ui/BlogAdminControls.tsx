'use client';

import Link from 'next/link';

export default function BlogAdminControls({ blogId }: { blogId: string }) {
    return (
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#334155' }}>Admin Controls</span>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href={`/admin/blogs?edit=${blogId}`} style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '0.875rem' }}>
                    Edit Blog
                </Link>
                <form action="/api/admin/blogs/delete" method="POST" onSubmit={(e) => {
                    if(!confirm('Are you sure you want to delete this blog?')) e.preventDefault();
                }}>
                    <input type="hidden" name="id" value={blogId} />
                    <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>
                        Delete Blog
                    </button>
                </form>
            </div>
        </div>
    );
}
