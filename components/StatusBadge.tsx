// components/StatusBadge.tsx
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface StatusBadgeProps {
  onClick?: () => void;
  className?: string;
}

export default function StatusBadge({ onClick, className = "" }: StatusBadgeProps) {
  const [status, setStatus] = useState<"operational" | "degraded" | "down">("operational");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkStatus();
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/healthz");
      if (response.ok) {
        setStatus("operational");
      } else {
        setStatus("degraded");
      }
    } catch (error) {
      setStatus("down");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "down":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "operational":
        return "All Systems Operational";
      case "degraded":
        return "Partial Outage";
      case "down":
        return "Major Outage";
      default:
        return "Checking Status";
    }
  };

  return (
    <Badge
      variant="outline"
      className={`cursor-pointer transition-all duration-200 hover:scale-105 ${getStatusColor()} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-1.5">
        <div className="relative">
          <Activity className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
          {status === "operational" && (
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <span className="text-xs font-medium">{getStatusText()}</span>
      </div>
    </Badge>
  );
}
