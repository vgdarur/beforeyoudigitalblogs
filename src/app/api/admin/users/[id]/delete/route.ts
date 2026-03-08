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

        // Ensure admin authorization
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        const userId = params.id;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Prevent admin from deleting themselves
        if ((session.user as any).id === userId) {
            return NextResponse.json({ error: 'You cannot delete yourself' }, { status: 400 });
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.redirect(new URL('/admin/users', request.url), 303);
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
