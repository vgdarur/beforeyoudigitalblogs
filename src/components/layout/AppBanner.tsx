'use client';

import { useState, useEffect } from 'react';
import styles from './AppBanner.module.css';

export default function AppBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isApple, setIsApple] = useState(false);
    const [isDismissing, setIsDismissing] = useState(false);

    // Read App Store URL from environment variable or use a fallback
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/us/app/ai-deals-of-america/id6768350874';

    useEffect(() => {
        // Check if user dismissed the banner before
        const isDismissed = localStorage.getItem('appBannerDismissed');
        if (isDismissed === 'true') {
            return;
        }

        // Detect Apple devices (iPhone, iPad, iPod)
        const ua = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(ua);
        
        // Handle iPadOS on Safari 13+ (which reports as Macintosh but has maxTouchPoints)
        const isMacTouch = /macintosh/.test(ua) && navigator.maxTouchPoints > 0;
        
        if (isIOS || isMacTouch) {
            setIsApple(true);
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, []);

    const handleDismiss = () => {
        setIsDismissing(true);
        // Wait for the slide-up animation to complete before unmounting
        setTimeout(() => {
            localStorage.setItem('appBannerDismissed', 'true');
            setIsVisible(false);
        }, 300); // matches the animation duration in CSS
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.bannerContainer} ${isDismissing ? styles.dismissing : ''}`}>
            <div className={`container ${styles.bannerInner}`}>
                <div className={styles.infoSection}>
                    <span className={styles.phoneIcon} role="img" aria-label="smartphone">📱</span>
                    <p className={styles.bannerText}>
                        {isApple ? (
                            <>
                                <strong>Get the iOS App!</strong> Experience the best of AI Deals of America on your iPhone.
                            </>
                        ) : (
                            <>
                                <strong>AI Deals is on iOS!</strong> Download our official app on the Apple App Store today.
                            </>
                        )}
                    </p>
                </div>
                
                <div className={styles.actionSection}>
                    <a 
                        href={appStoreUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.appStoreBtn}
                        aria-label="Download on the App Store"
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

                    <button 
                        onClick={handleDismiss} 
                        className={styles.closeBtn}
                        aria-label="Dismiss banner"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}
