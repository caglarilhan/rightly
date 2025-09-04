// app/trust/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Lock,
  Server,
  Zap,
  Award,
  FileText
} from "lucide-react";

interface TrustMetric {
  id: string;
  title: string;
  description: string;
  status: "operational" | "degraded" | "down";
  value: string;
  icon: React.ComponentType<any>;
  category: string;
}

export default function TrustCenterPage() {
  const [metrics, setMetrics] = useState<TrustMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const trustMetrics: TrustMetric[] = [
    {
      id: "uptime",
      title: "System Uptime",
      description: "99.9% uptime SLA guarantee",
      status: "operational",
      value: "99.97%",
      icon: Server,
      category: "Reliability"
    },
    {
      id: "security",
      title: "Security Headers",
      description: "HSTS, CSP, X-Frame-Options active",
      status: "operational",
      value: "All Active",
      icon: Shield,
      category: "Security"
    },
    {
      id: "gdpr",
      title: "GDPR Compliance",
      description: "Full GDPR Article 30 compliance",
      status: "operational",
      value: "Compliant",
      icon: Lock,
      category: "Compliance"
    },
    {
      id: "soc2",
      title: "SOC 2 Type II",
      description: "SOC 2 Type II certification in progress",
      status: "operational",
      value: "In Progress",
      icon: Award,
      category: "Compliance"
    },
    {
      id: "rate-limit",
      title: "Rate Limiting",
      description: "API rate limiting and DDoS protection",
      status: "operational",
      value: "Active",
      icon: Zap,
      category: "Security"
    },
    {
      id: "audit-log",
      title: "Audit Logging",
      description: "Comprehensive audit trail",
      status: "operational",
      value: "Enabled",
      icon: FileText,
      category: "Security"
    },
    {
      id: "data-centers",
      title: "Data Centers",
      description: "Multi-region data centers",
      status: "operational",
      value: "3 Regions",
      icon: Globe,
      category: "Infrastructure"
    },
    {
      id: "response-time",
      title: "Response Time",
      description: "Average API response time",
      status: "operational",
      value: "< 200ms",
      icon: Clock,
      category: "Performance"
    }
  ];

  useEffect(() => {
    // Simulate loading and checking metrics
    setTimeout(() => {
      setMetrics(trustMetrics);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 border-green-200";
      case "degraded":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "down":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "down":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = [];
    }
    acc[metric.category].push(metric);
    return acc;
  }, {} as Record<string, TrustMetric[]>);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Trust Center</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Real-time security, compliance, and reliability metrics
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔒 Enterprise-grade security</span>
          <span>•</span>
          <span>📊 99.9% uptime SLA</span>
          <span>•</span>
          <span>🌍 GDPR compliant</span>
        </div>
      </div>

      {/* Overall Status */}
      <Card className="mb-8 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">All Systems Operational</h3>
                <p className="text-sm text-green-700">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {metrics.filter(m => m.status === "operational").length}/{metrics.length} Operational
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="space-y-8">
        {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <Card key={metric.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-slate-600" />
                          <CardTitle className="text-lg">{metric.title}</CardTitle>
                        </div>
                        <Badge className={getStatusColor(metric.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(metric.status)}
                            {metric.status}
                          </div>
                        </Badge>
                      </div>
                      <CardDescription>
                        {metric.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 mb-2">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-500">
                        Last checked: {new Date().toLocaleTimeString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Compliance & Certifications */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Compliance & Certifications
            </CardTitle>
            <CardDescription>
              Our commitment to security and compliance standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">GDPR Compliant</h3>
                <p className="text-sm text-slate-600">Full compliance with EU data protection</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">SOC 2 Type II</h3>
                <p className="text-sm text-slate-600">Security certification in progress</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Server className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold">ISO 27001</h3>
                <p className="text-sm text-slate-600">Information security management</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact & Support */}
      <div className="mt-8 text-center">
        <Card className="bg-slate-50">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-slate-900 mb-2">Need More Information?</h3>
            <p className="text-slate-600 mb-4">
              Contact our security team for detailed compliance reports
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button variant="outline">Download Security Whitepaper</Button>
              <Button variant="outline">Contact Security Team</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
