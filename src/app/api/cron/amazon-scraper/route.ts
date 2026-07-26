import { NextResponse } from 'next/server';
import { AmazonScraper } from '@/lib/amazon-scraper';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const scraper = new AmazonScraper();
        let totalImported = 0;

        const indices = [
            { index: 'Electronics', kw: 'deals' },
            { index: 'Grocery', kw: 'snacks' },
            { index: 'HomeGarden', kw: 'deals' },
            { index: 'Beauty', kw: 'moisturizer' }
        ];

        const detailsLog: string[] = [];

        for (const target of indices) {
            console.log(`Scraping Amazon ${target.index} for keywords: "${target.kw}"...`);
            const products = await scraper.fetchDealsFromAmazon(target.index, target.kw);
            
            if (products.length > 0) {
                const imported = await scraper.importDeals(products);
                totalImported += imported;
                detailsLog.push(`Successfully imported/updated ${imported} deals from ${target.index}`);
            } else {
                detailsLog.push(`No active discounted items returned for ${target.index}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Scraper finished. Total deals processed: ${totalImported}`,
            details: detailsLog,
            timestamp: new Date().toISOString()
        });
    } catch (err: any) {
        console.error('Amazon scraper cron crash:', err);
        return NextResponse.json({
            success: false,
            error: err.message || 'Scraper encountered a critical error.'
        }, { status: 500 });
    }
}
