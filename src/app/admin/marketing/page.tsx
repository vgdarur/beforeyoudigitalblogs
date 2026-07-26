'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

type Deal = {
    id: string;
    title: string;
    slug: string;
    price: number | null;
    originalPrice: number | null;
    couponCode: string | null;
    description: string | null;
    affiliateUrl: string;
    merchant?: { name: string } | null;
};

type Drafts = {
    telegram: string;
    reddit: { title: string; body: string };
    twitter: string;
    facebook: string;
    andhrafriends: { title: string; body: string };
};

type PublishStatus = {
    status: 'idle' | 'loading' | 'success' | 'error';
    message?: string;
};

export default function MarketingPage() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
    const [isLoadingDeals, setIsLoadingDeals] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'telegram' | 'reddit' | 'twitter' | 'facebook' | 'andhrafriends'>('telegram');
    const [drafts, setDrafts] = useState<Drafts | null>(null);
    
    // Form fields for editing drafts
    const [tgText, setTgText] = useState('');
    const [redditTitle, setRedditTitle] = useState('');
    const [redditText, setRedditText] = useState('');
    const [twitterText, setTwitterText] = useState('');
    const [fbText, setFbText] = useState('');
    const [afTitle, setAfTitle] = useState('');
    const [afText, setAfText] = useState('');

    const [publishStatus, setPublishStatus] = useState<Record<string, PublishStatus>>({
        telegram: { status: 'idle' },
        reddit: { status: 'idle' },
        twitter: { status: 'idle' },
        facebook: { status: 'idle' },
        andhrafriends: { status: 'idle' }
    });

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        setIsLoadingDeals(true);
        try {
            const res = await fetch('/api/admin/marketing/deals');
            if (res.ok) {
                const data = await res.json();
                setDeals(data.deals || []);
                if (data.deals?.length > 0) {
                    setSelectedDeal(data.deals[0]);
                }
            }
        } catch (err) {
            console.error('Failed to load manual deals:', err);
        } finally {
            setIsLoadingDeals(false);
        }
    };

    const handleGenerateDrafts = async () => {
        if (!selectedDeal) return;
        setIsGenerating(true);
        setDrafts(null);
        // Reset status
        setPublishStatus({
            telegram: { status: 'idle' },
            reddit: { status: 'idle' },
            twitter: { status: 'idle' },
            facebook: { status: 'idle' },
            andhrafriends: { status: 'idle' }
        });

        try {
            const res = await fetch('/api/admin/marketing/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealId: selectedDeal.id })
            });

            if (res.ok) {
                const data = await res.json();
                const d = data.drafts as Drafts;
                setDrafts(d);
                
                // Pre-populate input fields
                setTgText(d.telegram || '');
                setRedditTitle(d.reddit?.title || '');
                setRedditText(d.reddit?.body || '');
                setTwitterText(d.twitter || '');
                setFbText(d.facebook || '');
                setAfTitle(d.andhrafriends?.title || '');
                setAfText(d.andhrafriends?.body || '');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to generate drafts from Gemini.');
            }
        } catch (err: any) {
            alert('Error calling generation service: ' + err.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async (platform: 'telegram' | 'reddit' | 'twitter' | 'facebook' | 'andhrafriends') => {
        setPublishStatus(prev => ({
            ...prev,
            [platform]: { status: 'loading' }
        }));

        let title = '';
        let content = '';
        const link = selectedDeal ? `https://aidealsofamerica.com/deals/${selectedDeal.slug}` : '';

        if (platform === 'telegram') content = tgText;
        if (platform === 'reddit') { title = redditTitle; content = redditText; }
        if (platform === 'twitter') content = twitterText;
        if (platform === 'facebook') content = fbText;
        if (platform === 'andhrafriends') { title = afTitle; content = afText; }

        try {
            const res = await fetch('/api/admin/marketing/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, title, content, link })
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setPublishStatus(prev => ({
                    ...prev,
                    [platform]: { status: 'success', message: data.message }
                }));
            } else {
                setPublishStatus(prev => ({
                    ...prev,
                    [platform]: { status: 'error', message: data.error || 'Failed to post' }
                }));
            }
        } catch (err: any) {
            setPublishStatus(prev => ({
                ...prev,
                [platform]: { status: 'error', message: err.message }
            }));
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Affiliate Marketing Center</h1>
                <p className={styles.subtitle}>Automate your deal distribution on Telegram, Reddit, Twitter, Facebook, and Andhrafriends Deals forum.</p>
            </header>

            <div className={styles.grid}>
                {/* Left Column: Select Deal */}
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Select Manual Deal</h3>
                    {isLoadingDeals ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className={styles.spinner}></div>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>Loading active deals...</p>
                        </div>
                    ) : deals.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'center' }}>No active manual deals found.</p>
                    ) : (
                        <ul className={styles.dealList}>
                            {deals.map(deal => (
                                <li 
                                    key={deal.id} 
                                    className={`${styles.dealItem} ${selectedDeal?.id === deal.id ? styles.dealItemActive : ''}`}
                                    onClick={() => {
                                        setSelectedDeal(deal);
                                        setDrafts(null);
                                    }}
                                >
                                    <h4 className={styles.dealItemTitle}>{deal.title}</h4>
                                    <div className={styles.dealItemMeta}>
                                        <span>{deal.merchant?.name || 'Retailer'}</span>
                                        <span style={{ fontWeight: 'bold' }}>{deal.price ? `$${deal.price}` : 'Special'}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Right Column: Execution Area */}
                <div className={styles.card}>
                    {selectedDeal ? (
                        <div>
                            <div className={styles.dealDetailHeader}>
                                <div>
                                    <h2 className={styles.dealDetailTitle}>{selectedDeal.title}</h2>
                                    <div className={styles.dealDetailMeta}>
                                        <span className={`${styles.badge} ${styles.badgePrimary}`}>{selectedDeal.merchant?.name || 'Retailer'}</span>
                                        <span className={`${styles.badge} ${styles.badgeSuccess}`}>{selectedDeal.price ? `Sale: $${selectedDeal.price}` : 'Special Offer'}</span>
                                        {selectedDeal.couponCode && (
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Code: <b>{selectedDeal.couponCode}</b></span>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    className={styles.generateBtn} 
                                    onClick={handleGenerateDrafts}
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className={styles.spinner}></span>
                                            Generating Drafts...
                                        </>
                                    ) : (
                                        <>
                                            <span>🤖</span>
                                            Generate AI Drafts
                                        </>
                                    )}
                                </button>
                            </div>

                            {drafts ? (
                                <div className={styles.tabContainer}>
                                    <div className={styles.tabs}>
                                        <button className={`${styles.tab} ${activeTab === 'telegram' ? styles.tabActive : ''}`} onClick={() => setActiveTab('telegram')}>Telegram</button>
                                        <button className={`${styles.tab} ${activeTab === 'reddit' ? styles.tabActive : ''}`} onClick={() => setActiveTab('reddit')}>Reddit</button>
                                        <button className={`${styles.tab} ${activeTab === 'twitter' ? styles.tabActive : ''}`} onClick={() => setActiveTab('twitter')}>Twitter/X</button>
                                        <button className={`${styles.tab} ${activeTab === 'facebook' ? styles.tabActive : ''}`} onClick={() => setActiveTab('facebook')}>Facebook</button>
                                        <button className={`${styles.tab} ${activeTab === 'andhrafriends' ? styles.tabActive : ''}`} onClick={() => setActiveTab('andhrafriends')}>Andhrafriends</button>
                                    </div>

                                    {/* Telegram Tab */}
                                    {activeTab === 'telegram' && (
                                        <div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Post Body (Supports HTML tags like &lt;b&gt;, &lt;i&gt;, &lt;a&gt;)</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    value={tgText} 
                                                    onChange={e => setTgText(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.publishActionRow}>
                                                <button 
                                                    className={`${styles.publishBtn} ${styles.telegramBtn}`}
                                                    onClick={() => handlePublish('telegram')}
                                                    disabled={publishStatus.telegram.status === 'loading'}
                                                >
                                                    Publish to Telegram
                                                </button>
                                                <PublishStatusIndicator status={publishStatus.telegram} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Reddit Tab */}
                                    {activeTab === 'reddit' && (
                                        <div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Post Title</label>
                                                <input 
                                                    className={styles.input} 
                                                    type="text" 
                                                    value={redditTitle} 
                                                    onChange={e => setRedditTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Post Body (Supports Markdown)</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    value={redditText} 
                                                    onChange={e => setRedditText(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.publishActionRow}>
                                                <button 
                                                    className={`${styles.publishBtn} ${styles.redditBtn}`}
                                                    onClick={() => handlePublish('reddit')}
                                                    disabled={publishStatus.reddit.status === 'loading'}
                                                >
                                                    Publish to Reddit
                                                </button>
                                                <PublishStatusIndicator status={publishStatus.reddit} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Twitter Tab */}
                                    {activeTab === 'twitter' && (
                                        <div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Tweet Content (Limit 280 characters)</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    value={twitterText} 
                                                    onChange={e => setTwitterText(e.target.value)}
                                                    maxLength={280}
                                                />
                                                <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                                                    {twitterText.length}/280 characters
                                                </div>
                                            </div>
                                            <div className={styles.publishActionRow}>
                                                <button 
                                                    className={`${styles.publishBtn} ${styles.twitterBtn}`}
                                                    onClick={() => handlePublish('twitter')}
                                                    disabled={publishStatus.twitter.status === 'loading'}
                                                >
                                                    Publish to Twitter/X
                                                </button>
                                                <PublishStatusIndicator status={publishStatus.twitter} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Facebook Tab */}
                                    {activeTab === 'facebook' && (
                                        <div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Post Copy</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    value={fbText} 
                                                    onChange={e => setFbText(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.publishActionRow}>
                                                <button 
                                                    className={`${styles.publishBtn} ${styles.facebookBtn}`}
                                                    onClick={() => handlePublish('facebook')}
                                                    disabled={publishStatus.facebook.status === 'loading'}
                                                >
                                                    Publish to Facebook Page
                                                </button>
                                                <PublishStatusIndicator status={publishStatus.facebook} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Andhrafriends Tab */}
                                    {activeTab === 'andhrafriends' && (
                                        <div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Thread Title</label>
                                                <input 
                                                    className={styles.input} 
                                                    type="text" 
                                                    value={afTitle} 
                                                    onChange={e => setAfTitle(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.inputGroup}>
                                                <label className={styles.label}>Thread Content</label>
                                                <textarea 
                                                    className={styles.textarea} 
                                                    value={afText} 
                                                    onChange={e => setAfText(e.target.value)}
                                                />
                                            </div>
                                            <div className={styles.publishActionRow}>
                                                <button 
                                                    className={`${styles.publishBtn} ${styles.andhrafriendsBtn}`}
                                                    onClick={() => handlePublish('andhrafriends')}
                                                    disabled={publishStatus.andhrafriends.status === 'loading'}
                                                >
                                                    Publish to Andhrafriends (Deals Forum)
                                                </button>
                                                <PublishStatusIndicator status={publishStatus.andhrafriends} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                                    <span style={{ fontSize: '2.5rem' }}>🤖</span>
                                    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>Click "Generate AI Drafts" to formulate tailored copies for this deal.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={styles.selectPrompt}>
                            <span className={styles.selectPromptIcon}>👈</span>
                            <p>Select a deal from the sidebar to start drafting and publishing.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Config guidelines */}
            <div className={`${styles.card} ${styles.instructionsCard}`}>
                <h4 className={styles.instructionsTitle}>⚙️ Integration & Environment Verification</h4>
                <ul className={styles.instructionsList}>
                    <li>The system is pre-configured with a **Dry Run Safety Protocol**. If platform API keys are not specified in your environment variables, the system executes simulated mock posts successfully, allowing you to test flows safely.</li>
                    <li>To activate live postings, configure your production environment keys: `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL_ID`, `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USERNAME`, `REDDIT_PASSWORD`, `FACEBOOK_PAGE_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`, `ANDHRAFRIENDS_USERNAME`, and `ANDHRAFRIENDS_PASSWORD`.</li>
                </ul>
            </div>
        </div>
    );
}

function PublishStatusIndicator({ status }: { status?: PublishStatus }) {
    if (!status || status.status === 'idle') return null;
    if (status.status === 'loading') {
        return (
            <span className={`${styles.statusBadge} ${styles.statusLoading}`}>
                <span className={styles.spinner}></span> Publishing...
            </span>
        );
    }
    if (status.status === 'success') {
        return (
            <span className={`${styles.statusBadge} ${styles.statusSuccess}`}>
                ✅ {status.message || 'Published!'}
            </span>
        );
    }
    return (
        <span className={`${styles.statusBadge} ${styles.statusError}`}>
            ❌ {status.message || 'Error occurred.'}
        </span>
    );
}
