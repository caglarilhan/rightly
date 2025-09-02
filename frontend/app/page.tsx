'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Rightly</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Özellikler</Link>
              <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Fiyatlandırma</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">Hakkımızda</Link>
            </nav>

            {/* Auth */}
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Giriş
              </Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Başla
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            GDPR Uyumluluğunu Kolaylaştırın
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            E-ticaret işletmeniz için GDPR çözümleri. DSAR taleplerini otomatik yönetin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Ücretsiz Başla
            </Link>
            <Link href="/features" className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-50">
              Özellikleri Gör
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Özellikler</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">DSAR Yönetimi</h3>
              <p className="text-gray-600">Veri erişim taleplerini otomatik işleyin</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">E-ticaret Entegrasyonu</h3>
              <p className="text-gray-600">Shopify ve WooCommerce desteği</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Güvenli Export</h3>
              <p className="text-gray-600">Tek kullanımlık güvenli linkler</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-blue-100 mb-8">
            GDPR uyumluluğunu kolaylaştırın
          </p>
          <Link href="/auth/register" className="bg-white text-blue-600 px-8 py-3 rounded hover:bg-gray-100">
            Ücretsiz Hesap Oluştur
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-semibold">Rightly</span>
              </div>
              <p className="text-gray-400 text-sm">
                GDPR uyumluluğunu kolaylaştıran platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white">Özellikler</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Fiyatlandırma</Link></li>
                <li><Link href="/docs" className="hover:text-white">Dokümantasyon</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/contact" className="hover:text-white">İletişim</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Gizlilik</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Rightly. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
