'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <main>
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <a href="/features" className="hover:text-white transition-colors">Özellikler</a>
            <a href="/pricing" className="hover:text-white transition-colors">Fiyatlandırma</a>
            <a href="/security" className="hover:text-white transition-colors">Güvenlik</a>
            <a href="/docs" className="hover:text-white transition-colors">Dokümanlar</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-slate-200 hover:text-white transition-colors">Giriş</a>
            <a
              href="/pricing"
              className="inline-flex h-10 items-center rounded-xl bg-brand-blue px-5 font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Ücretsiz Başla
            </a>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container grid gap-12 px-4 py-24 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" /> GDPR by design
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              GDPR uyumluluğunu kolaylaştırın
            </h1>
            <p className="mt-5 text-lg text-slate-300">
              E-ticaret ve SaaS ekipleri için DSAR ve ihlal yönetimini otomatikleştirin.
              30 gün SLA takip, tek-kullanımlık güvenli export ve Shopify/Woo entegrasyonları.
            </p>
            <div className="mt-8 flex gap-3">
              <a className="h-11 rounded-xl bg-brand-blue px-6 text-white hover:bg-blue-800 transition-colors" href="/pricing">
                Ücretsiz Başla
              </a>
              <a className="h-11 rounded-xl border border-white/20 px-6 text-slate-200 hover:bg-white/5 transition-colors" href="/security">
                Güvenlik Özeti (PDF)
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-400">14 gün deneme • Kredi kartı gerekmez</p>
            <div className="mt-8 flex items-center gap-6 opacity-80">
              <div className="text-slate-400 font-semibold">Shopify</div>
              <div className="text-slate-400 font-semibold">WooCommerce</div>
              <div className="text-slate-400 font-semibold">Stripe</div>
              <div className="text-slate-400 font-semibold">Cloudflare</div>
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-3 shadow-card backdrop-blur">
              <div className="aspect-[16/10] w-full rounded-xl ring-1 ring-white/10 bg-slate-800 grid place-items-center text-slate-400">
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-2">Rightly Dashboard</div>
                  <div className="text-sm">DSAR Yönetimi • Shopify Entegrasyonu</div>
                </div>
              </div>
              <div className="pointer-events-none absolute -right-3 -top-3 rounded-full bg-[conic-gradient(from_210deg,#D4AF37,#B88A2B,#D4AF37)] px-3 py-1 text-xs font-semibold text-brand-navy shadow">
                EU-Hosted
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Blocks */}
      <section className="py-24">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Kapsamlı GDPR Çözümleri
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Her boyutta e-ticaret işletmesi için tasarlanmış, GDPR uyumluluğunu basitleştiren özellikler.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* DSAR Otomasyonu */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-card">
              <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">DSAR Otomasyonu</h3>
              <p className="text-slate-300 mb-4">
                Erişim, silme ve ihrac taleplerini uçtan uca otomatik yönetin. 30 gün SLA takibi ile tam uyumluluk.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Otomatik webhook entegrasyonu
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SLA takibi ve uyarılar
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Durum bildirimleri
                </li>
              </ul>
            </div>

            {/* E-ticaret Entegrasyonları */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-card">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">E-ticaret Entegrasyonları</h3>
              <p className="text-slate-300 mb-4">
                Shopify ve WooCommerce ile otomatik webhook entegrasyonu. Minimal izinler ile güvenli bağlantı.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Shopify webhook desteği
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  WooCommerce entegrasyonu
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Otomatik veri çekme
                </li>
              </ul>
            </div>

            {/* Güvenli Export */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-card">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Güvenli Export</h3>
              <p className="text-slate-300 mb-4">
                Tek kullanımlık linkler ile güvenli veri export. Checksum doğrulama ve audit log ile tam izlenebilirlik.
              </p>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tek kullanımlık linkler
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Checksum doğrulama
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-brand-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Audit log
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white/5">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-lg text-slate-300">
              3 basit adımda GDPR uyumluluğuna başlayın
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bağla</h3>
              <p className="text-slate-300">
                Shopify veya WooCommerce hesabınızı bağlayın. Minimal izinler ile güvenli entegrasyon.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Portalı Yerleştir</h3>
              <p className="text-slate-300">
                GDPR portalını sitenize ekleyin. Otomatik webhook'lar ile DSAR taleplerini yakalayın.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-brand-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Otomatik Kapat</h3>
              <p className="text-slate-300">
                DSAR taleplerini otomatik olarak işleyin ve 30 gün içinde tamamlayın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-24">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-blue mb-2">&lt;10dk</div>
              <div className="text-slate-300">Kurulum süresi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-gold mb-2">%99+</div>
              <div className="text-slate-300">SLA uyumu</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">5+</div>
              <div className="text-slate-300">Konektör</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-blue">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            İlk DSAR'ınızı 5 dakikada kapatın
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Ücretsiz deneme ile başlayın, GDPR uyumluluğunu kolaylaştırın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="h-11 px-6 rounded-xl bg-white text-brand-blue hover:bg-blue-50 font-medium transition-colors">
              Ücretsiz Başla
            </a>
            <a href="/docs" className="h-11 px-6 rounded-xl border border-white/30 text-white hover:bg-white/10 font-medium transition-colors">
              Dokümanları Gör
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-brand-navy/50">
        <div className="container px-4 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-8" />
              </div>
              <p className="text-slate-300 mb-4 max-w-md">
                E-ticaret işletmeleri için GDPR uyumluluğunu kolaylaştıran, DSAR taleplerini otomatik yöneten ve güvenli veri export sağlayan platform.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Ürün</h3>
              <ul className="space-y-2">
                <li><a href="/features" className="text-slate-300 hover:text-white transition-colors">Özellikler</a></li>
                <li><a href="/pricing" className="text-slate-300 hover:text-white transition-colors">Fiyatlandırma</a></li>
                <li><a href="/security" className="text-slate-300 hover:text-white transition-colors">Güvenlik</a></li>
                <li><a href="/docs" className="text-slate-300 hover:text-white transition-colors">Dokümanlar</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Şirket</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-slate-300 hover:text-white transition-colors">Hakkımızda</a></li>
                <li><a href="/contact" className="text-slate-300 hover:text-white transition-colors">İletişim</a></li>
                <li><a href="/blog" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/careers" className="text-slate-300 hover:text-white transition-colors">Kariyer</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} Rightly. Tüm hakları saklıdır.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-4 text-sm">
              <span className="flex items-center text-slate-400">
                <span className="w-2 h-2 bg-brand-gold rounded-full mr-2"></span>
                EU-Hosted
              </span>
              <span className="flex items-center text-slate-400">
                <span className="w-2 h-2 bg-brand-blue rounded-full mr-2"></span>
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
