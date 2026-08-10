'use client';

import { useState, useEffect } from 'react';

export default function BroadcastButton({ dealId }: { dealId: string }) {
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [groups, setGroups] = useState<{id: string, name: string, groupId: string}[]>([]);

    useEffect(() => {
        fetch('/api/whatsapp/groups')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setGroups(data);
            })
            .catch(err => console.error("Error fetching WhatsApp groups:", err));
    }, []);

    const handleBroadcast = async () => {
        if (groups.length === 0) {
            alert('No WhatsApp groups found. Please add them in the database first.');
            return;
        }

        // Just select the first group for now, or let them pick
        const targetGroup = groups[0];
        
        if (!confirm(`Are you sure you want to broadcast this deal to ${targetGroup.name}?`)) return;

        setIsBroadcasting(true);
        try {
            const res = await fetch('/api/whatsapp/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dealId, groupId: targetGroup.groupId })
            });
            const result = await res.json();
            
            if (result.success) {
                alert('Broadcast sent successfully!');
            } else {
                alert(`Broadcast failed: ${result.error || result.details}`);
            }
        } catch (e) {
            alert('An error occurred during broadcast.');
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <button 
            onClick={handleBroadcast} 
            disabled={isBroadcasting}
            style={{
                padding: '0.25rem 0.5rem',
                background: isBroadcasting ? 'gray' : 'var(--accent)',
                border: 'none',
                color: 'white',
                borderRadius: '4px',
                cursor: isBroadcasting ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem'
            }}>
            {isBroadcasting ? 'Sending...' : 'Broadcast'}
        </button>
    );
}
