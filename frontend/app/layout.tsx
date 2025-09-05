import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "../components/Footer";
import { SeoJsonLd } from "../components/SeoJsonLd";
import { SkipToMainContent } from "../components/SkipToMainContent";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap", 
  weight: ["400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rightly.com"),
  title: "Rightly - GDPR Compliance Platform",
  description: "Enterprise-grade GDPR compliance and DSAR management platform",
  openGraph: {
    title: "Rightly Compliance",
    description: "GDPR uyumluluğu için kapsamlı veri koruma ve uyumluluk platformu.",
    url: "https://rightly.com",
    siteName: "Rightly Compliance",
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <SeoJsonLd json={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Rightly Compliance",
          "url": "https://rightly.com",
          "logo": "https://rightly.com/logo-mark.png",
          "sameAs": [
            "https://twitter.com/rightly",
            "https://www.linkedin.com/company/rightly"
          ]
        }} />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <SkipToMainContent />
          <Navbar />
          <main id="main-content">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}

