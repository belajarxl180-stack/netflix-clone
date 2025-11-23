import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Netflix Clone - Watch Unlimited Movies & TV Shows",
  description: "Discover and explore thousands of popular movies and TV shows. Browse by genre, search for your favorites, and watch trailers. Free Netflix-style streaming platform.",
  keywords: ["netflix", "movies", "streaming", "tv shows", "watch movies", "film online", "nonton film"],
  authors: [{ name: "Netflix Clone" }],
  openGraph: {
    title: "Netflix Clone - Watch Unlimited Movies",
    description: "Discover thousands of popular movies and TV shows. Browse by genre and watch trailers.",
    url: "https://netflix-clone-khaki-two-35.vercel.app",
    siteName: "Netflix Clone",
    images: [
      {
        url: "https://netflix-clone-khaki-two-35.vercel.app/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Netflix Clone Banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Netflix Clone - Watch Unlimited Movies",
    description: "Discover thousands of popular movies and TV shows",
    images: ["https://netflix-clone-khaki-two-35.vercel.app/banner.jpg"],
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#E50914" />
        <link rel="apple-touch-icon" href="/next.svg" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
