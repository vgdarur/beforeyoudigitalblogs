import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Missing required file' },
                { status: 400 }
            );
        }

        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = parsed.data as Record<string, string>[];
        
        const errors: string[] = [];
        let imported = 0;

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            
            // Expected headers perfectly matching Impact Campaigns.csv
            let name = row['Program Name'] || row['Program Names'];
            const trackingLink = row['Tracking Link'];
            const advUrl = row['Advertiser URL'];
            
            if (!name || !trackingLink) {
                errors.push(`Row ${i + 1}: Missing Program Name or Tracking Link`);
                continue;
            }

            // Clean common corporate affixes
            name = name.replace(/ - Affiliate Program/gi, '')
                       .replace(/ Affiliate Program/gi, '')
                       .replace(/ - Amazon/gi, '')
                       .trim();

            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            
            // Clearbit Auto-logo generation
            let logoUrl = null;
            if (advUrl) {
                try {
                    const domain = new URL(advUrl).hostname.replace('www.', '');
                    logoUrl = `https://logo.clearbit.com/${domain}`;
                } catch (e) {
                    // Invalid URL
                }
            }

            try {
                await prisma.merchant.upsert({
                    where: { slug: slug },
                    update: {
                        affiliateUrl: trackingLink,
                        logoUrl: logoUrl || undefined // Don't wipe existing logo if Clearbit fails
                    },
                    create: {
                        name: name.slice(0, 50),
                        slug: slug,
                        affiliateUrl: trackingLink,
                        logoUrl: logoUrl
                    }
                });
                imported++;
            } catch (err: any) {
                errors.push(`Row ${i + 1}: DB Error - ${err.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            itemsFound: rows.length,
            itemsImported: imported,
            errors: errors.slice(0, 10) // Only send first 10 for UI brevity
        });

    } catch (error: any) {
        console.error('Campaign Import API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error during import' }, { status: 500 });
    }
}
