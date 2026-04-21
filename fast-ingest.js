const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const inputPath = '/Users/venugopal/Downloads/impact.txt';
    const text = fs.readFileSync(inputPath, 'utf8');
    
    const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: "\t"
    });
    
    let rows = parsed.data;
    console.log(`Injecting ${rows.length} pristine Product Deals...`);
    let imported = 0;

    for (const originalRow of rows) {
        const row = Object.fromEntries(Object.entries(originalRow).map(([k, v]) => [String(k).toLowerCase().trim(), v]));
        
        const title = row['title'] || row['name'] || row['product name'];
        const url = row['url'] || row['link'] || row['affiliate link'];
        const merchantName = row['merchant'] || row['advertiser'] || row['store'] || row['program names'] || row['program name'] || row['manufacturer name'] || 'Unknown Merchant';
        
        if (!title || !url) continue;

        const price = parseFloat((row['price'] || row['sale price'] || row['current price'] || '').replace(/[^0-9.-]+/g, '')) || null;
        const originalPrice = parseFloat((row['retail price'] || row['original price'] || '').replace(/[^0-9.-]+/g, '')) || null;
        const discountRatio = price && originalPrice && originalPrice > price ? (originalPrice - price) / originalPrice : null;

        const merchantSlug = String(merchantName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const merchant = await prisma.merchant.upsert({
            where: { slug: merchantSlug }, update: {},
            create: { name: merchantName, slug: merchantSlug }
        });

        const defaultCategory = await prisma.category.upsert({
            where: { slug: "impact-deals" }, update: {},
            create: { name: "Special Offers", slug: "impact-deals" }
        });

        const dealSlug = `${merchantSlug}-${String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}-${Math.random().toString(36).slice(2,7)}`;

        await prisma.deal.create({
            data: {
                title: String(title).slice(0, 250),
                slug: dealSlug,
                description: String(row['description'] || row['desc'] || title).slice(0, 1000),
                imageUrl: row['image url'] || row['image'] || null,
                price: price,
                originalPrice: originalPrice,
                discountRatio: discountRatio,
                affiliateUrl: String(url),
                merchantId: merchant.id,
                categoryId: defaultCategory.id
            }
        });
        imported++;
    }
    console.log(`Successfully injected ${imported} products into live DB!`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
