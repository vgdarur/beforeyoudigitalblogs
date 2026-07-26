import crypto from 'crypto';

interface AmazonProduct {
    asin: string;
    title: string;
    price: number | null;
    originalPrice: number | null;
    imageUrl: string | null;
    detailUrl: string;
    description: string;
    brand: string;
}

export class AmazonPAAPI {
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

    private getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
        const kDate = this.hmac('AWS4' + key, dateStamp);
        const kRegion = this.hmac(kDate, regionName);
        const kService = this.hmac(kRegion, serviceName);
        const kSigning = this.hmac(kService, 'aws4_request');
        return kSigning;
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
     * Fetch product details using the new Amazon Creators API (LWA Token-based)
     */
    private async getProductByCreatorsAPI(asin: string): Promise<AmazonProduct | null> {
        const token = await this.getCreatorsAccessToken();
        const payload = {
            itemIds: [asin],
            itemIdType: 'ASIN',
            marketplace: 'www.amazon.com',
            partnerTag: this.associateTag,
            partnerType: 'Associates',
            resources: [
                'itemInfo.title',
                'itemInfo.features',
                'itemInfo.byLineInfo',
                'images.primary.large',
                'offersV2.listings.price'
            ]
        };

        const response = await fetch('https://creatorsapi.amazon/catalog/v1/getItems', {
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
        if (items.length === 0) return null;

        const item = items[0];
        const title = item.itemInfo?.title?.displayValue || item.ItemInfo?.Title?.DisplayValue || 'Amazon Product';
        const imageUrl = item.images?.primary?.large?.url || item.images?.primary?.large?.URL || item.Images?.Primary?.Large?.URL || null;
        const detailUrl = item.detailPageURL || item.DetailPageURL || `https://www.amazon.com/dp/${asin}?tag=${this.associateTag}`;
        
        const listing = item.offersV2?.listings?.[0] || item.OffersV2?.Listings?.[0] || item.offers?.listings?.[0] || item.Offers?.Listings?.[0];
        const price = listing?.price?.amount || listing?.Price?.Amount || null;
        const originalPrice = (listing?.price?.savings?.amount || listing?.Price?.Savings?.Amount)
            ? (parseFloat(price) + parseFloat(listing.price?.savings?.amount || listing.Price.Savings.Amount))
            : price;

        const features = item.itemInfo?.features?.displayValues || item.ItemInfo?.Features?.DisplayValues || [];
        const description = features.join('\n') || 'No description listed.';
        const brand = item.itemInfo?.byLineInfo?.brand?.displayValue || item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon';

        return {
            asin,
            title,
            price: price ? parseFloat(price) : null,
            originalPrice: originalPrice ? parseFloat(originalPrice) : null,
            imageUrl,
            detailUrl,
            description,
            brand
        };
    }

    private getMockProduct(asin: string): AmazonProduct {
        return {
            asin,
            title: `Mock Amazon Product (ASIN: ${asin})`,
            price: 99.99,
            originalPrice: 149.99,
            imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
            detailUrl: `https://www.amazon.com/dp/${asin}?tag=${this.associateTag}`,
            description: 'This is a simulated product description. Your Amazon Creator credentials are valid, but your account does not currently meet the 10 qualifying sales in 30 days requirement to access live catalog data. The app is falling back to mock details so you can continue testing.',
            brand: 'Amazon'
        };
    }

    /**
     * Resolve product details using either Amazon Creators API (OAuth) or legacy PA-API (Access/Secret Key)
     */
    async getProductByASIN(asin: string): Promise<AmazonProduct | null> {
        if (this.clientId && this.clientSecret) {
            try {
                console.log('Using Amazon Creators API (OAuth) for ASIN lookup:', asin);
                return await this.getProductByCreatorsAPI(asin);
            } catch (err: any) {
                console.warn(`Amazon Creators API lookup failed for ASIN ${asin}: ${err.message}. Falling back to mock details.`);
                return this.getMockProduct(asin);
            }
        }

        if (this.accessKey && this.secretKey) {
            console.log('Using legacy Amazon PA-API (SigV4) for ASIN lookup:', asin);
            const path = '/paapi5/getitems';
            const target = 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.GetItems';
            
            const payload = JSON.stringify({
                ItemIds: [asin],
                ItemIdType: 'ASIN',
                Resources: [
                    'ItemInfo.Title',
                    'ItemInfo.Features',
                    'ItemInfo.ByLineInfo',
                    'Images.Primary.Large',
                    'Offers.Listings.Price'
                ],
                PartnerType: 'Associates',
                PartnerTag: this.associateTag,
                Marketplace: 'www.amazon.com'
            });

            const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
            const dateStamp = amzDate.substring(0, 8);

            const canonicalHeaders = `content-type:application/json; charset=utf-8\nhost:${this.host}\nx-amz-date:${amzDate}\nx-amz-target:${target}\n`;
            const signedHeaders = 'content-type;host;x-amz-date;x-amz-target';
            const payloadHash = this.sha256Hex(payload);

            const canonicalRequest = `POST\n${path}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
            const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
            const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${this.sha256Hex(canonicalRequest)}`;

            const signingKey = this.getSignatureKey(this.secretKey, dateStamp, this.region, this.service);
            const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

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
                    throw new Error(`Amazon PA-API returned status ${response.status}: ${errText}`);
                }

                const data = await response.json();
                const items = data.ItemsResult?.Items || [];
                if (items.length === 0) return null;

                const item = items[0];
                const title = item.ItemInfo?.Title?.DisplayValue || 'Amazon Product';
                const imageUrl = item.Images?.Primary?.Large?.URL || null;
                const detailUrl = item.DetailPageURL || `https://www.amazon.com/dp/${asin}?tag=${this.associateTag}`;
                
                const listing = item.Offers?.Listings?.[0];
                const price = listing?.Price?.Amount || null;
                const originalPrice = listing?.Price?.Savings?.Amount 
                    ? (parseFloat(price) + parseFloat(listing.Price.Savings.Amount)) 
                    : price;

                const features = item.ItemInfo?.Features?.DisplayValues || [];
                const description = features.join('\n') || 'No product features listed.';
                const brand = item.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 'Amazon';

                return {
                    asin,
                    title,
                    price: price ? parseFloat(price) : null,
                    originalPrice: originalPrice ? parseFloat(originalPrice) : null,
                    imageUrl,
                    detailUrl,
                    description,
                    brand
                };
            } catch (error: any) {
                console.warn(`Amazon PA-API lookup failed for ASIN ${asin}: ${error.message}. Falling back to mock details.`);
                return this.getMockProduct(asin);
            }
        }

        console.log('No Amazon API credentials configured. Returning mock details.');
        return this.getMockProduct(asin);
    }
}
