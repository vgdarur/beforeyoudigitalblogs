import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import { upsertNetwork, deleteNetwork } from './actions';
import Link from 'next/link';

export default async function NetworksAdminPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const editId = sp.edit as string | undefined;

    const networks = await prisma.network.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { deals: true } } }
    });

    let editNetwork = null;
    if (editId) {
        editNetwork = networks.find(n => n.id === editId);
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Affiliate Networks & API Keys</h1>
                    <p className={styles.subtitle}>Manage your network connections, tracking IDs, and store credentials.</p>
                </div>
            </div>

            <div className={styles.layout}>
                {/* Left Side: List of Networks */}
                <div>
                    {networks.length > 0 ? (
                        networks.map(network => (
                            <div key={network.id} className={styles.networkCard}>
                                <div className={styles.networkHeader}>
                                    <div>
                                        <h3 className={styles.networkName}>{network.name}</h3>
                                        <span className={styles.networkSlug}>{network.slug} &bull; {network._count.deals} Deals</span>
                                    </div>
                                    <div className={styles.networkActions}>
                                        <Link href={`/admin/networks?edit=${network.id}`} className={styles.editBtn}>
                                            Edit
                                        </Link>
                                        <form action={deleteNetwork}>
                                            <input type="hidden" name="id" value={network.id} />
                                            <button type="submit" className={styles.deleteBtn}>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className={styles.keyGrid}>
                                    <span className={styles.keyLabel}>Store / Tracking ID:</span>
                                    <span className={network.trackingId ? styles.keyValue : styles.emptyValue}>
                                        {network.trackingId || 'Not configured'}
                                    </span>

                                    <span className={styles.keyLabel}>API Key / Secret:</span>
                                    <span className={network.apiKey ? styles.keyValue : styles.emptyValue}>
                                        {network.apiKey ? '••••••••' + network.apiKey.slice(-4) : 'Not configured'}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No networks created yet.</p>
                    )}
                </div>

                {/* Right Side: Form (Create or Edit) */}
                <div>
                    <div className={styles.formCard}>
                        <h2 className={styles.formTitle}>
                            {editNetwork ? `Edit ${editNetwork.name}` : 'Add New Network'}
                        </h2>

                        <form action={upsertNetwork}>
                            {editNetwork && <input type="hidden" name="id" value={editNetwork.id} />}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Network Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    defaultValue={editNetwork?.name || ''}
                                    placeholder="e.g. Amazon Associates"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Tracking ID / Store ID</label>
                                <input
                                    type="text"
                                    name="trackingId"
                                    defaultValue={editNetwork?.trackingId || ''}
                                    placeholder="e.g. dealsagent-20"
                                    className={styles.input}
                                />
                                <span className={styles.helperText}>Used to auto-tag generic links for this network.</span>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>API Key / Private Token</label>
                                <input
                                    type="text"
                                    name="apiKey"
                                    defaultValue={editNetwork?.apiKey || ''}
                                    placeholder="Optional raw API key..."
                                    className={styles.input}
                                />
                                <span className={styles.helperText}>Used for automated feed fetching if implemented.</span>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {editNetwork ? 'Save Changes' : 'Create Network'}
                            </button>

                            {editNetwork && (
                                <Link href="/admin/networks" className={styles.cancelEditBtn}>
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
