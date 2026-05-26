import React from 'react';

export default function ScraperRulesPage() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Claude AI Scraper Configuration</h1>
                <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>Current system rules, schedules, and UI logic for AI-curated deals.</p>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>🤖</span> 1. Claude AI Scraper Rules
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        The <code>ClaudeScraperImpl.java</code> system prompt has been configured to strictly command the Claude AI to use its web search tool to find exactly <strong>15 deals</strong> from specific merchants daily:
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        <li>1 Amazon</li>
                        <li>1 Target</li>
                        <li>1 Best Buy</li>
                        <li>1 Walmart</li>
                        <li>1 Home Depot</li>
                        <li>5 TikTok Shop</li>
                        <li>5 Shopify</li>
                    </ul>
                    <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '1rem', color: '#166534', borderRadius: '4px' }}>
                        <strong>Link Enforcement:</strong> The prompt explicitly forces Claude to leave the <code>affiliateSearchUrl</code> blank for all merchants except Amazon. Only Amazon deals will have an affiliate link processed by the backend.
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>📅</span> 2. Daily Schedule
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        The <code>DailyScrapeJob</code> is scheduled to execute precisely at Noon server time everyday.
                    </p>
                    <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <code style={{ color: '#dc2626', fontWeight: 'bold' }}>0 0 12 * * ?</code>
                        <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                            (Cron Expression for 12:00 PM Daily)
                        </p>
                    </div>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginTop: '1rem' }}>
                        This job exclusively calls the Claude scraper API and immediately saves the 15 deals directly to the database, skipping legacy fallback scrapers.
                    </p>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>🌐</span> 3. Web App UI Updates
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        The Next.js frontend has been updated to intelligently render buttons based on the scraper's output:
                    </p>
                    <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        <li><strong>Dynamic Button Text:</strong> If a deal is from Amazon, it will say <em>"Check out this deal in Amazon"</em>. If it's another merchant (e.g., Target), it says <em>"Check out this deal in Target"</em>.</li>
                        <li><strong>Link Removal (Graceful Fallback):</strong> If a deal has no affiliate link provided by the backend (which applies to the 14 non-Amazon deals), the "Check out" button is <strong>completely hidden</strong> from the UI to prevent broken user experiences.</li>
                    </ul>
                </section>

            </div>
        </div>
    );
}
