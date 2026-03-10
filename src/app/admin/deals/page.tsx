import { prisma } from '@/lib/prisma';
import styles from '../dashboard/page.module.css'; // Reusing dashboard styles for consistency
import Link from 'next/link';

export default async function AdminDealsPage() {
    // Fetch all deals
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            network: { select: { name: true } },
            category: { select: { name: true } },
            merchant: { select: { name: true } }
        }
    });

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.pageTitle}>Deals Dashboard</h1>
                <Link href="/admin/deals/new" className={styles.actionItem} style={{ padding: '0.5rem 1rem', display: 'inline-block', width: 'auto' }}>
                    + Add New Deal
                </Link>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>All Deals</h3>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Merchant</th>
                                <th>Network</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deals.length > 0 ? (
                                deals.map(deal => (
                                    <tr key={deal.id}>
                                        <td className={styles.truncate} title={deal.title}>{deal.title}</td>
                                        <td>{deal.merchant.name}</td>
                                        <td>
                                            {deal.network ? (
                                                <span className={styles.tag}>{deal.network.name}</span>
                                            ) : (
                                                <span className={styles.tag}>Manual</span>
                                            )}
                                        </td>
                                        <td>{deal.category.name}</td>
                                        <td>{deal.price ? `$${deal.price}` : '-'}</td>
                                        <td>
                                            <span style={{
                                                color: deal.isActive ? 'var(--positive)' : 'var(--text-muted)',
                                                fontWeight: 'bold'
                                            }}>
                                                {deal.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>{new Date(deal.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Link href={`/admin/deals/${deal.id}/edit`} style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: 'var(--surface-hover)',
                                                    border: '1px solid var(--border)',
                                                    color: 'var(--foreground)',
                                                    borderRadius: '4px',
                                                    textDecoration: 'none',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    Edit
                                                </Link>
                                                <form action={`/api/admin/deals/${deal.id}/delete`} method="POST">
                                                    <button type="submit" style={{
                                                        padding: '0.25rem 0.5rem',
                                                        background: 'transparent',
                                                        border: '1px solid var(--danger)',
                                                        color: 'var(--danger)',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.875rem'
                                                    }}>
                                                        Delete
                                                    </button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className={styles.emptyCell}>No deals found. Check the Import tab to add some!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
