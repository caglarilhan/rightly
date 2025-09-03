import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Rightly Compliance — GDPR Hub",
  description:
    "DSAR ve ihlal yönetimini otomatikleştirin. 30 gün SLA, güvenli export, Shopify/Woo entegrasyonları.",
  openGraph: {
    title: "Rightly Compliance",
    description:
      "GDPR uyumluluğunu kanıtlanabilir şekilde kolaylaştırın.",
    images: ["/brand/og.jpg"],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

