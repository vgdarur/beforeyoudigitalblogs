import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

        // Extract client IP address
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                   request.headers.get('x-real-ip')?.trim() || 
                   '127.0.0.1';

        // Extract client country code
        const country = request.headers.get('x-client-geo-country')?.trim() || 
                        request.headers.get('cf-ipcountry')?.trim() || 
                        'US';

        // Log the click asynchronously (awaited, but wrapped in try-catch to never block the redirect)
        // Skip click logging for admin users
        let isAdmin = false;
        let userEmail = null;
        try {
            const session = await getServerSession(authOptions);
            if (session?.user) {
                userEmail = session.user.email || null;
                if ((session.user as any).role === 'ADMIN') {
                    isAdmin = true;
                }
            }
        } catch (e) {
            console.error('Failed to get session in click tracker:', e);
        }

        if (!isAdmin) {
            try {
                await prisma.click.create({
                    data: {
                        id: uuidv4(),
                        referrer: referer,
                        device: device,
                        ipAddress: ip,
                        userEmail: userEmail,
                        country: country,
                        dealId: deal.id,
                        merchantId: deal.merchantId,
                        networkId: deal.networkId,
                    }
                });
            } catch (err) {
                console.error('Failed to log click:', err);
            }
        }

        // Handle outbound affiliate link formatting
        // If we have dynamic sub IDs, we can append them here
        // Example: amazon.com/?tag=myid -> amazon.com/?tag=myid&subid=xyz
        let targetUrl = deal.affiliateUrl;

        if (!targetUrl) {
            targetUrl = `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(deal.title)}`;
        }

        const safeTargetUrl = targetUrl.trim();

        // Redirect to the target affiliate URL
        // Use a 302 Found (Temporary Redirect) so browsers don't cache and we keep tracking clicks
        return NextResponse.redirect(new URL(safeTargetUrl), 302);

    } catch (error) {
        console.error('Error in click tracker:', error);
        // On error, fallback to homepage rather than showing an ugly error page
        // Use standard request.url as origin to avoid header parsing failure under multi-proxy setups
        return NextResponse.redirect(new URL('/', request.url), 302);
    }
}
