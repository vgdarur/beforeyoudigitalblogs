import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const merchant = await prisma.merchant.findUnique({
      where: { slug: slug },
    });

    if (!merchant || !merchant.affiliateUrl) {
      return NextResponse.redirect(new URL('/stores', request.url));
    }

    // You can optionally log a 'Store Click' analytic here in the future
    
    // Redirect directly to the Impact affiliate URL
    return NextResponse.redirect(merchant.affiliateUrl);
  } catch (error) {
    console.error('Store Redirect Error:', error);
    return NextResponse.redirect(new URL('/stores', request.url));
  }
}
