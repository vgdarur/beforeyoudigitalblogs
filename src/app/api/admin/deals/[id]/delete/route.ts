import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`));
        }

        const dealId = (await params).id;

        if (!dealId) {
            return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
        }

        await prisma.deal.delete({
            where: { id: dealId }
        });

        return NextResponse.redirect(new URL('/admin/deals', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 303);
    } catch (error) {
        console.error('Failed to delete deal:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
