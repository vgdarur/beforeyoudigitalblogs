module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/lib/prisma.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs, [project]/node_modules/@prisma/client)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f40$prisma$2f$client$29$__["PrismaClient"]();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;
}),
"[project]/src/app/api/admin/deals/create/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/prisma.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const formData = await request.formData();
        // Extract required fields
        const title = formData.get('title');
        const affiliateUrl = formData.get('affiliateUrl');
        const merchantName = formData.get('merchantName');
        const categoryId = formData.get('categoryId');
        if (!title || !affiliateUrl || !merchantName || !categoryId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        // Extract optional fields
        const networkId = formData.get('networkId') || null;
        const description = formData.get('description') || '';
        const rawPrice = formData.get('price');
        const rawOriginalPrice = formData.get('originalPrice');
        const imageUrl = formData.get('imageUrl') || null;
        const couponCode = formData.get('couponCode') || null;
        const rawExpirationDate = formData.get('expirationDate');
        // Parse numbers
        let price = null;
        if (rawPrice) {
            const parsedPrice = parseFloat(rawPrice);
            if (!isNaN(parsedPrice)) price = parsedPrice;
        }
        let originalPrice = null;
        if (rawOriginalPrice) {
            const parsedOrig = parseFloat(rawOriginalPrice);
            if (!isNaN(parsedOrig)) originalPrice = parsedOrig;
        }
        let discountRatio = null;
        if (price && originalPrice && originalPrice > price) {
            discountRatio = (originalPrice - price) / originalPrice;
        }
        // Parse date
        let expirationDate = null;
        if (rawExpirationDate) {
            expirationDate = new Date(rawExpirationDate);
        }
        // Create or find merchant
        const merchantSlug = merchantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const merchant = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].merchant.upsert({
            where: {
                slug: merchantSlug
            },
            update: {},
            create: {
                name: merchantName,
                slug: merchantSlug
            }
        });
        // Generate a unique slug for the deal
        const baseSlug = `${merchantSlug}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
        const randomSuffix = Math.floor(Math.random() * 10000);
        const dealSlug = `${baseSlug}-${randomSuffix}`;
        // Insert deal
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].deal.create({
            data: {
                title: title.slice(0, 250),
                slug: dealSlug,
                description: description.slice(0, 1000),
                imageUrl: imageUrl,
                price: price,
                originalPrice: originalPrice,
                discountRatio: discountRatio,
                couponCode: couponCode,
                affiliateUrl: affiliateUrl,
                merchantId: merchant.id,
                networkId: networkId || undefined,
                categoryId: categoryId,
                expirationDate: expirationDate,
                isActive: true
            }
        });
        // Redirect back to dashboard on success
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/admin/dashboard', `${request.headers.get('x-forwarded-proto') || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 'http')}://${request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'}`), 302);
    } catch (error) {
        console.error('Error creating manual deal:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create deal'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__da7d41e1._.js.map