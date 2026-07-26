import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import NewDealForm from './NewDealForm';

export default async function NewDealPage({
    searchParams,
}: {
    searchParams: Promise<{
        title?: string;
        affiliateUrl?: string;
        description?: string;
        price?: string;
        imageUrl?: string;
        merchantName?: string;
    }>;
}) {
    const params = await searchParams;
    const initialValues = {
        title: params.title || '',
        affiliateUrl: params.affiliateUrl || '',
        description: params.description || '',
        price: params.price || '',
        imageUrl: params.imageUrl || '',
        merchantName: params.merchantName || '',
    };

    const networks = await prisma.network.findMany({
        orderBy: { name: 'asc' }
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Add New Deal</h1>
                <p className={styles.subtitle}>Create a new affiliate deal manually.</p>
            </div>

            <NewDealForm 
                categories={categories} 
                networks={networks} 
                initialValues={initialValues} 
            />
        </div>
    );
}
