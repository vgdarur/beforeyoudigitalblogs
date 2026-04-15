import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string | null;
        const name = formData.get('name') as string;
        const url = formData.get('url') as string;
        const format = (formData.get('format') as string) || 'CSV';
        const isActiveStr = formData.get('isActive') as string;
        const isActive = isActiveStr === 'on' || isActiveStr === 'true';

        if (!name || !url) {
            return NextResponse.redirect(new URL('/admin/feeds?error=FieldsRequired', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
        }

        if (id) {
            await prisma.feedSource.update({
                where: { id },
                data: { name, url, format, isActive }
            });
        } else {
            await prisma.feedSource.create({
                data: { name, url, format, isActive }
            });
        }

        return NextResponse.redirect(new URL('/admin/feeds', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);

    } catch (error) {
        console.error('Failed to upsert feed source:', error);
        return NextResponse.redirect(new URL('/admin/feeds?error=FailedToSave', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    }
}
