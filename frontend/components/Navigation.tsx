import { NextPage } from "next";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import HelpButton from "./HelpButton";
import {
  Menu,
  X,
  Home,
  FileText,
  Activity,
  Settings,
  HelpCircle,
  Shield,
  Download
} from "lucide-react";

const Navigation: NextPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Audit Log", href: "/audit-log", icon: Activity },
    { name: "DSAR Requests", href: "/requests", icon: FileText },
    { name: "Exports", href: "/exports", icon: Download },
    { name: "Connectors", href: "/connectors", icon: Cloud },
    { name: "Compliance Reports", href: "/compliance-reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Support", href: "/support", icon: HelpCircle },
    { name: "Privacy", href: "/privacy", icon: Shield },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">GDPR Hub Lite</span>
            </a>
          </div>

                            {/* Desktop Menu */}
                  <div className="hidden md:flex items-center gap-6">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </a>
                      );
                    })}
                    <HelpButton />
                  </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-slate-200">
            <div className="py-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
