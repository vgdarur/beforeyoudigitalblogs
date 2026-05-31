import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            where: {
                deals: {
                    some: {
                        isActive: true,
                        imageUrl: { contains: 'http' },
                        OR: [
                            { expirationDate: null },
                            { expirationDate: { gt: new Date() } }
                        ]
                    }
                }
            },
            select: { id: true, name: true, slug: true },
            orderBy: { name: 'asc' }
        });

        const merchants = await prisma.merchant.findMany({
            where: {
                deals: {
                    some: {
                        isActive: true,
                        imageUrl: { contains: 'http' },
                        OR: [
                            { expirationDate: null },
                            { expirationDate: { gt: new Date() } }
                        ]
                    }
                }
            },
            select: { id: true, name: true, slug: true },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ categories, merchants });
    } catch (err) {
        console.error("Failed to fetch filters", err);
        return NextResponse.json({ categories: [], merchants: [] }, { status: 500 });
    }
}
