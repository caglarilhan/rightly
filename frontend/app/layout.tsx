import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GDPR Hub Lite',
  description: 'Küçük işletmeler için GDPR DSAR otomasyonu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-900">
                    🛡️ GDPR Hub Lite
                  </h1>
                </div>
                <nav className="flex space-x-8">
                  <a href="/" className="text-gray-500 hover:text-gray-900">
                    Ana Sayfa
                  </a>
                  <a href="/dashboard" className="text-gray-500 hover:text-gray-900">
                    Dashboard
                  </a>
                  <a href="/requests" className="text-gray-500 hover:text-gray-900">
                    Talepler
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

