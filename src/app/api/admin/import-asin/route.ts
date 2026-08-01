import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AmazonPAAPI } from '@/lib/amazon';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { asins, categoryId } = body;

        if (!asins || !Array.isArray(asins) || asins.length === 0) {
            return NextResponse.json({ error: 'A list of ASINs is required.' }, { status: 400 });
        }

        if (!categoryId) {
            return NextResponse.json({ error: 'Category ID is required.' }, { status: 400 });
        }

        const paapi = new AmazonPAAPI();
        const results = [];
        let successCount = 0;

        for (let asin of asins) {
            let cleanAsin = asin.trim().toUpperCase();
            // Try to extract ASIN if a full link is pasted
            if (cleanAsin.length !== 10) {
                const match = asin.match(/(?:dp|gp\/product|d)\/([A-Za-z0-9]{10})/i);
                if (match && match[1]) {
                    cleanAsin = match[1].toUpperCase();
                } else {
                    results.push({ asin, status: 'error', message: 'Invalid ASIN format' });
                    continue;
                }
            }

            try {
                const product = await paapi.getProductByASIN(cleanAsin);
                
                if (!product) {
                    results.push({ asin: cleanAsin, status: 'error', message: 'No product found on Amazon' });
                    continue;
                }

                // Check if deal already exists
                const existingDeal = await prisma.deal.findFirst({
                    where: { affiliateUrl: { contains: cleanAsin } }
                });

                if (existingDeal) {
                    results.push({ asin: cleanAsin, status: 'error', message: 'Deal already exists in DB' });
                    continue;
                }

                // Find or create Merchant
                const merchantName = product.brand || 'Amazon';
                const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const merchant = await prisma.merchant.upsert({
                    where: { slug: merchantSlug },
                    update: {},
                    create: { name: merchantName, slug: merchantSlug }
                });

                const discountRatio = (product.price && product.originalPrice && product.originalPrice > product.price) 
                    ? (product.originalPrice - product.price) / product.originalPrice 
                    : null;

                const baseSlug = `${merchantSlug}-${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
                const randomSuffix = Math.floor(Math.random() * 10000);
                const dealSlug = `${baseSlug}-${randomSuffix}`;

                await prisma.deal.create({
                    data: {
                        title: product.title.slice(0, 250),
                        slug: dealSlug,
                        description: product.description.slice(0, 1000),
                        price: product.price,
                        originalPrice: product.originalPrice,
                        discountRatio: discountRatio,
                        imageUrl: product.imageUrl,
                        affiliateUrl: product.detailUrl,
                        merchantId: merchant.id,
                        categoryId: categoryId,
                        isActive: true
                    }
                });

                successCount++;
                results.push({ asin: cleanAsin, status: 'success', message: 'Imported successfully' });

            } catch (err: any) {
                console.error(`Error importing ASIN ${cleanAsin}:`, err);
                results.push({ asin: cleanAsin, status: 'error', message: err.message || 'Server error' });
            }
        }

        return NextResponse.json({ success: true, successCount, results });
    } catch (err: any) {
        console.error('Bulk ASIN import error:', err);
        return NextResponse.json({ error: err.message || 'Failed to process bulk import.' }, { status: 500 });
    }
}
