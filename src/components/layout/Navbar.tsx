'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [zipcode, setZipcode] = useState('');
    const [zipStatus, setZipStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleZipSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!zipcode || zipcode.length < 5) return;
        setZipStatus('saving');
        try {
            await fetch('/api/location', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zipcode })
            });
            setZipStatus('saved');
            setTimeout(() => setZipStatus('idle'), 3000);
        } catch {
            setZipStatus('idle');
        }
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    <Image 
                        src="/logo.jpg" 
                        alt="Dealsagent Logo" 
                        width={120} 
                        height={120} 
                        style={{ width: 'auto', height: '54px', objectFit: 'contain', borderRadius: '8px' }} 
                        priority
                    />
                </Link>

                <div className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search deals, stores, categories..."
                        className={styles.searchInput}
                    />
                    <button className={styles.searchBtn}>Search</button>
                </div>

                <form onSubmit={handleZipSubmit} style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--surface-hover)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                    <input 
                        type="text" 
                        maxLength={5}
                        placeholder="Zip Code" 
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value.replace(/\D/g, ''))}
                        style={{ width: '80px', padding: '0.5rem', border: 'none', background: 'transparent', outline: 'none', textAlign: 'center', fontSize: '0.9rem', color: 'var(--foreground)' }}
                    />
                    <button type="submit" disabled={zipStatus === 'saving'} style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {zipStatus === 'saving' ? '...' : zipStatus === 'saved' ? '✓' : 'Set'}
                    </button>
                </form>

                <nav className={styles.navLinks}>
                    <Link href="/deals" className={styles.link}>All Deals</Link>
                    <Link href="/categories" className={styles.link}>Categories</Link>

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
                        <Link href="/login" className={styles.link}>Sign In</Link>
                    )}
                </nav>
                <button className={styles.burgerBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {isMobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    <input
                        type="text"
                        placeholder="Search deals, stores, categories..."
                        className={styles.searchInput}
                        style={{ backgroundColor: 'var(--surface-hover)', width: '100%', border: '1px solid var(--border)' }}
                    />
                    <Link href="/deals" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>All Deals</Link>
                    <Link href="/categories" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                    <Link href="/merchants" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Popular Merchants</Link>

                    {session ? (
                        <>
                            {session.user && (session.user as any).role === 'ADMIN' && (
                                <Link href="/admin/dashboard" className={styles.link} style={{ color: 'var(--primary)' }} onClick={() => setIsMobileMenuOpen(false)}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => { signOut({ callbackUrl: '/' }); setIsMobileMenuOpen(false); }}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    textAlign: 'left',
                                    padding: 0
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                    )}
                </div>
            )}
        </header>
    );
}
