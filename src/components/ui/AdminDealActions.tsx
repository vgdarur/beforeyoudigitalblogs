'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminDealActionsProps {
    dealId: string;
    dealSlug: string;
}

export default function AdminDealActions({ dealId, dealSlug }: AdminDealActionsProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this deal? This action cannot be undone.")) {
            try {
                const res = await fetch(`/api/admin/deals/${dealId}/delete`, {
                    method: 'POST',
                });
                // Since the delete endpoint redirects on form post, let's verify redirect behavior or handle success
                if (res.ok) {
                    alert("Deal deleted successfully.");
                    router.push('/deals');
                    router.refresh();
                } else {
                    alert("Failed to delete deal.");
                }
            } catch (e) {
                console.error(e);
                alert("An error occurred while deleting the deal.");
            }
        }
    };

    return (
        <div style={{
            background: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(220, 38, 38, 0.05)',
            fontFamily: 'inherit'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>🛠️</span>
                <div>
                    <strong style={{ color: '#991b1b', fontSize: '1rem', display: 'block', fontWeight: 700 }}>
                        Admin Operations
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: '#b91c1c', opacity: 0.9 }}>
                        You are signed in as an administrator. You can edit or delete this deal instantly.
                    </span>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link 
                    href={`/admin/deals/${dealId}/edit`} 
                    style={{
                        backgroundColor: '#2563eb',
                        color: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s, transform 0.1s',
                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                >
                    Update Deal
                </Link>
                <button 
                    onClick={handleDelete}
                    style={{
                        backgroundColor: '#dc2626',
                        color: 'white',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background-color 0.2s, transform 0.1s',
                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                    Delete Deal
                </button>
            </div>
        </div>
    );
}
