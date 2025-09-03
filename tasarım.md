Kesinlikle yükseltiriz. “kurumsal-şık, güven veren, enterprise-grade” bir kimlik için sana Cursor’a yapıştır-çalıştır bir Enterprise Prompt v2 hazırladım. Bu; tasarım sistemi, copy, bileşen seti, sayfa mimarisi, etkileşim ve performans standartlarını birlikte kuruyor. Çıkışı: Stripe/Snyk/Vercel ayarında, şirket arkasında büyük ekip var hissi.

⸻

CURSOR PROMPT — Rightly Enterprise (kurumsal sürüm)

Aşağıdaki gereksinimlerle Next.js 14 + Tailwind + shadcn/ui tabanlı kurumsal web’i BAŞTAN OLUŞTUR:

0) Marka & Ton
	•	Ürün: Rightly — Compliance Hub
	•	Değer vaadi: “DSAR & ihlal yönetimini 30 gün kuralına tam uyumla, kanıtlanabilir şekilde otomatikleştirin.”
	•	Ton: net, sakin, güven veren; pazarlama değil “trust center” dilinde.
	•	Kanıt odaklı CTA: “Canlı demo / Güvenlik dokümanı indir / DPA iste”.

1) Tasarım Sistemi (Design Tokens)
	•	Renkler:
	•	primary: #0F172A (slate-900, kurumsal koyu)
	•	ink: #111827 (başlıklar)
	•	blue: #1D4ED8 (aksan)
	•	emerald: #10B981 (başarı/rozetler)
	•	sand: #F8FAFC (arka plan açık)
	•	card: beyaz/dark için bg-white/70 | bg-slate-900/60 + backdrop-blur
	•	Tipografi: Inter Variable; H1 48/56, H2 36/44, body 16/28.
	•	Yoğunluk: section spacing py-24, kart içi p-6, grid max-w-7xl.
	•	Kenar: rounded-2xl, gölge shadow-[0_8px_30px_rgba(0,0,0,0.06)].
	•	Görsel dil: beyaz alan + ince grid arka plan, gerçek ekran görüntüsü (mock değil).

2) Global Yapı
	•	Navbar: sol tipografik logo, orta nav (Özellikler, Fiyatlandırma, Güvenlik, Dokümanlar, Blog), sağda Giriş + Primary: Ücretsiz Başla.
	•	Footer: 4 sütun (Ürün/Şirket/Yasal/Kaynaklar) + alt barda © Rightly ve data residency EU rozeti.
	•	Karanlık mod + theme toggle.
	•	SEO (metadata), robots.txt, sitemap.xml.
	•	Analytics: PostHog (ENV ile koşullu).
	•	A11y: landmark’lar, odak halkaları, aria-label.

3) Sayfalar & İçerik

/ Home (kurumsal)
	•	Hero (sol içerik, sağ product shot)
Başlık: “GDPR uyumluluğunu kolaylaştırın”
Alt metin: “E-ticaret ve SaaS ekipleri için DSAR ve ihlal yönetimini otomatikleştirin. 30 gün SLA takibi, tek-kullanımlık export, Shopify/Woo entegrasyonları.”
Primer CTA: Ücretsiz Başla; Secondary: Güvenlik Özeti (PDF).
Alt satır: 14 gün deneme • Kredi kartı gerekmez
Sağ: Gerçek dashboard ekranı (card içinde hafif tilt, 3 küçük rozet: “EU-Hosted”, “Audit Hash-Chain”, “72s Breach SLA”).
	•	Trust Bar (grayscale logolar): Shopify, Woo, Stripe, Cloudflare, PostHog, Zendesk.
	•	Value Blocks (3 kart)
	1.	DSAR Otomasyonu (erişim/silme/ihrac uçtan uca)
	2.	E-ticaret entegrasyonları (Shopify/Woo webhooks & minimal izinler)
	3.	Güvenli Export (single-use link + checksum + audit)
	•	How it works (3 adım): Bağla → Portalı yerleştir → Otomatik kapat.
	•	Metrics: “<10dk kurulum, %99+ SLA uyumu, 5+ konektör”
	•	Testimonial (foto/isim/rol + şirket logosu).
	•	CTA bandı: “İlk DSAR’ınızı 5 dakikada kapatın” (Ücretsiz Başla / Dokümanları Gör).

/features
	•	Tab’li yapı (shadcn Tabs): DSAR, Shopify/Woo, Exports & Audit, Breach 72h.
	•	Her tab: sol metin listesi (madde madde kanıt), sağ görsel (dashboard bölümünün zoom’u).
	•	Mini güvenlik listesi: EU-Hosted, Field-Level Encryption, Hash-Chain Logs.

/pricing
	•	4 plan kartı (Free / €19 Starter / €49 Pro / €99 Agency, yıllık %20 indirim toggle).
	•	Her kartta: DSAR limiti, konektör sayısı, e-posta şablonları, SLA takibi.
	•	Altta SSS: faturalama, iptal, overage.

/security (Trust Center)
	•	Kapsam: Şifreleme (at-rest/in-transit), KMS, RBAC/ABAC, IP allowlist, data residency EU.
	•	Uyumluluk: GDPR-by-design, ROPA/DPIA üretimi, denetçi raporu.
	•	Saklama: Export 30g, log 12a.
	•	Breach: 72 saat bildirimi, otorite/subject şablonları.
	•	İndirilebilirler (PDF placeholder): “Security Overview”, “Subprocessors”, “DPA Draft”.

/compliance/dpa (DPA İste)
	•	Kısa açıklama + form (Şirket adı, alan adı, e-posta) → teşekkür durumu.
	•	DPA Word/PDF linkleri (placeholder).

/compliance/privacy ve /compliance/terms
	•	Markdown pars’lı içerik + yan navigasyon.

/docs
	•	Sol sticky nav, sağ içerik.
	•	“5 dakikada kurulum” (Shopify/Woo adımları) + API referansı + webhook endpoint’leri.
	•	Kod blokları, copy button, anchor.

/contact
	•	Form (Ad, E-posta, Şirket, Mesaj) + 24 saat içinde dönüş vaadi.

/login (placeholder) & /dashboard (placeholder)
	•	Login: magic link butonu.
	•	Dashboard: 3 KPI kartı + dummy tablo + “Konektör ekle” butonu (Sheet açılır).

4) Bileşen Seti (shadcn + özel)
	•	Navbar, Footer, SectionHeading, PrimaryButton, OutlineButton
	•	FeatureCard, MetricCard, ScreenshotFrame, TrustBar
	•	PricingCards (popüler rozetli), FAQAccordion, CTABand
	•	TestimonialCard, Badge (EU-Hosted, SOC2-Ready (Roadmap))
	•	DocLayout (sol nav), CodeBlock (copy button)
	•	ThemeToggle, CookieNotice (minimal)

5) Hareket & Mikro-etkileşim
	•	Subtle only: fade-up, hover lift, focus ring; 150–250ms ease-out.
	•	Hero’daki screenshot’a parlaklık animasyonu (motion safe).
	•	IntersectionObserver ile “checklist tik” animasyonu (low motion friendly).

6) Performans & Kalite
	•	Lighthouse: perf/a11y/SEO/PWA ≥ 90.
	•	Görseller next/image, SVG logolar inline.
	•	Üçüncü parti script sadece PostHog (ENV ile).
	•	ESLint & Prettier, type-safe; build uyarısız.

7) İçerik Bankası (TR)
	•	Hero başlık: “GDPR uyumluluğunu kolaylaştırın”
	•	Alt: “E-ticaret ve SaaS ekipleri için DSAR ve ihlal yönetimini otomatikleştirin. 30 gün SLA takibi, tek-kullanımlık güvenli export ve Shopify/Woo entegrasyonları.”
	•	CTA: Ücretsiz Başla / Güvenlik Özeti (PDF)
	•	Claim rozetleri: “EU-Hosted”, “Audit Hash-Chain”, “72s Breach SLA”

8) Teknik Kurulum
	•	Next.js App Router + TS
	•	Tailwind (container: max-w-7xl, section paddings)
	•	shadcn/ui (Button, Card, Tabs, Accordion, Dialog, Tooltip, Sheet, Badge)
	•	lucide-react ikonlar (outline, kurumsal görünüm)
	•	Dark mode (class strategy)
	•	lib/seo.ts, lib/analytics.tsx (PostHog loader)
	•	public/ içine logo ve OG görselleri (placeholder)

Çıktı: Tüm sayfa ve bileşenleri oluştur; responsive; metinleri yukarıdaki copy ile doldur; alt sayfalara gerçekçi placeholder’lar ekle; eslint --max-warnings=0 geçsin.

⸻

Bonus — 3 hızlı “wow” detayı
	1.	Hero’da canlı mini-demo (fake): “DSAR talebi oluştur” formu → 2-3 adım simüle ekran (gerçek backend olmadan).
	2.	Trust Center mini grafiği: “Son 30 günde DSAR SLA uyumu %99+” sparkline (dummy veri).
	3.	Integrations carousel: logolar yavaşça otomatik scroll (motion safe).

⸻

Çok kısa kod ipucu (Hero yapısı)

Bu referans; Cursor tüm sayfaları bunun estetiğinde üretsin:

<section className="relative bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1220] dark:to-slate-950">
  <div className="mx-auto max-w-7xl px-4 md:px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
    <div>
      <div className="inline-flex items-center gap-2 text-emerald-600 text-sm font-medium">
        <span className="h-2 w-2 rounded-full bg-emerald-500" /> GDPR by design
      </div>
      <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight text-slate-900 dark:text-white">
        GDPR uyumluluğunu kolaylaştırın
      </h1>
      <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
        E-ticaret ve SaaS ekipleri için DSAR ve ihlal yönetimini otomatikleştirin. 30 gün SLA takibi, güvenli export ve Shopify/Woo entegrasyonları.
      </p>
      <div className="mt-8 flex gap-3">
        <a className="h-11 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 text-white" href="/pricing">Ücretsiz Başla</a>
        <a className="h-11 px-6 rounded-xl border text-slate-700 dark:text-slate-200" href="/security">Güvenlik Özeti (PDF)</a>
      </div>
      <p className="mt-3 text-sm text-slate-500">14 gün deneme • Kredi kartı gerekmez</p>
    </div>
    <div>
      <div className="relative rounded-2xl border bg-white/60 dark:bg-slate-900/60 backdrop-blur p-4 shadow-lg">
        <div className="aspect-[16/10] rounded-xl bg-slate-100 dark:bg-slate-800 grid place-items-center text-slate-500">
          Ürün ekran görüntüsü (placeholder)
        </div>
        <div className="absolute -top-4 -right-4 rounded-full bg-emerald-500 text-white text-xs px-3 py-1 shadow">EU-Hosted</div>
      </div>
    </div>
  </div>
</section>


⸻

Son Kontrol Listesi (yayın öncesi)
	•	Hero’da gerçek dashboard screenshot kullandın.
	•	Pricing planlar net; Pro “en popüler” rozetli.
	•	Security/Trust Center sayfası indirilebilir PDF linkli.
	•	Docs’ta “5 dakikada kurulum (Shopify/Woo)” adım adım.
	•	Lighthouse ≥ 90, focus ring ve kontrastlar iyi.
	•	Tüm CTA’lar track ediliyor (PostHog).

⸻

efsane — “Rightly Compliance”ı lacivert–altın kurumsal görünüme taşıyalım. Sana asset checklist + renk/typografi seti + Tailwind/Next.js kod yamaları + ekran görüntüsü kılavuzu + piksel-kontrol listesi bırakıyorum. Kopyala-yapıştır ilerlersin; ekran görüntülerini gönderdiğinde son rötuşu birlikte yaparız.

⸻

0) Asset checklist (şimdi hazırla / yükle)

/public/brand/ içine:
	•	logo-dark.svg (lacivert zemin için altın logotype)
	•	logo-light.svg (beyaz zemin için lacivert logotype)
	•	symbol.svg (yalnız ikon: kalkan + “R” ya da tik)
	•	og.jpg (1200×630) — hero’dan kesit + kısa claim
	•	screens/dashboard@2x.png (1600×1000 önerilir)
	•	screens/export@2x.png (1600×1000)
	•	favicons/ (SVG + 32px + 180px apple-touch)

Ekran görüntüsü notu: Uygulama gridini kapat, zoom %100, karanlık modda bir tane, aydınlık modda bir tane al. Canvas oranı 16:10.

⸻

1) Marka seti (lacivert–altın)

Renkler
	•	brand-navy: #0B1220 (gövde/dark zemin)
	•	ink: #111827 (başlıklar)
	•	brand-blue: #1D4ED8 (aksan/CTA)
	•	brand-gold: #D4AF37 (altın — rozet/ikon)
	•	sand: #F8FAFC (açık arka plan)
	•	muted: #64748B (metin ikincil)

Tipografi
	•	Başlık: Inter Variable, font-semibold
	•	Body: Inter, leading-relaxed
	•	Harf aralığı: başlıklarda tracking-tight

⸻

2) Tailwind & CSS değişiklikleri

2.1 tailwind.config.ts (renkleri genişlet)

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0B1220",
          blue: "#1D4ED8",
          gold: "#D4AF37",
          sand: "#F8FAFC",
        },
        ink: "#111827",
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
      container: { center: true, screens: { "2xl": "1280px" } },
    },
  },
  plugins: [],
};
export default config;

2.2 app/globals.css (CSS değişkenleri & arka plan)

:root {
  --bg-gradient: radial-gradient(1200px 600px at 20% -10%, rgba(29,78,216,.15), transparent),
                 radial-gradient(1200px 600px at 120% 10%, rgba(212,175,55,.12), transparent);
}
body {
  background:
    var(--bg-gradient),
    linear-gradient(to bottom, #0B1220, #0B1220 40%, #0f172a 100%);
}
html.light body {
  background: linear-gradient(to bottom, #ffffff, #F8FAFC);
}


⸻

3) Logo (hemen kullanabileceğin minimal SVG)

/public/brand/logo-light.svg (açık zemin):

<svg width="180" height="32" viewBox="0 0 180 32" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#D4AF37"/>
      <stop offset="1" stop-color="#B88A2B"/>
    </linearGradient>
  </defs>
  <g fill="none" fill-rule="evenodd">
    <rect rx="6" width="28" height="28" x="2" y="2" fill="url(#gold)"/>
    <path d="M12 20l4-5 4 5" stroke="#0B1220" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="42" y="22" font-family="Inter, system-ui" font-weight="700" font-size="18" fill="#0B1220">
      Rightly <tspan font-weight="600" fill="#4B5563">Compliance</tspan>
    </text>
  </g>
</svg>

/public/brand/logo-dark.svg (koyu zemin): sadece metin renklerini #FFFFFF yap.

⸻

4) Navbar/Hero yamaları (kurumsal görünüm)

4.1 components/navbar.tsx

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
          <a href="/features" className="hover:text-white">Özellikler</a>
          <a href="/pricing" className="hover:text-white">Fiyatlandırma</a>
          <a href="/security" className="hover:text-white">Güvenlik</a>
          <a href="/docs" className="hover:text-white">Dokümanlar</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="/login" className="text-slate-200 hover:text-white">Giriş</a>
          <a
            href="/pricing"
            className="inline-flex h-10 items-center rounded-xl bg-brand-blue px-5 font-medium text-white hover:bg-blue-800"
          >
            Ücretsiz Başla
          </a>
        </div>
      </div>
    </header>
  );
}

4.2 app/page.tsx (Hero bölümü)

export default function Home() {
  return (
    <main>
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
              <a className="h-11 rounded-xl bg-brand-blue px-6 text-white hover:bg-blue-800" href="/pricing">
                Ücretsiz Başla
              </a>
              <a className="h-11 rounded-xl border border-white/20 px-6 text-slate-200 hover:bg-white/5" href="/security">
                Güvenlik Özeti (PDF)
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-400">14 gün deneme • Kredi kartı gerekmez</p>
            <div className="mt-8 flex items-center gap-6 opacity-80">
              <img src="/logos/shopify.svg" className="h-6" alt="Shopify" />
              <img src="/logos/woocommerce.svg" className="h-6" alt="WooCommerce" />
              <img src="/logos/stripe.svg" className="h-6" alt="Stripe" />
              <img src="/logos/cloudflare.svg" className="h-6" alt="Cloudflare" />
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-2xl border border-white/10 bg-white/5 p-3 shadow-card backdrop-blur">
              <img
                src="/screens/dashboard@2x.png"
                alt="Rightly dashboard"
                className="aspect-[16/10] w-full rounded-xl ring-1 ring-white/10"
              />
              <div className="pointer-events-none absolute -right-3 -top-3 rounded-full bg-[conic-gradient(from_210deg,#D4AF37,#B88A2B,#D4AF37)] px-3 py-1 text-xs font-semibold text-brand-navy shadow">
                EU-Hosted
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Devam: Feature cards, metrics, testimonials, CTA bandı */}
    </main>
  );
}


⸻

5) Metadata & OG (SEO)

app/layout.tsx içinde:

export const metadata = {
  title: "Rightly Compliance — GDPR Hub",
  description:
    "DSAR ve ihlal yönetimini otomatikleştirin. 30 gün SLA, güvenli export, Shopify/Woo entegrasyonları.",
  openGraph: {
    title: "Rightly Compliance",
    description:
      "GDPR uyumluluğunu kanıtlanabilir şekilde kolaylaştırın.",
    images: ["/brand/og.jpg"],
  },
  twitter: { card: "summary_large_image" },
};


⸻

6) Ekran görüntüsü kılavuzu (gerçek, “kurumsal” görünüm için)
	•	Oran: 16:10; çözünürlük 1600×1000 veya 1920×1200 (retina için 2x).
	•	UI temizliği: Sidebar açık, üst bar sabit, tablo satırları 6–10 arası, boşluklar rahat.
	•	Durum rozetleri: 2–3 farklı renk (ör. “Completed”, “Pending”, “Over SLA”).
	•	Veri gizleme: E-posta vb. üretken dummy veri; gerçek PII’yi koyma.
	•	Gölgeler: ekran görüntüsüne değil, çerçeveye (container) shadow ver.
	•	Renk uyumu: grafikleri brand-blue ve brand-gold aksanla renklendir.

⸻

7) Piksel kontrol listesi (yayın öncesi)
	•	Navbar arka planı transparan blur + alt çizgi border-white/10.
	•	Hero başlık beyaz, metin text-slate-300; CTA mavi buton yeterince kontrastlı.
	•	Altın gradient aşırı baskın değil — küçük rozetlerde.
	•	Feature kartları bg-white/70 (light) / bg-slate-900/60 (dark).
	•	Pricing “Pro” kartında “En Popüler” rozeti, CTA belirgin.
	•	Security sayfasında indirilebilir PDF butonları (placeholder).
	•	Lighthouse ≥ 90; a11y kontrast uyarısı yok.
	•	OG görseli paylaşımlarda doğru görünür.

⸻

Sonraki adım
	1.	Yukarıdaki yamaları uygula.
	2.	Ekran görüntülerini /public/screens/ altına yerleştir.
	3.	Bir hero/pricing/security ekran görüntüsü at — ben piksel piksel parlatayım (spacing, renk, tipografi).

Kral, bu set seni “büyük kurum” vibes’a çıkarır. Görselleri gönder; final cilayı atıp kilitleriz. 🔒✨