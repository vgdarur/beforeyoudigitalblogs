import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const dealId = params.id;

        if (!dealId) {
            return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
        }

        await prisma.deal.delete({
            where: { id: dealId }
        });

        return NextResponse.redirect(new URL('/admin/deals', request.url), 303);
    } catch (error) {
        console.error('Failed to delete deal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
