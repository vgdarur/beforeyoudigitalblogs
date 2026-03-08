import { prisma } from '@/lib/prisma';
import styles from '../../new/page.module.css';
import { notFound } from 'next/navigation';

export default async function EditDealPage({ params }: { params: { id: string } }) {
    const dealId = params.id;

    const deal = await prisma.deal.findUnique({
        where: { id: dealId },
        include: { merchant: true }
    });

    if (!deal) {
        notFound();
    }

    const networks = await prisma.network.findMany({
        orderBy: { name: 'asc' }
    });

    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Edit Deal</h1>
                <p className={styles.subtitle}>Update existing deal information.</p>
            </div>

            <div className={styles.formCard}>
                <form action={`/api/admin/deals/${deal.id}/edit`} method="POST" className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Deal Title *</label>
                        <input type="text" name="title" defaultValue={deal.title} required className={styles.input} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Affiliate Link *</label>
                        <input type="url" name="affiliateUrl" defaultValue={deal.affiliateUrl} required className={styles.input} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" defaultValue={deal.description} className={styles.textarea}></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sale Price (USD)</label>
                        <input type="number" step="0.01" name="price" defaultValue={deal.price || ''} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Original Price (USD)</label>
                        <input type="number" step="0.01" name="originalPrice" defaultValue={deal.originalPrice || ''} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image URL</label>
                        <input type="url" name="imageUrl" defaultValue={deal.imageUrl || ''} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Coupon Code</label>
                        <input type="text" name="couponCode" defaultValue={deal.couponCode || ''} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Merchant / Store *</label>
                        <input type="text" name="merchantName" defaultValue={deal.merchant?.name || ''} required className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Expiration Date</label>
                        <input
                            type="datetime-local"
                            name="expirationDate"
                            defaultValue={deal.expirationDate ? new Date(deal.expirationDate).toISOString().slice(0, 16) : ''}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category *</label>
                        <select name="categoryId" defaultValue={deal.categoryId} required className={styles.select}>
                            <option value="">Select Category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Affiliate Network *</label>
                        <select name="networkId" defaultValue={deal.networkId} required className={styles.select}>
                            <option value="">Select Network...</option>
                            {networks.map(net => (
                                <option key={net.id} value={net.id}>{net.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.actions} ${styles.fullWidth}`}>
                        <a href="/admin/deals" className={styles.btnCancel}>Cancel</a>
                        <button type="submit" className={styles.btnSubmit}>Update Deal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
