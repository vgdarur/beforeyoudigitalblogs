'use client';

import Link from 'next/link';

interface RestaurantCardProps {
    merchant: {
        id: string;
        name: string;
        slug: string;
        logoUrl: string | null;
        _count?: {
            deals: number;
        };
    };
}

export default function RestaurantCard({ merchant }: RestaurantCardProps) {
    return (
        <Link 
            href={`/deals?merchant=${merchant.id}`} 
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: 'var(--surface)',
                borderRadius: '1rem',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}
        >
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                overflow: 'hidden'
            }}>
                {merchant.logoUrl ? (
                    <img 
                        src={merchant.logoUrl} 
                        alt={merchant.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                        {merchant.name.substring(0, 2).toUpperCase()}
                    </span>
                )}
            </div>
            
            <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                {merchant.name}
            </h3>
            
            {merchant._count && merchant._count.deals !== undefined && (
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {merchant._count.deals} Active Deals
                </span>
            )}
        </Link>
    );
}
