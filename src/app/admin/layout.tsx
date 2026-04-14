'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';
import { LogoutButton } from './LogoutButton';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={styles.adminLayout}>
            {/* Dark overlay for mobile when menu is open */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)} 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 35 }}
                />
            )}
            
            <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/admin" className={styles.logo} onClick={() => setIsSidebarOpen(false)}>
                        🔥 Dealsagent Admin
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Dashboard Overview
                    </Link>
                    <Link href="/admin/deals" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Deals Dashboard
                    </Link>
                    <Link href="/admin/import" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Bulk Import
                    </Link>
                    <Link href="/admin/requirements" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Requirements
                    </Link>
                    <div className={styles.divider}></div>
                    <Link href="/admin/merchants" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Merchants
                    </Link>
                    <Link href="/admin/categories" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Categories
                    </Link>
                    <Link href="/admin/networks" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Networks
                    </Link>
                    <Link href="/admin/users" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
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
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button className={styles.adminBurger} onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            ☰
                        </button>
                        <h2 className={styles.pageTitle}>Administration Portal</h2>
                    </div>
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
