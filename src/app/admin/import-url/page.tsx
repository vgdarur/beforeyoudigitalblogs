import { prisma } from '@/lib/prisma';
import UrlImporter from './UrlImporter';

export const revalidate = 0; // Disable page caching for real-time admin dashboard data

export default async function ImportUrlPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    const merchants = await prisma.merchant.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <UrlImporter 
            initialCategories={categories.map(c => ({ id: c.id, name: c.name, slug: c.slug }))}
            initialMerchants={merchants.map(m => ({ id: m.id, name: m.name, slug: m.slug }))}
        />
    );
}
