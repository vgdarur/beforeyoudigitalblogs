import React from 'react';

interface ImpactBannerProps {
  campaignName?: string;
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  affiliateUrl?: string;
  bannerImageUrl?: string;
}

export default function ImpactBanner({
  campaignName = "Impact.com Featured Partner",
  headline = "Exclusive Daily Savings: Up to 50% Off Top Brands",
  subheadline = "Verified deals on tech, home goods, and electronics updated daily via Impact.com",
  ctaText = "Shop Verified Deals →",
  affiliateUrl = "https://www.aidealsofamerica.com/deals?source=impact",
  bannerImageUrl
}: ImpactBannerProps) {
  return (
    <div style={{
      width: '100%',
      marginBottom: '2rem',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
      border: '1px solid #334155'
    }}>
      {bannerImageUrl ? (
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" style={{ display: 'block' }}>
          <img 
            src={bannerImageUrl} 
            alt="Sponsored Offer via Impact.com" 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </a>
      ) : (
        <div style={{
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                background: '#3b82f6',
                color: 'white',
                fontSize: '0.68rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                Sponsored
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {campaignName}
              </span>
            </div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 4px 0',
              lineHeight: 1.3
            }}>
              {headline}
            </h3>
            <p style={{
              fontSize: '0.85rem',
              color: '#cbd5e1',
              margin: 0
            }}>
              {subheadline}
            </p>
          </div>

          <div>
            <a
              href={affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                transition: 'background-color 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {ctaText}
            </a>
          </div>
        </div>
      )}
      <div style={{
        background: '#090d16',
        padding: '4px 1.5rem',
        fontSize: '0.68rem',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Affiliate Disclosure: We may earn a commission from purchases made through this link.</span>
        <span>Ad via Impact.com</span>
      </div>
    </div>
  );
}
