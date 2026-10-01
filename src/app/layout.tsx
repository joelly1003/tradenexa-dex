import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RegionalProvider } from "../components/providers/RegionalProvider";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { NetworkGuard } from "../components/NetworkGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tradenexa.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'TradeNexa | Institutional Decentralized Trading on Ink Network',
  description: 'Trade crypto with institutional speed and solver-optimized execution, powered by NADO and settled on Ink Network.',
  openGraph: {
    title: 'TradeNexa | Sub-Second Decentralized Trading',
    description: 'Solver-optimized execution settled on Ink Network L2 (Chain ID: 57073).',
    url: BASE_URL,
    siteName: 'TradeNexa',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'TradeNexa Interface' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TradeNexa | Sub-Second Decentralized Trading',
    description: 'Deep NADO liquidity with sub-second Ink L2 settlement.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-black text-black dark:text-zinc-50" suppressHydrationWarning>
        <Providers>
          <RegionalProvider>
            <Header />
            <NetworkGuard />
            <main className="flex-1 flex flex-col w-full">
              {children}
            </main>
            <Footer />
          </RegionalProvider>
        </Providers>
      </body>
    </html>
  );
}
