import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const features = [
  {
    title: 'DSAR Talebi Yönetimi',
    description: 'Veri erişim taleplerini otomatik olarak işleyin, takip edin ve yanıtlayın.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    badge: 'Temel',
    color: 'blue'
  },
  {
    title: 'E-ticaret Entegrasyonu',
    description: 'Shopify ve WooCommerce ile otomatik webhook entegrasyonu.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    badge: 'Pro',
    color: 'purple'
  },
  {
    title: 'Güvenli Veri Export',
    description: 'Tek kullanımlık linkler ile güvenli veri export ve indirme.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    badge: 'Temel',
    color: 'green'
  },
  {
    title: 'SLA İzleme',
    description: 'GDPR uyumluluk sürelerini otomatik takip edin ve uyarı alın.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    badge: 'Pro',
    color: 'amber'
  },
  {
    title: 'Audit Log',
    description: 'Tüm işlemlerin hash-chain ile güvenli kaydı ve 12 ay saklama.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    badge: 'Enterprise',
    color: 'emerald'
  },
  {
    title: 'Veri İhlali Yönetimi',
    description: 'GDPR Art.33/34 uyumlu veri ihlali raporlama ve bildirim sistemi.',
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
    badge: 'Enterprise',
    color: 'red'
  }
]

const integrations = [
  { name: 'Shopify', logo: '🛍️', status: 'active' },
  { name: 'WooCommerce', logo: '🛒', status: 'active' },
  { name: 'Magento', logo: '🛍️', status: 'coming-soon' },
  { name: 'PrestaShop', logo: '🛍️', status: 'coming-soon' },
  { name: 'BigCommerce', logo: '🛍️', status: 'coming-soon' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="primary" className="mb-4">Özellikler</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              GDPR Uyumluluğunu <span className="text-blue-600">Kolaylaştırın</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              E-ticaret işletmeniz için kapsamlı GDPR çözümleri. DSAR taleplerinden veri ihlali yönetimine kadar her şey tek platformda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/auth/register">Ücretsiz Başlayın</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">Fiyatları Görün</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Kapsamlı GDPR Çözümleri
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Her boyutta e-ticaret işletmesi için tasarlanmış, GDPR uyumluluğunu basitleştiren özellikler.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${feature.color}-100 text-${feature.color}-600 group-hover:scale-110 transition-transform duration-200`}>
                      {feature.icon}
                    </div>
                    <Badge variant={feature.badge === 'Enterprise' ? 'danger' : feature.badge === 'Pro' ? 'primary' : 'secondary'}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              E-ticaret Entegrasyonları
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Popüler e-ticaret platformlarıyla sorunsuz entegrasyon. Webhook'lar ile otomatik veri senkronizasyonu.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center p-6">
                <div className="text-4xl mb-4">{integration.logo}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{integration.name}</h3>
                <Badge 
                  variant={integration.status === 'active' ? 'success' : 'secondary'}
                  size="sm"
                >
                  {integration.status === 'active' ? 'Aktif' : 'Yakında'}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center p-12">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl text-white mb-4">
                GDPR Uyumluluğuna Hemen Başlayın
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Dakikalar içinde kurulum yapın, ilk DSAR talebinizi yönetmeye başlayın.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/register">Ücretsiz Hesap Oluşturun</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/contact">Demo İsteyin</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
