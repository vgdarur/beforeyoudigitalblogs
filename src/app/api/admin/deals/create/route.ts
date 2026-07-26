import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
        }

        const formData = await request.formData();

        // Extract required fields
        const title = formData.get('title') as string;
        const affiliateUrlRaw = formData.get('affiliateUrl') as string;
        const merchantName = formData.get('merchantName') as string;
        const categoryId = formData.get('categoryId') as string;

        if (!title || !affiliateUrlRaw || !merchantName || !categoryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cleanAmazonUrl = (url: string): string => {
            if (!url) return url;
            if (url.includes('amazon.com')) {
                return url.replace(/\/dp\/([A-Za-z0-9]{10})\/\?/, '/dp/$1?').replace(/\/gp\/product\/([A-Za-z0-9]{10})\/\?/, '/gp/product/$1?');
            }
            return url;
        };

        const affiliateUrl = cleanAmazonUrl(affiliateUrlRaw);

        // Extract optional fields
        const networkId = (formData.get('networkId') as string) || null;
        const description = (formData.get('description') as string) || '';
        const rawPrice = formData.get('price') as string;
        const rawOriginalPrice = formData.get('originalPrice') as string;
        const imageUrl = (formData.get('imageUrl') as string) || null;
        const youtubeUrl = (formData.get('youtubeUrl') as string) || null;
        const couponCode = (formData.get('couponCode') as string) || null;
        const rawExpirationDate = formData.get('expirationDate') as string;

        // Parse numbers
        let price = null;
        if (rawPrice) {
            const parsedPrice = parseFloat(rawPrice);
            if (!isNaN(parsedPrice)) price = parsedPrice;
        }

        let originalPrice = null;
        if (rawOriginalPrice) {
            const parsedOrig = parseFloat(rawOriginalPrice);
            if (!isNaN(parsedOrig)) originalPrice = parsedOrig;
        }

        let discountRatio = null;
        if (price && originalPrice && originalPrice > price) {
            discountRatio = (originalPrice - price) / originalPrice;
        }

        // Parse date
        let expirationDate = null;
        if (rawExpirationDate) {
            expirationDate = new Date(rawExpirationDate);
        }

        // Create or find merchant
        const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const merchant = await prisma.merchant.upsert({
            where: { slug: merchantSlug },
            update: {},
            create: { name: merchantName, slug: merchantSlug }
        });

        // Generate a unique slug for the deal
        const baseSlug = `${merchantSlug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
        const randomSuffix = Math.floor(Math.random() * 10000);
        const dealSlug = `${baseSlug}-${randomSuffix}`;

        // Insert deal
        await prisma.deal.create({
            data: {
                title: title.slice(0, 250),
                slug: dealSlug,
                description: description.slice(0, 1000),
                imageUrl: imageUrl,
                youtubeUrl: youtubeUrl,
                price: price,
                originalPrice: originalPrice,
                discountRatio: discountRatio,
                couponCode: couponCode,
                affiliateUrl: affiliateUrl,
                merchantId: merchant.id,
                networkId: networkId || undefined,
                categoryId: categoryId,
                expirationDate: expirationDate,
                isActive: true,
            }
        });

        // Redirect back to dashboard on success
        return NextResponse.redirect(new URL('/admin/dashboard', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);

    } catch (error) {
        console.error('Error creating manual deal:', error);
        return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
    }
}
