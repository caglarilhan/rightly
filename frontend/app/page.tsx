'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NextPage } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  Brain, 
  TrendingUp,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            GDPR DSAR'ları 5 Dakikada Kapatın
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Shopify ve WooCommerce mağazaları için otomatik GDPR DSAR yönetimi. 
            Müşteri verilerini güvenle işleyin, 30 gün SLA'nızı garanti edin.
          </p>
          <div className="flex gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-4">
              Ücretsiz Başlayın
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Demo İzleyin
            </Button>
          </div>
        </div>
      </div>

      {/* Launch Control OS Demo */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            🚀 Launch Control OS Demo
          </h2>
          <p className="text-center text-slate-600 mb-8">
            Real-time launch day war room dashboard
          </p>
          
          <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
            <div className="text-center mb-6">
              <Zap className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Launch Control OS</h3>
              <p className="text-gray-600">Real-time simulation dashboard</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Real-time KPIs</h4>
                <p className="text-sm text-gray-600">Live metrics & conversion tracking</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">AI Advisor</h4>
                <p className="text-sm text-gray-600">Smart insights & recommendations</p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">API Integrations</h4>
                <p className="text-sm text-gray-600">Connect all your data sources</p>
              </Card>
            </div>
            
            <div className="text-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push('/launch-dashboard')}
              >
                <Zap className="w-5 h-5 mr-2" />
                View Launch Dashboard Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Current Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Şu Anda Mevcut Özellikler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">DSAR Portal</h3>
              <p className="text-slate-600 mb-4">
                Müşterileriniz kendi verilerini kolayca talep edebilir. 
                Otomatik doğrulama ve işleme.
              </p>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Aktif
              </Badge>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Otomatik İşleme</h3>
              <p className="text-slate-600 mb-4">
                DSAR talepleri otomatik olarak işlenir. 
                PDF, JSON ve CSV formatlarında export.
              </p>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Aktif
              </Badge>
            </Card>

            <Card className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Audit Log</h3>
              <p className="text-slate-600 mb-4">
                Tüm işlemler kayıt altında. 
                GDPR uyumluluğu için tam izlenebilirlik.
              </p>
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                Aktif
              </Badge>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
