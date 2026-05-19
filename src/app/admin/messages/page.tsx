import { PrismaClient } from '@prisma/client';
import styles from '../dashboard/page.module.css'; // Reusing dashboard styles

const prisma = new PrismaClient();

export default async function AdminMessagesPage() {
    // Fetch all contact messages
    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.panelHeader} style={{ marginBottom: '2rem' }}>
                <h1 className={styles.pageTitle}>Support Messages</h1>
            </div>

            <div className={styles.panel}>
                <div className={styles.panelHeader}>
                    <h3 className={styles.panelTitle}>Inbox</h3>
                </div>
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.length > 0 ? (
                                messages.map(msg => (
                                    <tr key={msg.id}>
                                        <td>{msg.name}</td>
                                        <td>{msg.email}</td>
                                        <td>{msg.subject}</td>
                                        <td className={styles.truncate} title={msg.message} style={{ maxWidth: '300px' }}>
                                            {msg.message}
                                        </td>
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                background: msg.status === 'UNREAD' ? 'var(--danger)' : 'var(--success)',
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {msg.status}
                                            </span>
                                        </td>
                                        <td>{new Date(msg.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>No support messages yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
