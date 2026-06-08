import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContainer}`}>

                <div className={styles.brandSection}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🔥</span>
                        <span>AI Deals of America</span>
                    </div>
                    <p className={styles.description}>
                        Your ultimate destination for the best tech, fashion, and lifestyle discounts. We curate deals so you don't have to.
                    </p>
                    <div className={styles.socialLinks}>
                        <a href="https://www.facebook.com/aidealsagent/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                            </svg>
                            <span>Facebook</span>
                        </a>
                        <span className={styles.divider}>|</span>
                        <a href="https://x.com/dealsfromGA" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span>Twitter / X</span>
                        </a>
                        <span className={styles.divider}>|</span>
                        <a href="https://t.me/+qRrguIxNIHhiOTEx" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.79-.26-1.42-.4-1.37-.84.03-.23.35-.46.97-.69 3.82-1.66 6.37-2.75 7.64-3.28 3.64-1.51 4.4-1.77 4.9-.17z"/>
                            </svg>
                            <span>Telegram</span>
                        </a>
                    </div>
                    <div className={styles.disclosure}>
                        <strong>Affiliate Disclosure:</strong> AI Deals of America may earn a commission from purchases made through links on our site, at no extra cost to you. This helps support our platform.
                    </div>
                </div>

                <div className={styles.linksSection}>
                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Explore</h4>
                        <Link href="/deals" className={styles.link}>All Deals</Link>
                        <Link href="/categories" className={styles.link}>Categories</Link>
                        <Link href="/stores" className={styles.link}>Stores</Link>
                        <Link href="/blog" className={styles.link}>Blog / Guides</Link>
                    </div>

                    <div className={styles.linkColumn}>
                        <h4 className={styles.columnTitle}>Legal & Info</h4>
                        <Link href="/about" className={styles.link}>About Us</Link>
                        <Link href="/contact" className={styles.link}>Contact</Link>
                        <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.link}>Terms of Service</Link>
                    </div>
                </div>

            </div>
            <div className={styles.copyright}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} AI Deals of America. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
