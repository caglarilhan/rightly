// components/AdvancedAnalytics.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Brain,
  Zap,
  Calendar,
  Users,
  Database,
  Target,
  Activity,
  Lightbulb
} from "lucide-react";

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  prediction?: number;
  risk?: 'low' | 'medium' | 'high';
}

interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'recommendation' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
  action?: string;
}

export default function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sampleMetrics: AnalyticsMetric[] = [
    {
      id: '1',
      name: 'DSAR Volume',
      value: 47,
      change: 12.5,
      trend: 'up',
      prediction: 52,
      risk: 'low'
    },
    {
      id: '2',
      name: 'Response Time',
      value: 2.3,
      change: -8.2,
      trend: 'down',
      prediction: 2.1,
      risk: 'low'
    },
    {
      id: '3',
      name: 'Compliance Score',
      value: 94.2,
      change: 2.1,
      trend: 'up',
      prediction: 95.8,
      risk: 'low'
    },
    {
      id: '4',
      name: 'Data Processing',
      value: 1247,
      change: 18.7,
      trend: 'up',
      prediction: 1480,
      risk: 'medium'
    },
    {
      id: '5',
      name: 'Error Rate',
      value: 1.2,
      change: -15.3,
      trend: 'down',
      prediction: 1.0,
      risk: 'low'
    },
    {
      id: '6',
      name: 'User Engagement',
      value: 78.5,
      change: 5.2,
      trend: 'up',
      prediction: 82.1,
      risk: 'low'
    }
  ];

  const sampleInsights: AIInsight[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'DSAR Volume Spike Expected',
      description: 'Based on current trends, expect 15% increase in DSAR requests next month due to seasonal compliance audits.',
      confidence: 87,
      impact: 'neutral',
      action: 'Prepare additional resources'
    },
    {
      id: '2',
      type: 'anomaly',
      title: 'Unusual Processing Pattern',
      description: 'Data processing time increased by 25% in the last 24 hours. This may indicate system load issues.',
      confidence: 92,
      impact: 'negative',
      action: 'Investigate system performance'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Optimization Opportunity',
      description: 'Implementing caching could reduce response time by 30% and improve user satisfaction.',
      confidence: 78,
      impact: 'positive',
      action: 'Review caching strategy'
    },
    {
      id: '4',
      type: 'trend',
      title: 'Positive Compliance Trend',
      description: 'Compliance score has improved consistently over the past 3 months. Current trajectory suggests 98% by Q2.',
      confidence: 85,
      impact: 'positive',
      action: 'Maintain current practices'
    }
  ];

  useEffect(() => {
    setMetrics(sampleMetrics);
    setInsights(sampleInsights);
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Target className="h-4 w-4 text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-yellow-600" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      default:
        return <Brain className="h-4 w-4 text-purple-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Advanced Analytics</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          AI-powered insights and predictive analytics for your compliance data
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🤖 AI-powered predictions</span>
          <span>•</span>
          <span>📊 Real-time insights</span>
          <span>•</span>
          <span>🎯 Actionable recommendations</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{metric.name}</CardTitle>
                <Badge className={getRiskColor(metric.risk || 'low')}>
                  {metric.risk} risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-slate-900">
                    {metric.value}
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
                
                {metric.prediction && (
                  <div className="text-sm text-slate-600">
                    <span className="font-medium">Prediction:</span> {metric.prediction}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Insights
                </CardTitle>
                <CardDescription>
                  Intelligent analysis and recommendations
                </CardDescription>
              </div>
              <Button
                onClick={generateInsights}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Insights
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <h3 className="font-semibold text-slate-900">
                        {insight.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.action && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-600">Action:</span>
                      <span className="text-sm text-slate-700">{insight.action}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DSAR Volume Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              DSAR Volume Prediction
            </CardTitle>
            <CardDescription>
              AI-powered forecast for the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Current Volume</span>
                <span className="font-semibold">47 requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Predicted Volume</span>
                <span className="font-semibold text-blue-600">52 requests</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Growth Rate</span>
                <span className="font-semibold text-green-600">+10.6%</span>
              </div>
              <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Risk Assessment
            </CardTitle>
            <CardDescription>
              AI-powered risk scoring and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Overall Risk Score</span>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  Low Risk
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Data Processing</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Medium
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Response Time</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Low
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Error Rate</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Low
                  </Badge>
                </div>
              </div>
              <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-slate-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>
            AI-suggested actions to improve your compliance posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium">Implement Caching Strategy</div>
                <div className="text-sm text-slate-600">
                  Reduce response time by 30% with Redis caching
                </div>
              </div>
              <Button size="sm">Implement</Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <div className="font-medium">Scale Resources</div>
                <div className="text-sm text-slate-600">
                  Prepare for 15% increase in DSAR volume next month
                </div>
              </div>
              <Button size="sm">Plan</Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">Optimize Queries</div>
                <div className="text-sm text-slate-600">
                  Improve data processing efficiency by 25%
                </div>
              </div>
              <Button size="sm">Optimize</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
