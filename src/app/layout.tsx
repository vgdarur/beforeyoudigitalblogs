import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import NewsTicker from '@/components/layout/NewsTicker';
import AppBanner from '@/components/layout/AppBanner';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'AI Deals of America - Discover the Best Discounts & Offers',
    description: 'Find the latest and greatest deals, discounts, and coupons from top merchants, curated by AI.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="app-wrapper">
                        <AppBanner />
                        <NewsTicker />
                        <Navbar />
                        <main className="main-content">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
                
                {/* Google Analytics */}
                <Script src="https://www.googletagmanager.com/gtag/js?id=G-DY42XJQS7B" strategy="afterInteractive" />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-DY42XJQS7B');
                    `}
                </Script>
            </body>
        </html>
    );
}
