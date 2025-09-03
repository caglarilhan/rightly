"use client";

import { useState } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
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

    try {
      setLoading(true);

      // ⬇️ KENDİ BACKEND'İN: burada kendi endpoint'ini çağır.
      // Örn: POST https://api.rightly.com/auth/magic-link
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Gönderim başarısız");
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
              <div className="h-10 w-10 grid place-items-center rounded-xl bg-blue-600/10 text-blue-700 dark:text-blue-300">
                <Lock className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Giriş Yapın
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  DSAR yönetim platformuna erişin
                </p>
              </div>
            </div>

            {!done ? (
              <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-950/40 px-3 h-11 text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-blue-600/30"
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
                  className="w-full h-11 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium disabled:opacity-50"
                >
                  {loading ? "Gönderiliyor..." : "Magic Link Gönder"}
                </button>

                <p className="text-xs text-slate-500">
                  Hesabınız yok mu?{" "}
                  <a href="/pricing" className="underline underline-offset-4">
                    Ücretsiz başlayın
                  </a>
                </p>
              </form>
            ) : (
              <div className="mt-6 space-y-2">
                <p className="text-slate-900 dark:text-white font-medium">
                  Bağlantı gönderildi ✔
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Gelen kutunuzu kontrol edin. Bu cihazdan açmanız önerilir.
                </p>
                <p className="text-xs text-slate-500">
                  Gelmediyse spam klasörünü kontrol edin veya 60 sn sonra tekrar deneyin.
                </p>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            SSL şifreli bağlantı • EU-Hosted • Audit Hash-Chain
          </p>
        </div>

        {/* Sağ: büyük emoji/ikon YOK — yerine gerçek ekran görüntüsü */}
        <div className="hidden lg:block">
          <div className="relative rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur p-4 shadow-xl">
            <div className="aspect-[16/10] w-full rounded-xl ring-1 ring-black/5 dark:ring-white/10 bg-slate-800 grid place-items-center text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-semibold mb-2">Rightly Dashboard</div>
                <div className="text-sm">DSAR Yönetimi • Shopify Entegrasyonu</div>
              </div>
            </div>
            <div className="pointer-events-none absolute -top-3 -right-3 rounded-full bg-[conic-gradient(from_210deg,#D4AF37,#B88A2B,#D4AF37)] px-3 py-1 text-xs font-semibold text-slate-900 shadow">
              EU-Hosted
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
