'use client';

import { useState } from 'react';

type Merchant = {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};

// Assuming Deal has some generic properties based on Prisma schema
type Deal = any; 

export default function RestaurantDetailClient({
    merchant,
    deals,
    isAdmin
}: {
    merchant: Merchant;
    deals: Deal[];
    isAdmin: boolean;
}) {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState(merchant.name);
    const [logoUrl, setLogoUrl] = useState(merchant.logoUrl || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/merchants/${merchant.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, logoUrl })
            });

            if (res.ok) {
                setEditMode(false);
            } else {
                alert('Failed to save. You might not have proper Admin permissions.');
            }
        } catch (error) {
            console.error('Error updating restaurant details:', error);
        }
        setIsSaving(false);
    };

    return (
        <div style={{ backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {editMode ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style={{ fontSize: '2.5rem', fontWeight: 'bold', padding: '0.5rem', color: 'black', borderRadius: '0.5rem' }} 
                            placeholder="Restaurant Name"
                        />
                        <input 
                            value={logoUrl} 
                            onChange={(e) => setLogoUrl(e.target.value)} 
                            style={{ fontSize: '1rem', padding: '0.5rem', color: 'black', borderRadius: '0.5rem' }} 
                            placeholder="Logo URL (optional)"
                        />
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {logoUrl && (
                            <img src={logoUrl} alt={name} style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                        )}
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{name}</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Official Merchant Page</p>
                        </div>
                    </div>
                )}
                
                {isAdmin && (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {editMode ? (
                            <>
                                <button onClick={() => setEditMode(false)} style={{ padding: '0.5rem 1rem', background: '#ccc', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSave} disabled={isSaving} style={{ padding: '0.5rem 1rem', background: '#10b981', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                    {isSaving ? 'Saving...' : 'Save Details'}
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditMode(true)} style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                                ✎ Edit Details
                            </button>
                        )}
                    </div>
                )}
            </div>

            <hr style={{ margin: '2rem 0', borderColor: 'var(--border)' }} />

            <div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Active Deals & Offers</h3>
                {deals.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {deals.map(deal => (
                            <div key={deal.id} style={{ padding: '1.5rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{deal.title}</h4>
                                <p style={{ color: 'var(--text-muted)' }}>{deal.description}</p>
                                {deal.couponCode && (
                                    <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'var(--surface)', border: '1px dashed var(--primary)', textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px' }}>
                                        {deal.couponCode}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface-hover)', borderRadius: '1rem', color: 'var(--text-muted)' }}>
                        <h4 style={{ fontSize: '1.25rem' }}>Basic Summary Rendered.</h4>
                        <p>No active deals found for this restaurant right now.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
