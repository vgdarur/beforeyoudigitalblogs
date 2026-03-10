import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function CategoriesAdminPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;
    const errorMsg = sp.error as string | undefined;

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { deals: true } } }
    });

    let editCategory = null;
    if (editId) {
        editCategory = categories.find(c => c.id === editId);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Categories</h1>
                    <p className={styles.subtitle}>Manage your deal categories and navigation structure.</p>
                </div>
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fca5a5' }}>
                    <strong>Error: </strong>
                    {errorMsg === 'FailedToSave' && 'Failed to save category. The name or slug might already exist.'}
                    {errorMsg === 'CannotDeleteInUse' && 'Cannot delete category because it is linked to existing deals.'}
                    {errorMsg === 'NameRequired' && 'Category Name is required.'}
                    {!['FailedToSave', 'CannotDeleteInUse', 'NameRequired'].includes(errorMsg) && errorMsg}
                </div>
            )}

            <div className={styles.layout}>
                {/* Left Side: List of Categories */}
                <div>
                    {categories.length > 0 ? (
                        categories.map(category => (
                            <div key={category.id} className={styles.categoryCard}>
                                <div className={styles.categoryHeader}>
                                    <div>
                                        <h3 className={styles.categoryName}>{category.name}</h3>
                                        <span className={styles.categorySlug}>{category.slug} &bull; {category._count.deals} Deals</span>
                                    </div>
                                    <div className={styles.categoryActions}>
                                        <Link href={`/admin/categories?edit=${category.id}`} className={styles.editBtn}>
                                            Edit
                                        </Link>
                                        <form action="/api/admin/categories/delete" method="POST">
                                            <input type="hidden" name="id" value={category.id} />
                                            <button type="submit" className={styles.deleteBtn}>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No categories created yet.</p>
                    )}
                </div>

                {/* Right Side: Form (Create or Edit) */}
                <div>
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>
                            {editCategory ? `Edit ${editCategory.name}` : 'Add New Category'}
                        </h2>

                        <form action="/api/admin/categories" method="POST">
                            {editCategory && <input type="hidden" name="id" value={editCategory.id} />}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Category Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={editCategory?.name || ''}
                                    placeholder="e.g. Electronics"
                                    className={styles.input}
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {editCategory ? 'Save Changes' : 'Create Category'}
                            </button>

                            {editCategory && (
                                <Link href="/admin/categories" className={styles.cancelEditBtn}>
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
