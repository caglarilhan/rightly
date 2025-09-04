"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Shield, 
  Activity, 
  Settings, 
  Database, 
  CreditCard,
  Crown,
  FileText,
  Flag
} from "lucide-react";

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Crown,
  },
  {
    title: "Kullanıcılar",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Roller",
    href: "/admin/roles",
    icon: Shield,
  },
  {
    title: "Feature Flags",
    href: "/admin/features",
    icon: Flag,
  },
  {
    title: "Audit Log",
    href: "/admin/audit",
    icon: FileText,
  },
  {
    title: "Organizasyonlar",
    href: "/admin/organizations",
    icon: Database,
  },
  {
    title: "Faturalama",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    title: "Sistem Sağlığı",
    href: "/admin/health",
    icon: Activity,
  },
  {
    title: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Crown className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Admin Panel</h2>
            <p className="text-xs text-slate-500">Sınırsız Mod</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {adminMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-purple-600" : "text-slate-400"
                )} />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-200 bg-white">
        <div className="text-xs text-slate-500 text-center">
          <p>Admin Panel v0.1</p>
          <p className="mt-1">Sadece Super Admin</p>
        </div>
      </div>
    </div>
  );
}
