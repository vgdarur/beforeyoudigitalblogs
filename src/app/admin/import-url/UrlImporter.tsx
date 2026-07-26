'use client';

import { useState } from 'react';
import styles from './page.module.css';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Merchant {
    id: string;
    name: string;
    slug: string;
}

interface ExtractedDeal {
    id: string;
    title: string;
    description: string;
    price: number | null;
    originalPrice: number | null;
    affiliateUrl: string;
    priorityScore: number;
    isActive: boolean;
    category: {
        name: string;
    };
    merchant: {
        name: string;
    };
}

interface UrlImporterProps {
    initialCategories: Category[];
    initialMerchants: Merchant[];
}

export default function UrlImporter({ initialCategories, initialMerchants }: UrlImporterProps) {
    const [activeTab, setActiveTab] = useState<'url' | 'raw'>('url');
    const [urlInput, setUrlInput] = useState('');
    const [rawContentInput, setRawContentInput] = useState('');
    
    // Scraper status
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Extracted deals state
    const [deals, setDeals] = useState<ExtractedDeal[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Category options list
    const [categories, setCategories] = useState<Category[]>(initialCategories);

    const steps = [
        "Sending extraction request to AI agent...",
        "Querying web search tools for real-time deals...",
        "Analyzing target page content and price lists...",
        "Formatting products and category tags...",
        "Completing final data verification..."
    ];

    const startLoadingAnimations = () => {
        setIsLoading(true);
        setLoadingStep(0);
        setError(null);
        setSuccessMsg(null);

        const interval = setInterval(() => {
            setLoadingStep(prev => {
                if (prev < steps.length - 1) {
                    return prev + 1;
                }
                return prev;
            });
        }, 3000);

        return interval;
    };

    const handleExtract = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const payload: { url?: string; rawContent?: string } = {};
        if (activeTab === 'url') {
            if (!urlInput.trim()) {
                setError('Please enter a target URL.');
                return;
            }
            payload.url = urlInput.trim();
        } else {
            if (!rawContentInput.trim()) {
                setError('Please paste raw page HTML or text.');
                return;
            }
            payload.rawContent = rawContentInput.trim();
            if (urlInput.trim()) {
                payload.url = urlInput.trim(); // optional reference URL
            }
        }

        const loaderInterval = startLoadingAnimations();

        try {
            const res = await fetch('/api/admin/import/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to extract deals from this content.');
            }

            const extractedDeals: ExtractedDeal[] = await res.json();
            
            if (!extractedDeals || extractedDeals.length === 0) {
                throw new Error('No deals could be extracted. Please check the input content and try again.');
            }

            // Standardize deals structure and pre-populate missing categories in list
            const updatedDeals = extractedDeals.map(deal => {
                const dealCatName = deal.category?.name || 'General';
                // If this category is new, add it dynamically to local category options so dropdown works
                const catExists = categories.some(
                    c => c.name.toLowerCase() === dealCatName.toLowerCase()
                );
                if (!catExists) {
                    const newCat: Category = {
                        id: dealCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                        name: dealCatName,
                        slug: dealCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    };
                    setCategories(prev => [...prev, newCat]);
                }

                return {
                    ...deal,
                    title: deal.title || '',
                    description: deal.description || '',
                    price: deal.price !== undefined ? deal.price : null,
                    originalPrice: deal.originalPrice !== undefined ? deal.originalPrice : null,
                    affiliateUrl: deal.affiliateUrl || '',
                    priorityScore: deal.priorityScore || 50,
                    isActive: deal.isActive !== undefined ? deal.isActive : true,
                    category: { name: dealCatName },
                    merchant: { name: deal.merchant?.name || 'Unknown' }
                };
            });

            setDeals(updatedDeals);
            setSelectedIds(new Set(updatedDeals.map(d => d.id))); // select all by default
        } catch (err: any) {
            setError(err.message || 'An error occurred during extraction.');
            setDeals([]);
        } finally {
            clearInterval(loaderInterval);
            setIsLoading(false);
        }
    };

    const handleFieldChange = (id: string, field: keyof ExtractedDeal, value: any) => {
        setDeals(prev =>
            prev.map(deal => {
                if (deal.id === id) {
                    if (field === 'category') {
                        return { ...deal, category: { name: value } };
                    }
                    if (field === 'merchant') {
                        return { ...deal, merchant: { name: value } };
                    }
                    return { ...deal, [field]: value };
                }
                return deal;
            })
        );
    };

    const handleSelectToggle = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setSelectedIds(next);
    };

    const handleSelectAll = () => {
        if (selectedIds.size === deals.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(deals.map(d => d.id)));
        }
    };

    const handleImportSelected = async () => {
        if (selectedIds.size === 0) {
            setError('Please select at least one deal to import.');
            return;
        }

        const selectedDeals = deals.filter(d => selectedIds.has(d.id));
        setIsLoading(true);
        setLoadingStep(0);
        setError(null);
        setSuccessMsg(null);

        try {
            const payload = {
                deals: selectedDeals.map(d => ({
                    title: d.title,
                    description: d.description,
                    price: d.price ? parseFloat(d.price.toString()) : null,
                    originalPrice: d.originalPrice ? parseFloat(d.originalPrice.toString()) : null,
                    affiliateUrl: d.affiliateUrl,
                    merchantName: d.merchant.name,
                    categoryName: d.category.name,
                    isActive: d.isActive,
                    priorityScore: d.priorityScore
                }))
            };

            const res = await fetch('/api/admin/import/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save selected deals.');
            }

            const savedDeals = await res.json();
            setSuccessMsg(`Successfully imported ${savedDeals.length} deals into the database!`);
            setDeals([]); // clear deals after success
            setSelectedIds(new Set());
        } catch (err: any) {
            setError(err.message || 'An error occurred while importing deals.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Admin Deal URL Importer</h1>
                <p className={styles.subtitle}>
                    Parse active product offers from Amazon, Target, Walmart, Best Buy, and more using Claude.
                </p>
            </div>

            {error && (
                <div className={`${styles.message} ${styles.error}`}>
                    ⚠️ {error}
                </div>
            )}

            {successMsg && (
                <div className={`${styles.message} ${styles.success}`}>
                    ✅ {successMsg}
                </div>
            )}

            <div className={styles.tabs}>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'url' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('url')}
                >
                    🔗 URL Automated Fetch
                </button>
                <button
                    type="button"
                    className={`${styles.tabButton} ${activeTab === 'raw' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('raw')}
                >
                    📄 Raw Content Paste (Fail-Safe)
                </button>
            </div>

            {/* Input Form */}
            {deals.length === 0 && !isLoading && (
                <div className={styles.card}>
                    <form onSubmit={handleExtract}>
                        {activeTab === 'url' ? (
                            <div className={styles.inputGroup}>
                                <label className={styles.label} htmlFor="dealUrl">Deals Hub / Product Page URL</label>
                                <input
                                    id="dealUrl"
                                    type="url"
                                    placeholder="https://www.amazon.com/gp/savingshub?..."
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className={styles.input}
                                />
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    Claude will load the URL and extract current deals. Amazon, Walmart, Target, Home Depot, Lowe's, and Best Buy are supported.
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label} htmlFor="referenceUrl">Reference URL (Optional)</label>
                                    <input
                                        id="referenceUrl"
                                        type="url"
                                        placeholder="https://www.amazon.com/gp/savingshub"
                                        value={urlInput}
                                        onChange={(e) => setUrlInput(e.target.value)}
                                        className={styles.input}
                                    />
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        Helps Claude identify the retailer and generate accurate search links.
                                    </span>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label} htmlFor="rawContent">Pasted Text / HTML Source</label>
                                    <textarea
                                        id="rawContent"
                                        placeholder="Inspect Element or Ctrl+A -> Ctrl+C and paste the page text or HTML source code here..."
                                        value={rawContentInput}
                                        onChange={(e) => setRawContentInput(e.target.value)}
                                        className={`${styles.input} ${styles.textarea}`}
                                    />
                                    <div className={styles.howToFind}>
                                        💡 <strong>How to bypass anti-bot blocks:</strong> Go to the merchant's deals page in your browser, select everything (<code>Ctrl + A</code> / <code>Cmd + A</code>), copy it (<code>Ctrl + C</code>), and paste it directly above. Zero chances of bot detection!
                                    </div>
                                </div>
                            </>
                        )}

                        <button type="submit" className={styles.btnExtract} disabled={isLoading}>
                            Extract Deals with Claude
                        </button>
                    </form>
                </div>
            )}

            {/* Loading Spinner */}
            {isLoading && (
                <div className={styles.card}>
                    <div className={styles.loadingSection}>
                        <div className={styles.spinner}></div>
                        <div className={styles.loadingText}>
                            {deals.length === 0 ? steps[loadingStep] : "Importing deals into database..."}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Preview */}
            {deals.length > 0 && !isLoading && (
                <div>
                    <div className={styles.sectionTitle}>
                        <input
                            type="checkbox"
                            className={styles.checkbox}
                            style={{ marginRight: '0.5rem' }}
                            checked={selectedIds.size === deals.length}
                            onChange={handleSelectAll}
                            id="selectAll"
                        />
                        <label htmlFor="selectAll" style={{ cursor: 'pointer' }}>
                            Extracted Deals ({deals.length} found, {selectedIds.size} selected)
                        </label>
                    </div>

                    <div className={styles.dealsGrid}>
                        {deals.map((deal) => {
                            const isSelected = selectedIds.has(deal.id);
                            return (
                                <div
                                    key={deal.id}
                                    className={`${styles.dealCard} ${isSelected ? styles.dealCardSelected : ''}`}
                                >
                                    <div className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={isSelected}
                                            onChange={() => handleSelectToggle(deal.id)}
                                            aria-label={`Select ${deal.title}`}
                                        />
                                    </div>

                                    <div className={styles.dealForm}>
                                        <div className={styles.fullWidth}>
                                            <label className={styles.label}>Product Title</label>
                                            <input
                                                type="text"
                                                value={deal.title}
                                                onChange={(e) => handleFieldChange(deal.id, 'title', e.target.value)}
                                                className={styles.input}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={styles.label}>Store / Merchant</label>
                                            <input
                                                type="text"
                                                value={deal.merchant.name}
                                                onChange={(e) => handleFieldChange(deal.id, 'merchant', e.target.value)}
                                                className={styles.input}
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={styles.label}>Category</label>
                                            <select
                                                value={deal.category.name}
                                                onChange={(e) => handleFieldChange(deal.id, 'category', e.target.value)}
                                                className={styles.input}
                                            >
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.name}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className={styles.label}>Sale Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={deal.price !== null ? deal.price : ''}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        deal.id,
                                                        'price',
                                                        e.target.value ? parseFloat(e.target.value) : null
                                                    )
                                                }
                                                className={styles.input}
                                            />
                                        </div>

                                        <div>
                                            <label className={styles.label}>Original Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={deal.originalPrice !== null ? deal.originalPrice : ''}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        deal.id,
                                                        'originalPrice',
                                                        e.target.value ? parseFloat(e.target.value) : null
                                                    )
                                                }
                                                className={styles.input}
                                            />
                                        </div>

                                        <div>
                                            <label className={styles.label}>Priority / Heat Level</label>
                                            <select
                                                value={deal.priorityScore}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        deal.id,
                                                        'priorityScore',
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className={styles.input}
                                            >
                                                <option value={100}>Extremely High (100)</option>
                                                <option value={75}>High (75)</option>
                                                <option value={50}>Medium (50)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className={styles.label}>Is Active</label>
                                            <select
                                                value={deal.isActive ? 'true' : 'false'}
                                                onChange={(e) =>
                                                    handleFieldChange(
                                                        deal.id,
                                                        'isActive',
                                                        e.target.value === 'true'
                                                    )
                                                }
                                                className={styles.input}
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>

                                        <div className={styles.fullWidth}>
                                            <label className={styles.label}>Affiliate URL</label>
                                            <input
                                                type="url"
                                                value={deal.affiliateUrl}
                                                onChange={(e) => handleFieldChange(deal.id, 'affiliateUrl', e.target.value)}
                                                className={styles.input}
                                                required
                                            />
                                        </div>

                                        <div className={styles.fullWidth}>
                                            <label className={styles.label}>Description</label>
                                            <textarea
                                                value={deal.description}
                                                onChange={(e) => handleFieldChange(deal.id, 'description', e.target.value)}
                                                className={`${styles.input} ${styles.textarea}`}
                                                style={{ minHeight: '80px' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.footerActions}>
                        <button
                            type="button"
                            onClick={() => {
                                setDeals([]);
                                setSelectedIds(new Set());
                            }}
                            className={styles.tabButton}
                            style={{ border: '1px solid var(--border)' }}
                        >
                            Cancel / Reset
                        </button>
                        <button
                            type="button"
                            onClick={handleImportSelected}
                            className={styles.btnImport}
                            disabled={selectedIds.size === 0}
                        >
                            Import {selectedIds.size} Selected Deals
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
