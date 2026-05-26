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

                <div style={{ marginTop: '30px', gridColumn: '1 / -1', background: '#f5f0e8', color: '#0e0d0b', fontFamily: '"DM Sans", sans-serif', padding: '40px', borderRadius: '8px', borderTop: '4px solid #c8501a' }}>
                    <h2 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '2rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-0.02em' }}>
                        $25K Roadmap <em style={{ fontStyle: 'italic', color: '#d4a632' }}>Strategy</em>
                    </h2>
                    
                    <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '25px', color: '#2a2820' }}>
                        <span style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '3.5rem', fontWeight: 900, float: 'left', lineHeight: 0.75, marginRight: '0.15em', marginTop: '0.1em', color: '#c8501a' }}>T</span>his is absolutely achievable with $25K, and I can help you build the entire system. Let me lay out the full roadmap first, then we'll build the dashboard together. Here's how this all works together with $25K:
                    </p>

                    <div style={{ borderLeft: '4px solid #c8501a', margin: '30px 0', padding: '20px 25px', background: '#ede7d6' }}>
                        <p style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.3rem', fontStyle: 'italic', lineHeight: 1.4, margin: 0, color: '#0e0d0b' }}>
                            "The best resellers don't work harder — they build systems earlier. Your first 90 days are about learning. After that, everything is about leverage."
                        </p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a6b4a', marginBottom: '8px' }}>The core strategy</h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#2a2820' }}>Start with Amazon FBA retail arbitrage and online arbitrage (buying discounted branded goods and reselling on Amazon). This has the lowest barrier to entry because Amazon handles storage, packing, and shipping. Simultaneously run TikTok Shop where you can dropship or sell the same inventory, since TikTok's algorithm gives organic reach that reduces your ad spend early on.</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a6b4a', marginBottom: '8px' }}>Why these categories</h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#2a2820' }}>The product cards above are chosen specifically because they're lightweight (lower FBA fees), photogenic for TikTok content, and have proven repeat-purchase patterns. Kitchen gadgets and beauty especially go viral on TikTok, which can clear your inventory fast.</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a6b4a', marginBottom: '8px' }}>The break-even math</h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#2a2820' }}>On a typical FBA product at $25 retail with $8 COGS, your margin after FBA fees (~$5–7) and PPC (~$3–4) is around $6–10 per unit. To break even on $15K inventory spend you'd need roughly 1,500–2,500 units sold. With 3–5 solid products running, most sellers hit this in months 3–5.</p>
                    </div>

                    <div style={{ marginBottom: '20px', background: '#fff', border: '1px solid #c5bfb0', padding: '20px', position: 'relative' }}>
                        <span style={{ position: 'absolute', top: '-1px', left: '-1px', background: '#c8501a', color: '#fff', fontFamily: '"Playfair Display", Georgia, serif', fontSize: '0.85rem', fontWeight: 700, padding: '3px 10px', letterSpacing: '0.05em' }}>WARNING</span>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.2rem', fontWeight: 700, margin: '15px 0 10px 0' }}>The biggest beginner mistake</h3>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: '#2a2820' }}>Avoid buying too much of one product before validating demand. Start with 100–200 units per SKU, test, then reorder winners. Your $10K inventory budget across 4–5 products at 150 units each is the right move.</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: '1.25rem', fontWeight: 700, color: '#1a6b4a', marginBottom: '8px' }}>Tools you'll need from day one</h3>
                        <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#2a2820' }}>Jungle Scout or Helium 10 for product research (~$50/mo), Seller Central (your Amazon account), and TikTok Shop Seller Center (free). That's it to start.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
