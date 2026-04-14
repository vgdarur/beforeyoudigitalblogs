import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import RestaurantDetailClient from './RestaurantDetailClient';

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // We search the 'Merchant' table since the model for restaurants is Merchant
    const merchant = await prisma.merchant.findUnique({
        where: { slug },
        include: { deals: true }
    });

    if (!merchant) {
        notFound();
    }

    const session = await getServerSession();
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    // The Client Component handles the inline editing logic
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <RestaurantDetailClient 
                merchant={merchant} 
                deals={merchant.deals} 
                isAdmin={isAdmin} 
            />
        </div>
    );
}
