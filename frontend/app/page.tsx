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
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                R
              </div>
              <span className="text-lg font-semibold text-gray-900">Rightly</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Özellikler
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Fiyatlandırma
              </Link>
              <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Hakkımızda
              </Link>
              <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Dokümantasyon
              </Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Ücretsiz Başla
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mb-6">
              GDPR Uyumluluk Platformu
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              GDPR Uyumluluğunu{' '}
              <span className="text-blue-600">Kolaylaştırın</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              E-ticaret işletmeniz için kapsamlı GDPR çözümleri. DSAR taleplerinden veri ihlali yönetimine kadar her şey tek platformda.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Ücretsiz Başlayın
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-600 bg-white hover:bg-gray-50 border border-blue-600 rounded-lg transition-colors"
              >
                Özellikleri Keşfedin
              </Link>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: '📊', title: 'DSAR Yönetimi', desc: 'Otomatik talep işleme' },
                { icon: '🛒', title: 'E-ticaret Entegrasyonu', desc: 'Shopify & WooCommerce' },
                { icon: '🔒', title: 'Güvenli Export', desc: 'Tek kullanımlık linkler' },
                { icon: '⏰', title: 'SLA İzleme', desc: 'Otomatik uyarılar' }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Kapsamlı GDPR Çözümleri
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Her boyutta e-ticaret işletmesi için tasarlanmış, GDPR uyumluluğunu basitleştiren özellikler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div key={index} className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-xs text-gray-600">
                      <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              E-ticaret işletmelerinin GDPR uyumluluğu deneyimleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ayşe Yılmaz',
                role: 'E-ticaret Müdürü',
                company: 'ModaStore',
                content: 'Rightly sayesinde GDPR uyumluluğu artık bir kabus değil. DSAR taleplerini otomatik olarak yönetiyoruz.',
                avatar: 'AY'
              },
              {
                name: 'Mehmet Kaya',
                role: 'CTO',
                company: 'TechShop',
                content: 'Shopify entegrasyonu mükemmel çalışıyor. Webhook\'lar sayesinde hiçbir talebi kaçırmıyoruz.',
                avatar: 'MK'
              },
              {
                name: 'Zeynep Demir',
                role: 'Veri Koruma Sorumlusu',
                company: 'EcoMarket',
                content: 'Audit log özelliği ile tüm işlemlerimizi takip edebiliyoruz. Çok güvenilir bir platform.',
                avatar: 'ZD'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-gray-600">{testimonial.role} • {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            GDPR Uyumluluğuna Hemen Başlayın
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Dakikalar içinde kurulum yapın, ilk DSAR talebinizi yönetmeye başlayın.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-blue-600 bg-white hover:bg-gray-100 rounded-lg transition-colors"
            >
              Ücretsiz Hesap Oluşturun
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white hover:bg-white hover:text-blue-600 rounded-lg transition-colors"
            >
              Fiyatları Görün
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <div className="text-lg font-semibold">Rightly</div>
                  <div className="text-gray-400 text-sm">GDPR Compliance Hub</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 max-w-md">
                E-ticaret işletmeleri için GDPR uyumluluğunu kolaylaştıran, DSAR taleplerini otomatik yöneten ve güvenli veri export sağlayan platform.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Ürün</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors text-sm">Özellikler</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Fiyatlandırma</Link></li>
                <li><Link href="/docs" className="text-gray-400 hover:text-white transition-colors text-sm">Dokümantasyon</Link></li>
                <li><Link href="/integrations" className="text-gray-400 hover:text-white transition-colors text-sm">Entegrasyonlar</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">İletişim</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Gizlilik</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Şartlar</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} Rightly. Tüm hakları saklıdır.
              </p>
              <div className="mt-4 md:mt-0 flex items-center space-x-4 text-xs text-gray-400">
                <span>GDPR Compliant</span>
                <span>ISO 27001</span>
                <span>SOC 2 Type II</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
