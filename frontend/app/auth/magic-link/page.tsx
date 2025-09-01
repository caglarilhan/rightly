'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function MagicLinkPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyMagicLink = async () => {
      const token = searchParams.get('token')
      const redirect = searchParams.get('redirect')

      if (!token) {
        setError('Geçersiz magic link')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/v1/auth/magic-link/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          // Token'ı localStorage'a kaydet
          localStorage.setItem('token', data.access_token)
          localStorage.setItem('user', JSON.stringify(data.user))
          
          setIsSuccess(true)
          
          // Yönlendirme
          setTimeout(() => {
            router.push(redirect || '/dashboard')
          }, 2000)
        } else {
          setError(data.detail || 'Magic link doğrulanamadı')
        }
      } catch (err) {
        setError('Bir hata oluştu')
      } finally {
        setIsLoading(false)
      }
    }

    verifyMagicLink()
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">GDPR Hub Lite</h1>
            <div className="mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Magic link doğrulanıyor...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">GDPR Hub Lite</h1>
            <div className="mt-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Giriş başarılı!</h2>
              <p className="mt-2 text-gray-600">Dashboard'a yönlendiriliyorsunuz...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">GDPR Hub Lite</h1>
          <div className="mt-6">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">Doğrulama başarısız</h2>
            <p className="mt-2 text-gray-600">{error}</p>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/auth/login"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    </div>
  )
}


