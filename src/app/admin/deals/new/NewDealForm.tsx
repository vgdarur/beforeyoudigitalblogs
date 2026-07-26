'use client';

import { useState } from 'react';
import styles from './page.module.css';

type Option = {
    id: string;
    name: string;
};

type Props = {
    categories: Option[];
    networks: Option[];
    initialValues: {
        title: string;
        affiliateUrl: string;
        description: string;
        price: string;
        imageUrl: string;
        merchantName: string;
    };
};

export default function NewDealForm({ categories, networks, initialValues }: Props) {
    const [asin, setAsin] = useState('');
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [lookupError, setLookupError] = useState('');

    // Form field states
    const [title, setTitle] = useState(initialValues.title);
    const [affiliateUrl, setAffiliateUrl] = useState(initialValues.affiliateUrl);
    const [description, setDescription] = useState(initialValues.description);
    const [price, setPrice] = useState(initialValues.price);
    const [originalPrice, setOriginalPrice] = useState('');
    const [imageUrl, setImageUrl] = useState(initialValues.imageUrl);
    const [merchantName, setMerchantName] = useState(initialValues.merchantName);
    
    // Non-state fields can just be uncontrolled
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [networkId, setNetworkId] = useState('');

    const handleAsinLookup = async () => {
        if (!asin.trim()) {
            setLookupError('Please enter an ASIN first.');
            return;
        }

        setIsLookingUp(true);
        setLookupError('');

        try {
            const res = await fetch('/api/admin/amazon/lookup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asin })
            });

            const data = await res.json();
            
            if (res.ok && data.success) {
                const prod = data.product;
                setTitle(prod.title || '');
                setAffiliateUrl(prod.detailUrl || '');
                setDescription(prod.description || '');
                setPrice(prod.price ? prod.price.toString() : '');
                setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
                setImageUrl(prod.imageUrl || '');
                setMerchantName('Amazon');
                
                // Auto-select Amazon network
                const amazonNetwork = networks.find(n => n.name.toLowerCase().includes('amazon'));
                if (amazonNetwork) {
                    setNetworkId(amazonNetwork.id);
                }
                
                // Find or suggest category based on product category from API, fallback to electronics/shopping
                const matchedCategory = categories.find(c => 
                    (prod.category && c.name.toLowerCase().includes(prod.category.toLowerCase())) ||
                    c.name.toLowerCase().includes('shopping') || 
                    c.name.toLowerCase().includes('electronics') ||
                    c.name.toLowerCase().includes('grocery')
                );
                if (matchedCategory) {
                    setCategoryId(matchedCategory.id);
                }
            } else {
                setLookupError(data.error || 'Failed to fetch details from Amazon.');
            }
        } catch (err: any) {
            setLookupError('Connection error: ' + err.message);
        } finally {
            setIsLookingUp(false);
        }
    };

    return (
        <div>
            {/* Amazon ASIN Lookup Bar */}
            <div className={styles.formCard} style={{ marginBottom: '1.5rem', border: '1px solid #b3c5e6', background: '#f0f5ff' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0b3d91', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>🔌</span> Amazon PA-API Auto-Fill Helper
                </h3>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#475569' }}>
                    Enter an Amazon ASIN (e.g. <code>B0CHX2F125</code>) to instantly pull the product title, image, description, price, and your affiliate link.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        type="text" 
                        placeholder="e.g. B0CHX2F125" 
                        value={asin}
                        onChange={e => setAsin(e.target.value)}
                        className={styles.input}
                        style={{ maxWidth: '300px' }}
                    />
                    <button 
                        type="button" 
                        onClick={handleAsinLookup}
                        disabled={isLookingUp}
                        className={styles.btnSubmit}
                        style={{ width: 'auto', background: '#0b3d91' }}
                    >
                        {isLookingUp ? 'Fetching...' : 'Fetch Amazon Details'}
                    </button>
                </div>
                {lookupError && (
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: '#dc2626', fontWeight: 'bold' }}>
                        ⚠️ {lookupError}
                    </p>
                )}
            </div>

            <div className={styles.formCard}>
                <form action="/api/admin/deals/create" method="POST" className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Deal Title *</label>
                        <input 
                            type="text" 
                            name="title" 
                            required 
                            value={title} 
                            onChange={e => setTitle(e.target.value)} 
                            placeholder="e.g. 50% Off Sony Headphones" 
                            className={styles.input} 
                        />
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Affiliate Link *</label>
                        <input 
                            type="url" 
                            name="affiliateUrl" 
                            required 
                            value={affiliateUrl} 
                            onChange={e => setAffiliateUrl(e.target.value)} 
                            placeholder="https://..." 
                            className={styles.input} 
                        />
                        <span className={styles.helperText}>The raw destination or affiliate network tracking link.</span>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label className={styles.label}>Description</label>
                        <textarea 
                            name="description" 
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                            placeholder="Optional details about this promotion..." 
                            className={styles.textarea}
                        ></textarea>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Sale Price (USD)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="price" 
                            value={price} 
                            onChange={e => setPrice(e.target.value)} 
                            placeholder="199.99" 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Original Price (USD)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            name="originalPrice" 
                            value={originalPrice} 
                            onChange={e => setOriginalPrice(e.target.value)} 
                            placeholder="399.99" 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image URL</label>
                        <input 
                            type="url" 
                            name="imageUrl" 
                            value={imageUrl} 
                            onChange={e => setImageUrl(e.target.value)} 
                            placeholder="https://.../image.jpg" 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>YouTube Video URL</label>
                        <input 
                            type="url" 
                            name="youtubeUrl" 
                            value={youtubeUrl} 
                            onChange={e => setYoutubeUrl(e.target.value)} 
                            placeholder="https://youtube.com/watch?v=..." 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Coupon Code</label>
                        <input 
                            type="text" 
                            name="couponCode" 
                            value={couponCode} 
                            onChange={e => setCouponCode(e.target.value)} 
                            placeholder="e.g. SAVE50" 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Merchant / Store *</label>
                        <input 
                            type="text" 
                            name="merchantName" 
                            required 
                            value={merchantName} 
                            onChange={e => setMerchantName(e.target.value)} 
                            placeholder="e.g. Amazon, Best Buy" 
                            className={styles.input} 
                        />
                        <span className={styles.helperText}>If string does not exist, system will create a new one.</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Expiration Date</label>
                        <input 
                            type="datetime-local" 
                            name="expirationDate" 
                            value={expirationDate} 
                            onChange={e => setExpirationDate(e.target.value)} 
                            className={styles.input} 
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Category *</label>
                        <select 
                            name="categoryId" 
                            required 
                            value={categoryId} 
                            onChange={e => setCategoryId(e.target.value)} 
                            className={styles.select}
                        >
                            <option value="">Select Category...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Affiliate Network (Optional)</label>
                        <select 
                            name="networkId" 
                            value={networkId} 
                            onChange={e => setNetworkId(e.target.value)} 
                            className={styles.select}
                        >
                            <option value="">Select Network...</option>
                            {networks.map(net => (
                                <option key={net.id} value={net.id}>{net.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.actions} ${styles.fullWidth}`}>
                        <a href="/admin" className={styles.btnCancel}>Cancel</a>
                        <button type="submit" className={styles.btnSubmit}>Create Deal</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
