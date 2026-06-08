'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/us/app/ai-deals-of-america/id6768350874';

    if (pathname?.startsWith('/admin')) {
        return null;
    }
    const [zipcode, setZipcode] = useState('');
    const [zipStatus, setZipStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<{ id: string; name: string; slug: string; }[]>([]);
    const [merchants, setMerchants] = useState<{ id: string; name: string; slug: string; }[]>([]);

    useEffect(() => {
        if (!isMobileMenuOpen) return;
        
        const fetchFilters = async () => {
            try {
                const res = await fetch('/api/filters');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.categories || []);
                    setMerchants(data.merchants || []);
                }
            } catch (err) {
                console.error("Failed to load active filters", err);
            }
        };
        fetchFilters();
    }, [isMobileMenuOpen]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsMobileMenuOpen(false);
        router.push(`/deals?q=${encodeURIComponent(searchQuery.trim())}`);
    };

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
                        src="/logo-v8.png" 
                        alt="AI Deals of America Logo" 
                        width={300} 
                        height={300} 
                        style={{ width: 'auto', height: '80px', objectFit: 'contain' }} 
                        priority
                    />
                </Link>

                <form onSubmit={handleSearchSubmit} className={styles.searchBar}>
                    <input
                        type="text"
                        placeholder="Search deals, stores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                    <button type="submit" className={styles.searchBtn}>Search</button>
                </form>

                {/* App Store Download Badge and Socials beside the search bar on desktop */}
                <div className={styles.desktopHeaderActions}>
                    <a 
                        href={appStoreUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`${styles.appStoreBtn} ${styles.desktopAppStoreBtn}`}
                    >
                        <svg viewBox="0 0 170 170" width="18" height="18" className={styles.appleLogo}>
                            <path 
                                fill="currentColor" 
                                d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.92-2.38-6.74-6.86-11.46-13.43-5.07-7.07-9.42-15.66-13.06-25.79-3.63-10.13-5.46-20.14-5.46-30.04 0-15.92 4.2-29.17 12.61-39.73 8.41-10.56 18.91-15.93 31.5-16.12 4.7.07 9.8 1.47 15.3 4.19 5.49 2.72 9.07 4.07 10.72 4.07 1.27 0 5.06-1.5 11.37-4.51 6.31-3.01 12.18-4.41 17.62-4.19 14.1.62 25.1 5.89 33.01 15.82-12.13 7.37-18.1 17.51-17.9 30.4.19 10.23 4.01 18.82 11.46 25.79 7.45 6.97 16.27 10.8 26.47 11.51-2.58 7.74-5.96 15.34-10.13 22.8zM118.79 28.96c0-7.85 2.8-15.34 8.41-22.47 1.2-1.56 2.6-3.09 4.19-4.59.85-.78 1.62-1.28 2.31-1.5.17.64.29 1.54.35 2.7.07 1.16-.09 2.53-.46 4.12-1.21 5.19-3.79 10.36-7.74 15.51-3.95 5.15-8.41 9.01-13.4 11.57-1.1.58-2.14 1.02-3.12 1.33-.23-.92-.4-1.88-.49-2.88-.13-.86-.19-2.03-.19-3.5-.06.01-.06.07 0 .22z"
                            />
                        </svg>
                        <div className={styles.btnText}>
                            <span className={styles.downloadText}>Download on the</span>
                            <span className={styles.storeName}>App Store</span>
                        </div>
                    </a>

                    <div className={styles.socialHeaderLinks}>
                        <a href="https://www.facebook.com/aidealsagent/" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Facebook">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                        </a>
                        <a href="https://x.com/dealsfromGA" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Twitter / X">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="https://t.me/+qRrguIxNIHhiOTEx" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Telegram">
                            <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.46.97-.69 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.51 4.4-1.77 4.9-.17z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <nav className={styles.navLinks}>
                    <Link href="/deals" className={styles.link}>All Deals</Link>
                    <Link href="/smartphones" className={styles.link}>Phones</Link>
                    <Link href="/coupons" className={styles.link}>Coupons</Link>
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
                    <form onSubmit={handleSearchSubmit} className={styles.searchFormMobile}>
                        <input
                            type="text"
                            placeholder="Search deals, stores..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInputMobile}
                        />
                        <button type="submit" className={styles.searchBtnMobile}>Search</button>
                    </form>
                    
                    <Link href="/deals" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>All Deals</Link>
                    <Link href="/smartphones" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Phones</Link>
                    <Link href="/coupons" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Coupons</Link>
                    <Link href="/categories" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Categories</Link>
                    <Link href="/merchants" className={styles.link} onClick={() => setIsMobileMenuOpen(false)}>Popular Merchants</Link>

                    {/* Collapsible Active Categories List */}
                    {categories.length > 0 && (
                        <>
                            <div className={styles.menuDivider}></div>
                            <div className={styles.menuSection}>
                                <span className={styles.sectionHeader}>Categories</span>
                                <div className={styles.filterListMobile}>
                                    {categories.map(cat => (
                                        <Link 
                                            key={cat.id} 
                                            href={`/deals?category=${cat.id}`} 
                                            className={styles.filterLinkMobile} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Collapsible Active Stores List */}
                    {merchants.length > 0 && (
                        <>
                            <div className={styles.menuDivider}></div>
                            <div className={styles.menuSection}>
                                <span className={styles.sectionHeader}>Stores</span>
                                <div className={styles.filterListMobile}>
                                    {merchants.map(m => (
                                        <Link 
                                            key={m.id} 
                                            href={`/deals?merchant=${m.id}`} 
                                            className={styles.filterLinkMobile} 
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {m.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.menuDivider}></div>

                    {/* App Store Download Badge and Socials in Mobile Menu */}
                    <div className={styles.mobileHeaderActions}>
                        <a 
                            href={appStoreUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className={styles.appStoreBtn}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <svg viewBox="0 0 170 170" width="18" height="18" className={styles.appleLogo}>
                                <path 
                                    fill="currentColor" 
                                    d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.37-6.15-2.92-2.38-6.74-6.86-11.46-13.43-5.07-7.07-9.42-15.66-13.06-25.79-3.63-10.13-5.46-20.14-5.46-30.04 0-15.92 4.2-29.17 12.61-39.73 8.41-10.56 18.91-15.93 31.5-16.12 4.7.07 9.8 1.47 15.3 4.19 5.49 2.72 9.07 4.07 10.72 4.07 1.27 0 5.06-1.5 11.37-4.51 6.31-3.01 12.18-4.41 17.62-4.19 14.1.62 25.1 5.89 33.01 15.82-12.13 7.37-18.1 17.51-17.9 30.4.19 10.23 4.01 18.82 11.46 25.79 7.45 6.97 16.27 10.8 26.47 11.51-2.58 7.74-5.96 15.34-10.13 22.8zM118.79 28.96c0-7.85 2.8-15.34 8.41-22.47 1.2-1.56 2.6-3.09 4.19-4.59.85-.78 1.62-1.28 2.31-1.5.17.64.29 1.54.35 2.7.07 1.16-.09 2.53-.46 4.12-1.21 5.19-3.79 10.36-7.74 15.51-3.95 5.15-8.41 9.01-13.4 11.57-1.1.58-2.14 1.02-3.12 1.33-.23-.92-.4-1.88-.49-2.88-.13-.86-.19-2.03-.19-3.5-.06.01-.06.07 0 .22z"
                                />
                            </svg>
                            <div className={styles.btnText}>
                                <span className={styles.downloadText}>Download on the</span>
                                <span className={styles.storeName}>App Store</span>
                            </div>
                        </a>

                        <div className={styles.socialHeaderLinks}>
                            <a href="https://www.facebook.com/aidealsagent/" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Facebook">
                                <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                                </svg>
                            </a>
                            <a href="https://x.com/dealsfromGA" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Twitter / X">
                                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            <a href="https://t.me/+qRrguIxNIHhiOTEx" target="_blank" rel="noopener noreferrer" className={styles.socialHeaderLink} aria-label="Telegram">
                                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.46.97-.69 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.51 4.4-1.77 4.9-.17z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '0.5rem 0' }}></div>

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
