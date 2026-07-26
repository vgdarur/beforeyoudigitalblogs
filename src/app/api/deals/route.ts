import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        const query = searchParams.get('q');
        const category = searchParams.get('category');
        const merchant = searchParams.get('merchant');
        const network = searchParams.get('network');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const featured = searchParams.get('featured');

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = searchParams.get('sortBy') || 'updatedAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build the Prisma where clause
        const where: any = {
            isActive: true,
            // Default: don't show expired deals unless explicitly requested
            OR: [
                { expirationDate: null },
                { expirationDate: { gt: new Date() } }
            ]
        };

        if (query) {
            where.OR = [
                { title: { contains: query } },
                { description: { contains: query } }
            ];
        }

        if (category) where.categoryId = category;
        if (merchant) where.merchantId = merchant;
        if (network) where.networkId = network;
        if (featured === 'true') where.isFeatured = true;

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const [deals, totalCount] = await Promise.all([
            prisma.deal.findMany({
                where,
                include: {
                    merchant: true,
                    network: true,
                    category: true,
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            prisma.deal.count({ where }),
        ]);

        const mappedDeals = deals.map(deal => {
            // For manual deals (priorityScore !== 1), provide a separate detailUrl field and keep original affiliateUrl intact
            if (deal.priorityScore !== 1 && deal.slug) {
                return {
                    ...deal,
                    detailUrl: `https://aidealsofamerica.com/deals/${deal.slug}`
                };
            }
            return deal;
        });

        return NextResponse.json({
            deals: mappedDeals,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            }
        });
    } catch (error) {
        console.error('Error fetching deals:', error);
        return NextResponse.json(
            { error: 'Failed to fetch deals' },
            { status: 500 }
        );
    }
}
