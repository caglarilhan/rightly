// components/PerformanceOptimization.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Database, 
  Cpu, 
  HardDrive,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Settings,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Clock,
  Gauge
} from "lucide-react";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  threshold: number;
  description: string;
}

interface OptimizationAction {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'quick' | 'medium' | 'complex';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedImprovement: number;
}

export default function PerformanceOptimization() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationAction[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);

  const sampleMetrics: PerformanceMetric[] = [
    {
      id: '1',
      name: 'Response Time',
      value: 245,
      unit: 'ms',
      status: 'good',
      trend: 'down',
      threshold: 500,
      description: 'Average API response time'
    },
    {
      id: '2',
      name: 'Database Queries',
      value: 12.5,
      unit: 'queries/sec',
      status: 'warning',
      trend: 'up',
      threshold: 10,
      description: 'Database queries per second'
    },
    {
      id: '3',
      name: 'Memory Usage',
      value: 78,
      unit: '%',
      status: 'warning',
      trend: 'up',
      threshold: 80,
      description: 'Server memory utilization'
    },
    {
      id: '4',
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'good',
      trend: 'stable',
      threshold: 70,
      description: 'CPU utilization'
    },
    {
      id: '5',
      name: 'Cache Hit Rate',
      value: 92,
      unit: '%',
      status: 'good',
      trend: 'up',
      threshold: 85,
      description: 'Redis cache hit rate'
    },
    {
      id: '6',
      name: 'Disk I/O',
      value: 15.2,
      unit: 'MB/s',
      status: 'good',
      trend: 'down',
      threshold: 50,
      description: 'Disk read/write operations'
    }
  ];

  const sampleOptimizations: OptimizationAction[] = [
    {
      id: '1',
      name: 'Database Indexing',
      description: 'Add missing indexes to improve query performance',
      impact: 'high',
      effort: 'medium',
      status: 'pending',
      estimatedImprovement: 40
    },
    {
      id: '2',
      name: 'Query Optimization',
      description: 'Optimize slow database queries',
      impact: 'high',
      effort: 'complex',
      status: 'in-progress',
      estimatedImprovement: 35
    },
    {
      id: '3',
      name: 'Caching Strategy',
      description: 'Implement Redis caching for frequently accessed data',
      impact: 'high',
      effort: 'medium',
      status: 'completed',
      estimatedImprovement: 60
    },
    {
      id: '4',
      name: 'CDN Implementation',
      description: 'Deploy CDN for static assets',
      impact: 'medium',
      effort: 'quick',
      status: 'pending',
      estimatedImprovement: 25
    },
    {
      id: '5',
      name: 'Connection Pooling',
      description: 'Optimize database connection pooling',
      impact: 'medium',
      effort: 'medium',
      status: 'pending',
      estimatedImprovement: 20
    },
    {
      id: '6',
      name: 'Code Splitting',
      description: 'Implement code splitting for better load times',
      impact: 'medium',
      effort: 'complex',
      status: 'pending',
      estimatedImprovement: 30
    }
  ];

  useEffect(() => {
    setMetrics(sampleMetrics);
    setOptimizations(sampleOptimizations);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'quick':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'complex':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const startOptimization = (optimizationId: string) => {
    setOptimizations(optimizations.map(opt => 
      opt.id === optimizationId 
        ? { ...opt, status: 'in-progress' as const }
        : opt
    ));
  };

  const completeOptimization = (optimizationId: string) => {
    setOptimizations(optimizations.map(opt => 
      opt.id === optimizationId 
        ? { ...opt, status: 'completed' as const }
        : opt
    ));
  };

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Performance Optimization</h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
          Monitor and optimize system performance for better user experience
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>⚡ Real-time monitoring</span>
          <span>•</span>
          <span>🔧 Automated optimization</span>
          <span>•</span>
          <span>📊 Performance analytics</span>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Gauge className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">245ms</div>
                <div className="text-sm text-slate-600">Avg Response Time</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">92%</div>
                <div className="text-sm text-slate-600">Cache Hit Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Cpu className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">45%</div>
                <div className="text-sm text-slate-600">CPU Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">78%</div>
                <div className="text-sm text-slate-600">Memory Usage</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Metrics */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Performance Metrics
                </CardTitle>
                <CardDescription>
                  Live system performance monitoring
                </CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={toggleMonitoring}
              >
                {isMonitoring ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Monitoring
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900">{metric.name}</h3>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold text-slate-900">
                      {metric.value}{metric.unit}
                    </div>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">
                    {metric.description}
                  </p>
                  
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.status === 'good' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-1">
                    Threshold: {metric.threshold}{metric.unit}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Actions */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Optimization Actions
            </CardTitle>
            <CardDescription>
              Recommended performance improvements and their impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimizations.map((optimization) => (
                <div
                  key={optimization.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{optimization.name}</h3>
                        <Badge className={getImpactColor(optimization.impact)}>
                          {optimization.impact} impact
                        </Badge>
                        <Badge className={getEffortColor(optimization.effort)}>
                          {optimization.effort} effort
                        </Badge>
                      </div>
                      <p className="text-slate-600 text-sm mb-2">
                        {optimization.description}
                      </p>
                      <div className="text-sm text-slate-500">
                        Estimated improvement: {optimization.estimatedImprovement}%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {optimization.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => startOptimization(optimization.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {optimization.status === 'in-progress' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completeOptimization(optimization.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                      {optimization.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Response Time Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Response Time Trends
            </CardTitle>
            <CardDescription>
              API response time over the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-100 rounded flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Average</span>
                <span className="font-semibold">245ms</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Peak</span>
                <span className="font-semibold text-red-600">890ms</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>95th percentile</span>
                <span className="font-semibold">420ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Resource Utilization
            </CardTitle>
            <CardDescription>
              Current system resource usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Memory Usage</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Disk Usage</span>
                  <span>62%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '62%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Network I/O</span>
                  <span>15.2 MB/s</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Performance Actions</CardTitle>
          <CardDescription>
            Common performance optimization tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <RefreshCw className="h-5 w-5 mb-2" />
              <span>Clear Cache</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Database className="h-5 w-5 mb-2" />
              <span>Optimize DB</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Settings className="h-5 w-5 mb-2" />
              <span>Auto Optimize</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
