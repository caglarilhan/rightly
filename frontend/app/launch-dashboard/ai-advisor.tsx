import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  DollarSign,
  MessageSquare,
  Clock,
  Zap
} from "lucide-react";

interface Insight {
  id: string;
  type: "positive" | "negative" | "neutral" | "opportunity";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  action: string;
  confidence: number;
  timestamp: string;
}

interface Recommendation {
  id: string;
  category: "traffic" | "conversion" | "revenue" | "engagement";
  title: string;
  description: string;
  expectedImpact: string;
  effort: "low" | "medium" | "high";
  priority: "critical" | "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
}

const AILaunchAdvisor = () => {
  const [insights, setInsights] = useState<Insight[]>([
    {
      id: "1",
      type: "positive",
      title: "Conversion Rate Spike",
      description: "Conversion rate increased by 25% in the last hour, indicating strong product-market fit",
      impact: "high",
      action: "Consider increasing ad spend to capitalize on momentum",
      confidence: 92,
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      type: "negative",
      title: "Email Open Rate Decline",
      description: "Email open rate dropped from 28% to 18% in the last 30 minutes",
      impact: "medium",
      action: "Review email subject lines and timing, consider A/B testing",
      confidence: 87,
      timestamp: "5 minutes ago"
    },
    {
      id: "3",
      type: "opportunity",
      title: "Product Hunt Trending",
      description: "Product Hunt post is trending in Top 10, high engagement potential",
      impact: "high",
      action: "Increase social media promotion and engage with comments",
      confidence: 94,
      timestamp: "8 minutes ago"
    },
    {
      id: "4",
      type: "neutral",
      title: "Traffic Pattern Analysis",
      description: "Traffic is following expected launch day pattern with 15% increase",
      impact: "low",
      action: "Continue current strategy, monitor for deviations",
      confidence: 78,
      timestamp: "12 minutes ago"
    }
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: "1",
      category: "conversion",
      title: "Optimize Landing Page CTA",
      description: "Add urgency to call-to-action buttons with countdown timer",
      expectedImpact: "+15% conversion rate",
      effort: "low",
      priority: "high",
      status: "pending"
    },
    {
      id: "2",
      category: "traffic",
      title: "Increase Social Media Ads",
      description: "Scale up LinkedIn and Twitter ad spend by 50%",
      expectedImpact: "+200 visitors/hour",
      effort: "medium",
      priority: "high",
      status: "in-progress"
    },
    {
      id: "3",
      category: "revenue",
      title: "Implement Exit Intent Popup",
      description: "Show special launch day offer to users about to leave",
      expectedImpact: "+8% MRR",
      effort: "medium",
      priority: "medium",
      status: "pending"
    },
    {
      id: "4",
      category: "engagement",
      title: "Send Follow-up Email Sequence",
      description: "Create personalized follow-up emails for free signups",
      expectedImpact: "+12% Pro conversions",
      effort: "high",
      priority: "medium",
      status: "pending"
    }
  ]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "positive": return <TrendingUp className="w-5 h-5 text-green-600" />;
      case "negative": return <TrendingDown className="w-5 h-5 text-red-600" />;
      case "opportunity": return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case "neutral": return <BarChart3 className="w-5 h-5 text-blue-600" />;
      default: return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "positive": return "border-green-200 bg-green-50";
      case "negative": return "border-red-200 bg-red-50";
      case "opportunity": return "border-yellow-200 bg-yellow-50";
      case "neutral": return "border-blue-200 bg-blue-50";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "traffic": return <Users className="w-4 h-4" />;
      case "conversion": return <Target className="w-4 h-4" />;
      case "revenue": return <DollarSign className="w-4 h-4" />;
      case "engagement": return <MessageSquare className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const updateRecommendationStatus = (id: string, status: "pending" | "in-progress" | "completed") => {
    setRecommendations(prev => 
      prev.map(rec => rec.id === id ? { ...rec, status } : rec)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold">AI Launch Advisor</h2>
        </div>
        <Badge className="bg-purple-100 text-purple-800">
          <Zap className="w-3 h-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      {/* Real-time Insights */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h3 className="text-lg font-semibold">Real-time Insights</h3>
        </div>
        
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                    {insight.impact} impact
                  </Badge>
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Recommended Action:</span>
                  <span className="text-gray-600 ml-2">{insight.action}</span>
                </div>
                <span className="text-xs text-gray-500">{insight.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Recommendations */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">AI Recommendations</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getCategoryIcon(rec.category)}
                  <div>
                    <h4 className="font-medium">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                    {rec.priority} priority
                  </Badge>
                  <Badge className={`text-xs ${getEffortColor(rec.effort)}`}>
                    {rec.effort} effort
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Expected Impact:</span>
                  <span className="text-green-600 ml-2">{rec.expectedImpact}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${
                    rec.status === "completed" ? "bg-green-100 text-green-800" :
                    rec.status === "in-progress" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {rec.status === "completed" ? <CheckCircle className="w-3 h-3 mr-1" /> :
                     rec.status === "in-progress" ? <Clock className="w-3 h-3 mr-1" /> :
                     <AlertTriangle className="w-3 h-3 mr-1" />}
                    {rec.status}
                  </Badge>
                  
                  {rec.status === "pending" && (
                    <Button 
                      size="sm" 
                      onClick={() => updateRecommendationStatus(rec.id, "in-progress")}
                    >
                      Start
                    </Button>
                  )}
                  
                  {rec.status === "in-progress" && (
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => updateRecommendationStatus(rec.id, "completed")}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* AI Performance Metrics */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">AI Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-blue-600">Accuracy</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-green-600">Insights Generated</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">8</div>
            <div className="text-sm text-purple-600">Actions Taken</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">+23%</div>
            <div className="text-sm text-orange-600">Performance Boost</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AILaunchAdvisor;
