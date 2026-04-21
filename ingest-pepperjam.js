const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const inputPath = '/Users/venugopal/Downloads/Assets.csv';
    const text = fs.readFileSync(inputPath, 'utf8');
    
    console.log("Parsing Pepperjam Assets...");
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    
    let rows = parsed.data;
    console.log(`Found ${rows.length} total Pepperjam rows.`);
    let imported = 0;

    for (const row of rows) {
        let name = row['Name'];
        let description = row['Description'] || name;
        let url = row['TrackingLink'];
        let landingPage = row['LandingPage'];
        let promoCode = row['DealDefaultDiscountCode'] || null;

        if (!name || !url || !landingPage) continue;

        // Pepperjam often lacks Advertiser Name in Assets.csv, so we elegantly parse the domain
        let merchantName = "Ascend Partner";
        let logoUrl = null;
        try {
            const urlObj = new URL(landingPage);
            const domain = urlObj.hostname.replace('www.', '');
            merchantName = domain.split('.')[0];
            merchantName = merchantName.charAt(0).toUpperCase() + merchantName.slice(1);
            logoUrl = `https://logo.clearbit.com/${domain}`;
        } catch(e) {}

        const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const merchant = await prisma.merchant.upsert({
            where: { slug: merchantSlug }, update: {},
            create: { name: merchantName, slug: merchantSlug, logoUrl: logoUrl }
        });

        // Default Category for generic Pepperjam assets
        const category = await prisma.category.upsert({
            where: { slug: "partner-offers" }, update: {},
            create: { name: "Partner Offers", slug: "partner-offers" }
        });

        const dealSlug = `${merchantSlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}-${Math.random().toString(36).slice(2,7)}`;

        await prisma.deal.create({
            data: {
                title: name.slice(0, 250),
                slug: dealSlug,
                description: description.slice(0, 1000),
                imageUrl: null, // Pepperjam Assets are usually pure text/promo
                couponCode: promoCode,
                affiliateUrl: url,
                merchantId: merchant.id,
                categoryId: category.id
            }
        });
        imported++;
    }
    console.log(`Successfully injected ${imported} Pepperjam Assets into live DB!`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
