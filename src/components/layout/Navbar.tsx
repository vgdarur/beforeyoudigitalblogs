'use client';

import Link from 'next/link';
import styles from './Navbar.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>🔥</span>
                    <span className={styles.logoText}>Dealsagent</span>
                </Link>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search deals, stores, categories..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchBtn}>Search</button>
                </div>

                <nav className={styles.navLinks}>
                    <Link href="/deals" className={styles.link}>All Deals</Link>
                    <Link href="/categories" className={styles.link}>Categories</Link>
                    <Link href="/stores" className={styles.link}>Stores</Link>

                    <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border)', margin: '0 0.5rem' }}></div>

                    {session ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {session.user && (session.user as any).role === 'ADMIN' && (
                                <Link href="/admin/dashboard" className={styles.link} style={{ color: 'var(--primary)' }}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => signIn()}
                            style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.5rem 1rem',
                                border: 'none',
                                borderRadius: 'var(--radius-sm)',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Sign In
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}
