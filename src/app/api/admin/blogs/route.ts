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
        const slug = formData.get('slug') as string | null;
        const content = formData.get('content') as string | null;
        const published = formData.get('published') === 'true';

        if (!title || !slug || !content) {
            return NextResponse.redirect(new URL('/admin/blogs?error=MissingFields', req.url));
        }

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

        return NextResponse.redirect(new URL('/admin/blogs', req.url));
    } catch (error) {
        console.error('Error saving blog:', error);
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToSave', req.url));
    }
}
