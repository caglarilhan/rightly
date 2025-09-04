"use client";

import { X, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ImpersonationBannerProps {
  user: {
    id: string;
    email: string;
    name?: string;
    organization?: string;
  };
  onExit: () => void;
}

export function ImpersonationBanner({ user, onExit }: ImpersonationBannerProps) {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-3 w-3" />
            </div>
            <span className="font-semibold">👑 Sınırsız Mod</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span>Şu anda:</span>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              {user.name || user.email}
            </Badge>
            {user.organization && (
              <>
                <span>@</span>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  {user.organization}
                </Badge>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span>30 dk kaldı</span>
          </div>
          
          <button
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
          >
            <X className="h-4 w-4" />
            Çıkış
          </button>
        </div>
      </div>
    </div>
  );
}
