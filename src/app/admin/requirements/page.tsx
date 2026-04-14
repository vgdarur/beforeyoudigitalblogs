'use client';

import { useState, useEffect } from 'react';
import styles from '../page.module.css';

export default function RequirementsEditor() {
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        fetch('/api/requirements')
            .then(res => res.json())
            .then(data => {
                if (data.content) {
                    setContent(data.content);
                }
                setIsLoading(false);
            })
            .catch(() => {
                setContent('# Error loading requirements');
                setIsLoading(false);
            });
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const res = await fetch('/api/requirements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            if (res.ok) {
                setSaveStatus('success');
            } else {
                setSaveStatus('error');
            }
        } catch (e) {
            setSaveStatus('error');
        }
        setIsSaving(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
    };

    if (isLoading) {
        return <div className={styles.container}><h2 className={styles.title}>Loading Requirements...</h2></div>;
    }

    return (
        <div className={styles.container} style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100vh', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h2 className={styles.title}>Project Requirements Tracker</h2>
                    <p className={styles.subtitle}>Maintain your official requirements document here. Handled natively via the server.</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: saveStatus === 'success' ? '#10b981' : saveStatus === 'error' ? '#ef4444' : 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s',
                        minWidth: '120px'
                    }}
                >
                    {isSaving ? 'Saving...' : saveStatus === 'success' ? 'Saved! ✓' : saveStatus === 'error' ? 'Failed ⨯' : 'Save Changes'}
                </button>
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                    flex: 1,
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface-hover)',
                    color: 'var(--foreground)',
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    resize: 'none',
                    outline: 'none',
                    lineHeight: '1.5'
                }}
                placeholder="Write your project requirements here in Markdown..."
            />
        </div>
    );
}
