import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Mbah Mur Trailer Film - Nonton Trailer Film Terbaru & Terlengkap",
  description: "Jelajahi ribuan trailer film terbaru dan terlengkap. Cari berdasarkan genre, temukan film favorit, dan tonton trailer dengan gaya khas Netflix.",
  keywords: ["trailer film", "mbah mur", "nonton trailer", "film terbaru", "netflix font", "nonton film"],
  authors: [{ name: "Mbah Mur Trailer Film" }],
  openGraph: {
    title: "Mbah Mur Trailer Film - Nonton Trailer Film Terbaru",
    description: "Jelajahi ribuan trailer film terbaru dan terlengkap. Cari berdasarkan genre dan tonton trailer dengan font khas Netflix.",
    url: "https://netflix-clone-khaki-two-35.vercel.app",
    siteName: "Mbah Mur Trailer Film",
    images: [
      {
        url: "https://netflix-clone-khaki-two-35.vercel.app/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Mbah Mur Trailer Film Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mbah Mur Trailer Film - Nonton Trailer Film Terbaru",
    description: "Jelajahi ribuan trailer film terbaru dan terlengkap.",
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
