'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Eğer kullanıcı giriş yapmışsa dashboard'a yönlendir
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">GDPR Hub Lite</h1>
              <p className="text-gray-600">GDPR Uyumluluk Platformu</p>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/auth/login"
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="bg-white hover:bg-gray-50 text-primary border border-primary px-4 py-2 rounded-md text-sm font-medium"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            GDPR Uyumluluğu
            <span className="text-primary"> Kolaylaştırıldı</span>
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            DSAR taleplerini otomatik olarak yönetin, GDPR uyumluluğunu sağlayın ve müşteri verilerini güvenle koruyun.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
              >
                Ücretsiz Başlayın
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Demo İnceleyin
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Otomatik DSAR Yönetimi</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Veri erişim ve silme taleplerini otomatik olarak işleyin ve 30 günlük süre sınırını aşmayın.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gdpr-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">E-ticaret Entegrasyonu</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Shopify ve WooCommerce ile tam entegrasyon. Webhook'lar ile otomatik talep alımı.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Güvenli Veri İşleme</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      End-to-end şifreleme, audit log'lar ve güvenli veri export'u ile tam güvenlik.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-primary rounded-lg shadow-xl">
          <div className="px-6 py-12 text-center">
            <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
              GDPR Uyumluluğunu Kolaylaştırın
            </h3>
            <p className="mt-4 text-lg text-primary-100">
              Hemen başlayın ve DSAR taleplerinizi profesyonel bir şekilde yönetin.
            </p>
            <div className="mt-8">
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50"
              >
                Ücretsiz Hesap Oluşturun
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; 2024 GDPR Hub Lite. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
