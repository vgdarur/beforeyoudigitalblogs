import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }
        
        const userId = (session.user as any).id;

        const formData = await req.formData();
        const id = formData.get('id') as string | null;
        const title = formData.get('title') as string | null;
        let slug = formData.get('slug') as string | null;
        const content = formData.get('content') as string | null;
        const published = formData.get('published') === 'true';

        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;

        if (!title || !slug || !content) {
            return NextResponse.redirect(new URL('/admin/blogs?error=MissingFields', baseUrl));
        }

        // Clean up the slug to prevent URL routing issues
        slug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        if (id) {
            // Update
            await prisma.blog.update({
                where: { id },
                data: {
                    title,
                    slug,
                    content,
                    published,
                    authorId: userId
                }
            });
        } else {
            // Create
            await prisma.blog.create({
                data: {
                    title,
                    slug,
                    content,
                    published,
                    authorId: userId
                }
            });
        }

        return NextResponse.redirect(new URL('/admin/blogs', baseUrl));
    } catch (error) {
        console.error('Error saving blog:', error);
        
        const baseUrl = `${req.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'}`;
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToSave', baseUrl));
    }
}
