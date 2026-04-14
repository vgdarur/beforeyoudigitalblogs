import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string | null;
        const name = formData.get('name') as string;

        if (!name) {
            return NextResponse.redirect(new URL('/admin/merchants?error=NameRequired', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const logoUrl = (formData.get('logoUrl') as string) || null;

        if (id) {
            // Update existing
            await prisma.merchant.update({
                where: { id },
                data: { name, slug, logoUrl }
            });
        } else {
            // Create new
            await prisma.merchant.create({
                data: { name, slug, logoUrl }
            });
        }

        return NextResponse.redirect(new URL('/admin/merchants', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);

    } catch (error) {
        console.error('Failed to upsert merchant:', error);
        return NextResponse.redirect(new URL('/admin/merchants?error=FailedToSave', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    }
}
