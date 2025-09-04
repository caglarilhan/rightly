// components/ChangelogToast.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles, ArrowRight } from "lucide-react";

interface ChangelogToastProps {
  isOpen: boolean;
  onClose: () => void;
  onViewChangelog: () => void;
}

const recentChanges = [
  {
    type: "new",
    title: "Admin Panel v0",
    description: "Complete RBAC system with 'Sınırsız Mod' impersonation",
    date: "2024-01-15"
  },
  {
    type: "improved",
    title: "Enhanced Security",
    description: "Added comprehensive audit logging and rate limiting",
    date: "2024-01-14"
  },
  {
    type: "fixed",
    title: "Performance Boost",
    description: "Optimized database queries and frontend loading",
    date: "2024-01-13"
  }
];

export default function ChangelogToast({ isOpen, onClose, onViewChangelog }: ChangelogToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 transition-all duration-300">
      <Card className="w-80 shadow-lg border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">What's New</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Latest updates and improvements
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {recentChanges.slice(0, 2).map((change, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge 
                variant={
                  change.type === "new" ? "default" : 
                  change.type === "improved" ? "secondary" : "outline"
                }
                className="text-xs"
              >
                {change.type}
              </Badge>
              <div className="flex-1">
                <div className="font-medium text-sm">{change.title}</div>
                <div className="text-xs text-slate-600">{change.description}</div>
              </div>
            </div>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewChangelog}
            className="w-full mt-3"
          >
            View Full Changelog
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
