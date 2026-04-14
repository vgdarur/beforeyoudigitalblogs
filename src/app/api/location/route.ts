import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { zipcode } = body;
        
        if (!zipcode) {
            return NextResponse.json({ error: 'Zipcode is required' }, { status: 400 });
        }

        // Await headers() in Next 15+, but works in 14 too
        const headersList = await headers();
        const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
        const userAgent = headersList.get('user-agent') || 'unknown';

        const log = await prisma.zipcodeLog.create({
            data: {
                zipcode,
                ipAddress: String(ipAddress),
                userAgent: String(userAgent)
            }
        });

        return NextResponse.json({ success: true, log });
    } catch (e) {
        console.error("Failed to log zipcode:", e);
        return NextResponse.json({ error: 'Failed to log zipcode.' }, { status: 500 });
    }
}
