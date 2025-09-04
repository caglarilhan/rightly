"use client";

import { usePathname } from "next/navigation";
import { track } from "../lib/analytics";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/features", label: "Özellikler" },
    { href: "/pricing", label: "Fiyatlandırma" },
    { href: "/docs", label: "Dokümanlar" },
    { href: "/privacy", label: "Gizlilik" },
    { href: "/security", label: "Güvenlik" },
    { href: "/support", label: "Destek" },
  ];

  const handleNavClick = (href: string, label: string) => {
    track("nav_link_clicked", { page: href, label });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4">
        <a href="/" className="flex items-center gap-2">
          <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200" role="navigation" aria-label="Primary">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                pathname === item.href
                  ? "text-white font-medium"
                  : "text-slate-200 hover:text-white"
              }`}
              onClick={() => handleNavClick(item.href, item.label)}
            >
              {item.label}
            </a>
          ))}
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
