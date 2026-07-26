import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

// Helper to convert typical affiliate CSV formats to our schema
function parsePrice(val: string): number | null {
    if (!val) return null;
    const num = parseFloat(val.replace(/[^0-9.-]+/g, ""));
    return isNaN(num) ? null : num;
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const networkId = formData.get('networkId') as string;
        const defaultCategoryId = formData.get('categoryId') as string;

        if (!file || !networkId || !defaultCategoryId) {
            return NextResponse.json(
                { error: 'Missing required fields (file, networkId, categoryId)' },
                { status: 400 }
            );
        }

        const text = await file.text();

        // Parse CSV
        // Expecting columns roughly like: Title, Description, Image URL, Price, Retail Price, URL, Merchant Name, Expiration Date
        const parsed = Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            transformHeader: h => h.trim().toLowerCase()
        });

        if (parsed.errors.length > 0) {
            console.warn("CSV Parsing errors:", parsed.errors);
        }

        const rows = parsed.data as any[];
        let imported = 0;
        const errors = [];

        // Create an import job record
        const job = await prisma.feedImportJob.create({
            data: {
                status: 'PROCESSING',
                itemsFound: rows.length,
                startedAt: new Date(),
                // Link to a dummy or default feed source for manual uploads
                feedSource: {
                    connectOrCreate: {
                        where: { id: 'manual-upload' },
                        create: { name: 'Manual CSV Upload', url: 'local', format: 'CSV' }
                    }
                }
            }
        });

        // Process rows synchronously for simplicity, but in production would use a background worker
        for (let index = 0; index < rows.length; index++) {
            const row = rows[index];
            try {
                // Map common column names (CJ, Rakuten, Impact, ShareASale)
                const title = row['title'] || row['name'] || row['product name'] || row['productname'];
                const description = row['description'] || row['desc'] || row['product description'] || row['short product description'] || title;
                const url = row['url'] || row['link'] || row['affiliate link'] || row['tracking url'] || row['buyurl'] || row['linkurl'] || row['product url'];
                const merchantName = row['merchant'] || row['advertiser'] || row['store'] || row['program names'] || row['program name'] || row['manufacturer name'] || row['advertisername'] || row['advertiser name'] || 'Unknown Merchant';

                if (!title || !url) {
                    errors.push(`Row ${index + 1}: Missing required title or URL`);
                    continue;
                }

                const price = parsePrice(row['price'] || row['sale price'] || row['current price'] || row['saleprice']);
                const originalPrice = parsePrice(row['original price'] || row['retail price'] || row['retailprice'] || row['price']);

                let discountRatio = null;
                if (price && originalPrice && originalPrice > price) {
                    discountRatio = (originalPrice - price) / originalPrice;
                }

                // 1. Ensure Merchant Exists
                const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const merchant = await prisma.merchant.upsert({
                    where: { slug: merchantSlug },
                    update: {},
                    create: { name: merchantName, slug: merchantSlug }
                });

                // 2. Create Deal
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
                        description: description.slice(0, 1000),
                        imageUrl: row['image url'] || row['image'] || null,
                        price,
                        originalPrice,
                        discountRatio,
                        couponCode: row['coupon'] || row['code'] || null,
                        affiliateUrl: url,
                        merchantId: merchant.id,
                        networkId: networkId,
                        categoryId: defaultCategoryId,
                        // Simple expiration parsing if exists
                        expirationDate: row['expiration'] || row['end date'] ? new Date(row['expiration'] || row['end date']) : null
                    }
                });

                imported++;
            } catch (err: any) {
                errors.push(`Row ${index + 1}: ${err.message}`);
            }
        }

        // Update job status
        await prisma.feedImportJob.update({
            where: { id: job.id },
            data: {
                status: errors.length > 0 && imported === 0 ? 'FAILED' : 'COMPLETED',
                itemsImported: imported,
                completedAt: new Date(),
                errorMessage: errors.length > 0 ? JSON.stringify(errors.slice(0, 10)) : null
            }
        });

        return NextResponse.json({
            success: true,
            jobId: job.id,
            itemsFound: rows.length,
            itemsImported: imported,
            errors: errors.slice(0, 10) // Only return first 10 rules to client
        });

    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json({ error: error.message || 'Server error during import' }, { status: 500 });
    }
}
