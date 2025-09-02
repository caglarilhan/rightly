import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const plans = [
  {
    name: 'Starter',
    price: 'Ücretsiz',
    description: 'Küçük işletmeler için temel GDPR uyumluluğu',
    features: [
      'Aylık 10 DSAR talebi',
      'Temel webhook entegrasyonu',
      'Email bildirimleri',
      'Temel audit log',
      'Email desteği',
      'GDPR şablonları'
    ],
    badge: 'Popüler',
    popular: false,
    cta: 'Ücretsiz Başla',
    href: '/auth/register'
  },
  {
    name: 'Professional',
    price: '₺299',
    period: '/ay',
    description: 'Büyüyen e-ticaret işletmeleri için',
    features: [
      'Aylık 100 DSAR talebi',
      'Shopify & WooCommerce entegrasyonu',
      'Gelişmiş webhook yönetimi',
      'SLA izleme ve uyarılar',
      'Veri ihlali yönetimi',
      'Öncelikli destek',
      'API erişimi',
      'Özel şablonlar'
    ],
    badge: 'En Popüler',
    popular: true,
    cta: 'Pro\'ya Geç',
    href: '/auth/register?plan=pro'
  },
  {
    name: 'Enterprise',
    price: 'Özel',
    description: 'Büyük işletmeler için özel çözümler',
    features: [
      'Sınırsız DSAR talebi',
      'Tüm e-ticaret entegrasyonları',
      'Özel API geliştirme',
      'Dedicated support',
      'On-premise kurulum',
      'SLA garantisi',
      'Özel eğitim',
      'GDPR danışmanlığı'
    ],
    badge: 'Enterprise',
    popular: false,
    cta: 'İletişime Geç',
    href: '/contact'
  }
]

const features = [
  {
    title: 'DSAR Talebi Yönetimi',
    starter: '✓',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'E-ticaret Entegrasyonu',
    starter: 'Temel',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'Güvenli Veri Export',
    starter: '✓',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'SLA İzleme',
    starter: '✗',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'Audit Log',
    starter: 'Temel',
    pro: 'Gelişmiş',
    enterprise: '✓'
  },
  {
    title: 'Veri İhlali Yönetimi',
    starter: '✗',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'API Erişimi',
    starter: '✗',
    pro: '✓',
    enterprise: '✓'
  },
  {
    title: 'Öncelikli Destek',
    starter: '✗',
    pro: '✓',
    enterprise: '✓'
  }
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="primary" className="mb-4">Fiyatlandırma</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              İhtiyacınıza Uygun <span className="text-blue-600">Plan</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Her boyutta e-ticaret işletmesi için tasarlanmış, şeffaf fiyatlandırma. İhtiyacınız büyüdükçe planınızı yükseltin.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'ring-2 ring-blue-600 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="primary" className="px-4 py-1">
                      {plan.badge}
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-gray-600 ml-1">{plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-gray-600">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    variant={plan.popular ? 'primary' : 'outline'}
                    asChild
                  >
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Özellik Karşılaştırması
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hangi planın size uygun olduğunu görmek için özellikleri karşılaştırın.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Özellik</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Starter</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Professional</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 px-6 font-medium text-gray-900">{feature.title}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{feature.starter}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{feature.pro}</td>
                    <td className="py-4 px-6 text-center text-gray-600">{feature.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Sık Sorulan Sorular
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fiyatlandırma hakkında merak ettiğiniz soruların cevapları.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Plan değişikliği yapabilir miyim?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Evet, istediğiniz zaman planınızı yükseltebilir veya düşürebilirsiniz. Değişiklikler anında etkili olur.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ücretsiz deneme sürümü var mı?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Starter plan tamamen ücretsizdir. Professional plan için 14 günlük ücretsiz deneme sunuyoruz.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>İptal edebilir miyim?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz. İptal sonrası dönem sonuna kadar hizmet almaya devam edersiniz.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fatura nasıl alırım?</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Aylık olarak email ile fatura gönderiyoruz. Enterprise müşterileri için özel fatura düzenleme seçenekleri mevcuttur.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center p-12">
            <CardHeader>
              <CardTitle className="text-3xl sm:text-4xl text-white mb-4">
                Hemen Başlayın
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Ücretsiz hesap oluşturun ve GDPR uyumluluğuna ilk adımı atın.
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
