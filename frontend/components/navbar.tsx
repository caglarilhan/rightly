export function Navbar() {
  return (
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
  );
}
