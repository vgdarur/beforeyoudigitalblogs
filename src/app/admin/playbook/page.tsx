import React from 'react';

export default function PlaybookPage() {
    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>Platform Growth Playbook</h1>
                <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>Strategic documentation and troubleshooting for affiliate network approvals.</p>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                
                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>🐣</span> The "Chicken and Egg" Problem
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Major networks (like Rakuten, CJ, and Amazon) strictly monitor network quality. They will <strong>almost always decline brand new websites</strong> that don't have existing content or traffic. They want to see an active, populated platform before handing out approvals.
                    </p>
                    <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '1rem', color: '#166534', borderRadius: '4px' }}>
                        <strong>Reassurance:</strong> Being declined right now is practically a rite of passage. Building this custom website was the essential first step—you now own a fast, SEO-optimized asset. You just need to correctly "seed" it to get approved.
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>⚡</span> Step 1: The "Sub-Affiliate" Strategy (Instant Approvals)
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Instead of applying to strict direct networks immediately, use an <strong>Affiliate Aggregator</strong>. 
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        <li><strong>Skimlinks</strong> or <strong>Sovrn (Viglink)</strong></li>
                    </ul>
                    <p style={{ color: '#374151', lineHeight: '1.6' }}>
                        <strong>Why it works:</strong> These platforms have already partnered with thousands of merchants (including Rakuten and CJ brands). When you join Skimlinks, they generally approve you quickly. Once approved, you instantly get access to promote almost any brand without individual store approvals!
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>🌱</span> Step 2: "Seed" Your Website Manually
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Networks decline empty sites. Your immediate goal is to make Dealsagent look like a bustling, authoritative coupon hub.
                    </p>
                    <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.6' }}>
                            <li style={{ marginBottom: '0.5rem' }}>Navigate to the <strong>Merchants</strong> tab and create profiles for 10-20 famous brands.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Use the <strong>Manual Deal Creation</strong> tool to add 20-30 high-quality deals for these brands.</li>
                            <li style={{ marginBottom: '0.5rem' }}>Even if you aren't an affiliate yet, link directly to their standard sales pages!</li>
                            <li>Write descriptive titles and SEO-friendly descriptions.</li>
                        </ol>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#6b7280' }}>
                            Once your homepage is flooded with beautiful, active deals, networks will review your site manually and say, "Wow, this is a thriving platform," and they'll approve your subsequent applications immediately.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 style={{ fontSize: '1.5rem', color: '#1f2937', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.8rem' }}>📈</span> Step 3: Build Organic Traffic (SEO & Social)
                    </h2>
                    <p style={{ color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        Right now, focus on generating traffic. You don't even need affiliate links to start seeing success:
                    </p>
                    <ul style={{ listStyleType: 'circle', paddingLeft: '1.5rem', color: '#374151', lineHeight: '1.6', marginBottom: '1rem' }}>
                        <li>Post your website's custom deal links to Facebook Deal Groups, X (Twitter), or TikTok.</li>
                        <li>Let Google index your highly-optimized, fast page routes.</li>
                        <li><strong>Amazon PAAPI Goal:</strong> Amazon only requires 3 sales within your first 180 days to grant permanent API access. Driving organic social traffic is the fastest way to hit this goal!</li>
                    </ul>
                </section>

            </div>
        </div>
    );
}
