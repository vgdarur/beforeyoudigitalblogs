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
