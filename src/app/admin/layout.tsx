import Link from 'next/link';
import styles from './page.module.css';
import { LogoutButton } from './LogoutButton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo}>
                        🔥 Dealsagent Admin
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navLink}>
                        Dashboard Overview
                    </Link>
                    <Link href="/admin/deals" className={styles.navLink}>
                        Deals Dashboard
                    </Link>
                    <Link href="/admin/import" className={styles.navLink}>
                        Bulk Import
                    </Link>
                    <div className={styles.divider}></div>
                    <Link href="/admin/merchants" className={styles.navLink}>
                        Merchants
                    </Link>
                    <Link href="/admin/networks" className={styles.navLink}>
                        Networks
                    </Link>
                    <Link href="/admin/users" className={styles.navLink}>
                        Users & Roles
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>A</div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Admin User</span>
                            <span className={styles.userRole}>Superadmin</span>
                        </div>
                    </div>
                    <LogoutButton />
                </div>
            </aside>

            <main className={styles.mainContent}>
                <header className={styles.topbar}>
                    <h2 className={styles.pageTitle}>Administration Portal</h2>
                    <div className={styles.topbarActions}>
                        <Link href="/" className={styles.viewSiteBtn} target="_blank">
                            View Live Site ↗
                        </Link>
                    </div>
                </header>

                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
