import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { RegionalProvider } from "../components/providers/RegionalProvider";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeNexa | Localized Decentralized Exchange",
  description: "Trade crypto seamlessly priced natively in your local currency.",
  openGraph: {
    title: "TradeNexa | Localized Decentralized Exchange",
    description: "Trade crypto seamlessly priced natively in your local currency.",
    url: "https://tradenexa.com",
    siteName: "TradeNexa",
    images: [
      {
        url: "https://tradenexa.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TradeNexa Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TradeNexa | Localized Decentralized Exchange",
    description: "Trade crypto seamlessly priced natively in your local currency.",
    images: ["https://tradenexa.com/og-image.jpg"],
  },
  alternates: {
    canonical: "https://tradenexa.com",
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
