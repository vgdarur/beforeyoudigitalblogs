import Link from 'next/link';

interface AIDealCardProps {
    deal: {
        title: string;
        reason: string;
        category: string;
        url: string;
        heat_level?: string;
        estimated_price?: string;
    };
    index?: number;
}

export default function AIDealCard({ deal, index = 0 }: AIDealCardProps) {
    // Determine category styling based on text
    const catLower = deal.category?.toLowerCase() || '';
    let catBg = '#f1f8f1';
    let catColor = '#166534';
    if (catLower.includes('beauty')) { catBg = '#f1f8f1'; catColor = '#166534'; }
    else if (catLower.includes('beach') || catLower.includes('summer')) { catBg = '#fdf2f8'; catColor = '#831843'; }
    else if (catLower.includes('pet') || catLower.includes('home')) { catBg = '#f0fdf4'; catColor = '#14532d'; }
    else if (catLower.includes('health')) { catBg = '#f3e8ff'; catColor = '#4c1d95'; }
    
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
                        {deal.category}
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
                    {deal.estimated_price ? deal.estimated_price : ''}
                </span>
                <Link href={deal.url} target="_blank" rel="noopener noreferrer" style={{ 
                    color: '#2563eb', 
                    fontSize: '0.9rem', 
                    fontWeight: 600, 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
                    Get Deal
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </Link>
            </div>
        </div>
    );
}
