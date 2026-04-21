const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const inputPath = '/Users/venugopal/Downloads/Campaigns.csv';
    console.log('Loading Campaigns.csv into memory...');
    const text = fs.readFileSync(inputPath, 'utf8');
    
    console.log('Parsing Campaigns...');
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    
    let rows = parsed.data;
    console.log(`Found ${rows.length} approved campaigns/stores to process.`);
    
    let imported = 0;
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        let name = row['Program Name'];
        const trackingLink = row['Tracking Link'];
        const advUrl = row['Advertiser URL'];
        
        if (!name || !trackingLink) continue;

        // Clean up common affiliate program suffixes from brand names
        name = name.replace(/ - Affiliate Program/gi, '')
                   .replace(/ Affiliate Program/gi, '')
                   .replace(/ - Amazon/gi, '')
                   .trim();

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        // Auto-generate highly reliable logo from their native website root domain!
        let logoUrl = null;
        if (advUrl) {
            try {
                const domain = new URL(advUrl).hostname.replace('www.', '');
                logoUrl = `https://logo.clearbit.com/${domain}`;
            } catch (e) {
                // Invalid URL
            }
        }

        await prisma.merchant.upsert({
            where: { slug: slug },
            update: {
                affiliateUrl: trackingLink,
                logoUrl: logoUrl || undefined
            },
            create: {
                name: name.slice(0, 50),
                slug: slug,
                affiliateUrl: trackingLink,
                logoUrl: logoUrl
            }
        }).catch(err => {
            console.error(`Skipping duplicate or error on ${name}`);
        });

        imported++;
    }
    
    console.log(`\n🎉 FINISHED! Successfully injected ${imported} approved Stores!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
