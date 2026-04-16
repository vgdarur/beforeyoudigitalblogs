import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // Allow longer execution time for Cron on Vercel/GCP

function parsePrice(val: string): number | null {
    if (!val) return null;
    const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? null : num;
}

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        
        // Security check
        if (
            process.env.CRON_SECRET && 
            authHeader !== `Bearer ${process.env.CRON_SECRET}` &&
            request.headers.get('x-vercel-cron') !== process.env.CRON_SECRET
        ) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const activeFeeds = await prisma.feedSource.findMany({
            where: { isActive: true }
        });

        if (activeFeeds.length === 0) {
            return NextResponse.json({ message: 'No active feeds to process.' });
        }

        const results = [];

        // Ensure default category exists
        const defaultCategory = await prisma.category.upsert({
            where: { slug: 'general' },
            update: {},
            create: { name: 'General', slug: ' general' }
        });

        // Note: For massive scale, these should be queued (Google Cloud Tasks). 
        // We'll run them sequentially for V1.
        for (const feed of activeFeeds) {
            const job = await prisma.feedImportJob.create({
                data: {
                    status: 'PROCESSING',
                    itemsFound: 0,
                    startedAt: new Date(),
                    feedSourceId: feed.id
                }
            });

            try {
                // Fetch the remote CSV text
                const response = await fetch(feed.url);
                if (!response.ok) throw new Error(`Failed to fetch feed HTTP ${response.status}`);
                
                const text = await response.text();
                
                const parsed = Papa.parse(text, {
                    header: true,
                    skipEmptyLines: true,
                    // Leaving delimiter undefined forces PapaParse to auto-detect (comma, tab, pipe)
                    transformHeader: h => h.trim().toLowerCase()
                });

                const rows = parsed.data as any[];
                let imported = 0;
                const errors = [];

                await prisma.feedImportJob.update({
                    where: { id: job.id },
                    data: { itemsFound: rows.length }
                });

                for (let index = 0; index < rows.length; index++) {
                    const row = rows[index];
                    try {
                        // Comprehensive Network Mapping (CJ, Rakuten, Impact, ShareASale)
                        const title = row['title'] || row['name'] || row['product name'] || row['productname'];
                        const description = row['description'] || row['desc'] || row['product description'] || row['short product description'] || title;
                        const url = row['url'] || row['link'] || row['affiliate link'] || row['tracking url'] || row['buyurl'] || row['linkurl'] || row['product url'];
                        const merchantName = row['merchant'] || row['advertiser'] || row['store'] || row['program names'] || row['program name'] || row['manufacturer name'] || feed.name;

                        if (!title || !url) continue;

                        const price = parsePrice(row['price'] || row['sale price'] || row['current price'] || row['saleprice']);
                        const originalPrice = parsePrice(row['original price'] || row['retail price'] || row['price']);

                        let discountRatio = null;
                        if (price && originalPrice && originalPrice > price) {
                            discountRatio = (originalPrice - price) / originalPrice;
                        }

                        const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const merchant = await prisma.merchant.upsert({
                            where: { slug: merchantSlug },
                            update: {},
                            create: { name: merchantName, slug: merchantSlug }
                        });

                        const dealSlug = `${merchantSlug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${index}`;

                        await prisma.deal.upsert({
                            where: { slug: dealSlug },
                            update: {
                                price,
                                originalPrice,
                                discountRatio,
                                isActive: true,
                                updatedAt: new Date()
                            },
                            create: {
                                title: title.slice(0, 250),
                                slug: dealSlug,
                                description: String(description).slice(0, 1000),
                                price,
                                originalPrice,
                                discountRatio,
                                imageUrl: row['image url'] || row['image'] || null,
                                couponCode: row['coupon'] || row['code'] || null,
                                affiliateUrl: url,
                                merchantId: merchant.id,
                                categoryId: defaultCategory.id
                            }
                        });

                        imported++;
                    } catch (err: any) {
                        errors.push(`Row ${index}: ${err.message}`);
                    }
                }

                await prisma.feedImportJob.update({
                    where: { id: job.id },
                    data: {
                        status: 'COMPLETED',
                        itemsImported: imported,
                        completedAt: new Date(),
                        errorMessage: errors.length > 0 ? JSON.stringify(errors.slice(0, 5)) : null
                    }
                });

                results.push({ feed: feed.name, imported, errors: errors.length });

            } catch (jobErr: any) {
                await prisma.feedImportJob.update({
                    where: { id: job.id },
                    data: {
                        status: 'FAILED',
                        completedAt: new Date(),
                        errorMessage: jobErr.message
                    }
                });
                results.push({ feed: feed.name, status: 'FAILED', error: jobErr.message });
            }
        }

        return NextResponse.json({ success: true, processed: results });

    } catch (error: any) {
        console.error('Fatal cron error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
