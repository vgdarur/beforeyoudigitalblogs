import { prisma } from '@/lib/prisma';

export interface AdDeal {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  originalPrice: number | null;
  discountRatio: number | null;
  couponCode: string | null;
  imageUrl: string | null;
  merchantName: string;
}

/**
 * Fetches the 3 best deals posted today or top active featured deals
 */
export async function getTop3DealsToday(): Promise<AdDeal[]> {
  try {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);

    // 1. Try fetching top active deals created today
    let deals = await prisma.deal.findMany({
      where: {
        isActive: true,
        createdAt: { gte: startOfToday },
        priorityScore: { not: 1 }
      },
      include: { merchant: true },
      orderBy: [
        { isFeatured: 'desc' },
        { priorityScore: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 3
    });

    // 2. If fewer than 3 deals posted today, fallback to top featured active deals
    if (deals.length < 3) {
      const fallbackDeals = await prisma.deal.findMany({
        where: {
          isActive: true,
          id: { notIn: deals.map(d => d.id) }
        },
        include: { merchant: true },
        orderBy: [
          { isFeatured: 'desc' },
          { priorityScore: 'desc' },
          { updatedAt: 'desc' }
        ],
        take: 3 - deals.length
      });
      deals = [...deals, ...fallbackDeals];
    }

    return deals.map(d => ({
      id: d.id,
      title: d.title,
      slug: d.slug,
      description: d.description,
      price: d.price,
      originalPrice: d.originalPrice,
      discountRatio: d.discountRatio,
      couponCode: d.couponCode,
      imageUrl: d.imageUrl,
      merchantName: d.merchant?.name || 'Verified Merchant'
    }));
  } catch (error) {
    console.error('Error fetching top 3 deals for blog ad injection:', error);
    return [];
  }
}

/**
 * Renders an inline Native Contextual Text & Link Ad Box
 */
export function renderContextualTextAd(deal: AdDeal): string {
  const discountText = deal.discountRatio
    ? `${Math.round(deal.discountRatio * 100)}% OFF`
    : deal.originalPrice && deal.price
    ? `${Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF`
    : 'Special Price';

  const priceText = deal.price ? `$${deal.price.toFixed(2)}` : '';
  const couponHtml = deal.couponCode
    ? `<span style="background: #fef08a; color: #854d0e; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; margin-left: 6px;">Use Code: ${deal.couponCode}</span>`
    : '';

  return `
    <aside style="
      margin: 2rem 0;
      padding: 1.25rem 1.5rem;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 5px solid #2563eb;
      border-radius: 8px;
      font-family: inherit;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
        <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #1d4ed8; background: #dbeafe; padding: 2px 8px; border-radius: 4px;">
          🔥 AI Deals of America • Editor's Pick
        </span>
        <span style="font-size: 0.75rem; color: #64748b;">
          Partner: ${deal.merchantName}
        </span>
      </div>
      <p style="margin: 0 0 8px 0; font-size: 1.05rem; font-weight: 600; color: #1e293b; line-height: 1.4;">
        <a href="/api/go/${deal.slug}" target="_blank" rel="noopener sponsored" style="color: #1d4ed8; text-decoration: underline;">
          ${deal.title}
        </a>
      </p>
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="font-size: 0.95rem; color: #334155;">
          ${priceText ? `<strong style="color: #0f172a; font-size: 1.15rem;">${priceText}</strong>` : ''}
          <span style="color: #16a34a; font-weight: 700; margin-left: 6px;">(${discountText})</span>
          ${couponHtml}
        </div>
        <a href="/api/go/${deal.slug}" target="_blank" rel="noopener sponsored" style="
          background: #2563eb;
          color: #ffffff;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
          display: inline-block;
        ">
          Claim Deal &rarr;
        </a>
      </div>
    </aside>
  `;
}

/**
 * Renders the "3 Best Deals Today" 3-Column Card Grid Widget
 */
export function renderTop3DealsWidget(deals: AdDeal[]): string {
  if (deals.length === 0) return '';

  const cardsHtml = deals.map(deal => {
    const discountText = deal.discountRatio
      ? `${Math.round(deal.discountRatio * 100)}% OFF`
      : deal.originalPrice && deal.price
      ? `${Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF`
      : 'Special Deal';

    const priceText = deal.price ? `$${deal.price.toFixed(2)}` : '';
    const origText = deal.originalPrice ? `<span style="text-decoration: line-through; color: #94a3b8; font-size: 0.85rem; margin-left: 4px;">$${deal.originalPrice.toFixed(2)}</span>` : '';

    return `
      <div style="
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
        padding: 14px;
      ">
        <div>
          ${deal.imageUrl ? `
            <div style="width: 100%; height: 130px; background: #f8fafc; border-radius: 6px; overflow: hidden; margin-bottom: 10px; display: flex; align-items: center; justify-content: center;">
              <img src="${deal.imageUrl}" alt="${deal.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;" />
            </div>
          ` : ''}
          <div style="font-size: 0.72rem; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">
            ${deal.merchantName}
          </div>
          <h4 style="font-size: 0.92rem; font-weight: 600; color: #0f172a; margin: 0 0 8px 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${deal.title}
          </h4>
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #f1f5f9;">
          <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 8px;">
            <div>
              <span style="font-size: 1.1rem; font-weight: 800; color: #0f172a;">${priceText}</span>
              ${origText}
            </div>
            <span style="background: #dcfce7; color: #15803d; font-size: 0.75rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
              ${discountText}
            </span>
          </div>
          <a href="/api/go/${deal.slug}" target="_blank" rel="noopener sponsored" style="
            display: block;
            text-align: center;
            background: #0f172a;
            color: #ffffff;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 600;
            text-decoration: none;
          ">
            Get Deal &rarr;
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="
      margin: 3rem 0;
      padding: 1.75rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      font-family: inherit;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #dc2626; background: #fee2e2; padding: 2px 8px; border-radius: 4px;">
            ⚡ Today's Top Picks
          </span>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 4px 0 0 0;">
            3 Best Deals from AI Deals of America
          </h3>
        </div>
        <a href="/deals" target="_blank" style="font-size: 0.85rem; color: #2563eb; font-weight: 600; text-decoration: none;">
          View All Deals &rarr;
        </a>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
        ${cardsHtml}
      </div>
    </div>
  `;
}

/**
 * Intelligently injects ads into article HTML content:
 * - Injects a contextual text ad after ~2nd or 3rd paragraph
 * - Injects the "Top 3 Deals Today" widget after ~5th or 6th paragraph
 */
export function injectDealsIntoHtml(htmlContent: string, deals: AdDeal[]): string {
  if (!deals || deals.length === 0) return htmlContent;

  const textAdHtml = renderContextualTextAd(deals[0]);
  const widgetHtml = renderTop3DealsWidget(deals);

  // Find all closing </p> positions using regex exec
  const pClosingMatches: { index: number }[] = [];
  const regex = /<\/p>/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(htmlContent)) !== null) {
    pClosingMatches.push({ index: match.index });
  }

  if (pClosingMatches.length < 2) {
    // Append at the bottom
    return htmlContent + textAdHtml + widgetHtml;
  }

  let modifiedHtml = htmlContent;

  // Insert Slot 2 (Top 3 Deals Widget) around paragraph 5 (or half way)
  if (pClosingMatches.length >= 5) {
    const fifthPIndex = pClosingMatches[4].index + 4; // length of </p>
    modifiedHtml = 
      modifiedHtml.slice(0, fifthPIndex) + 
      widgetHtml + 
      modifiedHtml.slice(fifthPIndex);
  } else {
    // If fewer than 5 paragraphs, append widget at the end
    modifiedHtml = modifiedHtml + widgetHtml;
  }

  // Recalculate closing </p> positions for Slot 1
  const updatedPMatches: { index: number }[] = [];
  const updatedRegex = /<\/p>/gi;
  while ((match = updatedRegex.exec(modifiedHtml)) !== null) {
    updatedPMatches.push({ index: match.index });
  }

  if (updatedPMatches.length >= 2) {
    const secondPIndex = updatedPMatches[1].index + 4;
    modifiedHtml = 
      modifiedHtml.slice(0, secondPIndex) + 
      textAdHtml + 
      modifiedHtml.slice(secondPIndex);
  } else {
    modifiedHtml = textAdHtml + modifiedHtml;
  }

  return modifiedHtml;
}
