import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function AdminFeedsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;
    const action = sp.action as string | undefined;
    const errorMsg = sp.error as string | undefined;

    const feeds = await prisma.feedSource.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            jobs: {
                orderBy: { startedAt: 'desc' },
                take: 1
            }
        }
    });

    let editFeed = null;
    if (editId) {
        editFeed = feeds.find(f => f.id === editId);
    }

    const showForm = editId || action === 'new';

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Automated Feed Sources</h1>
                    <p className={styles.subtitle}>Manage your affiliate network CSV/XML data feed URLs.</p>
                </div>
                {!showForm && (
                     <Link href="/admin/feeds?action=new" className={styles.editBtn}>
                         + Add Feed URL
                     </Link>
                )}
            </div>

            {errorMsg && (
                <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #fca5a5' }}>
                    <strong>Error: </strong>
                    {errorMsg === 'FailedToSave' && 'Failed to save feed source.'}
                    {errorMsg === 'FieldsRequired' && 'Feed Name and URL are required.'}
                    {!['FailedToSave', 'FieldsRequired'].includes(errorMsg) && errorMsg}
                </div>
            )}

            <div className={styles.layout}>
                {/* Left Side: List of Feeds */}
                <div>
                    {feeds.length > 0 ? (
                        feeds.map(feed => {
                            const lastJob = feed.jobs[0];
                            return (
                                <div key={feed.id} className={styles.networkCard}>
                                    <div className={styles.networkHeader}>
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h3 className={styles.networkName}>
                                                    {feed.name}
                                                    {!feed.isActive && <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Inactive</span>}
                                                </h3>
                                                <Link href={`/admin/feeds?edit=${feed.id}`} className={styles.editBtn}>
                                                    Edit
                                                </Link>
                                            </div>
                                            <div className={styles.keyGrid}>
                                                <span className={styles.keyLabel}>URL:</span>
                                                <span className={styles.keyValue} style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>{feed.url}</span>
                                                
                                                <span className={styles.keyLabel}>Format:</span>
                                                <span className={styles.keyValue}>{feed.format}</span>

                                                <span className={styles.keyLabel}>Last Sync:</span>
                                                <span className={styles.keyValue}>
                                                    {lastJob ? (
                                                        <span style={{ color: lastJob.status === 'FAILED' ? '#dc2626' : (lastJob.status === 'COMPLETED' ? '#16a34a' : 'inherit') }}>
                                                            {lastJob.status} ({lastJob.itemsImported} items) at {lastJob.completedAt ? new Date(lastJob.completedAt).toLocaleString() : 'Processing'}
                                                        </span>
                                                    ) : 'Never synced'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No feed sources configured.</p>
                    )}
                </div>

                {/* Right Side: Form (Create or Edit) */}
                {(showForm || feeds.length === 0) ? (
                    <div>
                        <div className={styles.formCard}>
                            <h2 className={styles.formTitle}>
                                {editFeed ? `Edit ${editFeed.name}` : 'Add New Data Feed'}
                            </h2>

                            <form action="/api/admin/feeds" method="POST" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {editFeed && <input type="hidden" name="id" value={editFeed.id} />}

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Feed Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        defaultValue={editFeed?.name || ''}
                                        placeholder="e.g. CJ Amazon Daily Feed"
                                        className={styles.input}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>CSV / XML Output URL *</label>
                                    <input
                                        type="url"
                                        name="url"
                                        required
                                        defaultValue={editFeed?.url || ''}
                                        placeholder="https://affiliate.com/export?key=123"
                                        className={styles.input}
                                    />
                                    <span className={styles.helperText}>This URL will be automatically downloaded by the Cron job.</span>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Feed Format</label>
                                    <select name="format" className={styles.input} defaultValue={editFeed?.format || 'CSV'}>
                                        <option value="CSV">CSV File</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <input 
                                        type="checkbox" 
                                        name="isActive" 
                                        id="isActive"
                                        defaultChecked={editFeed ? editFeed.isActive : true}
                                        style={{ width: '1.2rem', height: '1.2rem' }}
                                    />
                                    <label htmlFor="isActive" className={styles.label} style={{ marginBottom: 0 }}>Enable automatic syncing</label>
                                </div>

                                <button type="submit" className={styles.submitBtn} style={{ marginTop: '1rem' }}>
                                    {editFeed ? 'Save Feed' : 'Add Feed Source'}
                                </button>

                                {editFeed && (
                                    <Link href="/admin/feeds" className={styles.cancelEditBtn}>
                                        Cancel Edit
                                    </Link>
                                )}
                            </form>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'none' }} className="form-placeholder"></div>
                )}
            </div>
        </div>
    );
}
