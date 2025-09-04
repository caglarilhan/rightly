// components/UpgradeNudge.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Crown, TrendingUp } from "lucide-react";

interface UpgradeNudgeProps {
  usagePercentage: number;
  currentPlan: string;
  onUpgrade: () => void;
  onDismiss: () => void;
}

export default function UpgradeNudge({ 
  usagePercentage, 
  currentPlan, 
  onUpgrade, 
  onDismiss 
}: UpgradeNudgeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show nudge when usage is above 80%
    if (usagePercentage >= 80) {
      setIsVisible(true);
    }
  }, [usagePercentage]);

  if (!isVisible) return null;

  const getMessage = () => {
    if (usagePercentage >= 95) {
      return "You're almost at your limit!";
    } else if (usagePercentage >= 85) {
      return "You're approaching your limit";
    } else {
      return "You're getting close to your limit";
    }
  };

  const getUrgency = () => {
    if (usagePercentage >= 95) return "high";
    if (usagePercentage >= 85) return "medium";
    return "low";
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 animate-in slide-in-from-top-2">
      <Card className="w-full max-w-md shadow-lg border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900">Upgrade to Pro</h3>
                  <Badge variant="secondary" className="text-xs">
                    {usagePercentage}% used
                  </Badge>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                  {getMessage()} Upgrade to unlock unlimited requests and advanced features.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={onUpgrade}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Upgrade Now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsVisible(false);
                      onDismiss();
                    }}
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                onDismiss();
              }}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
