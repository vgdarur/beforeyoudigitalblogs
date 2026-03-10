import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Providers from '@/components/Providers';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Dealsagent - Discover the Best Discounts & Offers',
    description: 'Aggregating the best tech, fashion and general deals from across the web. Save more with curated discounts.',
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
                        <Navbar />
                        <main className="main-content">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
