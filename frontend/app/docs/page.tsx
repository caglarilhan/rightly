'use client'

export default function DocsPage() {
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
            <a href="/security" className="hover:text-white transition-colors">Güvenlik</a>
            <a href="/docs" className="text-white font-medium">Dokümanlar</a>
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
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-semibold text-white mb-4">Dokümanlar</h1>
            <p className="text-slate-300 mb-8">Rightly ürününü hızlıca kurmak, entegre etmek ve yönetmek için rehberler.</p>

            <div className="space-y-8">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Başlarken</h2>
                <p className="text-slate-300 mb-4">Kurulum, ilk DSAR talebi ve temel kavramlar.</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Kurulum (Next.js + API anahtarı)</li>
                  <li>DSAR talebi oluşturma</li>
                  <li>Webhook doğrulama (Shopify/WooCommerce)</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Entegrasyonlar</h2>
                <p className="text-slate-300 mb-4">E-ticaret platformları ve ödeme sağlayıcıları ile entegrasyon.</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>Shopify App kurulumu ve HMAC doğrulama</li>
                  <li>WooCommerce webhooks</li>
                  <li>Stripe imza doğrulaması</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
                <h2 className="text-xl font-semibold text-white mb-2">Güvenlik</h2>
                <p className="text-slate-300 mb-4">Veri güvenliği, EU-Hosted mimari ve export güvenliği.</p>
                <ul className="list-disc list-inside text-slate-300 space-y-1">
                  <li>EU-Hosted mimari</li>
                  <li>Tek kullanımlık export bağlantıları</li>
                  <li>Audit Log ve hash-chain</li>
                </ul>
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

