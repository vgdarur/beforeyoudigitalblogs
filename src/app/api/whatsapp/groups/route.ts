import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const groups = await prisma.whatsAppGroup.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
        
        return NextResponse.json(groups);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch WhatsApp groups' }, { status: 500 });
    }
}
