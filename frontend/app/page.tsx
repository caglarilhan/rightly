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

const LandingPage: NextPage = () => {
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

      {/* Coming Soon Features */}
      <div className="container mx-auto px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">
            Yakında Gelecek Özellikler
          </h2>
          <p className="text-center text-slate-600 mb-12">
            Sürekli geliştiriyoruz. İşte önümüzdeki aylarda gelecek özellikler:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sprint 2 */}
            <Card className="p-6 border-2 border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="bg-blue-100 text-blue-800">
                  Sprint 2
                </Badge>
                <span className="text-sm text-blue-600">2-3 hafta içinde</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Pro Plan Özellikleri</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Gmail Connector - Otomatik e-posta bildirimleri
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Google Drive Connector - Otomatik Drive yükleme
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Çoklu Dil Desteği - EN/TR/DE/FR
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Gelişmiş Analitik - Gerçek zamanlı metrikler
                </li>
              </ul>
            </Card>

            {/* Sprint 3 */}
            <Card className="p-6 border-2 border-purple-200 bg-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="bg-purple-100 text-purple-800">
                  Sprint 3
                </Badge>
                <span className="text-sm text-purple-600">4-6 hafta içinde</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Enterprise Özellikleri</h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Agency Workspace - Çoklu mağaza yönetimi
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  White-Label Çözüm - Özel domain + marka
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Rol Tabanlı Erişim - Admin/Manager/Viewer
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Slack/Teams Entegrasyonu - Ekip bildirimleri
                </li>
              </ul>
            </Card>

            {/* Sprint 4 */}
            <Card className="p-6 border-2 border-green-200 bg-green-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Sprint 4
                </Badge>
                <span className="text-sm text-green-600">6-8 hafta içinde</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">AI & Otomasyon</h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  AI DSAR Sınıflandırıcı - Spam tespiti
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Uyumluluk Asistanı - AI destekli rehberlik
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Gelişmiş Otomasyon - İş akışı optimizasyonu
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Tahminsel Analitik - Trend analizi
                </li>
              </ul>
            </Card>

            {/* Sprint 5 */}
            <Card className="p-6 border-2 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="default" className="bg-orange-100 text-orange-800">
                  Sprint 5
                </Badge>
                <span className="text-sm text-orange-600">8-10 hafta içinde</span>
              </div>
              <h3 className="text-lg font-semibold mb-4">Marketplace Genişleme</h3>
              <ul className="space-y-2 text-sm text-orange-800">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Amazon Seller Central - E-ticaret entegrasyonu
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  eBay Entegrasyonu - Marketplace desteği
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Enterprise Connector'lar - SAP/ERP/CRM sistemleri
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Gelişmiş Uyumluluk - SOC2 + GDPR sertifikasyonu
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
            Fiyatlandırma
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">€0</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  1 DSAR/ay
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Temel export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  E-posta desteği
                </li>
              </ul>
              <Button className="w-full">Ücretsiz Başlayın</Button>
            </Card>

            <Card className="p-8 text-center border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">€49</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sınırsız DSAR
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Gelişmiş export
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Öncelikli destek
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Yakında: Gmail/Drive Connector
                </li>
              </ul>
              <Button className="w-full">Pro'ya Geçin</Button>
            </Card>

            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-4xl font-bold text-blue-600 mb-4">€99</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Tüm Pro özellikleri
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Telefon desteği
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Özel entegrasyonlar
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Yakında: Agency Workspace
                </li>
              </ul>
              <Button className="w-full">Enterprise İletişim</Button>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            GDPR Uyumluluğunu Basitleştirin
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Bugün başlayın, yarın büyüyün. Sürekli gelişen özelliklerimizle 
            her zaman önde kalın.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4">
              Ücretsiz Deneyin
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              Roadmap'i İnceleyin
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
