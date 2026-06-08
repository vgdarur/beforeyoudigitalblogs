import Link from 'next/link';

interface AIDealCardProps {
    deal: {
        title: string;
        reason: string;
        merchant: string;
        url: string;
        heat_level?: string;
        exact_price?: string;
    };
    index?: number;
    isAdmin?: boolean;
}

export default function AIDealCard({ deal, index = 0, isAdmin = false }: AIDealCardProps) {
    const queryTitle = deal.title.toLowerCase();
    let placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Trending+Deal';
    if (queryTitle.includes("iphone")) {
        placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=iPhone+Deal';
    } else if (queryTitle.includes("samsung") || queryTitle.includes("galaxy")) {
        placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Samsung+Deal';
    } else if (queryTitle.includes("pixel")) {
        placeholderImage = 'https://placehold.co/600x400/f8fafc/0f172a?text=Google+Pixel+Deal';
    }
    
    const priceValue = deal.exact_price ? deal.exact_price.replace(/[^0-9.]/g, '') : '';
    // Determine merchant styling based on text
    const merchantLower = deal.merchant?.toLowerCase() || '';
    let catBg = '#f8fafc';
    let catColor = '#334155';
    if (merchantLower.includes('amazon')) { catBg = '#fff7ed'; catColor = '#c2410c'; }
    else if (merchantLower.includes('target')) { catBg = '#fdf2f8'; catColor = '#be123c'; }
    else if (merchantLower.includes('best buy')) { catBg = '#eff6ff'; catColor = '#1d4ed8'; }
    else if (merchantLower.includes('home depot')) { catBg = '#fff7ed'; catColor = '#c2410c'; }
    else if (merchantLower.includes('tiktok')) { catBg = '#f1f5f9'; catColor = '#0f172a'; }
    else if (merchantLower.includes('walmart')) { catBg = '#eff6ff'; catColor = '#1d4ed8'; }
    else if (merchantLower.includes('slickdeals')) { catBg = '#f0fdf4'; catColor = '#16a34a'; }
    else if (merchantLower.includes('costco')) { catBg = '#fee2e2'; catColor = '#dc2626'; }
    
    // Heat level styling
    const heatLower = deal.heat_level?.toLowerCase() || '';
    let heatBg = '#fff7ed';
    let heatColor = '#9a3412';
    if (heatLower.includes('medium')) { heatBg = '#fef3c7'; heatColor = '#92400e'; }
    
    const heatText = heatLower.includes('high') ? '🔥 High' : heatLower.includes('medium') ? 'Medium' : heatLower.includes('low') ? 'Low' : '🔥 High';

    // Pastel background colors for each card based on index
    const pastelColors = [
        '#f8faff', // very light blue
        '#fffaf5', // very light orange/peach
        '#f8fff8', // very light green
        '#fff5fb', // very light pink
        '#fbf5ff', // very light purple
        '#f5ffff'  // very light cyan
    ];
    const cardBgColor = pastelColors[index % pastelColors.length];

    return (
        <div style={{ 
            background: cardBgColor, 
            border: '1px solid #e2e8f0', 
            borderRadius: '12px', 
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
            <div>
                {/* Badges Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ 
                        background: catBg, 
                        color: catColor, 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600 
                    }}>
                        {deal.merchant}
                    </span>
                    <span style={{ 
                        background: heatBg, 
                        color: heatColor, 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.8rem', 
                        fontWeight: 600 
                    }}>
                        {heatText}
                    </span>
                </div>

                {/* Title & Description */}
                <Link href={deal.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, margin: '0 0 0.5rem 0', color: '#0f172a', lineHeight: 1.3 }}>
                        {deal.title}
                    </h3>
                </Link>
                <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
                    {deal.reason}
                </p>
            </div>

            {/* Bottom Bar: Price and Link */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    {deal.exact_price ? deal.exact_price : ''}
                </span>
                <Link href={deal.url || '#'} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#2563eb', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    Click here to purchase this deal on {deal.merchant}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Link>
            </div>

            {isAdmin && (
                <div style={{ borderTop: '1px dashed #fee2e2', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link 
                        href={`/admin/deals/new?title=${encodeURIComponent(deal.title)}&affiliateUrl=${encodeURIComponent(`https://www.amazon.com/s?k=${encodeURIComponent(deal.title)}&tag=aidealsagent-20`)}&description=${encodeURIComponent(deal.reason)}&price=${encodeURIComponent(priceValue)}&merchantName=${encodeURIComponent('Amazon')}&imageUrl=${encodeURIComponent(placeholderImage)}`}
                        target="_blank"
                        style={{
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            border: '1px solid #fca5a5',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        📥 Import as Manual Deal
                    </Link>
                </div>
            )}
        </div>
    );
}
