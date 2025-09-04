import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Lightbulb,
  Users,
  Star
} from "lucide-react";

interface AIInsight {
  id: string;
  type: "warning" | "success" | "info";
  title: string;
  description: string;
  action?: string;
  priority: "high" | "medium" | "low";
}

interface CreditUsage {
  total: number;
  used: number;
  remaining: number;
  nextUpgrade: number;
}

const DashboardPage: NextPage = () => {
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([
    {
      id: "1",
      type: "warning",
      title: "High Priority DSAR Detected",
      description: "Request #DSAR-2024-015 contains sensitive data patterns. Recommended response time: <24h",
      action: "Review Now",
      priority: "high"
    },
    {
      id: "2",
      type: "success",
      title: "Compliance Score Improved",
      description: "Your GDPR compliance score increased by 15% this week. Great job!",
      priority: "medium"
    },
    {
      id: "3",
      type: "info",
      title: "Usage Pattern Detected",
      description: "Peak DSAR activity on Tuesdays. Consider scheduling team availability.",
      priority: "low"
    }
  ]);

  const [creditUsage, setCreditUsage] = useState<CreditUsage>({
    total: 100,
    used: 35,
    remaining: 65,
    nextUpgrade: 80
  });

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to GDPR Hub!",
      description: "Let's get you started in 3 minutes",
      target: "#dashboard-overview"
    },
    {
      title: "AI Copilot",
      description: "Get intelligent insights and suggestions",
      target: "#ai-insights"
    },
    {
      title: "Credit System",
      description: "Track your usage and upgrade when needed",
      target: "#credit-usage"
    },
    {
      title: "You're All Set!",
      description: "Start processing DSAR requests now",
      target: "#quick-actions"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "info":
        return <Lightbulb className="w-5 h-5 text-blue-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleInsightAction = (insightId: string) => {
    console.log(`Taking action on insight ${insightId}`);
    // Navigate to relevant page or show modal
  };

  const startTutorial = () => {
    setShowTutorial(true);
    setTutorialStep(0);
  };

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
    }
  };

  const skipTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Tutorial Overlay */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <Brain className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{tutorialSteps[tutorialStep].title}</h3>
              <p className="text-slate-600 mb-6">{tutorialSteps[tutorialStep].description}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={nextTutorialStep}>
                  {tutorialStep === tutorialSteps.length - 1 ? "Get Started" : "Next"}
                </Button>
                <Button variant="outline" onClick={skipTutorial}>
                  Skip Tutorial
                </Button>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === tutorialStep ? "bg-brand-600" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
              <p className="text-slate-600">
                GDPR DSAR Management Overview
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={startTutorial}>
                <Lightbulb className="w-4 h-4 mr-2" />
                Start Tutorial
              </Button>
              <Button onClick={() => window.location.href = "/audit-log"}>
                View Audit Log
              </Button>
            </div>
          </div>

          {/* Credit Usage Alert */}
          {creditUsage.used >= creditUsage.nextUpgrade && (
            <Card className="p-4 mb-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">
                    You're approaching your plan limit!
                  </p>
                  <p className="text-sm text-yellow-700">
                    {creditUsage.remaining} credits remaining. Upgrade to Pro for unlimited DSAR processing.
                  </p>
                </div>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Upgrade Now
                </Button>
              </div>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total DSAR Requests</p>
                  <p className="text-3xl font-bold text-slate-900">47</p>
                  <p className="text-xs text-slate-500 mt-1">
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-3xl font-bold text-green-600">42</p>
                  <p className="text-xs text-slate-500 mt-1">
                    89% success rate
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Processing</p>
                  <p className="text-3xl font-bold text-yellow-600">3</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Avg: 2.3 hours
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Compliance Score</p>
                  <p className="text-3xl font-bold text-purple-600">98%</p>
                  <p className="text-xs text-slate-500 mt-1">
                    30-day SLA met
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* AI Copilot Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-brand-600" />
                <h2 className="text-xl font-semibold">AI Copilot Insights</h2>
                <Badge variant="default" className="bg-brand-100 text-brand-800">
                  Beta
                </Badge>
              </div>

              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <div
                    key={insight.id}
                    className={`p-4 rounded-lg border ${getPriorityColor(insight.priority)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{insight.title}</h3>
                        <p className="text-sm mb-3">{insight.description}</p>
                        {insight.action && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleInsightAction(insight.id)}
                          >
                            {insight.action}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Credit Usage */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Credit Usage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Used</span>
                    <span>{creditUsage.used}/{creditUsage.total}</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-brand-600 h-2 rounded-full transition-all"
                      style={{ width: `${(creditUsage.used / creditUsage.total) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-brand-600">{creditUsage.remaining}</p>
                  <p className="text-sm text-slate-600">credits remaining</p>
                </div>
                <Button className="w-full" variant="outline">
                  <Zap className="w-4 h-4 mr-2" />
                  Upgrade to Pro
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="justify-start" variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Process New DSAR
              </Button>
              <Button className="justify-start" variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Compliance Report
              </Button>
              <Button className="justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">DSAR request completed for customer@example.com</p>
                  <p className="text-xs text-slate-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Clock className="w-4 h-4 text-yellow-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New DSAR request received from Shopify</p>
                  <p className="text-xs text-slate-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Brain className="w-4 h-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">AI Copilot detected high-priority request</p>
                  <p className="text-xs text-slate-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
