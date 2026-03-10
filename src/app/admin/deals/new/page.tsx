import { prisma } from '@/lib/prisma';
import styles from './page.module.css';

// This needs to be a Server Component structurally so it can fetch the lists natively
export default async function NewDealPage() {
    // Fetch dropdown options for the form natively on server
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

            <div className={styles.formCard}>
                <form action="/api/admin/deals/create" method="POST" className={styles.formGrid}>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Deal Title *</label>
                        <input type="text" name="title" required placeholder="e.g. 50% Off Sony Headphones" className={styles.input} />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Affiliate Link *</label>
                        <input type="url" name="affiliateUrl" required placeholder="https://..." className={styles.input} />
                        <span className={styles.helperText}>The raw destination or affiliate network tracking link.</span>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" placeholder="Optional details about this promotion..." className={styles.textarea}></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sale Price (USD)</label>
                        <input type="number" step="0.01" name="price" placeholder="199.99" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Original Price (USD)</label>
                        <input type="number" step="0.01" name="originalPrice" placeholder="399.99" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image URL</label>
                        <input type="url" name="imageUrl" placeholder="https://.../image.jpg" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Coupon Code</label>
                        <input type="text" name="couponCode" placeholder="e.g. SAVE50" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Merchant / Store *</label>
                        <input type="text" name="merchantName" required placeholder="e.g. Amazon, Best Buy" className={styles.input} />
                        <span className={styles.helperText}>If string does not exist, system will create a new one.</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Expiration Date</label>
                        <input type="datetime-local" name="expirationDate" className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category *</label>
                        <select name="categoryId" required className={styles.select}>
                            <option value="">Select Category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Affiliate Network (Optional)</label>
                        <select name="networkId" className={styles.select}>
                            <option value="">Select Network...</option>
                            {networks.map(net => (
                                <option key={net.id} value={net.id}>{net.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.actions} ${styles.fullWidth}`}>
                        <a href="/admin" className={styles.btnCancel}>Cancel</a>
                        <button type="submit" className={styles.btnSubmit}>Create Deal</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
