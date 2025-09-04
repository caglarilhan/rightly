export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
            Güvenlik ve Uyumluluk
          </h1>
          <p className="text-xl text-slate-600 text-center mb-12">
            GDPR uyumluluğu için gerekli tüm güvenlik önlemleri ve veri koruma standartları.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">EU-Hosted Altyapı</h3>
              <p className="text-slate-600 mb-4">Tüm verileriniz Avrupa Birliği sınırları içinde saklanır. GDPR Article 3 ve Schrems II uyumluluğu.</p>
              <ul className="text-slate-600 space-y-2">
                <li>• Frankfurt, Almanya veri merkezi</li>
                <li>• EU veri saklama garantisi</li>
                <li>• Schrems II uyumluluğu</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Güvenli Veri Export</h3>
              <p className="text-slate-600 mb-4">Tek kullanımlık linkler ile güvenli veri export. 24 saat sonra otomatik silme.</p>
              <ul className="text-slate-600 space-y-2">
                <li>• Tek kullanımlık download linkleri</li>
                <li>• 24 saat otomatik silme</li>
                <li>• Şifrelenmiş transfer</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Audit Log ve Hash-Chain</h3>
              <p className="text-slate-600 mb-4">Tüm işlemler hash-chain ile güvenli şekilde kayıt altına alınır. 12 ay saklama süresi.</p>
              <ul className="text-slate-600 space-y-2">
                <li>• Hash-chain ile değişmezlik</li>
                <li>• 12 ay saklama süresi</li>
                <li>• Tam işlem geçmişi</li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Webhook Güvenliği</h3>
              <p className="text-slate-600 mb-4">HMAC imza doğrulaması ile güvenli webhook entegrasyonu. Shopify ve WooCommerce uyumlu.</p>
              <ul className="text-slate-600 space-y-2">
                <li>• HMAC imza doğrulaması</li>
                <li>• Shopify/WooCommerce uyumlu</li>
                <li>• Güvenli veri transferi</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Sertifikalar ve Uyumluluk</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">GDPR Uyumlu</h3>
                <p className="text-slate-600 text-sm">Tam GDPR uyumluluğu ve DSAR yönetimi</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">ISO 27001</h3>
                <p className="text-slate-600 text-sm">Bilgi güvenliği yönetim sistemi</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">SOC 2 Type II</h3>
                <p className="text-slate-600 text-sm">Güvenlik ve operasyonel kontroller</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6 text-center">Güvenlik Açığı Bildirimi</h2>
            <div className="text-center">
              <p className="text-slate-600 mb-6">
                Güvenlik açığı bulduysanız, lütfen aşağıdaki kanallardan bize bildirin:
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                <a 
                  href="mailto:security@rightly.com" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  security@rightly.com
                </a>
                <a 
                  href="/security/pgp-key" 
                  className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  PGP Anahtarı
                </a>
              </div>
              <p className="text-slate-500 text-sm mt-4">
                Güvenlik açıklarını gizli tutuyoruz ve 48 saat içinde yanıt veriyoruz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
