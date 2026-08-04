import { prisma } from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import TrendingDealsBottom from '@/components/ui/TrendingDealsBottom';
import BlogAdminControls from '@/components/ui/BlogAdminControls';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    
    let blog = await prisma.blog.findUnique({
        where: { slug }
    });

    if (!blog && slug !== decodedSlug) {
        blog = await prisma.blog.findUnique({
            where: { slug: decodedSlug }
        });
    }

    if (!blog) return {};

    return {
        title: `${blog.title} | AI Deals of America`,
        description: blog.title,
    };
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    
    let blog = await prisma.blog.findUnique({
        where: { slug, published: true }
    });

    if (!blog && slug !== decodedSlug) {
        blog = await prisma.blog.findUnique({
            where: { slug: decodedSlug, published: true }
        });
    }

    // Fallback for old links with spaces or uppercase characters (e.g. from social media)
    if (!blog) {
        const sanitizedSlug = decodedSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (sanitizedSlug !== decodedSlug && sanitizedSlug !== slug) {
            const fallbackBlog = await prisma.blog.findUnique({
                where: { slug: sanitizedSlug, published: true }
            });
            if (fallbackBlog) {
                // Permanent redirect to the new clean URL
                redirect(`/blog/${sanitizedSlug}`);
            }
        }
    }

    if (!blog) {
        notFound();
    }

    // Check if the current user is an admin
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user && (session.user as any).role === 'ADMIN';

    // By wrapping in a full width div, we let the HTML content style itself.
    // If the content brings its own <style> tags and .container, it will render exactly as authored.
    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
            {isAdmin && <BlogAdminControls blogId={blog.id} />}
            
            <article dangerouslySetInnerHTML={{ __html: blog.content }} />
            
            <TrendingDealsBottom />
        </div>
    );
}
