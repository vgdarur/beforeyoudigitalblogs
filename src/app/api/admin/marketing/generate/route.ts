import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { dealId } = await request.json();
        if (!dealId) {
            return NextResponse.json({ error: 'dealId is required' }, { status: 400 });
        }

        const deal = await prisma.deal.findUnique({
            where: { id: dealId },
            include: { merchant: true }
        });

        if (!deal) {
            return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        if (!geminiApiKey) {
            return NextResponse.json({ 
                error: 'GEMINI_API_KEY is not configured in your .env file. Please add it to generate promotional copies.' 
            }, { status: 400 });
        }
        
        // Prepare prompt
        const prompt = `You are an expert social media copywriter and affiliate marketer.
Based on the following deal details, compose engaging promotional posts for:
1. Telegram (supports HTML tags like <b>, <i>, <a>. Maximize impact, include coupon, store name and URL link).
2. Reddit (Engaging Title & Markdown Body).
3. Twitter/X (Catchy text under 280 characters, include coupon and checkout URL).
4. Facebook (Engaging paragraph copy, include store name and checkout URL).
5. Andhrafriends Deals Subforum (Polite, forum-style Thread Title & Thread Body).

Deal Details:
- Title: ${deal.title}
- Description: ${deal.description || 'No description'}
- Original Price: ${deal.originalPrice ? `$${deal.originalPrice}` : 'N/A'}
- Sale Price: ${deal.price ? `$${deal.price}` : 'N/A'}
- Coupon Code: ${deal.couponCode || 'None'}
- Merchant/Store: ${deal.merchant?.name || 'Retailer'}
- Checkout Link: https://aidealsofamerica.com/deals/${deal.slug}

You MUST return the output as a valid JSON object matching this structure EXACTLY (do not wrap in markdown \`\`\`json blocks):
{
  "telegram": "...",
  "reddit": { "title": "...", "body": "..." },
  "twitter": "...",
  "facebook": "...",
  "andhrafriends": { "title": "...", "body": "..." }
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error: ${errText}`);
        }

        const resData = await response.json();
        const rawJsonText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawJsonText) {
            throw new Error('No content returned from Gemini');
        }

        const parsedOutput = JSON.parse(rawJsonText);
        return NextResponse.json({ drafts: parsedOutput });

    } catch (error: any) {
        console.error('Failed to generate drafts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
