'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './CouponCard.module.css';

type CouponProps = {
    deal: {
        title: string;
        description: string;
        couponCode: string | null;
        affiliateUrl: string;
        merchant: {
            name: string;
            logoUrl: string | null;
        }
    }
};

export default function CouponCard({ deal }: CouponProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (deal.couponCode) {
            navigator.clipboard.writeText(deal.couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const hasCode = deal.couponCode && deal.couponCode.trim() !== '';

    return (
        <article className={styles.couponCard}>
            {/* Merchant Identity */}
            {deal.merchant.logoUrl ? (
                <img 
                    src={deal.merchant.logoUrl} 
                    alt={deal.merchant.name} 
                    className={styles.merchantLogo}
                    onError={(e) => {
                        // Fallback to initials if image fails
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.removeAttribute('style');
                    }}
                />
            ) : null}
            
            <div 
                className={styles.merchantInitials}
                style={{ display: deal.merchant.logoUrl ? 'none' : 'flex' }}
            >
                {deal.merchant.name.substring(0, 2).toUpperCase()}
            </div>

            {/* Deal Info */}
            <div className={styles.content}>
                <div className={styles.merchantName}>{deal.merchant.name}</div>
                <h3 className={styles.title}>{deal.title}</h3>
                <p className={styles.description}>{deal.description}</p>
            </div>

            {/* Action Area */}
            <div className={styles.actionArea}>
                {hasCode ? (
                    <div 
                        className={`${styles.codeBox} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                        title="Click to Copy code"
                    >
                        {copied ? 'COPIED!' : deal.couponCode}
                    </div>
                ) : (
                    <div className={styles.codeBox} style={{ fontSize: '1rem' }} onClick={() => window.open(deal.affiliateUrl, '_blank')}>
                        NO CODE NEEDED
                    </div>
                )}
                
                <a 
                    href={`/api/go/${deal.merchant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.shopLink}
                >
                    {hasCode ? 'Copy & Shop →' : 'Shop Deal →'}
                </a>
            </div>
        </article>
    );
}
