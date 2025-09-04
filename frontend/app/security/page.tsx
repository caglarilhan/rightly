'use client'

export default function SecurityPage() {
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <a href="/features" className="hover:text-white transition-colors">Özellikler</a>
            <a href="/pricing" className="hover:text-white transition-colors">Fiyatlandırma</a>
            <a href="/security" className="text-white font-medium">Güvenlik</a>
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
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">Güvenlik ve Uyumluluk</h1>
            <p className="text-slate-300 text-lg">GDPR uyumluluğu için gerekli tüm güvenlik önlemleri ve veri koruma standartları.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">EU-Hosted Altyapı</h3>
              <p className="text-slate-300 mb-4">Tüm verileriniz Avrupa Birliği sınırları içinde saklanır. GDPR Article 3 ve Schrems II uyumluluğu.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Frankfurt, Almanya veri merkezi</li>
                <li>• EU veri saklama garantisi</li>
                <li>• Schrems II uyumluluğu</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Güvenli Veri Export</h3>
              <p className="text-slate-300 mb-4">Tek kullanımlık linkler ile güvenli veri export. 24 saat sonra otomatik silme.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Tek kullanımlık download linkleri</li>
                <li>• 24 saat otomatik silme</li>
                <li>• Şifrelenmiş transfer</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Audit Log ve Hash-Chain</h3>
              <p className="text-slate-300 mb-4">Tüm işlemler hash-chain ile güvenli şekilde kayıt altına alınır. 12 ay saklama süresi.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Hash-chain ile değişmezlik</li>
                <li>• 12 ay saklama süresi</li>
                <li>• Tam işlem geçmişi</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Webhook Güvenliği</h3>
              <p className="text-slate-300 mb-4">HMAC imza doğrulaması ile güvenli webhook entegrasyonu. Shopify ve WooCommerce uyumlu.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• HMAC imza doğrulaması</li>
                <li>• Shopify/WooCommerce uyumlu</li>
                <li>• Güvenli veri transferi</li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8 mb-16">
            <h2 className="text-2xl font-semibold text-white mb-6 text-center">Sertifikalar ve Uyumluluk</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">GDPR Uyumlu</h3>
                <p className="text-slate-300 text-sm">Tam GDPR uyumluluğu ve veri koruma standartları</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">ISO 27001</h3>
                <p className="text-slate-300 text-sm">Bilgi güvenliği yönetim sistemi sertifikası</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">SOC 2 Type II</h3>
                <p className="text-slate-300 text-sm">Güvenlik, erişilebilirlik ve gizlilik kontrolleri</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Güvenlik Dokümanları</h2>
            <p className="text-slate-300 mb-8">Detaylı güvenlik bilgileri ve uyumluluk dokümanları için bizimle iletişime geçin.</p>
            <a
              href="/contact"
              className="inline-flex h-12 items-center rounded-xl bg-brand-blue px-8 font-medium text-white hover:bg-blue-800 transition-colors"
            >
              İletişime Geç
            </a>
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

