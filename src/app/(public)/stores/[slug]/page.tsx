import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import StoreDetailClient from './StoreDetailClient';

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const merchant = await prisma.merchant.findUnique({
        where: { slug },
        include: {
            deals: {
                where: { isActive: true },
                include: { merchant: true }
            }
        }
    });

    if (!merchant) {
        notFound();
    }

    const session = await getServerSession();
    const isAdmin = !!(session?.user && (session.user as any).role === 'ADMIN');

    // The Client Component handles the inline editing logic
    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
            <StoreDetailClient 
                merchant={merchant} 
                deals={merchant.deals} 
                isAdmin={isAdmin} 
            />
        </div>
    );
}
