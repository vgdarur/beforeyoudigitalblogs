'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsTicker() {
    const [news, setNews] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('https://api.aidealsofamerica.com/api/news/active');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setNews(data[0].message); // Only display the most recent AI banner
                    } else {
                        setNews('🚨 Trending in USA Today: Check out our top deals below!');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch news ticker", error);
            }
        };
        fetchNews();
    }, []);



    const handleBannerClick = () => {
        window.open('/trending', '_blank');
    };

    if (!news) return null;

    return (
        <div className="news-ticker-container" onClick={handleBannerClick} style={{ cursor: 'pointer' }}>
            <span className="news-ticker-text">{news}</span>
            <style jsx>{`
                .news-ticker-container {
                    background: linear-gradient(90deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
                    color: white;
                    padding: 10px 0;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-weight: bold;
                    font-size: 15px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    z-index: 50;
                    transition: transform 0.2s ease, opacity 0.2s ease;
                }
                .news-ticker-container:hover {
                    opacity: 0.95;
                }
                .news-ticker-container:active {
                    transform: scale(0.99);
                }
                .news-ticker-text {
                    text-align: center;
                }
            `}</style>
        </div>
    );
}
