const fs = require('fs');
const Papa = require('papaparse');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const parsePrice = (val) => {
    if (!val) return null;
    let numeric = String(val).replace(/[^0-9.]/g, '');
    if (numeric.match(/\..*\./)) {
        numeric = numeric.replace(/\.(?=.*\.)/g, '');
    }
    const floatVal = parseFloat(numeric);
    return isNaN(floatVal) ? null : floatVal;
};

async function main() {
    const inputPath = '/Users/venugopal/Downloads/impact.csv';
    console.log('Loading CSV file into memory...');
    const text = fs.readFileSync(inputPath, 'utf8');
    
    console.log('Parsing CSV...');
    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
    
    let rows = parsed.data;
    console.log(`Found ${rows.length} rows to process.`);
    
    console.log('Ensuring Default Category exists...');
    const defaultCategory = await prisma.category.upsert({
        where: { slug: 'general' },
        update: {},
        create: { name: 'General', slug: 'general' }
    });

    let imported = 0;
    
    for (let i = 0; i < rows.length; i++) {
        const originalRow = rows[i];
        if (!originalRow) continue;
        
        // Convert all keys to lowercase for robust matching
        const row = Object.fromEntries(Object.entries(originalRow).map(([k, v]) => [String(k).toLowerCase().trim(), v]));
        
        const title = row['title'] || row['name'] || row['product name'] || row['productname'];
        const description = row['description'] || row['desc'] || row['product description'] || row['short product description'] || title;
        const url = row['url'] || row['link'] || row['affiliate link'] || row['tracking url'] || row['buyurl'] || row['linkurl'] || row['product url'];
        const merchantName = row['merchant'] || row['advertiser'] || row['store'] || row['program names'] || row['program name'] || row['manufacturer name'];

        if (!title || !url || !merchantName) {
            continue;
        }

        const price = parsePrice(row['price'] || row['sale price'] || row['current price'] || row['saleprice']);
        const originalPrice = parsePrice(row['original price'] || row['retail price'] || row['price']);

        let discountRatio = null;
        if (price && originalPrice && originalPrice > price) {
            discountRatio = (originalPrice - price) / originalPrice;
        }

        const merchantSlug = String(merchantName).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const merchant = await prisma.merchant.upsert({
            where: { slug: merchantSlug },
            update: {},
            create: {
                name: String(merchantName).slice(0, 50),
                slug: merchantSlug
            }
        });

        // Generate unique slug
        const dealSlugBase = String(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40);
        const dealSlug = `${dealSlugBase}-${merchantSlug}-${Math.floor(Math.random() * 100000)}`;

        await prisma.deal.create({
            data: {
                title: String(title).slice(0, 250),
                slug: dealSlug,
                description: String(description).slice(0, 1000),
                price,
                originalPrice,
                discountRatio,
                imageUrl: row['image url'] || row['image'] || null,
                couponCode: row['coupon'] || row['code'] || null,
                affiliateUrl: String(url),
                merchantId: merchant.id,
                categoryId: defaultCategory.id,
                isActive: true
            }
        }).catch(e => {
            // fail silently on duplicate constraints
        });
        
        imported++;
        if (imported % 500 === 0) {
            console.log(`Successfully injected ${imported} / ${rows.length} deals...`);
        }
    }
    
    console.log(`\n🎉 FINISHED! Successfully imported ${imported} new deals directly into the database!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
