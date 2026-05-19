'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';

export default function NewsAdminPage() {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [activeNews, setActiveNews] = useState<any[]>([]);

    const SPRING_API_URL = "https://api.aidealsofamerica.com/api/news";

    const fetchNews = async () => {
        try {
            const res = await fetch(`${SPRING_API_URL}/active`);
            if (res.ok) {
                const data = await res.json();
                setActiveNews(data);
            }
        } catch (error) {
            console.error("Failed to fetch news:", error);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch(SPRING_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message.trim() })
            });

            if (response.ok) {
                setStatus({ type: 'success', text: 'News successfully pushed to iOS App!' });
                setMessage('');
                fetchNews(); // Refresh the list
            } else {
                setStatus({ type: 'error', text: 'Failed to publish news.' });
            }
        } catch (error) {
            setStatus({ type: 'error', text: 'Network error occurred.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>📱 iOS App News Ticker</h1>
                <p className={styles.subtitle}>Paste the deals you scraped from Google AI here to instantly broadcast them to your iOS app users.</p>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>New Ticker Message</label>
                        <textarea 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="e.g. 🚨 Amazon just price-matched BestBuy on 4K TVs!"
                            style={{ 
                                width: '100%', 
                                minHeight: '120px', 
                                padding: '1rem', 
                                borderRadius: '8px',
                                border: '1px solid #ccc',
                                fontSize: '1rem',
                                fontFamily: 'inherit'
                            }}
                            required
                        />
                    </div>
                    
                    {status && (
                        <div style={{ 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            backgroundColor: status.type === 'success' ? '#d4edda' : '#f8d7da',
                            color: status.type === 'success' ? '#155724' : '#721c24'
                        }}>
                            {status.text}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isSubmitting || !message.trim()}
                        style={{
                            padding: '1rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            cursor: (isSubmitting || !message.trim()) ? 'not-allowed' : 'pointer',
                            opacity: (isSubmitting || !message.trim()) ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish to iOS App'}
                    </button>
                </form>
            </div>

            <div className={styles.header} style={{ marginTop: '2rem' }}>
                <h2 className={styles.title}>Currently Active Tickers</h2>
                <p className={styles.subtitle}>These messages are currently scrolling on the iOS App.</p>
            </div>

            <div className={styles.card}>
                {activeNews.length === 0 ? (
                    <p style={{ color: '#666' }}>No active news tickers.</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeNews.map((news) => (
                            <li key={news.id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                <p style={{ margin: 0, fontWeight: '500' }}>{news.message}</p>
                                <small style={{ color: '#64748b', display: 'block', marginTop: '0.5rem' }}>
                                    Published: {new Date(news.createdAt).toLocaleString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
