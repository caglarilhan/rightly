// components/SmartUpgradeModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Zap, 
  Users, 
  Database, 
  FileText, 
  HardDrive,
  X,
  Check,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { UpgradeTrigger, usageTracker } from "@/lib/usageTracking";

interface SmartUpgradeModalProps {
  trigger: UpgradeTrigger;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const planFeatures = {
  free: {
    apiCalls: 1000,
    exports: 5,
    teamMembers: 1,
    storage: 100,
    reports: 3
  },
  pro: {
    apiCalls: -1, // Unlimited
    exports: -1,
    teamMembers: -1,
    storage: -1,
    reports: -1
  }
};

const getFeatureIcon = (type: string) => {
  switch (type) {
    case 'api_limit':
      return <Zap className="h-5 w-5 text-blue-600" />;
    case 'export_limit':
      return <FileText className="h-5 w-5 text-green-600" />;
    case 'team_limit':
      return <Users className="h-5 w-5 text-purple-600" />;
    case 'storage_limit':
      return <HardDrive className="h-5 w-5 text-orange-600" />;
    case 'report_limit':
      return <Database className="h-5 w-5 text-indigo-600" />;
    default:
      return <Crown className="h-5 w-5 text-yellow-600" />;
  }
};

const getFeatureName = (type: string) => {
  switch (type) {
    case 'api_limit':
      return 'API Calls';
    case 'export_limit':
      return 'Data Exports';
    case 'team_limit':
      return 'Team Members';
    case 'storage_limit':
      return 'Storage';
    case 'report_limit':
      return 'Reports';
    default:
      return 'Feature';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'high':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function SmartUpgradeModal({ 
  trigger, 
  isOpen, 
  onClose, 
  onUpgrade 
}: SmartUpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState(usageTracker.getUsageMetrics());

  useEffect(() => {
    if (isOpen) {
      setMetrics(usageTracker.getUsageMetrics());
    }
  }, [isOpen]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // Simulate upgrade process
      await new Promise(resolve => setTimeout(resolve, 2000));
      onUpgrade();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUsage = () => {
    switch (trigger.type) {
      case 'api_limit':
        return metrics.current.apiCalls;
      case 'export_limit':
        return metrics.current.exports;
      case 'team_limit':
        return metrics.current.teamMembers;
      case 'storage_limit':
        return metrics.current.storage;
      case 'report_limit':
        return metrics.current.reports;
      default:
        return 0;
    }
  };

  const getLimit = () => {
    switch (trigger.type) {
      case 'api_limit':
        return metrics.limits.apiCalls;
      case 'export_limit':
        return metrics.limits.exports;
      case 'team_limit':
        return metrics.limits.teamMembers;
      case 'storage_limit':
        return metrics.limits.storage;
      case 'report_limit':
        return metrics.limits.reports;
      default:
        return 0;
    }
  };

  const getProValue = () => {
    switch (trigger.type) {
      case 'api_limit':
        return 'Unlimited API calls';
      case 'export_limit':
        return 'Unlimited exports';
      case 'team_limit':
        return 'Unlimited team members';
      case 'storage_limit':
        return 'Unlimited storage';
      case 'report_limit':
        return 'Unlimited reports';
      default:
        return 'Unlimited';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-3 mb-4">
            {getFeatureIcon(trigger.type)}
            <div>
              <CardTitle className="text-2xl">
                Upgrade to Pro
              </CardTitle>
              <CardDescription>
                Unlock unlimited {getFeatureName(trigger.type).toLowerCase()}
              </CardDescription>
            </div>
          </div>

          <Badge className={getPriorityColor(trigger.priority)}>
            {trigger.priority === 'critical' ? 'Critical' : 'Recommended'}
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Usage */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-slate-700">
                Current {getFeatureName(trigger.type)} Usage
              </span>
              <span className="text-sm text-slate-500">
                {getCurrentUsage()} / {getLimit()}
              </span>
            </div>
            <Progress value={trigger.percentage} className="h-2" />
            <p className="text-sm text-slate-600 mt-2">
              {trigger.message}
            </p>
          </div>

          {/* Pro Benefits */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Pro Plan Benefits
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-slate-700">{getProValue()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-slate-700">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-slate-700">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-slate-700">Custom integrations</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">$29</div>
                <div className="text-sm text-slate-500">per month</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Save 20% with annual billing</div>
                <div className="text-lg font-semibold text-green-600">$23/month</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Pro
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Maybe Later
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="text-center pt-4 border-t">
            <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
              <span>🔒 Secure payment</span>
              <span>•</span>
              <span>⚡ Instant activation</span>
              <span>•</span>
              <span>🔄 30-day money back</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
