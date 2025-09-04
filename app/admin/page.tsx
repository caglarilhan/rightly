import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Activity, Settings, Database, CreditCard } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-2">
          Sistem yönetimi ve kullanıcı kontrolü
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +12% geçen aydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Organizasyon</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5% geçen aydan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sistem Sağlığı</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Son 24 saat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Hızlı İşlemler
            </CardTitle>
            <CardDescription>
              Sık kullanılan admin işlemleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="font-medium">Kullanıcı Ekle</div>
                <div className="text-sm text-slate-600">Yeni kullanıcı davet et</div>
              </div>
              <Badge variant="secondary">Hızlı</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="font-medium">Feature Flag</div>
                <div className="text-sm text-slate-600">Yeni özellik aç/kapa</div>
              </div>
              <Badge variant="secondary">Hızlı</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
              <div>
                <div className="font-medium">Audit Log</div>
                <div className="text-sm text-slate-600">Sistem aktivitelerini incele</div>
              </div>
              <Badge variant="outline">Detaylı</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Sistem Durumu
            </CardTitle>
            <CardDescription>
              Canlı sistem metrikleri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Frontend Latency</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                45ms
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backend Latency</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                23ms
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Error Rate</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                0.1%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Queue Depth</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                0
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>
            Son 24 saatteki admin işlemleri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Yeni kullanıcı eklendi</div>
                <div className="text-sm text-slate-600">john@example.com - 2 saat önce</div>
              </div>
              <Badge variant="outline">Kullanıcı</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Feature flag açıldı</div>
                <div className="text-sm text-slate-600">advanced_analytics - 4 saat önce</div>
              </div>
              <Badge variant="outline">Feature</Badge>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <div className="font-medium">Rol değişikliği</div>
                <div className="text-sm text-slate-600">admin → user - 6 saat önce</div>
              </div>
              <Badge variant="outline">Rol</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
