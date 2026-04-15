import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function AdminMerchantsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;
    const action = sp.action as string | undefined;
    const errorMsg = sp.error as string | undefined;

    const merchants = await prisma.merchant.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { deals: true }
            }
        }
    });

    let editMerchant = null;
    if (editId) {
        editMerchant = merchants.find(m => m.id === editId);
    }

    // Force showing form on right side if edit=... or action=new are provided, else keep normally open
    const showForm = editId || action === 'new';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Merchants</h1>
                    <p className={styles.subtitle}>Add, configure, and review your database of tracked stores.</p>
                </div>
                {/* On mobile, if we aren't already creating, show a button to enter create state */}
                {!showForm && (
                     <Link href="/admin/merchants?action=new" className={styles.editBtn}>
                         + Add Merchant 
                     </Link>
                )}
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fca5a5' }}>
                    <strong>Error: </strong>
                    {errorMsg === 'FailedToSave' && 'Failed to save merchant. The name or slug might already exist.'}
                    {errorMsg === 'NameRequired' && 'Merchant Name is required.'}
                    {!['FailedToSave', 'NameRequired'].includes(errorMsg) && errorMsg}
                </div>
            )}

            <div className={styles.layout}>
                {/* Left Side: List of Merchants */}
                <div>
                    {merchants.length > 0 ? (
                        merchants.map(merchant => (
                            <div key={merchant.id} className={styles.networkCard}>
                                <div className={styles.networkHeader}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {merchant.logoUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img 
                                                src={merchant.logoUrl} 
                                                alt={merchant.name} 
                                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                                            />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                                                {merchant.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h3 className={styles.networkName}>{merchant.name}</h3>
                                            <span className={styles.networkSlug}>{merchant.slug} &bull; {merchant._count.deals} Active Deals</span>
                                        </div>
                                    </div>
                                    <div className={styles.networkActions}>
                                        <Link href={`/admin/merchants?edit=${merchant.id}`} className={styles.editBtn}>
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No merchants created yet.</p>
                    )}
                </div>

                {/* Right Side: Form (Create or Edit) */}
                {(showForm || merchants.length === 0) ? (
                    <div>
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>
                                {editMerchant ? `Edit ${editMerchant.name}` : 'Add New Merchant'}
                            </h2>

                            <form action="/api/admin/merchants" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {editMerchant && <input type="hidden" name="id" value={editMerchant.id} />}

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Merchant Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={editMerchant?.name || ''}
                                        placeholder="e.g. Amazon"
                                        className={styles.input}
                                    />
                                    <span className={styles.helperText}>This will auto-generate the URL slug.</span>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Logo URL</label>
                                    <input
                                        type="url"
                                        name="logoUrl"
                                        defaultValue={editMerchant?.logoUrl || ''}
                                        placeholder="https://example.com/logo.png"
                                        className={styles.input}
                                    />
                                </div>

                                <button type="submit" className={styles.submitBtn} style={{ marginTop: '1rem' }}>
                                    {editMerchant ? 'Save Changes' : 'Create Merchant'}
                                </button>

                                {editMerchant && (
                                    <Link href="/admin/merchants" className={styles.cancelEditBtn}>
                                        Cancel Edit
                                    </Link>
                                )}
                            </form>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'none' }} className="form-placeholder">
                        {/* Empty right column logic visually handled by media queries if none active, or can be forced open */}
                    </div>
                )}
            </div>
        </div>
    );
}
