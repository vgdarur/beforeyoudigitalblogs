import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`));
        }

        const dealId = (await params).id;
        const formData = await request.formData();

        // Extract required fields
        const title = formData.get('title') as string;
        const affiliateUrlRaw = formData.get('affiliateUrl') as string;
        const merchantName = formData.get('merchantName') as string;
        const categoryId = formData.get('categoryId') as string;
        const networkId = formData.get('networkId') as string;
        const parsedNetworkId = networkId === '' ? null : networkId;

        if (!dealId || !title || !affiliateUrlRaw || !merchantName || !categoryId) {
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

        // Get existing deal to check details
        const existing = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { merchant: true }
        });

        if (!existing) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        // Regenerate slug ONLY if title or merchant name changes (reusing the deal)
        let dealSlug = existing.slug;
        if (existing.title !== title || existing.merchant.name !== merchantName) {
            const baseSlug = `${merchantSlug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
            const randomSuffix = Math.floor(Math.random() * 10000);
            dealSlug = `${baseSlug}-${randomSuffix}`;
        }

        const priorityScoreValue = existing.priorityScore === 1 ? 0 : undefined;

        // Update deal
        await prisma.deal.update({
            where: { id: dealId },
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
                networkId: parsedNetworkId,
                categoryId: categoryId,
                expirationDate: expirationDate,
                ...(priorityScoreValue !== undefined ? { priorityScore: priorityScoreValue } : {})
            }
        });

        // Redirect back to dashboard on success
        return NextResponse.redirect(new URL('/admin/deals', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 303);

    } catch (error) {
        console.error('Error updating deal:', error);
        return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
    }
}
