// components/AIExplainer.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Zap,
  Clock,
  BarChart3,
  X,
  RefreshCw
} from "lucide-react";

interface AIInsight {
  id: string;
  type: 'spike' | 'drop' | 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timestamp: string;
  data?: any;
}

interface AIExplainerProps {
  metric: string;
  value: number;
  previousValue?: number;
  onInsightRequest?: (insight: AIInsight) => void;
}

export default function AIExplainer({ 
  metric, 
  value, 
  previousValue, 
  onInsightRequest 
}: AIExplainerProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [showInsights, setShowInsights] = useState(false);

  const analyzeMetric = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'spike',
        title: 'Unusual Activity Detected',
        description: 'This spike appears to be caused by increased API calls from your Shopify integration during peak shopping hours (2-4 PM).',
        confidence: 87,
        impact: 'high',
        timestamp: new Date().toISOString(),
        data: {
          cause: 'Shopify integration',
          timeRange: '2-4 PM',
          correlation: 'Shopping peak hours'
        }
      },
      {
        id: '2',
        type: 'recommendation',
        title: 'Optimization Opportunity',
        description: 'Consider implementing rate limiting during peak hours to reduce API costs and improve performance.',
        confidence: 92,
        impact: 'medium',
        timestamp: new Date().toISOString(),
        data: {
          suggestion: 'Rate limiting',
          benefit: 'Cost reduction',
          implementation: 'Easy'
        }
      },
      {
        id: '3',
        type: 'trend',
        title: 'Positive Growth Pattern',
        description: 'Your usage shows a healthy 15% week-over-week growth, indicating good product-market fit.',
        confidence: 78,
        impact: 'high',
        timestamp: new Date().toISOString(),
        data: {
          growth: '15%',
          period: 'Week-over-week',
          trend: 'Positive'
        }
      }
    ];
    
    setInsights(mockInsights);
    setIsAnalyzing(false);
    setShowInsights(true);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spike':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'drop':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      case 'anomaly':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'trend':
        return <BarChart3 className="h-4 w-4 text-green-600" />;
      case 'recommendation':
        return <Lightbulb className="h-4 w-4 text-purple-600" />;
      default:
        return <Brain className="h-4 w-4 text-slate-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* AI Analysis Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-slate-900">AI Analysis</h3>
                <p className="text-sm text-slate-600">
                  Get intelligent insights about this metric
                </p>
              </div>
            </div>
            <Button
              onClick={analyzeMetric}
              disabled={isAnalyzing}
              variant="outline"
              size="sm"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {showInsights && insights.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Insights
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsights(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Intelligent analysis of your {metric} metric
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getInsightIcon(insight.type)}
                      <h4 className="font-semibold text-slate-900">
                        {insight.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getImpactColor(insight.impact)}>
                        {insight.impact} impact
                      </Badge>
                      <span className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-700 mb-3">
                    {insight.description}
                  </p>
                  
                  {insight.data && (
                    <div className="text-sm text-slate-500">
                      <Clock className="h-3 w-3 inline mr-1" />
                      Analyzed {new Date(insight.timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Questions</CardTitle>
          <CardDescription>
            Ask AI about your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => analyzeMetric()}
            >
              <Brain className="h-4 w-4 mr-2" />
              Why did this metric spike?
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => analyzeMetric()}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              What's the biggest risk right now?
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => analyzeMetric()}
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              How can I optimize this?
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-left"
              onClick={() => analyzeMetric()}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              What's the trend prediction?
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
