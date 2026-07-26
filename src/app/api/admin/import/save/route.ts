import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { deals } = body;

        const response = await fetch('https://api.aidealsofamerica.com/api/admin/import/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ deals }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return NextResponse.json({ error: `Spring API Error: ${errorText}` }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('Error during save routing:', err);
        return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
    }
}
