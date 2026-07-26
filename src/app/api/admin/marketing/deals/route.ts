import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const where = {
            priorityScore: { not: 1 },
            isActive: true
        };

        const deals = await prisma.deal.findMany({
            where,
            include: {
                merchant: {
                    select: { name: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 30
        });

        return NextResponse.json({ deals });
    } catch (error: any) {
        console.error('Failed to fetch marketing deals:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
