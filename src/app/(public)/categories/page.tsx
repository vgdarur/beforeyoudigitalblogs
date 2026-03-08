import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

export const revalidate = 3600; // Cache for 1 hour

export const metadata = {
    title: 'Deal Categories | DealHub',
    description: 'Browse the best deals and discounts by category including Tech, Fashion, Home, and more.',
};

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: {
            _count: {
                select: { deals: { where: { isActive: true } } }
            }
        },
        orderBy: {
            name: 'asc'
        }
    });

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>Browse by Category</h1>
                <p className={styles.subtitle}>Find the best discounts across all your favorite product categories</p>
            </div>

            <div className={styles.grid}>
                {categories.map(category => (
                    <Link
                        href={`/deals?category=${category.id}`}
                        key={category.id}
                        className={styles.card}
                    >
                        <div className={styles.cardContent}>
                            <h2 className={styles.cardTitle}>{category.name}</h2>
                            <span className={styles.dealCount}>
                                {category._count.deals} Active {category._count.deals === 1 ? 'Deal' : 'Deals'}
                            </span>
                        </div>
                        <div className={styles.arrow}>→</div>
                    </Link>
                ))}

                {categories.length === 0 && (
                    <div className={styles.emptyState}>No categories found.</div>
                )}
            </div>
        </div>
    );
}
