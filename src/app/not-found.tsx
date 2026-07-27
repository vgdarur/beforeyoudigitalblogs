import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'system-ui, sans-serif', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '4rem', marginBottom: '20px', fontWeight: 'bold', color: '#1d1d1f' }}>404</h1>
            <p style={{ fontSize: '1.5rem', color: '#4b5563', marginBottom: '30px' }}>Oops! The page you are looking for doesn't exist.</p>
            <Link href="/" style={{ 
                display: 'inline-block',
                padding: '12px 24px', 
                backgroundColor: '#ea580c', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '8px',
                fontWeight: '600'
            }}>
                Return to Deals
            </Link>
        </div>
    );
}
