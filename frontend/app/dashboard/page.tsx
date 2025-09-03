'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    totalRequests: 24,
    completedRequests: 156,
    averageSLA: '2.3g',
    pendingRequests: 8
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-navy/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              <img src="/brand/logo-light.svg" alt="Rightly Compliance" className="h-7" />
            </a>
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-200">
              <a href="/dashboard" className="text-white font-medium">Dashboard</a>
              <a href="/requests" className="hover:text-white transition-colors">DSAR Talepleri</a>
              <a href="/integrations" className="hover:text-white transition-colors">Entegrasyonlar</a>
              <a href="/exports" className="hover:text-white transition-colors">Exportlar</a>
              <a href="/audit" className="hover:text-white transition-colors">Audit Log</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-slate-200 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-semibold text-sm">
              R
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white mb-2">Hoş geldiniz</h1>
          <p className="text-slate-300">DSAR taleplerinizi yönetin ve GDPR uyumluluğunuzu takip edin.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Toplam DSAR</p>
                <p className="text-3xl font-bold text-white">{stats.totalRequests}</p>
              </div>
              <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Tamamlanan</p>
                <p className="text-3xl font-bold text-emerald-400">{stats.completedRequests}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Ortalama SLA</p>
                <p className="text-3xl font-bold text-brand-gold">{stats.averageSLA}</p>
              </div>
              <div className="w-12 h-12 bg-brand-gold/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Bekleyen</p>
                <p className="text-3xl font-bold text-amber-400">{stats.pendingRequests}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requests */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Son DSAR Talepleri</h2>
              <a href="/requests" className="text-brand-blue hover:text-blue-400 text-sm transition-colors">
                Tümünü Gör
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">#DSAR-2024-001</p>
                    <p className="text-slate-400 text-sm">Ahmet Yılmaz</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium border border-emerald-400/30">
                  Tamamlandı
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-brand-blue rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">#DSAR-2024-002</p>
                    <p className="text-slate-400 text-sm">Ayşe Demir</p>
                  </div>
                </div>
                <span className="text-xs bg-brand-blue/20 text-brand-blue px-3 py-1 rounded-full font-medium border border-brand-blue/30">
                  İşleniyor
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">#DSAR-2024-003</p>
                    <p className="text-slate-400 text-sm">Mehmet Kaya</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full font-medium border border-amber-400/30">
                  Beklemede
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Entegrasyonlar</h2>
              <a href="/integrations" className="text-brand-blue hover:text-blue-400 text-sm transition-colors">
                Yönet
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Shopify</p>
                    <p className="text-slate-400 text-sm">mystore.myshopify.com</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full font-medium border border-emerald-400/30">
                  Aktif
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">WooCommerce</p>
                    <p className="text-slate-400 text-sm">example.com</p>
                  </div>
                </div>
                <span className="text-xs bg-slate-500/20 text-slate-400 px-3 py-1 rounded-full font-medium border border-slate-400/30">
                  Bağlanmadı
                </span>
              </div>
            </div>
            <button className="w-full mt-4 h-10 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-colors font-medium">
              + Yeni Entegrasyon Ekle
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Hızlı İşlemler</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-brand-blue/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Yeni DSAR</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Entegrasyon</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Export</span>
            </button>
            <button className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span className="text-white font-medium text-sm">Rapor</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
