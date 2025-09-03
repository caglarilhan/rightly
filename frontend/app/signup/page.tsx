"use client";

import { useState } from "react";
import Image from "next/image";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // basit validasyon
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Geçerli bir e-posta adresi girin.");
      return;
    }

    if (!company.trim()) {
      setError("Şirket adını girin.");
      return;
    }

    try {
      setLoading(true);

      // ⬇️ KENDİ BACKEND'İN: burada kendi endpoint'ini çağır.
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company }),
      });

      if (!res.ok) throw new Error("Kayıt başarısız");
      setDone(true);
    } catch (e: any) {
      setError(e.message ?? "Bir şeyler ters gitti.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-gradient-to-b from-slate-50 to-white dark:from-[#0B1220] dark:to-slate-950">
      <header className="flex h-16 items-center border-b border-black/5 dark:border-white/10 backdrop-blur">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 flex items-center gap-3">
          <Image
            src="/brand/logo-light.svg"
            alt="Rightly Compliance"
            width={140}
            height={28}
            className="hidden dark:block"
          />
          <Image
            src="/brand/logo-dark.svg"
            alt="Rightly Compliance"
            width={140}
            height={28}
            className="block dark:hidden"
          />
        </div>
      </header>

      <section className="container mx-auto max-w-7xl px-4 md:px-6 py-16 grid lg:grid-cols-2 gap-12 items-center">
        {/* Sol: Form kartı */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-8 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-emerald-600/10 text-emerald-700 dark:text-emerald-300">
                <UserPlus className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Ücretsiz Başlayın
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  14 gün deneme • Kredi kartı gerekmez
                </p>
              </div>
            </div>

            {!done ? (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Şirket Adı
                  </label>
                  <input
                    id="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Acme Corp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/40 px-3 h-11 text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-600/30"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    E-posta Adresi
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="ornek@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/40 px-3 h-11 text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-emerald-600/30"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Hesap oluşturuluyor..." : "Ücretsiz Başla"}
                </button>

                <p className="text-xs text-slate-500">
                  Zaten hesabınız var mı?{" "}
                  <a href="/login" className="underline underline-offset-4">
                    Giriş yapın
                  </a>
                </p>
              </form>
            ) : (
              <div className="mt-6 space-y-2">
                <p className="text-slate-900 dark:text-white font-medium">
                  Hesabınız oluşturuldu ✔
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Gelen kutunuzu kontrol edin. Hesabınızı doğrulamak için e-posta gönderdik.
                </p>
                <p className="text-xs text-slate-500">
                  Gelmediyse spam klasörünü kontrol edin.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            SSL şifreli bağlantı • EU-Hosted • GDPR Compliant
          </p>
        </div>

        {/* Sağ: Özellikler */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Neler Dahil?
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Sınırsız DSAR talebi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Shopify & WooCommerce entegrasyonu</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">30 gün SLA takibi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Güvenli export sistemi</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">Audit log & compliance raporları</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Güvenlik & Uyumluluk
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">EU-Hosted (GDPR compliant)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">SOC 2 Type II certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
