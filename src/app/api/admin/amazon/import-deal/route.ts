import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAmazonGoldboxDeals } from '@/lib/amazon-scraper';

function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

export async function POST(request: Request) {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { asin } = body;

        if (!asin) {
            return NextResponse.json({ error: 'ASIN parameter is required.' }, { status: 400 });
        }

        // Fetch deals from the JSON feed
        const allDeals = await getAmazonGoldboxDeals();
        const deal = allDeals.find(d => d.asin.toUpperCase() === asin.toUpperCase());

        if (!deal) {
            return NextResponse.json({ error: `Product with ASIN ${asin} not found in the daily deals feed.` }, { status: 404 });
        }

        // Check if the deal already exists in the main DB
        const slug = `${slugify(deal.title.slice(0, 40))}-${deal.asin}`;
        const existingDeal = await prisma.deal.findFirst({
            where: {
                OR: [
                    { slug },
                    { title: deal.title }
                ]
            }
        });

        if (existingDeal) {
            return NextResponse.json({ 
                success: true, 
                message: 'Deal already exists in the database.', 
                dealId: existingDeal.id 
            });
        }

        // Find or create "Amazon" merchant
        let amazonMerchant = await prisma.merchant.findFirst({
            where: { name: 'Amazon' }
        });

        if (!amazonMerchant) {
            amazonMerchant = await prisma.merchant.create({
                data: {
                    name: 'Amazon',
                    slug: 'amazon',
                    logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&auto=format&fit=crop&q=80'
                }
            });
        }

        // Find or create category
        let category = await prisma.category.findFirst({
            where: { name: deal.categoryName }
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: deal.categoryName,
                    slug: slugify(deal.categoryName)
                }
            });
        }

        const discountRatio = (deal.originalPrice - deal.price) / deal.originalPrice;

        // Insert new manual deal in DB
        const newDbDeal = await prisma.deal.create({
            data: {
                title: deal.title,
                slug,
                description: deal.description,
                price: deal.price,
                originalPrice: deal.originalPrice,
                discountRatio,
                affiliateUrl: deal.detailUrl,
                imageUrl: deal.imageUrl,
                isActive: true,
                priorityScore: 0, // Promote to manual deal!
                merchantId: amazonMerchant.id,
                categoryId: category.id,
            }
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Successfully promoted deal to database.', 
            dealId: newDbDeal.id 
        });
    } catch (err: any) {
        console.error('Failed to import deal from feed:', err);
        return NextResponse.json({ error: err.message || 'Failed to import deal.' }, { status: 500 });
    }
}
