import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

const team = [
  {
    name: 'Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    bio: '10+ yıl e-ticaret ve veri güvenliği deneyimi. GDPR uyumluluğu konusunda uzman.',
    avatar: 'AY',
    linkedin: '#'
  },
  {
    name: 'Zeynep Kaya',
    role: 'CTO',
    bio: 'Full-stack geliştirici, güvenlik uzmanı. Önceki deneyim: Google, Microsoft.',
    avatar: 'ZK',
    linkedin: '#'
  },
  {
    name: 'Mehmet Demir',
    role: 'Ürün Müdürü',
    bio: 'Kullanıcı deneyimi odaklı ürün geliştirme. E-ticaret ekosistemi uzmanı.',
    avatar: 'MD',
    linkedin: '#'
  },
  {
    name: 'Elif Özkan',
    role: 'Hukuk Danışmanı',
    bio: 'Veri koruma hukuku uzmanı. GDPR ve KVKK konularında 8+ yıl deneyim.',
    avatar: 'EÖ',
    linkedin: '#'
  }
]

const stats = [
  { label: 'Aktif Müşteri', value: '500+' },
  { label: 'İşlenen DSAR', value: '10K+' },
  { label: 'Uptime', value: '99.9%' },
  { label: 'Müşteri Memnuniyeti', value: '98%' }
]

const values = [
  {
    title: 'Güvenlik Önceliği',
    description: 'Müşteri verilerinin güvenliği bizim için her şeyden önce gelir.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: 'Şeffaflık',
    description: 'Tüm işlemlerimizde şeffaf ve açık iletişim kuruyoruz.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    title: 'İnovasyon',
    description: 'Sürekli gelişim ve teknolojik yeniliklerle müşterilerimize en iyi hizmeti sunuyoruz.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Müşteri Odaklılık',
    description: 'Müşteri ihtiyaçlarını anlayarak kişiselleştirilmiş çözümler geliştiriyoruz.',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="primary" className="mb-4">Hakkımızda</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              GDPR Uyumluluğunu <span className="text-blue-600">Kolaylaştıran</span> Ekip
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              2023 yılında kurulan Rightly, e-ticaret işletmelerinin GDPR uyumluluğunu basitleştirmek için yola çıktı. 
              Bugün 500+ müşteriye hizmet veriyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">İletişime Geçin</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/careers">Kariyer Fırsatları</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Misyonumuz
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                E-ticaret işletmelerinin GDPR uyumluluğunu karmaşık bir süreç olmaktan çıkarıp, 
                basit ve otomatik hale getirmek. Müşterilerimizin veri güvenliği konusunda 
                endişe duymadan işlerine odaklanmalarını sağlamak.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Teknoloji ve hukuk uzmanlığımızı birleştirerek, GDPR uyumluluğunu 
                her boyutta işletme için erişilebilir kılıyoruz.
              </p>
              <Button size="lg" asChild>
                <Link href="/features">Özelliklerimizi Keşfedin</Link>
              </Button>
            </div>
            <div className="relative">
              <Card className="p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Vizyonumuz</h3>
                  <p className="text-gray-600">
                    Avrupa'nın önde gelen GDPR uyumluluk platformu olmak ve 
                    veri koruma standartlarını yükseltmek.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Değerlerimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Çalışma prensiplerimizi ve değerlerimizi yansıtan temel ilkelerimiz.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                    {value.icon}
                  </div>
                </div>
                <CardTitle className="text-xl mb-3">{value.title}</CardTitle>
                <CardDescription className="text-base">
                  {value.description}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              GDPR uyumluluğu konusunda uzman ekibimizle tanışın.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                    {member.avatar}
                  </div>
                </div>
                <CardTitle className="text-lg mb-1">{member.name}</CardTitle>
                <CardDescription className="text-blue-600 font-medium mb-3">
                  {member.role}
                </CardDescription>
                <CardDescription className="text-sm">
                  {member.bio}
                </CardDescription>
                <div className="mt-4">
                  <a 
                    href={member.linkedin} 
                    className="text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </a>
                </div>
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
                Bizimle Çalışın
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                GDPR uyumluluğu konusunda uzman ekibimizle tanışın ve işletmenizi koruyun.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/contact">İletişime Geçin</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                  <Link href="/auth/register">Ücretsiz Başlayın</Link>
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
