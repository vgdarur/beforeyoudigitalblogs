import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { deleteBlog } from '@/lib/blogStore';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const formData = await req.formData();
        const id = formData.get('id') as string | null;

        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;

        if (!id) {
            return NextResponse.redirect(new URL('/admin/blogs?error=MissingId', baseUrl));
        }

        await deleteBlog(id);

        return NextResponse.redirect(new URL('/admin/blogs', baseUrl));
    } catch (error) {
        console.error('Error deleting blog:', error);
        
        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToDelete', baseUrl));
    }
}
