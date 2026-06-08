import DealCard from '@/components/ui/DealCard';
import styles from './page.module.css';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic'; // Prevent static caching for search/filtered routes

import { Prisma } from '@prisma/client';

async function getDeals(searchParams: { [key: string]: string | string[] | undefined }) {
    const q = searchParams.q as string || '';
    const category = searchParams.category as string || '';
    const merchant = searchParams.merchant as string || '';
    const sortBy = searchParams.sortBy as string || 'createdAt';
    const page = 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const where: Prisma.DealWhereInput = {
        isActive: true,
        priorityScore: { not: 1 },
        imageUrl: { contains: 'http' },
        NOT: {
            merchant: { slug: { in: ['shopify', 'tiktok-shop', 'best-buy', 'target', 'walmart', 'home-depot'] } }
        },
        OR: [
            { expirationDate: null },
            { expirationDate: { gt: new Date() } }
        ]
    };

    if (q) {
        where.OR = [
            { title: { contains: q } },
            { description: { contains: q } }
        ];
    }

    if (category) where.categoryId = category;
    if (merchant) where.merchantId = merchant;

    let sortOrder: Prisma.SortOrder = 'desc';
    if (sortBy === 'price') sortOrder = 'asc';

    try {
        const [deals, totalCount] = await Promise.all([
            prisma.deal.findMany({
                where,
                include: {
                    merchant: true,
                    network: true,
                    category: true,
                },
                orderBy: {
                    [sortBy]: sortOrder,
                },
                skip,
                take: limit,
            }),
            prisma.deal.count({ where }),
        ]);

        return {
            deals: deals,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            }
        };
    } catch (err) {
        console.error("DB Error fetching deals", err);
        return { deals: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    }
}

export default async function DealsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams;
    const { deals, meta } = await getDeals(sp);

    // Fetch filter options (Categories, Merchants) for the sidebar, only if they have active deals
    const categories = await prisma.category.findMany({
        where: {
            deals: {
                some: {
                    isActive: true,
                    priorityScore: { not: 1 },
                    imageUrl: { contains: 'http' },
                    NOT: {
                        merchant: { slug: { in: ['shopify', 'tiktok-shop', 'best-buy', 'target', 'walmart', 'home-depot'] } }
                    },
                    OR: [
                        { expirationDate: null },
                        { expirationDate: { gt: new Date() } }
                    ]
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    const merchants = await prisma.merchant.findMany({
        where: {
            slug: { notIn: ['shopify', 'tiktok-shop', 'best-buy', 'target', 'walmart', 'home-depot'] },
            deals: {
                some: {
                    isActive: true,
                    priorityScore: { not: 1 },
                    imageUrl: { contains: 'http' },
                    OR: [
                        { expirationDate: null },
                        { expirationDate: { gt: new Date() } }
                    ]
                }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className={`container ${styles.dealsContainer}`}>
            <div className={styles.header}>
                <h1 className={styles.title}>All Deals</h1>
                <p className={styles.subtitle}>Showing {deals.length} of {meta.total} active offers</p>
            </div>

            <div className={styles.layout}>
                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Search</h3>
                        <form action="/deals" method="GET" className={styles.searchForm}>
                            {/* Preserve other filters */}
                            {sp.category && <input type="hidden" name="category" value={sp.category as string} />}
                            {sp.merchant && <input type="hidden" name="merchant" value={sp.merchant as string} />}

                            <input
                                type="text"
                                name="q"
                                defaultValue={sp.q as string || ''}
                                placeholder="Search deals..."
                                className={styles.filterInput}
                            />
                            <button type="submit" className={styles.filterBtn}>Search</button>
                        </form>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Categories</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <a href={`/deals?${new URLSearchParams({ ...(sp as Record<string, string>), category: '' }).toString()}`}
                                    className={!sp.category ? styles.activeFilter : ''}>
                                    All Categories
                                </a>
                            </li>
                            {categories.map(cat => (
                                <li key={cat.id}>
                                    <a href={`/deals?${new URLSearchParams({ ...(sp as Record<string, string>), category: cat.id }).toString()}`}
                                        className={sp.category === cat.id ? styles.activeFilter : ''}>
                                        {cat.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.filterGroup}>
                        <h3 className={styles.filterTitle}>Stores</h3>
                        <ul className={styles.filterList}>
                            <li>
                                <a href={`/deals?${new URLSearchParams({ ...(sp as Record<string, string>), merchant: '' }).toString()}`}
                                    className={!sp.merchant ? styles.activeFilter : ''}>
                                    All Stores
                                </a>
                            </li>
                            {merchants.map(merchant => (
                                <li key={merchant.id}>
                                    <a href={`/deals?${new URLSearchParams({ ...(sp as Record<string, string>), merchant: merchant.id }).toString()}`}
                                        className={sp.merchant === merchant.id ? styles.activeFilter : ''}>
                                        {merchant.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Clear Filters */}
                    <a href="/deals" className={styles.clearFiltersBtn}>Clear All Filters</a>
                </aside>

                {/* Deals Grid */}
                <main className={styles.mainContent}>

                    <div className={styles.filtersTopBar}>
                        <div className={styles.activeFiltersChips}>
                            {sp.q && <span className={styles.chip}>Search: {sp.q as string}</span>}
                            {sp.category && <span className={styles.chip}>Category Filtered</span>}
                            {sp.merchant && <span className={styles.chip}>Store Filtered</span>}
                        </div>

                        <div className={styles.sortOptions}>
                            <form action="/deals" method="GET" id="sortForm">
                                {/* Preserve active filters */}
                                {sp.q && <input type="hidden" name="q" value={sp.q as string} />}
                                {sp.category && <input type="hidden" name="category" value={sp.category as string} />}

                                <div className={styles.sortGroup}>
                                    <select
                                        name="sortBy"
                                        defaultValue={sp.sortBy as string || 'createdAt'}
                                        className={styles.sortSelect}
                                    >
                                        <option value="createdAt">Newest First</option>
                                        <option value="priorityScore">Hottest Deals</option>
                                        <option value="price">Lowest Price</option>
                                        <option value="discountRatio">Highest Discount</option>
                                    </select>
                                    <button type="submit" className={styles.sortSubmit}>Sort</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {deals.length > 0 ? (
                        <div className={styles.dealGrid}>
                            {deals.map((deal: any) => (
                                <DealCard key={deal.id} deal={deal} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <h3>No deals found</h3>
                            <p>Try adjusting your search or filters to find what you're looking for.</p>
                            <a href="/deals" className={styles.btnPrimary}>Reset Filters</a>
                        </div>
                    )}

                    {/* Pagination (Simplified) */}
                    {meta.totalPages > 1 && (
                        <div className={styles.pagination}>
                            <p>Page {meta.page} of {meta.totalPages}</p>
                            {/* Pagination controls would go here */}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
