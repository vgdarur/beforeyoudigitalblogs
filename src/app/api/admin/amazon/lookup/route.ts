import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AmazonPAAPI } from '@/lib/amazon';

export async function POST(request: Request) {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { asin } = body;

        if (!asin || typeof asin !== 'string') {
            return NextResponse.json({ error: 'ASIN parameter is required and must be a string.' }, { status: 400 });
        }

        // Clean and extract ASIN (in case they paste a full Amazon link)
        let cleanAsin = asin.trim().toUpperCase();
        if (cleanAsin.length !== 10) {
            const match = asin.match(/(?:dp|gp\/product|d)\/([A-Za-z0-9]{10})/i);
            if (match && match[1]) {
                cleanAsin = match[1].toUpperCase();
            } else {
                return NextResponse.json({ error: 'Invalid ASIN or Amazon URL format. Could not extract 10-character ASIN.' }, { status: 400 });
            }
        }

        const paapi = new AmazonPAAPI();
        const product = await paapi.getProductByASIN(cleanAsin);

        if (!product) {
            return NextResponse.json({ error: `No Amazon product found for ASIN: ${cleanAsin}` }, { status: 404 });
        }

        return NextResponse.json({ success: true, product });
    } catch (err: any) {
        console.error('Amazon lookup API error:', err);
        return NextResponse.json({ error: err.message || 'Failed to lookup Amazon product details.' }, { status: 500 });
    }
}
