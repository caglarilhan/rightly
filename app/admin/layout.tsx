"use client";

import { useState, useEffect } from "react";
import { AdminSidebar } from "../../components/AdminSidebar";
import { ImpersonationBanner } from "../../components/ImpersonationBanner";
import { AdminGuard } from "../../components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedUser, setImpersonatedUser] = useState<any>(null);

  useEffect(() => {
    // Check if currently impersonating
    const impersonationSession = localStorage.getItem("impersonation_session");
    if (impersonationSession) {
      const session = JSON.parse(impersonationSession);
      if (session.expires_at > Date.now()) {
        setIsImpersonating(true);
        setImpersonatedUser(session.target_user);
      } else {
        localStorage.removeItem("impersonation_session");
      }
    }
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-50">
        {/* Impersonation Banner */}
        {isImpersonating && impersonatedUser && (
          <ImpersonationBanner 
            user={impersonatedUser}
            onExit={() => {
              localStorage.removeItem("impersonation_session");
              setIsImpersonating(false);
              setImpersonatedUser(null);
              window.location.reload();
            }}
          />
        )}

        <div className="flex">
          {/* Admin Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
