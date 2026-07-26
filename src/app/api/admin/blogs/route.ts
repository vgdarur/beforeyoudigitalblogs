import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
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
                    published
                }
            });
        } else {
            // Create
            await prisma.blog.create({
                data: {
                    title,
                    slug,
                    content,
                    published
                }
            });
        }

        return NextResponse.redirect(new URL('/admin/blogs', req.url));
    } catch (error) {
        console.error('Error saving blog:', error);
        return NextResponse.redirect(new URL('/admin/blogs?error=FailedToSave', req.url));
    }
}
