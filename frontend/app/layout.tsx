import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rightly — GDPR Automation',
  description: 'Rightly ile DSAR ve GDPR uyumluluğunuzu otomatik yönetin.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white font-bold">R</span>
                  <span className="text-sm font-semibold tracking-wide">Rightly</span>
                </Link>
                <nav className="hidden md:flex items-center space-x-8 text-sm">
                  <Link href="/" className="text-gray-600 hover:text-gray-900">Ana Sayfa</Link>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Panel</Link>
                  <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">Giriş</Link>
                </nav>
                <div className="flex items-center space-x-3">
                  <Link href="/auth/register" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Ücretsiz Başla</Link>
                </div>
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>
          <footer className="border-t border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-gray-500 flex items-center justify-between">
              <p>© {new Date().getFullYear()} Rightly</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="hover:text-gray-700">Gizlilik</Link>
                <Link href="#" className="hover:text-gray-700">Şartlar</Link>
                <Link href="#" className="hover:text-gray-700">İletişim</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}

