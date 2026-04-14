import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getServerSession();
    
    // Only admins can update the restaurant details inline
    if (!session || (session.user as any)?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, logoUrl } = body;

        const updatedMerchant = await prisma.merchant.update({
            where: { id },
            data: { 
                name, 
                logoUrl: logoUrl || null 
            }
        });

        return NextResponse.json({ success: true, merchant: updatedMerchant });
    } catch (e) {
        console.error("Failed to update merchant:", e);
        return NextResponse.json({ error: 'Failed to update merchant.' }, { status: 500 });
    }
}
