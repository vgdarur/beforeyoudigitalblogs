import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return NextResponse.redirect(new URL('/admin/networks?error=IdRequired', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
        }

        await prisma.network.delete({
            where: { id }
        });

        return NextResponse.redirect(new URL('/admin/networks', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);

    } catch (error) {
        console.error('Failed to delete network:', error);
        return NextResponse.redirect(new URL('/admin/networks?error=CannotDeleteInUse', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    }
}
