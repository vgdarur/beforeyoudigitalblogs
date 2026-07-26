'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImportDealButton({ asin }: { asin: string }) {
    const [isImporting, setIsImporting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    const handleImport = async () => {
        setIsImporting(true);
        setStatus('idle');
        setMsg('');

        try {
            const res = await fetch('/api/admin/amazon/import-deal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ asin })
            });

            const data = await res.json();
            
            if (res.ok && data.success) {
                setStatus('success');
                setMsg(data.message || 'Deal successfully imported!');
                // Optional: refresh page or redirect to edit the deal
                router.refresh();
            } else {
                setStatus('error');
                setMsg(data.error || 'Failed to import deal.');
            }
        } catch (err: any) {
            setStatus('error');
            setMsg('Connection error: ' + err.message);
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '0.9rem', fontWeight: 'bold' }}>
                🛡️ Admin Curation Panel
            </h4>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', color: '#64748b' }}>
                You are logged in as administrator. Click below to import this temporary deal into your main website deals database.
            </p>
            <button
                onClick={handleImport}
                disabled={isImporting || status === 'success'}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: status === 'success' ? '#10b981' : '#0b3d91',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.6rem 1.2rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    transition: 'background 0.15s ease'
                }}
            >
                {isImporting ? 'Importing...' : status === 'success' ? '✓ Imported to Database' : 'Add to Website Deals'}
            </button>
            {msg && (
                <p style={{ 
                    margin: '0.75rem 0 0 0', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold',
                    color: status === 'success' ? '#059669' : '#dc2626' 
                }}>
                    {msg}
                </p>
            )}
        </div>
    );
}
