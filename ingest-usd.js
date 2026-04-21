const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const inputPath = '/Users/venugopal/Downloads/impact (1).txt';
    const text = fs.readFileSync(inputPath, 'utf8');
    
    console.log("Parsing TSV...");
    const parsed = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        delimiter: "\t"
    });
    
    let rows = parsed.data;
    console.log(`Found ${rows.length} total rows. Filtering for USD...`);
    let imported = 0;

    for (const originalRow of rows) {
        // Standardize keys
        const row = Object.fromEntries(Object.entries(originalRow).map(([k, v]) => [String(k).toLowerCase().trim(), v]));
        
        // Skip Non-USD deals
        const currency = (row['currency'] || '').toUpperCase().trim();
        if (currency !== 'USD') {
            continue;
        }

        const title = row['title'] || row['name'] || row['product name'];
        const url = row['url'] || row['link'] || row['affiliate link'];
        const merchantName = row['merchant'] || row['advertiser'] || row['store'] || row['program names'] || row['program name'] || row['manufacturer name'] || 'Unknown Merchant';
        let categoryName = row['category name'] || row['category'] || 'Deals';
        
        if (!title || !url) continue;

        const price = parseFloat((row['price'] || row['sale price'] || row['current price'] || '').replace(/[^0-9.-]+/g, '')) || null;
        const originalPrice = parseFloat((row['retail price'] || row['original price'] || '').replace(/[^0-9.-]+/g, '')) || null;
        const discountRatio = price && originalPrice && originalPrice > price ? (originalPrice - price) / originalPrice : null;

        // Ensure Merchant
        const merchantSlug = String(merchantName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const merchant = await prisma.merchant.upsert({
            where: { slug: merchantSlug }, update: {},
            create: { name: merchantName, slug: merchantSlug }
        });

        // Ensure Category mapping natively from the CSV
        // Take the primary category if it's a long path like "electronics > electronics accessories"
        if (categoryName.includes('>')) {
            categoryName = categoryName.split('>').pop().trim();
        }
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        const catSlug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const category = await prisma.category.upsert({
            where: { slug: catSlug }, update: {},
            create: { name: categoryName, slug: catSlug }
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
                categoryId: category.id
            }
        });
        imported++;
    }
    console.log(`Successfully injected ${imported} USD products into live DB, properly categorized!`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
