import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanım Şartları – Rightly Compliance",
  description: "Rightly Compliance platform kullanım şartları ve koşulları.",
  openGraph: {
    title: "Rightly Compliance – Kullanım Şartları",
    description: "Platform kullanım şartları ve koşulları.",
    url: "https://rightly.com/terms",
    siteName: "Rightly Compliance",
    images: [{ url: "/og/og-default.png", width: 1200, height: 630 }],
    locale: "tr_TR",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  alternates: {
    canonical: "https://rightly.com/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Kullanım Şartları
          </h1>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                1. Hizmet Kapsamı
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Rightly Compliance, GDPR uyumluluğu için veri koruma ve uyumluluk platformu sağlar. 
                Hizmetlerimiz DSAR (Data Subject Access Request) yönetimi, veri haritalama, 
                uyumluluk raporlama ve ilgili araçları içerir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                2. Kullanıcı Sorumlulukları
              </h2>
              <ul className="text-slate-600 space-y-2">
                <li>• Platformu yasal amaçlar için kullanmak</li>
                <li>• Hesap güvenliğini korumak</li>
                <li>• Veri koruma yasalarına uymak</li>
                <li>• Platform kurallarını ihlal etmemek</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                3. Fikri Mülkiyet
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Platform ve içeriği Rightly Compliance'a aittir. Kullanıcılar sadece 
                lisanslanmış hakları kullanabilir.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                4. Sorumluluk Sınırları
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Rightly Compliance, platform kullanımından doğan dolaylı zararlardan 
                sorumlu değildir. Maksimum sorumluluk aylık abonelik ücreti ile sınırlıdır.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                5. Değişiklikler
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Bu şartlar önceden haber verilmeksizin değiştirilebilir. 
                Değişiklikler web sitesinde yayınlandığı tarihten itibaren geçerlidir.
              </p>
            </div>

            <div className="border-t border-slate-200 pt-8">
              <p className="text-sm text-slate-500">
                Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
