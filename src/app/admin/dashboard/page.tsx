import { prisma } from '@/lib/prisma';
import styles from './page.module.css';
import Link from 'next/link';

export default async function AdminDashboard() {
    // Fetch aggregate data
    const [
        totalDeals,
        activeDeals,
        totalClicks,
        totalMerchants,
        recentClicks
    ] = await Promise.all([
        prisma.deal.count(),
        prisma.deal.count({ where: { isActive: true } }),
        prisma.click.count(),
        prisma.merchant.count(),
        prisma.click.findMany({
            take: 10,
            orderBy: { timestamp: 'desc' },
            include: {
                deal: { select: { title: true } },
                network: { select: { name: true } }
            }
        })
    ]);

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Total Deals</div>
                    <div className={styles.statValue}>{totalDeals}</div>
                    <div className={styles.statIndicator + ' ' + styles.positive}>
                        {activeDeals} Active Offers
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Total Outbound Clicks</div>
                    <div className={styles.statValue}>{totalClicks}</div>
                    <div className={styles.statIndicator + ' ' + styles.positive}>
                        +12% this week
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Active Merchants</div>
                    <div className={styles.statValue}>{totalMerchants}</div>
                    <Link href="/admin/merchants" className={styles.statLink}>
                        Manage Merchants →
                    </Link>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statTitle}>Active Feed Sources</div>
                    <div className={styles.statValue}>1+</div>
                    <Link href="/admin/feeds" className={styles.statLink}>
                        Manage Automations →
                    </Link>
                </div>
            </div>

            <div className={styles.dashboardGrid}>
                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Recent Click Activity</h3>
                    </div>
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Deal</th>
                                    <th>Network</th>
                                    <th>Device</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentClicks.length > 0 ? (
                                    recentClicks.map(click => (
                                        <tr key={click.id}>
                                            <td>{new Date(click.timestamp).toLocaleString()}</td>
                                            <td className={styles.truncate}>{click.deal.title}</td>
                                            <td>
                                                <span className={styles.tag}>{click.network?.name || 'Manual'}</span>
                                            </td>
                                            <td>{click.device || 'Unknown'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className={styles.emptyCell}>No click data yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className={styles.panel}>
                    <div className={styles.panelHeader}>
                        <h3 className={styles.panelTitle}>Quick Actions</h3>
                    </div>
                    <div className={styles.actionList}>
                        <Link href="/admin/deals/new" className={styles.actionItem}>
                            <div className={styles.actionIcon}>+</div>
                            <div className={styles.actionText}>
                                <h4>Manually Add Deal</h4>
                                <p>Create a single high-priority affiliate deal</p>
                            </div>
                        </Link>

                        <Link href="/admin/feeds" className={styles.actionItem}>
                            <div className={styles.actionIcon}>🤖</div>
                            <div className={styles.actionText}>
                                <h4>Data Feeds Automation</h4>
                                <p>Manage active affiliate feed URLs</p>
                            </div>
                        </Link>

                        <Link href="/admin/merchants?action=new" className={styles.actionItem}>
                            <div className={styles.actionIcon}>🏪</div>
                            <div className={styles.actionText}>
                                <h4>Add Merchant</h4>
                                <p>Register a new store or restaurant</p>
                            </div>
                        </Link>

                        <Link href="/admin/networks" className={styles.actionItem}>
                            <div className={styles.actionIcon}>🔗</div>
                            <div className={styles.actionText}>
                                <h4>Add Affiliate Network</h4>
                                <p>Configure a new tracking source</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
