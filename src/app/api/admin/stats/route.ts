import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Basic aggregate statistics for Admin Dash
        // Note: This requires admin authentication in production!
        const [
            totalDeals,
            activeDeals,
            totalClicks,
            totalMerchants,
            recentClicks
        ] = await Promise.all([
            prisma.deal.count(),
            prisma.deal.count({ where: { isActive: true } }),
            prisma.click.count(),
            prisma.merchant.count(),
            prisma.click.findMany({
                take: 5,
                orderBy: { timestamp: 'desc' },
                include: {
                    deal: { select: { title: true } },
                    merchant: { select: { name: true } },
                    network: { select: { name: true } }
                }
            })
        ]);

        // Calculate unique visitors
        const clickLogsForUnique = await prisma.click.findMany({
            select: { id: true, ipAddress: true }
        });
        const uniqueVisitorIps = new Set(
            clickLogsForUnique.map(click => click.ipAddress || click.id)
        );
        const totalUniqueVisitors = uniqueVisitorIps.size;

        // Simple GroupBy equivalent to get clicks per merchant for a chart
        const topMerchants = await prisma.click.groupBy({
            by: ['merchantId'],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: 'desc',
                },
            },
            take: 5,
        });

        // Transform merchant IDs to names doing individual lookups (cacheable)
        // This could also be done via raw SQL for true join efficiency
        const topMerchantsWithNames = await Promise.all(
            topMerchants.map(async (m) => {
                const merchant = await prisma.merchant.findUnique({
                    where: { id: m.merchantId },
                    select: { name: true }
                });
                return {
                    name: merchant?.name || 'Unknown',
                    clicks: m._count.id
                };
            })
        );

        return NextResponse.json({
            stats: {
                totalDeals,
                activeDeals,
                totalClicks,
                totalUniqueVisitors,
                totalMerchants
            },
            recentClicks,
            topMerchants: topMerchantsWithNames
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json({ error: 'Failed to fetch admin statistics' }, { status: 500 });
    }
}
