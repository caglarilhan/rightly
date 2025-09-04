import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  Globe,
  Mail,
  MessageSquare,
  Activity,
  Shield,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";

interface Metric {
  name: string;
  target: string;
  current: string;
  status: "success" | "warning" | "error" | "pending";
  trend?: "up" | "down" | "stable";
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

const LaunchDayDashboard: NextPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(true);
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

  // Real-time simulation data
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      if (isLive) {
        // Simulate realistic launch day data
        setSimulationData(prev => {
          const timeElapsed = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 9, 0, 0).getTime()) / 1000 / 60); // minutes since 9 AM
          
          // Realistic growth simulation
          const visitorGrowth = Math.floor(timeElapsed * 2 + Math.random() * 10);
          const signupGrowth = Math.floor(visitorGrowth * 0.05 + Math.random() * 3);
          const conversionGrowth = Math.floor(signupGrowth * 0.15 + Math.random() * 2);
          const mrrGrowth = conversionGrowth * 49;
          
          const phUpvotes = Math.floor(timeElapsed * 0.5 + Math.random() * 5);
          const linkedInViews = Math.floor(timeElapsed * 3 + Math.random() * 15);
          const socialImpressions = Math.floor(timeElapsed * 8 + Math.random() * 25);
          const emailOpenRate = Math.min(25 + Math.random() * 10, 35);
          
          return {
            freeSignups: Math.max(prev.freeSignups, signupGrowth),
            proConversions: Math.max(prev.proConversions, conversionGrowth),
            mrrGenerated: Math.max(prev.mrrGenerated, mrrGrowth),
            websiteVisitors: Math.max(prev.websiteVisitors, visitorGrowth),
            productHuntUpvotes: Math.max(prev.productHuntUpvotes, phUpvotes),
            linkedInViews: Math.max(prev.linkedInViews, linkedInViews),
            socialImpressions: Math.max(prev.socialImpressions, socialImpressions),
            emailOpenRate: Math.max(prev.emailOpenRate, emailOpenRate),
            conversionRate: signupGrowth > 0 ? Math.round((conversionGrowth / signupGrowth) * 100) : 0,
            appStoreRating: signupGrowth > 10 ? 4.5 + Math.random() * 0.5 : 0
          };
        });
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(timer);
  }, [currentTime, isLive]);

  // Mock data with real-time simulation
  const primaryKPIs: Metric[] = [
    {
      name: "Free Signups",
      target: "100+",
      current: simulationData.freeSignups.toString(),
      status: simulationData.freeSignups >= 100 ? "success" : simulationData.freeSignups >= 50 ? "warning" : "pending",
      trend: simulationData.freeSignups > 0 ? "up" : "stable"
    },
    {
      name: "Pro Conversions",
      target: "15+",
      current: simulationData.proConversions.toString(),
      status: simulationData.proConversions >= 15 ? "success" : simulationData.proConversions >= 8 ? "warning" : "pending",
      trend: simulationData.proConversions > 0 ? "up" : "stable"
    },
    {
      name: "MRR Generated",
      target: "€750+",
      current: `€${simulationData.mrrGenerated}`,
      status: simulationData.mrrGenerated >= 750 ? "success" : simulationData.mrrGenerated >= 400 ? "warning" : "pending",
      trend: simulationData.mrrGenerated > 0 ? "up" : "stable"
    },
    {
      name: "Conversion Rate",
      target: "15%",
      current: `${simulationData.conversionRate}%`,
      status: simulationData.conversionRate >= 15 ? "success" : simulationData.conversionRate >= 10 ? "warning" : "pending",
      trend: simulationData.conversionRate > 0 ? "up" : "stable"
    },
    {
      name: "App Store Rating",
      target: "4.5★+",
      current: simulationData.appStoreRating > 0 ? `${simulationData.appStoreRating.toFixed(1)}★` : "-",
      status: simulationData.appStoreRating >= 4.5 ? "success" : simulationData.appStoreRating >= 4.0 ? "warning" : "pending",
      trend: simulationData.appStoreRating > 0 ? "up" : "stable"
    }
  ];

  const trafficMetrics: Metric[] = [
    {
      name: "Website Visitors",
      target: "500+",
      current: simulationData.websiteVisitors.toString(),
      status: simulationData.websiteVisitors >= 500 ? "success" : simulationData.websiteVisitors >= 250 ? "warning" : "pending"
    },
    {
      name: "Product Hunt Upvotes",
      target: "50+",
      current: simulationData.productHuntUpvotes.toString(),
      status: simulationData.productHuntUpvotes >= 50 ? "success" : simulationData.productHuntUpvotes >= 25 ? "warning" : "pending"
    },
    {
      name: "LinkedIn Views",
      target: "200+",
      current: simulationData.linkedInViews.toString(),
      status: simulationData.linkedInViews >= 200 ? "success" : simulationData.linkedInViews >= 100 ? "warning" : "pending"
    },
    {
      name: "Social Media Impressions",
      target: "1000+",
      current: simulationData.socialImpressions.toString(),
      status: simulationData.socialImpressions >= 1000 ? "success" : simulationData.socialImpressions >= 500 ? "warning" : "pending"
    },
    {
      name: "Email Open Rate",
      target: "20%+",
      current: `${Math.round(simulationData.emailOpenRate)}%`,
      status: simulationData.emailOpenRate >= 20 ? "success" : simulationData.emailOpenRate >= 15 ? "warning" : "pending"
    }
  ];

  const systemHealth: SystemHealth[] = [
    {
      name: "Frontend",
      status: "online",
      responseTime: "<200ms",
      uptime: "99.9%"
    },
    {
      name: "Backend API",
      status: "online",
      responseTime: "<300ms",
      uptime: "99.9%"
    },
    {
      name: "Database",
      status: "online",
      responseTime: "<100ms",
      uptime: "99.9%"
    },
    {
      name: "Redis",
      status: "online",
      responseTime: "<50ms",
      uptime: "99.9%"
    },
    {
      name: "Celery",
      status: "online",
      responseTime: "Active",
      uptime: "99.9%"
    },
    {
      name: "S3 Storage",
      status: "online",
      responseTime: "<500ms",
      uptime: "99.9%"
    }
  ];

  const platformStatus: PlatformStatus[] = [
    {
      name: "Shopify App Store",
      status: "pending",
      engagement: "-",
      conversion: "-"
    },
    {
      name: "Product Hunt",
      status: "live",
      engagement: "0 upvotes",
      conversion: "-"
    },
    {
      name: "LinkedIn",
      status: "live",
      engagement: "0 views",
      conversion: "-"
    },
    {
      name: "Twitter/X",
      status: "pending",
      engagement: "-",
      conversion: "-"
    },
    {
      name: "Email Campaign",
      status: "pending",
      engagement: "-",
      conversion: "-"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "online":
      case "live":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "error":
      case "offline":
        return "text-red-600 bg-red-50";
      case "pending":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
      case "online":
      case "live":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "error":
      case "offline":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "down":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleLiveMode = () => {
    setIsLive(!isLive);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h1 className="text-2xl font-bold text-slate-900">Launch Day War Room</h1>
              <Badge variant="default" className="bg-red-100 text-red-800">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-600">
                {currentTime.toLocaleTimeString()}
              </div>
              <Button
                size="sm"
                variant={isLive ? "default" : "outline"}
                onClick={toggleLiveMode}
              >
                {isLive ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Live
                  </>
                )}
              </Button>
              <Button size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Primary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {primaryKPIs.map((metric) => (
              <Card key={metric.name} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600">{metric.name}</h3>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{metric.current}</p>
                    <p className="text-sm text-slate-500">Target: {metric.target}</p>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {getStatusIcon(metric.status)}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Traffic & Engagement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Traffic & Engagement</h2>
              </div>
              <div className="space-y-4">
                {trafficMetrics.map((metric) => (
                  <div key={metric.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{metric.name}</p>
                      <p className="text-sm text-slate-500">Target: {metric.target}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-slate-900">{metric.current}</p>
                      <Badge className={getStatusColor(metric.status)}>
                        {getStatusIcon(metric.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* System Health */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">System Health</h2>
              </div>
              <div className="space-y-4">
                {systemHealth.map((system) => (
                  <div key={system.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{system.name}</p>
                      <p className="text-sm text-slate-500">{system.responseTime}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm text-slate-600">{system.uptime}</p>
                      <Badge className={getStatusColor(system.status)}>
                        {getStatusIcon(system.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Platform Status */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold">Platform Status</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {platformStatus.map((platform) => (
                <div key={platform.name} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-slate-900">{platform.name}</h3>
                    <Badge className={getStatusColor(platform.status)}>
                      {getStatusIcon(platform.status)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-600">Engagement: {platform.engagement}</p>
                    <p className="text-sm text-slate-600">Conversion: {platform.conversion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Launch Sequence Tracker */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold">Completed</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Health checks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Product Hunt</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>LinkedIn</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">In Progress</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Email campaign</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Social blitz</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span>Partnerships</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-semibold">Upcoming</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>Blog post</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>Community engagement</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-yellow-500" />
                  <span>Evening review</span>
                </div>
              </div>
            </Card>
          </div>

                     {/* Conversion Funnel */}
           <Card className="p-6 mb-8">
             <div className="flex items-center gap-3 mb-6">
               <Target className="w-6 h-6 text-indigo-600" />
               <h2 className="text-xl font-semibold">Conversion Funnel</h2>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="text-center p-4 bg-blue-50 rounded-lg">
                 <p className="text-2xl font-bold text-blue-600">{simulationData.websiteVisitors}</p>
                 <p className="text-sm text-blue-600">Website Visitors</p>
                 <p className="text-xs text-blue-500">Target: 500+</p>
               </div>
               <div className="text-center p-4 bg-green-50 rounded-lg">
                 <p className="text-2xl font-bold text-green-600">{simulationData.freeSignups}</p>
                 <p className="text-sm text-green-600">Free Signups</p>
                 <p className="text-xs text-green-500">Target: 100+ (5%)</p>
               </div>
               <div className="text-center p-4 bg-purple-50 rounded-lg">
                 <p className="text-2xl font-bold text-purple-600">{simulationData.proConversions}</p>
                 <p className="text-sm text-purple-600">Pro Conversions</p>
                 <p className="text-xs text-purple-500">Target: 15+ (15%)</p>
               </div>
               <div className="text-center p-4 bg-orange-50 rounded-lg">
                 <p className="text-2xl font-bold text-orange-600">€{simulationData.mrrGenerated}</p>
                 <p className="text-sm text-orange-600">MRR Generated</p>
                 <p className="text-xs text-orange-500">Target: €750+</p>
               </div>
             </div>
           </Card>

          {/* Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-l-4 border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold">Success Alerts</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-green-600">✓ All systems operational</p>
                <p className="text-sm text-green-600">✓ Product Hunt live</p>
                <p className="text-sm text-green-600">✓ Technical health green</p>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-yellow-500">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-semibold">Warning Alerts</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-yellow-600">⚠ Shopify App Store pending</p>
                <p className="text-sm text-yellow-600">⚠ Email campaign not sent</p>
                <p className="text-sm text-yellow-600">⚠ No signups yet</p>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-red-500">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold">Critical Alerts</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-red-600">No critical alerts</p>
                <p className="text-sm text-gray-500">All systems operational</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchDayDashboard;
