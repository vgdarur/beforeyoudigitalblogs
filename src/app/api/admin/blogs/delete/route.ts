import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const id = formData.get('id') as string | null;

        if (!id) {
            return NextResponse.redirect(new URL('/admin/blogs?error=MissingId', req.url));
        }

        await prisma.blog.delete({
            where: { id }
        });

        return NextResponse.redirect(new URL('/admin/blogs', req.url));
    } catch (error) {
        console.error('Error deleting blog:', error);
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToDelete', req.url));
    }
}
