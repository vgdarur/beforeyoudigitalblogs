import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string | null;

        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;

        if (!id) {
            return NextResponse.redirect(new URL('/admin/blogs?error=MissingId', baseUrl));
        }

        await prisma.blog.delete({
            where: { id }
        });

        return NextResponse.redirect(new URL('/admin/blogs', baseUrl));
    } catch (error) {
        console.error('Error deleting blog:', error);
        
        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToDelete', baseUrl));
    }
}
