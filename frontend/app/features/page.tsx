'use client'

export default function FeaturesPage() {
  return (
    <main>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-2">
            <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
            <a href="/features" className="text-white font-medium">Özellikler</a>
            <a href="/pricing" className="hover:text-white transition-colors">Fiyatlandırma</a>
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
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">GDPR Uyumluluğu için Gerekli Tüm Araçlar</h1>
            <p className="text-slate-300 text-lg">DSAR talepleri, veri işleme kayıtları, onay yönetimi ve daha fazlası tek platformda.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">DSAR Talepleri</h3>
              <p className="text-slate-300 mb-4">Veri erişim, düzeltme ve silme taleplerini otomatik olarak işleyin. Webhook entegrasyonu ile e-ticaret platformlarınızla senkronize çalışır.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Otomatik veri toplama ve export</li>
                <li>• Webhook entegrasyonu (Shopify, WooCommerce)</li>
                <li>• Talep durumu takibi</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Veri İşleme Kayıtları</h3>
              <p className="text-slate-300 mb-4">GDPR Article 30 gereği veri işleme faaliyetlerinizi kayıt altına alın. Veri işleme amaçları, süreleri ve paylaşım detaylarını yönetin.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Veri işleme amaçları</li>
                <li>• Veri saklama süreleri</li>
                <li>• Üçüncü taraf paylaşımları</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Onay Yönetimi</h3>
              <p className="text-slate-300 mb-4">Kullanıcı onaylarını merkezi olarak yönetin. Onay geçmişi, iptal işlemleri ve onay kanıtlarını saklayın.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• Onay geçmişi takibi</li>
                <li>• Onay kanıtları</li>
                <li>• Toplu onay yönetimi</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-8">
              <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Veri İhlali Raporlama</h3>
              <p className="text-slate-300 mb-4">72 saat içinde yetkili makamlara bildirim yapın. İhlal detayları, etkilenen kişi sayısı ve alınan önlemleri kayıt altına alın.</p>
              <ul className="text-slate-300 space-y-2">
                <li>• İhlal detayları</li>
                <li>• Etkilenen kişi sayısı</li>
                <li>• Alınan önlemler</li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Hemen Başlayın</h2>
            <p className="text-slate-300 mb-8">GDPR uyumluluğu için gerekli tüm araçlar tek platformda.</p>
            <a
              href="/signup"
              className="inline-flex h-12 items-center rounded-xl bg-brand-blue px-8 font-medium text-white hover:bg-blue-800 transition-colors"
            >
              Ücretsiz Hesap Oluştur
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
