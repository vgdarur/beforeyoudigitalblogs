import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    // 1. Authenticate the request
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { dealId, groupId } = await req.json();

        if (!dealId || !groupId) {
            return NextResponse.json({ error: 'Missing dealId or groupId' }, { status: 400 });
        }

        // 2. Fetch the Deal
        const deal = await prisma.deal.findUnique({
            where: { id: dealId }
        });

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        // 3. Format the WhatsApp Message
        let message = `🔥 *${deal.title}* 🔥\n\n`;
        message += `${deal.description}\n\n`;
        
        if (deal.couponCode) {
            message += `✂️ Use Code: *${deal.couponCode}*\n`;
        }
        if (deal.price) {
            message += `💰 Price: $${deal.price.toFixed(2)}`;
            if (deal.originalPrice) {
                message += ` (Was $${deal.originalPrice.toFixed(2)})`;
            }
            message += `\n`;
        }
        
        message += `\n🛒 Get it here: ${deal.affiliateUrl}\n`;
        message += `\n_Powered by AiDealsOfAmerica.com_`;

        // 4. Send request to local WhatsApp Daemon running on port 3002
        const response = await fetch('http://localhost:3002/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                groupId: groupId,
                message: message,
                imageUrl: deal.imageUrl
            })
        });

        const result = await response.json();

        if (!result.success) {
            return NextResponse.json({ error: 'Failed to broadcast', details: result.error }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Broadcast sent successfully!' });

    } catch (error: any) {
        console.error('Broadcast API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
