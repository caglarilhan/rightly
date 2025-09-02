import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-lg shadow-lg">
              R
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gray-900">Rightly</div>
              <div className="text-xs text-gray-500">GDPR Compliance Hub</div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Özellikler
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Fiyatlandırma
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/docs" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dokümantasyon
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/auth/login" 
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link 
              href="/auth/register" 
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
