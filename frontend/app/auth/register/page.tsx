'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '../../components/layout/Header'
import { Footer } from '../../components/layout/Footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    company_name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('http://127.0.0.1:9011/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          company_name: formData.company_name
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify({
          email: formData.email,
          full_name: formData.full_name,
          company_name: formData.company_name
        }))
        router.push('/dashboard')
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Kayıt başarısız')
      }
    } catch (err) {
      setError('Bağlantı hatası')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="flex flex-col justify-center py-24">
        <div className="mx-auto max-w-md w-full px-4">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-2xl shadow-lg">
                R
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Ücretsiz Hesap Oluşturun
            </h1>
            <p className="text-gray-600">
              GDPR uyumluluğu yolculuğunuza başlayın
            </p>
          </div>

          <Card className="p-8">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl text-center">Hesap Oluşturun</CardTitle>
              <CardDescription className="text-center">
                Zaten hesabınız var mı?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Giriş yapın
                </Link>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Şirket Adı
                  </label>
                  <input
                    id="company_name"
                    name="company_name"
                    type="text"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ABC Şirketi"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta adresi
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Şifre Tekrar
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                >
                  {isLoading ? 'Kayıt yapılıyor...' : 'Ücretsiz Hesap Oluşturun'}
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Kayıt olarak{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-700">
                      Kullanım Şartları
                    </Link>
                    {' '}ve{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
                      Gizlilik Politikası
                    </Link>
                    'nı kabul etmiş olursunuz.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}


