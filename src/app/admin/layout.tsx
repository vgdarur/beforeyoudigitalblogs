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
                        🔥 AI Deals of America Admin
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
                    <Link href="/admin/import-url" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Import from URL
                    </Link>
                    <Link href="/admin/news" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        News Ticker (iOS)
                    </Link>
                    <Link href="/admin/requirements" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Requirements
                    </Link>
                    <Link href="/admin/playbook" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Growth Playbook
                    </Link>
                    <Link href="/admin/feeds" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Automated Feeds
                    </Link>
                    <Link href="/admin/scraper-rules" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Scraper Rules
                    </Link>
                    <Link href="/admin/blogs" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Blogs
                    </Link>
                    <Link href="/admin/reseller-blog" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Reseller Blog
                    </Link>
                    <Link href="/admin/marketing" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Marketing Center
                    </Link>
                    <Link href="/admin/supplier-outreach" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Supplier Outreach
                    </Link>
                    <Link href="/admin/import-export-guide" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Import Export Guide
                    </Link>
                    <Link href="/admin/life-insurance-guide" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Life Insurance Guide
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
                    <Link href="/admin/messages" className={styles.navLink} onClick={() => setIsSidebarOpen(false)}>
                        Support Messages
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
