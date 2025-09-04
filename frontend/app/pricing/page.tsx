'use client'

export default function PricingPage() {
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <a href="/features" className="hover:text-white transition-colors">Özellikler</a>
            <a href="/pricing" className="text-white font-medium">Fiyatlandırma</a>
            <a href="/security" className="hover:text-white transition-colors">Güvenlik</a>
            <a href="/docs" className="hover:text-white transition-colors">Dokümanlar</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-slate-200 hover:text-white transition-colors">Giriş</a>
            <a
              href="/signup"
              className="inline-flex h-10 items-center rounded-xl bg-brand-blue px-5 font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Ücretsiz Başla
            </a>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">Basit ve Şeffaf Fiyatlandırma</h1>
            <p className="text-slate-300 text-lg">İhtiyacınıza uygun planı seçin. Tüm planlar GDPR uyumluluğu için gerekli temel özellikleri içerir.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
                <div className="text-3xl font-bold text-white mb-2">₺0</div>
                <p className="text-slate-300 text-sm">Aylık</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  100 DSAR talebi/ay
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Temel webhook entegrasyonu
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Email desteği
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Temel raporlama
                </li>
              </ul>
              <a
                href="/signup"
                className="w-full inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 font-medium text-white hover:bg-white/10 transition-colors"
              >
                Ücretsiz Başla
              </a>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl border-2 border-brand-blue bg-white/10 backdrop-blur p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-brand-blue text-white px-4 py-1 rounded-full text-sm font-medium">Popüler</span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
                <div className="text-3xl font-bold text-white mb-2">₺299</div>
                <p className="text-slate-300 text-sm">Aylık</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Sınırsız DSAR talebi
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gelişmiş webhook entegrasyonu
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Öncelikli destek
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Gelişmiş raporlama
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  SLA garantisi
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Veri ihlali raporlama
                </li>
              </ul>
              <a
                href="/signup"
                className="w-full inline-flex h-12 items-center justify-center rounded-xl bg-brand-blue px-6 font-medium text-white hover:bg-blue-800 transition-colors"
              >
                Pro'ya Geç
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-white mb-2">Özel</div>
                <p className="text-slate-300 text-sm">Fiyat teklifi</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Pro özellikleri + daha fazlası
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Özel entegrasyonlar
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  7/24 destek
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Özel SLA
                </li>
                <li className="flex items-center text-slate-300">
                  <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  On-premise seçeneği
                </li>
              </ul>
              <a
                href="/contact"
                className="w-full inline-flex h-12 items-center justify-center rounded-xl border border-white/20 bg-transparent px-6 font-medium text-white hover:bg-white/10 transition-colors"
              >
                İletişime Geç
              </a>
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-2xl font-semibold text-white mb-4">SSS</h2>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-left">
                <h3 className="text-lg font-medium text-white mb-2">Fatura nasıl çalışır?</h3>
                <p className="text-slate-300">Aylık olarak faturalandırılır. İstediğiniz zaman iptal edebilirsiniz.</p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-white mb-2">Plan değişikliği yapabilir miyim?</h3>
                <p className="text-slate-300">Evet, hesap ayarlarından planınızı istediğiniz zaman değiştirebilirsiniz.</p>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-white mb-2">Destek nasıl sağlanır?</h3>
                <p className="text-slate-300">Starter planında email desteği, Pro ve Enterprise planlarında öncelikli destek.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-brand-navy/50">
        <div className="container px-4 py-12 text-slate-300">
          <div className="text-sm">© {new Date().getFullYear()} Rightly.</div>
        </div>
      </footer>
    </main>
  )
}
