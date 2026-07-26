import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const networks = await prisma.network.findMany({
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(networks);
    } catch (error: any) {
        console.error('Failed to fetch networks:', error);
        return NextResponse.json({ error: 'Failed to fetch networks' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const id = formData.get('id') as string | null;
        const name = formData.get('name') as string;

        if (!name) {
            return NextResponse.redirect(new URL('/admin/networks?error=NameRequired', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const apiKey = (formData.get('apiKey') as string) || null;
        const trackingId = (formData.get('trackingId') as string) || null;

        if (id) {
            // Update existing
            await prisma.network.update({
                where: { id },
                data: { name, slug, apiKey, trackingId }
            });
        } else {
            // Create new
            await prisma.network.create({
                data: { name, slug, apiKey, trackingId }
            });
        }

        return NextResponse.redirect(new URL('/admin/networks', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);

    } catch (error) {
        console.error('Failed to upsert network:', error);
        return NextResponse.redirect(new URL('/admin/networks?error=FailedToSave', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    }
}
