'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function ImportPage() {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [importMode, setImportMode] = useState<'DEALS' | 'CAMPAIGNS'>('DEALS');
    const [networkId, setNetworkId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [networks, setNetworks] = useState<{ id: string; name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        fetch('/api/admin/networks')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setNetworks(data);
            })
            .catch(err => console.error('Error loading networks:', err));

        fetch('/api/admin/categories')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(err => console.error('Error loading categories:', err));
    }, []);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            const name = droppedFile.name.toLowerCase();
            if (droppedFile.type === 'text/csv' || name.endsWith('.csv') || name.endsWith('.txt') || name.endsWith('.tsv')) {
                setFile(droppedFile);
            } else {
                alert('Please upload a valid CSV, TSV, or TXT feed file.');
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file) {
            alert('Please select a CSV file.');
            return;
        }

        if (importMode === 'DEALS' && (!networkId || !categoryId)) {
            alert('Please select Network and Category fields for Deal Imports.');
            return;
        }

        setIsUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        if (importMode === 'DEALS') {
            formData.append('networkId', networkId);
            formData.append('categoryId', categoryId);
        }

        const endpoint = importMode === 'DEALS' ? '/api/admin/import' : '/api/admin/import-campaigns';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            setResult({ status: res.status, data });

            if (res.ok) {
                setFile(null); // Reset on success
            }
        } catch (error) {
            console.error('Import failed:', error);
            setResult({ status: 500, data: { error: 'Failed to communicate with server.' } });
        } finally {
            setIsUploading(false);
        }
    };

    // Simplified hardcoded lookup since we'd normally pass these via Server Components
    // For production this form would either:
    // A) Be a child client component receiving props from a server component
    // B) Fetch these via a quick SWR/React Query API call
    return (
        <div className={styles.importContainer}>
            <div className={styles.header}>
                <h1 className={styles.title}>Bulk Deal Import</h1>
                <p className={styles.description}>
                    Upload a CSV feed from Rakuten, CJ Affiliate, or Amazon Associates to automatically parse and load deals.
                </p>
            </div>

            <div className={styles.layout}>
                <form onSubmit={handleSubmit} className={styles.importForm}>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Import Mode</label>
                        <select
                            className={styles.select}
                            value={importMode}
                            onChange={(e) => setImportMode(e.target.value as 'DEALS' | 'CAMPAIGNS')}
                        >
                            <option value="DEALS">Standard Deal Feed (Products & Prices)</option>
                            <option value="CAMPAIGNS">Brand Campaigns (Merchants & Tracking Links)</option>
                        </select>
                        <p className={styles.helpText}>Choose which type of Impact API file you are uploading.</p>
                    </div>

                    {importMode === 'DEALS' && (
                        <>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Select Network Source</label>
                                <select
                                    className={styles.select}
                                    value={networkId}
                                    onChange={(e) => setNetworkId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Network --</option>
                                    {networks.map(n => (
                                        <option key={n.id} value={n.id}>{n.name}</option>
                                    ))}
                                </select>
                                <p className={styles.helpText}>Used to attribute analytics clicks.</p>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Default Category Fallback</label>
                                <select
                                    className={styles.select}
                                    value={categoryId}
                                    onChange={(e) => setCategoryId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Default Category --</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <p className={styles.helpText}>Applied if the CSV parser cannot intelligently categorize the item.</p>
                            </div>
                        </>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>CSV Feed File</label>

                        <div
                            className={`${styles.dropzone} ${isDragging ? styles.dragActive : ''} ${file ? styles.hasFile : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className={styles.dropContent}>
                                <span className={styles.dropIcon}>📄</span>
                                {file ? (
                                    <div className={styles.fileInfo}>
                                        <span className={styles.fileName}>{file.name}</span>
                                        <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                                        <button type="button" onClick={() => setFile(null)} className={styles.removeFileBtn}>
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className={styles.dropText}>Drag & drop your feed file here</p>
                                        <span className={styles.dropSecondary}>or</span>
                                        <label className={styles.browseBtn}>
                                            Browse Files
                                            <input
                                                type="file"
                                                accept=".csv,.txt,.tsv"
                                                className={styles.fileInput}
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={!file || (importMode === 'DEALS' && (!networkId || !categoryId)) || isUploading}
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
                                Upload a file to see processing results.
                            </div>
                        )}

                        {isUploading && (
                            <div className={styles.uploadingState}>
                                <div className={styles.spinner}></div>
                                <p>Processing CSV and importing to database...</p>
                                <small>This may take a minute for large files.</small>
                            </div>
                        )}

                        {result && result.status === 200 && (
                            <div className={styles.successState}>
                                <div className={styles.successIcon}>✓</div>
                                <h4>Import Complete</h4>
                                <div className={styles.statsRow}>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Found</span>
                                        <span className={styles.statNum}>{result.data.itemsFound}</span>
                                    </div>
                                    <div className={styles.statBox}>
                                        <span className={styles.statLabel}>Imported</span>
                                        <span className={styles.statNum + ' ' + styles.textSuccess}>
                                            {result.data.itemsImported}
                                        </span>
                                    </div>
                                </div>

                                {result.data.errors && result.data.errors.length > 0 && (
                                    <div className={styles.errorLog}>
                                        <h5>Warnings / Skipped Rows:</h5>
                                        <ul>
                                            {result.data.errors.map((err: string, i: number) => (
                                                <li key={i}>{err}</li>
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
