'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Marketing Admin Page Error:', error);
    }, [error]);

    return (
        <div style={{ 
            padding: '2rem', 
            textAlign: 'center', 
            background: '#fee2e2', 
            color: '#991b1b', 
            borderRadius: '8px', 
            border: '1px solid #fca5a5',
            maxWidth: '600px',
            margin: '2rem auto'
        }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Marketing Page Error
            </h2>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#b91c1c' }}>
                {error.message || 'An error occurred while rendering the page.'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <button
                    onClick={() => reset()}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#991b1b', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.reload()}
                    style={{ 
                        padding: '0.5rem 1rem', 
                        background: '#f3f4f6', 
                        color: '#374151', 
                        border: '1px solid #d1d5db', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
}
