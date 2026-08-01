'use client';

import { useState, useEffect } from 'react';
import styles from '../import/page.module.css'; // Reuse styles from bulk import page

export default function ImportAsinPage() {
    const [asinsText, setAsinsText] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error('Error loading categories:', err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!asinsText.trim()) {
            alert('Please enter at least one ASIN.');
            return;
        }

        if (!categoryId) {
            alert('Please select a Category.');
            return;
        }

        const asinsList = asinsText
            .split(/[\n,]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (asinsList.length === 0) {
            alert('No valid ASINs found.');
            return;
        }
        
        if (asinsList.length > 50) {
            alert('Please limit to 50 ASINs per batch.');
            return;
        }

        setIsUploading(true);
        setResult(null);

        try {
            const res = await fetch('/api/admin/import-asin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asins: asinsList, categoryId })
            });

            const data = await res.json();
            setResult({ status: res.status, data });

            if (res.ok) {
                setAsinsText(''); // Clear on success
            }
        } catch (error) {
            console.error('Import failed:', error);
            setResult({ status: 500, data: { error: 'Failed to communicate with server.' } });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className={styles.importContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Bulk Amazon ASIN Import</h1>
                <p className={styles.description}>
                    Paste a list of Amazon ASINs (or full links) below. The system will automatically fetch product details and create Deals in the database.
                </p>
            </div>

            <div className={styles.layout}>
                <form onSubmit={handleSubmit} className={styles.importForm}>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Select Category</label>
                        <select
                            className={styles.select}
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">-- Choose Category --</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <p className={styles.helpText}>All imported ASINs will be assigned to this category.</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>ASINs or Amazon Links</label>
                        <textarea
                            style={{ width: '100%', minHeight: '200px', padding: '1rem', borderRadius: '4px', border: '1px solid #d1d5db' }}
                            value={asinsText}
                            onChange={(e) => setAsinsText(e.target.value)}
                            placeholder="B00XMLE9BA\nB08XYZ1234\nhttps://amazon.com/dp/B00YYYYYY"
                            required
                        />
                        <p className={styles.helpText}>Enter one ASIN or Link per line (Max 50 per batch).</p>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={!asinsText.trim() || !categoryId || isUploading}
                    >
                        {isUploading ? 'Processing Import...' : 'Start Bulk Import'}
                    </button>
                </form>

                {/* Results Panel */}
                <div className={styles.resultsPanel}>
                    <div className={styles.panelHeader}>
                        <h3>Import Status</h3>
                    </div>
                    <div className={styles.panelContent}>
                        {!result && !isUploading && (
                            <div className={styles.emptyState}>
                                Enter ASINs and click Import to begin.
                            </div>
                        )}

                        {isUploading && (
                            <div className={styles.uploadingState}>
                                <div className={styles.spinner}></div>
                                <p>Fetching data from Amazon and creating deals...</p>
                                <small>This may take a minute for multiple ASINs.</small>
                            </div>
                        )}

                        {result && result.status === 200 && (
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>✓</div>
                                <h4>Import Complete</h4>
                                <div className={styles.statsRow}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Successfully Imported</span>
                                        <span className={styles.statNum + ' ' + styles.textSuccess}>
                                            {result.data.successCount}
                                        </span>
                                    </div>
                                </div>

                                {result.data.results && result.data.results.length > 0 && (
                                    <div className={styles.errorLog} style={{ marginTop: '1rem' }}>
                                        <h5>Details:</h5>
                                        <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                            {result.data.results.map((r: any, i: number) => (
                                                <li key={i} style={{ color: r.status === 'success' ? 'green' : 'red' }}>
                                                    <strong>{r.asin}:</strong> {r.message}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}

                        {result && result.status !== 200 && (
                            <div className={styles.errorState}>
                                <div className={styles.errorIcon}>!</div>
                                <h4>Import Failed</h4>
                                <p>{result.data.error || 'Server error occurred'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
