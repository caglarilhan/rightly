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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                R
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-bold text-gray-900">Rightly</div>
                <div className="text-xs text-gray-500 font-medium">GDPR Compliance Hub</div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Özellikler
              </Link>
              <Link href="/pricing" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Fiyatlandırma
              </Link>
              <Link href="/about" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Hakkımızda
              </Link>
              <Link href="/docs" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
                Dokümantasyon
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              GDPR Uyumluluk Platformu
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              GDPR Uyumluluğunu{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Kolaylaştırın
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
              E-ticaret işletmeniz için kapsamlı GDPR çözümleri. DSAR taleplerinden veri ihlali yönetimine kadar her şey tek platformda.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Ücretsiz Başlayın
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white hover:bg-gray-50 border-2 border-blue-600 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Özellikleri Keşfedin
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { icon: '📊', title: 'DSAR Yönetimi', desc: 'Otomatik talep işleme' },
                { icon: '🛒', title: 'E-ticaret Entegrasyonu', desc: 'Shopify & WooCommerce' },
                { icon: '🔒', title: 'Güvenli Export', desc: 'Tek kullanımlık linkler' },
                { icon: '⏰', title: 'SLA İzleme', desc: 'Otomatik uyarılar' }
              ].map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Kapsamlı GDPR Çözümleri
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Her boyutta e-ticaret işletmesi için tasarlanmış, GDPR uyumluluğunu basitleştiren özellikler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'DSAR Talebi Yönetimi',
                description: 'Veri erişim taleplerini otomatik olarak işleyin ve takip edin.',
                icon: '📋',
                features: ['Otomatik webhook entegrasyonu', 'SLA takibi', 'Durum bildirimleri']
              },
              {
                title: 'E-ticaret Entegrasyonu',
                description: 'Shopify ve WooCommerce ile otomatik webhook entegrasyonu.',
                icon: '🛍️',
                features: ['Shopify webhook desteği', 'WooCommerce entegrasyonu', 'Otomatik veri çekme']
              },
              {
                title: 'Güvenli Veri Export',
                description: 'Tek kullanımlık linkler ile güvenli veri export ve indirme.',
                icon: '🔐',
                features: ['Tek kullanımlık linkler', '24 saat TTL', 'Güvenli indirme']
              },
              {
                title: 'SLA İzleme',
                description: 'GDPR uyumluluk sürelerini otomatik takip edin ve uyarı alın.',
                icon: '⏱️',
                features: ['30 gün SLA takibi', 'Otomatik uyarılar', 'E-posta bildirimleri']
              },
              {
                title: 'Audit Log',
                description: 'Tüm işlemlerin hash-chain ile güvenli kaydı ve 12 ay saklama.',
                icon: '📝',
                features: ['Hash-chain kayıt', '12 ay saklama', 'Değişmezlik garantisi']
              },
              {
                title: 'Veri İhlali Yönetimi',
                description: 'GDPR Art.33/34 uyumlu veri ihlali raporlama ve bildirim sistemi.',
                icon: '🚨',
                features: ['72 saat bildirim', 'PDF rapor oluşturma', 'Regülatör iletişimi']
              }
            ].map((feature, index) => (
              <div key={index} className="group bg-white rounded-3xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            GDPR Uyumluluğuna Hemen Başlayın
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Dakikalar içinde kurulum yapın, ilk DSAR talebinizi yönetmeye başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-blue-600 bg-white hover:bg-gray-100 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ücretsiz Hesap Oluşturun
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600 rounded-2xl transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Fiyatları Görün
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg">
                  R
                </div>
                <div>
                  <div className="text-2xl font-bold">Rightly</div>
                  <div className="text-gray-400">GDPR Compliance Hub</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                E-ticaret işletmeleri için GDPR uyumluluğunu kolaylaştıran, DSAR taleplerini otomatik yöneten ve güvenli veri export sağlayan platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Ürün</h3>
              <ul className="space-y-4">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Özellikler</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Fiyatlandırma</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Dokümantasyon</Link></li>
                <li><Link href="/integrations" className="text-gray-400 hover:text-white transition-colors">Entegrasyonlar</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Şirket</h3>
              <ul className="space-y-4">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">İletişim</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Gizlilik</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Şartlar</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Rightly. Tüm hakları saklıdır.
              </p>
              <div className="mt-4 md:mt-0 flex items-center space-x-6 text-sm text-gray-400">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  GDPR Compliant
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  ISO 27001
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  SOC 2 Type II
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
