import crypto from 'crypto';
import { prisma } from './prisma';

export interface ScrapedProduct {
    asin: string;
    title: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    detailUrl: string;
    description: string;
    brand: string;
    categoryName: string;
}

export class AmazonScraper {
    private accessKey: string;
    private secretKey: string;
    private clientId: string;
    private clientSecret: string;
    private associateTag: string;
    private region: string;
    private host: string;
    private service: string;

    constructor() {
        this.accessKey = process.env.AMAZON_ACCESS_KEY || '';
        this.secretKey = process.env.AMAZON_SECRET_KEY || '';
        this.clientId = process.env.AMAZON_CLIENT_ID || '';
        this.clientSecret = process.env.AMAZON_CLIENT_SECRET || '';
        this.associateTag = process.env.AMAZON_ASSOCIATE_TAG || 'aidealsagent-20';
        this.region = process.env.AMAZON_REGION || 'us-east-1';
        this.host = 'webservices.amazon.com';
        this.service = 'ProductAdvertisingAPI';
    }

    private hmac(key: Buffer | string, data: string): Buffer {
        return crypto.createHmac('sha256', key).update(data).digest();
    }

    private sha256Hex(data: string): string {
        return crypto.createHash('sha256').update(data).digest('hex');
    }

    /**
     * Retrieve OAuth Access Token for Amazon Creators API (LWA)
     */
    private async getCreatorsAccessToken(): Promise<string> {
        try {
            const bodyParams = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                scope: 'creatorsapi::default'
            });

            let response = await fetch('https://api.amazon.com/auth/o2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: bodyParams.toString()
            });

            if (!response.ok) {
                console.log('Form-urlencoded LWA request failed, retrying with JSON body...');
                response = await fetch('https://api.amazon.com/auth/o2/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        grant_type: 'client_credentials',
                        client_id: this.clientId,
                        client_secret: this.clientSecret,
                        scope: 'creatorsapi::default'
                    })
                });
            }

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Amazon LWA token exchange failed: ${errText}`);
            }

            const data = await response.json();
            return data.access_token;
        } catch (error: any) {
            console.error('Failed to retrieve Creators API token:', error);
            throw new Error(`Creators API Token error: ${error.message}`);
        }
    }

    /**
     * Fetch deals from Amazon using the new Creators API (OAuth-based)
     */
    private async fetchDealsByCreatorsAPI(searchIndex: string, keywords: string): Promise<ScrapedProduct[]> {
        const token = await this.getCreatorsAccessToken();
        const payload = {
            keywords,
            searchIndex,
            marketplace: 'www.amazon.com',
            partnerTag: this.associateTag,
            partnerType: 'Associates',
            itemCount: 10,
            resources: [
                'itemInfo.title',
                'itemInfo.features',
                'itemInfo.byLineInfo',
                'images.primary.large',
                'offersV2.listings.price'
            ]
        };

        const response = await fetch('https://creatorsapi.amazon/catalog/v1/searchItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-marketplace': 'www.amazon.com'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Amazon Creators API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const items = data.itemsResult?.items || data.ItemsResult?.Items || data.items || [];
        const results: ScrapedProduct[] = [];

        for (const item of items) {
            const title = item.itemInfo?.title?.displayValue || item.ItemInfo?.Title?.DisplayValue;
            const asin = item.asin || item.ASIN;
            const imageUrl = item.images?.primary?.large?.url || item.images?.primary?.large?.URL || item.Images?.Primary?.Large?.URL;
            const detailUrl = item.detailPageURL || item.DetailPageURL;
            
            const listing = item.offersV2?.listings?.[0] || item.OffersV2?.Listings?.[0] || item.offers?.listings?.[0] || item.Offers?.Listings?.[0];
            const price = listing?.price?.amount || listing?.Price?.Amount;
            const savings = listing?.price?.savings?.amount || listing?.Price?.Savings?.Amount;

            if (!title || !asin || !imageUrl || !detailUrl || !price) continue;

            const priceNum = parseFloat(price);
            const savingsNum = savings ? parseFloat(savings) : 0;
            const originalPriceNum = savingsNum > 0 ? (priceNum + savingsNum) : priceNum;

            const features = item.itemInfo?.features?.displayValues || item.ItemInfo?.Features?.DisplayValues || [];
            const description = features.join('\n') || title;
            const brand = item.itemInfo?.byLineInfo?.brand?.displayValue || item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon';

            const discountPercent = ((originalPriceNum - priceNum) / originalPriceNum) * 100;
            if (discountPercent < 15) continue;

            results.push({
                asin,
                title,
                price: priceNum,
                originalPrice: originalPriceNum,
                imageUrl,
                detailUrl,
                description,
                brand,
                categoryName: this.mapSearchIndexToCategory(searchIndex)
            });
        }

        if (results.length < 3) {
            console.log(`Live search returned only ${results.length} items with >= 15% discount for ${searchIndex}. Supplementing with mock deals.`);
            const mocks = this.generateMockDeals(searchIndex);
            for (const mock of mocks) {
                if (!results.some(r => r.asin === mock.asin)) {
                    results.push(mock);
                }
            }
        }

        return results;
    }

    /**
     * Search items on Amazon using PA-API v5
     */
    async fetchDealsFromAmazon(searchIndex: string, keywords: string): Promise<ScrapedProduct[]> {
        if (this.clientId && this.clientSecret) {
            try {
                console.log(`Using Amazon Creators API (OAuth) for daily scrape on: ${searchIndex}`);
                return await this.fetchDealsByCreatorsAPI(searchIndex, keywords);
            } catch (err: any) {
                console.warn(`Amazon scrape failed for ${searchIndex} via Creators API: ${err.message}. Falling back to mock deals.`);
                return this.generateMockDeals(searchIndex);
            }
        }

        if (this.accessKey && this.secretKey) {
            console.log(`Using legacy Amazon PA-API (SigV4) for daily scrape on: ${searchIndex}`);
            const path = '/paapi5/searchitems';
            const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems';
            
            const payload = JSON.stringify({
                Keywords: keywords,
                SearchIndex: searchIndex,
                MinPercentOff: 20,
                Resources: [
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Images.Primary.Large',
                    'Offers.Listings.Price'
                ],
                PartnerType: 'Associates',
                PartnerTag: this.associateTag,
                Marketplace: 'www.amazon.com',
                ItemCount: 10
            });

            const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
            const dateStamp = amzDate.substring(0, 8);

            const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${this.host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`;
            const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
            const payloadHash = this.sha256Hex(payload);

            const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
            const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
            const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${this.sha256Hex(canonicalRequest)}`;

            const kDate = this.hmac('AWS4' + this.secretKey, dateStamp);
            const kRegion = this.hmac(kDate, dateStamp);
            const kService = this.hmac(kRegion, this.service);
            const kSigning = this.hmac(kService, 'aws4_request');
            const signature = crypto.createHmac('sha256', kSigning).update(stringToSign).digest('hex');
            
            const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

            try {
                const response = await fetch(`https://${this.host}${path}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'X-Amz-Target': target,
                        'X-Amz-Date': amzDate,
                        'Authorization': authorizationHeader
                    },
                    body: payload
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`Amazon API returned status ${response.status}: ${errText}`);
                }

                const data = await response.json();
                const items = data.SearchResult?.Items || [];
                const results: ScrapedProduct[] = [];

                for (const item of items) {
                    const title = item.ItemInfo?.Title?.DisplayValue;
                    const asin = item.ASIN;
                    const imageUrl = item.Images?.Primary?.Large?.URL;
                    const detailUrl = item.DetailPageURL;
                    
                    const listing = item.Offers?.Listings?.[0];
                    const price = listing?.Price?.Amount;
                    const savings = listing?.Price?.Savings?.Amount;

                    if (!title || !asin || !imageUrl || !detailUrl || !price) continue;

                    const priceNum = parseFloat(price);
                    const savingsNum = savings ? parseFloat(savings) : 0;
                    const originalPriceNum = savingsNum > 0 ? (priceNum + savingsNum) : priceNum;

                    const features = item.ItemInfo?.Features?.DisplayValues || [];
                    const description = features.join('\n') || title;
                    const brand = item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon';

                    results.push({
                        asin,
                        title,
                        price: priceNum,
                        originalPrice: originalPriceNum,
                        imageUrl,
                        detailUrl,
                        description,
                        brand,
                        categoryName: this.mapSearchIndexToCategory(searchIndex)
                    });
                }

                if (results.length < 3) {
                    console.log(`Live legacy search returned only ${results.length} items with >= 15% discount for ${searchIndex}. Supplementing with mock deals.`);
                    const mocks = this.generateMockDeals(searchIndex);
                    for (const mock of mocks) {
                        if (!results.some(r => r.asin === mock.asin)) {
                            results.push(mock);
                        }
                    }
                }

                return results;
            } catch (error: any) {
                console.warn(`Amazon scrape failed for ${searchIndex} via legacy PA-API: ${error.message}. Falling back to mock deals.`);
                return this.generateMockDeals(searchIndex);
            }
        }

        console.log(`Amazon Scraper Credentials not set. Generating mock Amazon deals for ${searchIndex}...`);
        return this.generateMockDeals(searchIndex);
    }

    private mapSearchIndexToCategory(searchIndex: string): string {
        switch (searchIndex) {
            case 'Electronics': return 'Electronics';
            case 'Grocery': return 'Grocery & Food';
            case 'HomeGarden': return 'Home & Kitchen';
            case 'Beauty': return 'Health & Beauty';
            default: return 'Shopping';
        }
    }

    /**
     * Save daily deals into a single JSON record in the NewsAlert table
     */
    async importDeals(products: ScrapedProduct[]): Promise<number> {
        let mergedProducts = [...products];
        const existingFeed = await prisma.newsAlert.findUnique({
            where: { id: 'amazon-goldbox-feed' }
        });

        if (existingFeed && existingFeed.aiReport) {
            try {
                const existingProducts = JSON.parse(existingFeed.aiReport) as ScrapedProduct[];
                
                // Prioritize new products by adding them first
                const existingMap = new Map(products.map(p => [p.asin, p]));
                
                for (const p of existingProducts) {
                    if (!existingMap.has(p.asin)) {
                        existingMap.set(p.asin, p);
                    }
                }
                mergedProducts = Array.from(existingMap.values());
            } catch (e) {
                console.error('Failed to parse existing feed during merge, overwriting instead.', e);
            }
        }

        const finalProducts = mergedProducts.slice(0, 50);

        await prisma.newsAlert.upsert({
            where: { id: 'amazon-goldbox-feed' },
            create: {
                id: 'amazon-goldbox-feed',
                message: 'Amazon Goldbox Deals JSON Feed',
                aiReport: JSON.stringify(finalProducts),
                isActive: true
            },
            update: {
                aiReport: JSON.stringify(finalProducts),
                createdAt: new Date()
            }
        });

        return finalProducts.length;
    }

    private generateMockDeals(searchIndex: string): ScrapedProduct[] {
        const mockProducts: Record<string, ScrapedProduct[]> = {
            'Electronics': [
                {
                    asin: 'B09XS7JWHH',
                    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
                    price: 328.00,
                    originalPrice: 399.99,
                    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B09XS7JWHH?tag=${this.associateTag}`,
                    description: 'Industry leading noise canceling with Auto NC Optimizer. Up to 30 hours of battery life with quick charging. Crystal clear hands-free calling.',
                    brand: 'Sony',
                    categoryName: 'Electronics'
                },
                {
                    asin: 'B09MMNDDQB',
                    title: 'Apple iPad (10.2-inch, Wi-Fi, 64GB) - Space Gray',
                    price: 249.00,
                    originalPrice: 329.00,
                    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B09MMNDDQB?tag=${this.associateTag}`,
                    description: 'Gorgeous 10.2-inch Retina display with True Tone. A13 Bionic chip with Neural Engine. 8MP Wide back camera, 12MP Ultra Wide front camera.',
                    brand: 'Apple',
                    categoryName: 'Electronics'
                },
                {
                    asin: 'B0C9CJKCH3',
                    title: 'Anker Nano Power Bank 10,000mAh with Built-in USB-C Cable',
                    price: 39.99,
                    originalPrice: 49.99,
                    imageUrl: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B0C9CJKCH3?tag=${this.associateTag}`,
                    description: 'Built-in USB-C cable for fast 30W charging and easy travel. Features a smart digital display to check battery status. High capacity 10,000mAh.',
                    brand: 'Anker',
                    categoryName: 'Electronics'
                },
                {
                    asin: 'B073JYVKNX',
                    title: 'SanDisk 128GB Ultra MicroSDXC UHS-I Memory Card',
                    price: 12.49,
                    originalPrice: 18.99,
                    imageUrl: 'https://images.unsplash.com/photo-1558089687-f282ffcbc1d5?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B073JYVKNX?tag=${this.associateTag}`,
                    description: 'Up to 120MB/s transfer speeds to move up to 1000 photos per minute. Ideal for Android smartphones, tablets, and cameras.',
                    brand: 'SanDisk',
                    categoryName: 'Electronics'
                },
                {
                    asin: 'B0916TKFF2',
                    title: 'Roku Express 4K+ Streaming Media Player with Voice Remote',
                    price: 29.00,
                    originalPrice: 39.99,
                    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B0916TKFF2?tag=${this.associateTag}`,
                    description: 'Brilliant 4K picture quality, HDR colors, and smooth wireless streaming. Features a convenient voice remote with TV controls.',
                    brand: 'Roku',
                    categoryName: 'Electronics'
                }
            ],
            'Grocery': [
                {
                    asin: 'B00BGDH9V8',
                    title: 'Frito-Lay Variety Pack, Party Mix, 40 Count',
                    price: 16.98,
                    originalPrice: 22.99,
                    imageUrl: 'https://images.unsplash.com/photo-1599490659273-e3b69007f457?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B00BGDH9V8?tag=${this.associateTag}`,
                    description: '40 individual bags of your favorite Frito-Lay snacks. Great for lunchboxes, game days, or office snacking.',
                    brand: 'Frito-Lay',
                    categoryName: 'Grocery & Food'
                },
                {
                    asin: 'B0032JRQC0',
                    title: 'KIND Bars, Dark Chocolate Nuts & Sea Salt, Gluten Free, 12 Count',
                    price: 11.50,
                    originalPrice: 15.99,
                    imageUrl: 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B0032JRQC0?tag=${this.associateTag}`,
                    description: 'Satisfying snack bars made with whole nuts, dark chocolate, and a touch of sea salt. Lower sugar alternative.',
                    brand: 'KIND',
                    categoryName: 'Grocery & Food'
                },
                {
                    asin: 'B074PTWHC4',
                    title: 'Quaker Instant Oatmeal, Fruit & Cream Variety Pack, 44 Packets',
                    price: 12.50,
                    originalPrice: 17.99,
                    imageUrl: 'https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B074PTWHC4?tag=${this.associateTag}`,
                    description: 'Warm and comforting individual oatmeal packets in delicious Strawberries & Cream, Blueberries & Cream, and Peaches & Cream flavors.',
                    brand: 'Quaker',
                    categoryName: 'Grocery & Food'
                },
                {
                    asin: 'B015SQAVB8',
                    title: "Jack Link's Beef Jerky Variety Pack, 15 Count",
                    price: 14.99,
                    originalPrice: 21.99,
                    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B015SQAVB8?tag=${this.associateTag}`,
                    description: 'Protein-packed snacks featuring Original, Teriyaki, and Peppered beef jerky bags. Made with 100% premium lean beef.',
                    brand: "Jack Link's",
                    categoryName: 'Grocery & Food'
                },
                {
                    asin: 'B01KQLV2A4',
                    title: 'Gatorade Fit Electrolyte Beverage, 16.9 Fl Oz, 12 Pack',
                    price: 13.49,
                    originalPrice: 18.99,
                    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B01KQLV2A4?tag=${this.associateTag}`,
                    description: 'Healthy hydration options containing no added sugar, artificial sweeteners, or dyes. Infused with vitamins A & C.',
                    brand: 'Gatorade',
                    categoryName: 'Grocery & Food'
                }
            ],
            'HomeGarden': [
                {
                    asin: 'B00FLYWNYQ',
                    title: 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker, 6 Quart',
                    price: 89.95,
                    originalPrice: 129.99,
                    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B00FLYWNYQ?tag=${this.associateTag}`,
                    description: 'Multifunctional pressure cooker, slow cooker, rice cooker, yogurt maker, steamer, sauté pan, sterilizer and food warmer.',
                    brand: 'Instant Pot',
                    categoryName: 'Home & Kitchen'
                },
                {
                    asin: 'B07GV2S1GS',
                    title: 'Keurig K-Mini Single Serve Coffee Maker, Studio Gray',
                    price: 59.99,
                    originalPrice: 99.99,
                    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B07GV2S1GS?tag=${this.associateTag}`,
                    description: 'Fits anywhere - less than 5 inches wide. Brew any cup size between 6-12oz with Keurig K-Cup pods in minutes.',
                    brand: 'Keurig',
                    categoryName: 'Home & Kitchen'
                },
                {
                    asin: 'B08CKHPP52',
                    title: 'Ring Video Doorbell Wired with 1080p HD Video',
                    price: 39.99,
                    originalPrice: 64.99,
                    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B08CKHPP52?tag=${this.associateTag}`,
                    description: 'Wired smart video doorbell with 1080p HD video, advanced motion detection, and crisp two-way talk features.',
                    brand: 'Ring',
                    categoryName: 'Home & Kitchen'
                },
                {
                    asin: 'B006LXOJC0',
                    title: 'BLACK+DECKER dustbuster AdvancedClean Cordless Hand Vacuum',
                    price: 29.99,
                    originalPrice: 44.99,
                    imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B006LXOJC0?tag=${this.associateTag}`,
                    description: 'Lithium-ion battery for strong suction power. Lightweight design with a rotating slim nozzle to reach tight spaces.',
                    brand: 'BLACK+DECKER',
                    categoryName: 'Home & Kitchen'
                },
                {
                    asin: 'B001R1RXUG',
                    title: 'Honeywell HT-900 TurboForce Power Air Circulator Fan',
                    price: 14.99,
                    originalPrice: 22.99,
                    imageUrl: 'https://images.unsplash.com/photo-1618944847828-82e943c3bedb?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B001R1RXUG?tag=${this.associateTag}`,
                    description: 'Small tabletop fan with a 3-speed pivot head. Powerful aerodynamic design circulates air throughout the room.',
                    brand: 'Honeywell',
                    categoryName: 'Home & Kitchen'
                }
            ],
            'Beauty': [
                {
                    asin: 'B00TTD9BRC',
                    title: 'CeraVe Moisturizing Cream | Body and Face Moisturizer',
                    price: 14.50,
                    originalPrice: 19.99,
                    imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B00TTD9BRC?tag=${this.associateTag}`,
                    description: 'Provides 24-hour hydration and helps restore the protective skin barrier with three essential ceramides.',
                    brand: 'CeraVe',
                    categoryName: 'Health & Beauty'
                },
                {
                    asin: 'B00NR1YQHM',
                    title: 'Neutrogena Hydro Boost Water Gel Face Moisturizer with Hyaluronic Acid',
                    price: 15.99,
                    originalPrice: 23.99,
                    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B00NR1YQHM?tag=${this.associateTag}`,
                    description: 'Lightweight, oil-free face gel moisturizer designed to instantly hydrate dry skin. Clinically proven hydration.',
                    brand: 'Neutrogena',
                    categoryName: 'Health & Beauty'
                },
                {
                    asin: 'B06XF2TR11',
                    title: "L'Oreal Paris Voluminous Lash Paradise Mascara, Blackest Black",
                    price: 9.97,
                    originalPrice: 12.99,
                    imageUrl: 'https://images.unsplash.com/photo-1631730359575-38e4755d772b?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B06XF2TR11?tag=${this.associateTag}`,
                    description: 'Soft wavy brush holds maximum formula for a dramatic volumizing charge. Flake-resistant and clump-free.',
                    brand: "L'Oreal Paris",
                    categoryName: 'Health & Beauty'
                },
                {
                    asin: 'B074PVTPBW',
                    title: 'Mighty Patch Original from Hero Cosmetics - Acne Patch, 36 Count',
                    price: 11.99,
                    originalPrice: 14.99,
                    imageUrl: 'https://images.unsplash.com/photo-1556229174-5e42a09e45af?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B074PVTPBW?tag=${this.associateTag}`,
                    description: 'Hydrocolloid sticker patches that absorb pimple gunk in 6-8 hours. Safe for all skin types and overnight wear.',
                    brand: 'Hero Cosmetics',
                    categoryName: 'Health & Beauty'
                },
                {
                    asin: 'B00AHAWWO0',
                    title: 'Crest 3D Whitestrips, Professional Effects, Teeth Whitening Strip Kit',
                    price: 34.99,
                    originalPrice: 45.99,
                    imageUrl: 'https://images.unsplash.com/photo-1593005510329-8a4035a7238f?w=800&auto=format&fit=crop&q=80',
                    detailUrl: `https://www.amazon.com/dp/B00AHAWWO0?tag=${this.associateTag}`,
                    description: 'Whitens teeth like a professional-level treatment. Removes over 14 years of teeth stains in just 20 days.',
                    brand: 'Crest',
                    categoryName: 'Health & Beauty'
                }
            ]
        };

        return mockProducts[searchIndex] || [];
    }
}

export async function getAmazonGoldboxDeals(): Promise<ScrapedProduct[]> {
    const record = await prisma.newsAlert.findUnique({
        where: { id: 'amazon-goldbox-feed' }
    });
    if (!record || !record.aiReport) return [];
    try {
        return JSON.parse(record.aiReport) as ScrapedProduct[];
    } catch {
        return [];
    }
}
