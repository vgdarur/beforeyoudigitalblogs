# AI Deals of America - Affiliate Marketing Platform

A modern, responsive Next.js application designed to aggregate and display affiliate deals from networks like CJ Affiliate, Amazon Associates, Rakuten, and more. It features a robust public-facing deals browser, a powerful click tracking engine, and a comprehensive secure Admin Dashboard.

## 🚀 Features

### Public Frontend
- **Beautiful UI**: Built with custom, heavily optimized CSS classes avoiding raw Tailwind for a highly tailored aesthetic featuring smooth micro-animations.
- **Dynamic Filtering**: Server-side filtering, sorting, and searching logic.
- **SEO Optimized**: Fully implemented Next.js `metadata` API with OpenGraph image tags and readable URL slugs.
- **Click Tracking Engine**: High-performance `/api/go/[slug]` route that asynchronously records click analytics (Device, Referrer, Network) to the database before correctly performing a 302 temporary redirect to the affiliate URL.

### Admin Dashboard (`/admin`)
- **Real-time Analytics**: View quick dashboard metrics on total outbound clicks, active deals, and recent activity.
- **Bulk CSV Import**: An intelligent drag-and-drop CSV importer at `/admin/import`. Upload generic structured feed files and it will automatically attach them to specific networks and gracefully parse column headers.

## 💻 Tech Stack Setup

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM
- **Styling**: Vanilla CSS Modules
- **Other Libs**: `uuid` for quick primary key generation, `papaparse` for rapid client-to-server CSV streaming.

## 🛠 Getting Started

### 1. Database Initialization
The project utilizes SQLite to eliminate external Postgres dependencies during local testing.

```bash
# Generate the Prisma Client
npm run prisma generate

# Finalize the database schema
npx prisma db push

# (CRITICAL) Seed the initial merchants, networks, and deals
node prisma/seed.js
```

### 2. Run the Development Server

```bash
npm run dev
```

Visit the frontend at [http://localhost:3000](http://localhost:3000) and the admin dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

## 📊 How Affiliate Tracking Works

All outbound traffic is routed through the internal Next.js tracking endpoint.
When a user clicks "Get Deal" on `/deals/slug-123`, they are sent to `/api/go/slug-123`.

1. The API performs a quick DB lookup for the affiliate URL link.
2. It parses the incoming request `referer` and `user-agent`.
3. It asynchronously creates a `Click` record in the database for admin analytics.
4. It finally issues an HTTP 302 Redirect to the merchant's tracking link ensure you get paid without blocking the user flow.

## 📦 Importing Deals

To test importing deals, create a basic CSV file with headers like: `Title`, `Price`, `Retail Price`, `URL`, `Image URL`, `Merchant`. Go to the `/admin/import` page, drag and drop the CSV, and select the target affiliate network. The system will handle the rest!
