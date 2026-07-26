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
            <head>
                <meta name="impact-site-verification" content="ea8b5636-d3fc-461c-9695-d08dffaf2720" {...({ value: "ea8b5636-d3fc-461c-9695-d08dffaf2720" } as any)} />
            </head>
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

                {/* Impact.com UTT Tracking */}
                <Script id="impact-tracking" strategy="afterInteractive">
                    {`
                        (function(i,m,p,a,c,t){c.ire_o=p;c[p]=c[p]||function(){(c[p].a=c[p].a||[]).push(arguments)};t=a.createElement(m);var z=a.getElementsByTagName(m)[0];t.async=1;t.src=i;z.parentNode.insertBefore(t,z)})('https://utt.impactcdn.com/P-A7176062-4957-4b7d-8ed5-69ad192b43f61.js','script','impactStat',document,window);
                        impactStat('transformLinks');
                        impactStat('trackImpression');
                    `}
                </Script>
            </body>
        </html>
    );
}
