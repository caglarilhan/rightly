"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Target,
  Globe,
  Activity,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell,
  Lock,
  Brain,
  Link as LinkIcon,
  Play,
  Pause,
  Zap
} from "lucide-react";
import APIIntegrations from "./api-integrations";
import AILaunchAdvisor from "./ai-advisor";

interface Metric {
  name: string;
  target: string;
  current: string;
  status: "success" | "warning" | "error" | "pending";
  trend?: "up" | "down" | "stable";
  locked?: boolean;
}

interface SystemHealth {
  name: string;
  status: "online" | "warning" | "offline";
  responseTime: string;
  uptime: string;
}

interface PlatformStatus {
  name: string;
  status: "live" | "pending" | "offline";
  engagement: string;
  conversion: string;
}

export default function LaunchDayDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [showPricing, setShowPricing] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "integrations" | "ai-advisor">("dashboard");
  const [simulationData, setSimulationData] = useState({
    freeSignups: 0,
    proConversions: 0,
    mrrGenerated: 0,
    websiteVisitors: 0,
    productHuntUpvotes: 0,
    linkedInViews: 0,
    socialImpressions: 0,
    emailOpenRate: 0,
    conversionRate: 0,
    appStoreRating: 0
  });

  // Tick clock
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Simulate live metrics
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isLive) return;
      setSimulationData(prev => {
        const now = new Date();
        const minutes = Math.max(0, (now.getHours() - 9) * 60 + now.getMinutes());
        const visitors = Math.floor(minutes * 3 + Math.random() * 25);
        const signups = Math.floor(visitors * 0.06 + Math.random() * 4);
        const pro = Math.floor(signups * 0.18 + Math.random() * 2);
        const mrr = pro * 49;
        const ph = Math.floor(minutes * 0.7 + Math.random() * 6);
        const li = Math.floor(minutes * 4 + Math.random() * 20);
        const impressions = Math.floor(minutes * 10 + Math.random() * 40);
        const open = Math.min(35, 24 + Math.random() * 12);
        return {
          freeSignups: Math.max(prev.freeSignups, signups),
          proConversions: Math.max(prev.proConversions, pro),
          mrrGenerated: Math.max(prev.mrrGenerated, mrr),
          websiteVisitors: Math.max(prev.websiteVisitors, visitors),
          productHuntUpvotes: Math.max(prev.productHuntUpvotes, ph),
          linkedInViews: Math.max(prev.linkedInViews, li),
          socialImpressions: Math.max(prev.socialImpressions, impressions),
          emailOpenRate: Math.max(prev.emailOpenRate, open),
          conversionRate: signups > 0 ? Math.round((pro / signups) * 100) : 0,
          appStoreRating: signups > 10 ? 4.5 + Math.random() * 0.4 : 0
        };
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [isLive]);

  const getStatusColor = (status: Metric["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend?: Metric["trend"]) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const primaryKPIs: Metric[] = [
    {
      name: "Free Signups",
      target: "100+",
      current: simulationData.freeSignups.toString(),
      status:
        simulationData.freeSignups >= 100
          ? "success"
          : simulationData.freeSignups >= 50
          ? "warning"
          : "pending",
      trend: simulationData.freeSignups > 0 ? "up" : "stable"
    },
    {
      name: "Pro Conversions",
      target: "15+",
      current: simulationData.proConversions.toString(),
      status:
        simulationData.proConversions >= 15
          ? "success"
          : simulationData.proConversions >= 8
          ? "warning"
          : "pending",
      trend: simulationData.proConversions > 0 ? "up" : "stable",
      locked: currentPlan === "free"
    },
    {
      name: "MRR Generated",
      target: "€750+",
      current: `€${simulationData.mrrGenerated}`,
      status:
        simulationData.mrrGenerated >= 750
          ? "success"
          : simulationData.mrrGenerated >= 400
          ? "warning"
          : "pending",
      trend: simulationData.mrrGenerated > 0 ? "up" : "stable",
      locked: currentPlan === "free"
    },
    {
      name: "Conversion Rate",
      target: "15%",
      current: `${simulationData.conversionRate}%`,
      status:
        simulationData.conversionRate >= 15
          ? "success"
          : simulationData.conversionRate >= 10
          ? "warning"
          : "pending",
      trend: simulationData.conversionRate > 0 ? "up" : "stable"
    },
    {
      name: "App Store Rating",
      target: "4.5★+",
      current: simulationData.appStoreRating > 0 ? `${simulationData.appStoreRating.toFixed(1)}★` : "-",
      status:
        simulationData.appStoreRating >= 4.5
          ? "success"
          : simulationData.appStoreRating >= 4.0
          ? "warning"
          : "pending",
      trend: simulationData.appStoreRating > 0 ? "up" : "stable",
      locked: currentPlan === "free"
    }
  ];

  const trafficMetrics: Metric[] = [
    {
      name: "Website Visitors",
      target: "500+",
      current: simulationData.websiteVisitors.toString(),
      status:
        simulationData.websiteVisitors >= 500
          ? "success"
          : simulationData.websiteVisitors >= 250
          ? "warning"
          : "pending"
    },
    {
      name: "Product Hunt Upvotes",
      target: "50+",
      current: simulationData.productHuntUpvotes.toString(),
      status:
        simulationData.productHuntUpvotes >= 50
          ? "success"
          : simulationData.productHuntUpvotes >= 25
          ? "warning"
          : "pending",
      locked: currentPlan === "free"
    },
    {
      name: "LinkedIn Views",
      target: "200+",
      current: simulationData.linkedInViews.toString(),
      status:
        simulationData.linkedInViews >= 200
          ? "success"
          : simulationData.linkedInViews >= 100
          ? "warning"
          : "pending",
      locked: currentPlan === "free"
    },
    {
      name: "Social Media Impressions",
      target: "1000+",
      current: simulationData.socialImpressions.toString(),
      status:
        simulationData.socialImpressions >= 1000
          ? "success"
          : simulationData.socialImpressions >= 500
          ? "warning"
          : "pending",
      locked: currentPlan === "free"
    },
    {
      name: "Email Open Rate",
      target: "20%+",
      current: `${Math.round(simulationData.emailOpenRate)}%`,
      status:
        simulationData.emailOpenRate >= 20
          ? "success"
          : simulationData.emailOpenRate >= 15
          ? "warning"
          : "pending",
      locked: currentPlan === "free"
    }
  ];

  const systemHealth: SystemHealth[] = [
    { name: "Frontend", status: "online", responseTime: "120ms", uptime: "99.9%" },
    { name: "Backend API", status: "online", responseTime: "45ms", uptime: "99.8%" },
    { name: "Database", status: "online", responseTime: "12ms", uptime: "99.9%" },
    { name: "Redis Cache", status: "online", responseTime: "3ms", uptime: "99.9%" },
    { name: "Celery Workers", status: "online", responseTime: "250ms", uptime: "99.7%" },
    { name: "S3 Storage", status: "online", responseTime: "180ms", uptime: "99.9%" }
  ];

  const platformStatus: PlatformStatus[] = [
    { name: "Shopify", status: "live", engagement: "Active", conversion: "2.3%" },
    { name: "Product Hunt", status: "live", engagement: "Trending", conversion: "15.7%" },
    { name: "LinkedIn", status: "live", engagement: "Viral", conversion: "8.2%" },
    { name: "Twitter/X", status: "live", engagement: "Growing", conversion: "12.1%" },
    { name: "Email Campaign", status: "live", engagement: "High", conversion: "24.5%" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Launch Control OS</h1>
            <Badge className="bg-green-100 text-green-800">{isLive ? "LIVE" : "PAUSED"}</Badge>
            <span className="text-sm text-gray-500 hidden sm:inline">{currentTime.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${currentPlan === "free" ? "bg-gray-100 text-gray-800" : currentPlan === "pro" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}>
              {currentPlan === "free" ? "Starter" : currentPlan === "pro" ? "Pro" : "Enterprise"}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setShowPricing(true)}>Upgrade</Button>
            <Button variant={isLive ? "secondary" : "primary"} size="sm" onClick={() => setIsLive(!isLive)}>
              {isLive ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
              {isLive ? "Pause" : "Live"}
            </Button>
          </div>
        </div>
      </div>

      {/* Pricing modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Choose Your Plan</h2>
              <Button variant="ghost" onClick={() => setShowPricing(false)}>✕</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Starter","Pro","Enterprise"].map((tier) => (
                <Card key={tier} className="p-4">
                  <div className="text-lg font-semibold mb-2">{tier}</div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li>• Real-time dashboard</li>
                    <li>• Basic analytics</li>
                    {tier !== "Starter" && <li>• Integrations</li>}
                    {tier === "Enterprise" && <li>• AI Advisor + SLA</li>}
                  </ul>
                  <Button
                    className="w-full"
                    variant={tier === "Pro" ? "primary" : "outline"}
                    onClick={() => {
                      setCurrentPlan(tier === "Starter" ? "free" : tier === "Pro" ? "pro" : "enterprise");
                      setShowPricing(false);
                    }}
                  >
                    {tier === "Starter" ? "Keep Free" : `Choose ${tier}`}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant={activeTab === "dashboard" ? "primary" : "ghost"} size="sm" onClick={() => setActiveTab("dashboard")}>
            <BarChart3 className="w-4 h-4 mr-1" /> Dashboard
          </Button>
          <Button
            variant={activeTab === "integrations" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("integrations")}
            className="flex items-center"
            disabled={currentPlan === "free"}
          >
            <LinkIcon className="w-4 h-4 mr-1" /> Integrations
            {currentPlan === "free" && <Lock className="w-3 h-3 ml-1" />}
          </Button>
          <Button
            variant={activeTab === "ai-advisor" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ai-advisor")}
            className="flex items-center"
            disabled={currentPlan === "free"}
          >
            <Brain className="w-4 h-4 mr-1" /> AI Advisor
            {currentPlan === "free" && <Lock className="w-3 h-3 ml-1" />}
          </Button>
        </div>

        {/* Tab content */}
        {activeTab === "dashboard" && (
          <>
            {/* KPIs */}
            <Card className="p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Primary KPIs</h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className={`w-4 h-4 ${isLive ? "animate-spin" : ""}`} /> Live updates
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {primaryKPIs.map((m) => (
                  <div key={m.name} className={`p-4 rounded-lg border ${m.locked ? "bg-gray-50" : "bg-white"} border-gray-200`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm text-gray-600 font-medium">{m.name}</h3>
                      {m.locked && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">{m.current}</span>
                      {getTrendIcon(m.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(m.status)}`}>{m.status}</Badge>
                      <span className="text-xs text-gray-500">Target: {m.target}</span>
                    </div>
                    {m.locked && (
                      <Button variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => setShowPricing(true)}>
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Conversion Funnel */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Conversion Funnel</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{simulationData.websiteVisitors}</p>
                  <p className="text-sm text-blue-700">Website Visitors</p>
                  <p className="text-xs text-blue-600">Target: 500+</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{simulationData.freeSignups}</p>
                  <p className="text-sm text-green-700">Free Signups</p>
                  <p className="text-xs text-green-600">Target: 100+ (5%)</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-700">{simulationData.proConversions}</p>
                  <p className="text-sm text-purple-700">Pro Conversions</p>
                  <p className="text-xs text-purple-600">Target: 15+ (15%)</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-700">€{simulationData.mrrGenerated}</p>
                  <p className="text-sm text-orange-700">MRR Generated</p>
                  <p className="text-xs text-orange-600">Target: €750+</p>
                </div>
              </div>
            </Card>

            {/* Traffic & Engagement */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold">Traffic & Engagement</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {trafficMetrics.map((m) => (
                  <div key={m.name} className={`p-4 rounded-lg border ${m.locked ? "bg-gray-50" : "bg-white"} border-gray-200`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">{m.name}</h3>
                      {m.locked && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="text-xl font-semibold mb-2">{m.current}</div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(m.status)}`}>{m.status}</Badge>
                      <span className="text-xs text-gray-500">Target: {m.target}</span>
                    </div>
                    {m.locked && (
                      <Button variant="ghost" size="sm" className="mt-2 w-full text-xs" onClick={() => setShowPricing(true)}>
                        Upgrade to Pro
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-red-600" />
                <h2 className="text-lg font-semibold">System Health</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {systemHealth.map((s) => (
                  <div key={s.name} className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">{s.name}</h3>
                    <Badge className={`text-xs mb-2 ${s.status === "online" ? "bg-green-100 text-green-800" : s.status === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{s.status}</Badge>
                    <p className="text-xs text-gray-500">{s.responseTime}</p>
                    <p className="text-xs text-gray-500">{s.uptime}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Platform Status */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Platform Status</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {platformStatus.map((p) => (
                  <div key={p.name} className="p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium">{p.name}</h3>
                      <Badge className={`text-xs ${p.status === "live" ? "bg-green-100 text-green-800" : p.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>{p.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">Engagement: {p.engagement}</p>
                    <p className="text-xs text-gray-600">Conversion: {p.conversion}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Launch Sequence */}
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold">Launch Sequence Tracker</h2>
              </div>
              <div className="space-y-3">
                {[
                  { task: "Pre-launch Email Sequence", status: "completed", time: "08:30" },
                  { task: "Product Hunt Submission", status: "completed", time: "09:00" },
                  { task: "Social Media Blast", status: "completed", time: "09:15" },
                  { task: "LinkedIn Post", status: "completed", time: "09:30" },
                  { task: "Email Newsletter", status: "in-progress", time: "10:00" },
                  { task: "Influencer Outreach", status: "upcoming", time: "11:00" },
                  { task: "Press Release", status: "upcoming", time: "14:00" },
                  { task: "Evening Recap", status: "upcoming", time: "18:00" }
                ].map((i, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${i.status === "completed" ? "bg-green-500" : i.status === "in-progress" ? "bg-yellow-500" : "bg-gray-300"}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{i.task}</p>
                      <p className="text-xs text-gray-500">{i.time}</p>
                    </div>
                    <Badge className={`text-xs ${i.status === "completed" ? "bg-green-100 text-green-800" : i.status === "in-progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}>{i.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Alerts */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold">Real-Time Alerts</h2>
              </div>
              <div className="space-y-3">
                {[
                  { type: "success", message: "Product Hunt trending in Top 10!", time: "09:45" },
                  { type: "warning", message: "Email open rate dropped to 18%", time: "10:15" },
                  { type: "success", message: "First Pro conversion achieved!", time: "10:30" },
                  { type: "critical", message: "Database response time > 500ms", time: "10:45" }
                ].map((a, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg ${a.type === "success" ? "bg-green-50 border border-green-200" : a.type === "warning" ? "bg-yellow-50 border border-yellow-200" : "bg-red-50 border border-red-200"}`}>
                    <div className={`w-2 h-2 rounded-full ${a.type === "success" ? "bg-green-500" : a.type === "warning" ? "bg-yellow-500" : "bg-red-500"}`} />
                    <p className="text-sm flex-1">{a.message}</p>
                    <span className="text-xs text-gray-500">{a.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === "integrations" && (
          currentPlan === "free" ? (
            <Card className="p-12 text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">API Integrations Locked</h3>
              <p className="text-gray-600 mb-6">Upgrade to Pro to unlock API integrations and connect your data sources.</p>
              <Button onClick={() => setShowPricing(true)}>Upgrade to Pro</Button>
            </Card>
          ) : (
            <APIIntegrations />
          )
        )}

        {activeTab === "ai-advisor" && (
          currentPlan === "free" ? (
            <Card className="p-12 text-center">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Launch Advisor Locked</h3>
              <p className="text-gray-600 mb-6">Upgrade to Pro to unlock AI-powered insights and recommendations.</p>
              <Button onClick={() => setShowPricing(true)}>Upgrade to Pro</Button>
            </Card>
          ) : (
            <AILaunchAdvisor />
          )
        )}
      </div>
    </div>
  );
}
