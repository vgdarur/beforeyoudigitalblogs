import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { headers } = request;

        // Find the deal
        const deal = await prisma.deal.findUnique({
            where: { slug },
            include: {
                merchant: true,
                network: true
            }
        });

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        // Get basic user analytics data
        const referer = headers.get('referer') || 'Direct';
        const userAgent = headers.get('user-agent') || 'Unknown';

        // Simplified device detection
        let device = 'Desktop';
        if (/mobile/i.test(userAgent)) device = 'Mobile';
        if (/tablet/i.test(userAgent)) device = 'Tablet';

        // Log the click asynchronously (don't block the redirect)
        // In a high-traffic production app, this would be pushed to a queue (e.g., Redis/Kafka)
        prisma.click.create({
            data: {
                id: uuidv4(),
                referrer: referer,
                device: device,
                dealId: deal.id,
                merchantId: deal.merchantId,
                networkId: deal.networkId,
            }
        }).catch(err => {
            console.error('Failed to log click asynchronously:', err);
        });

        // Handle outbound affiliate link formatting
        // If we have dynamic sub IDs, we can append them here
        // Example: amazon.com/?tag=myid -> amazon.com/?tag=myid&subid=xyz
        let targetUrl = deal.affiliateUrl;

        if (!targetUrl) {
            targetUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(deal.title)}`;
        }

        // Redirect to the target affiliate URL
        // Use a 302 Found (Temporary Redirect) so browsers don't cache and we keep tracking clicks
        return NextResponse.redirect(new URL(targetUrl), 302);

    } catch (error) {
        console.error('Error in click tracker:', error);
        // On error, fallback to homepage rather than showing an ugly error page
        return NextResponse.redirect(new URL('/', `${request.headers.get('x-forwarded-proto') || (process.env.NODE_ENV === 'production' ? 'https' : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    }
}
