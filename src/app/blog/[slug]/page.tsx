import { getBlogBySlug } from '@/lib/blogStore';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import TrendingDealsBottom from '@/components/ui/TrendingDealsBottom';
import BlogAdminControls from '@/components/ui/BlogAdminControls';
import ImpactBanner from '@/components/ads/ImpactBanner';
import { getTop3DealsToday, injectDealsIntoHtml } from '@/lib/blogAdInjector';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    
    try {
        const blog = await getBlogBySlug(slug, true);
        if (blog) {
            return {
                title: `${blog.title} | AI Deals of America`,
                description: blog.title,
            };
        }
    } catch (e) {
        // Fallback title on error
    }

    return {
        title: `Shopping Guide | AI Deals of America`,
    };
}

export default async function SingleBlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const blog = await getBlogBySlug(slug, true);

    if (!blog) {
        notFound();
    }

    // Check if current user is admin
    let isAdmin = false;
    try {
        const session = await getServerSession(authOptions);
        isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');
    } catch (e) {
        // session error fallback
    }

    // Fetch top 3 deals today for in-content ad injection
    const topDeals = await getTop3DealsToday();
    const contentWithAds = injectDealsIntoHtml(blog.content, topDeals);

    return (
        <div style={{ padding: '2rem 1rem', maxWidth: '850px', margin: '0 auto' }}>
            {isAdmin && <BlogAdminControls blogId={blog.id} />}
            
            {/* Top Advertisement Banner from Impact.com */}
            <ImpactBanner />

            {/* Main Article with In-Content Injected AI Deals */}
            <article 
                dangerouslySetInnerHTML={{ __html: contentWithAds }} 
                style={{ lineHeight: 1.7, fontSize: '1.05rem', color: '#1e293b' }}
            />
            
            {/* Bottom Trending Deals Section */}
            <TrendingDealsBottom />
        </div>
    );
}
