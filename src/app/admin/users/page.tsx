import { prisma } from '@/lib/prisma';
import styles from '../dashboard/page.module.css';
import Link from 'next/link';

export default async function AdminUsersPage() {
    // Fetch all users
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.panelHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className={styles.pageTitle}>Users & Roles</h1>
                <Link href="/admin/users/new" className={styles.actionItem} style={{ padding: '0.5rem 1rem', display: 'inline-block', width: 'auto' }}>
                    + Add New Admin
                </Link>
            </div>

            <div className={styles.panel}>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name || 'No Name'}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={styles.tag}>{user.role}</span>
                                    </td>
                                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <form action={`/api/admin/users/${user.id}/delete`} method="POST">
                                                <button type="submit" style={{
                                                    padding: '0.25rem 0.5rem',
                                                    background: 'transparent',
                                                    border: '1px solid var(--danger)',
                                                    color: 'var(--danger)',
                                                    borderRadius: '4px',
                                                    cursor: 'pointer'
                                                }}>
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
