// components/DemoMode.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Eye, 
  EyeOff,
  Database,
  FileText,
  BarChart3,
  Users,
  Settings,
  Zap
} from "lucide-react";

interface DemoData {
  requests: {
    total: number;
    pending: number;
    completed: number;
    recent: Array<{
      id: string;
      customer: string;
      status: string;
      date: string;
    }>;
  };
  reports: {
    total: number;
    thisMonth: number;
    recent: Array<{
      id: string;
      type: string;
      date: string;
      status: string;
    }>;
  };
  analytics: {
    dataSources: number;
    customers: number;
    compliance: string;
  };
}

export default function DemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState<DemoData | null>(null);

  const sampleDemoData: DemoData = {
    requests: {
      total: 47,
      pending: 3,
      completed: 44,
      recent: [
        {
          id: "DSAR-2024-001",
          customer: "john.doe@example.com",
          status: "completed",
          date: "2024-01-15"
        },
        {
          id: "DSAR-2024-002",
          customer: "sarah.smith@company.com",
          status: "pending",
          date: "2024-01-14"
        },
        {
          id: "DSAR-2024-003",
          customer: "mike.johnson@startup.io",
          status: "completed",
          date: "2024-01-13"
        }
      ]
    },
    reports: {
      total: 23,
      thisMonth: 8,
      recent: [
        {
          id: "REP-2024-001",
          type: "GDPR Compliance Report",
          date: "2024-01-15",
          status: "generated"
        },
        {
          id: "REP-2024-002",
          type: "Data Processing Report",
          date: "2024-01-14",
          status: "generated"
        },
        {
          id: "REP-2024-003",
          type: "Audit Trail Report",
          date: "2024-01-13",
          status: "generated"
        }
      ]
    },
    analytics: {
      dataSources: 5,
      customers: 1247,
      compliance: "98.5%"
    }
  };

  const enableDemoMode = async () => {
    setIsLoading(true);
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDemoData(sampleDemoData);
    setIsDemoMode(true);
    setIsLoading(false);
    localStorage.setItem("demo-mode", "true");
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setDemoData(null);
    localStorage.removeItem("demo-mode");
  };

  useEffect(() => {
    // Check if demo mode was previously enabled
    const savedDemoMode = localStorage.getItem("demo-mode");
    if (savedDemoMode === "true") {
      setDemoData(sampleDemoData);
      setIsDemoMode(true);
    }
  }, []);

  if (isDemoMode && demoData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Demo Mode Banner */}
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Play className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">Demo Mode Active</h3>
                    <p className="text-sm text-blue-700">
                      You're viewing sample data. Switch to real mode anytime.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Demo Data
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disableDemoMode}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <EyeOff className="h-4 w-4 mr-1" />
                    Exit Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{demoData.requests.total}</div>
                  <div className="text-sm text-slate-600">Total DSAR Requests</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{demoData.reports.total}</div>
                  <div className="text-sm text-slate-600">Reports Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{demoData.analytics.customers}</div>
                  <div className="text-sm text-slate-600">Customers Processed</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900">{demoData.analytics.compliance}</div>
                  <div className="text-sm text-slate-600">Compliance Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Recent DSAR Requests
              </CardTitle>
              <CardDescription>
                Latest data subject access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoData.requests.recent.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{request.id}</div>
                      <div className="text-sm text-slate-500">{request.customer}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={request.status === "completed" ? "default" : "secondary"}
                        className={
                          request.status === "completed" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {request.status}
                      </Badge>
                      <span className="text-sm text-slate-500">{request.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Reports
              </CardTitle>
              <CardDescription>
                Latest compliance reports generated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoData.reports.recent.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-slate-900">{report.id}</div>
                      <div className="text-sm text-slate-500">{report.type}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {report.status}
                      </Badge>
                      <span className="text-sm text-slate-500">{report.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Features */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Try These Features
              </CardTitle>
              <CardDescription>
                Explore Rightly's capabilities with demo data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <Database className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Create DSAR Request</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Test the data discovery process
                  </p>
                  <Button size="sm" variant="outline">Try It</Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Generate Report</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Create compliance reports
                  </p>
                  <Button size="sm" variant="outline">Try It</Button>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Settings className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Configure Connectors</h3>
                  <p className="text-sm text-slate-600 mb-3">
                    Set up data sources
                  </p>
                  <Button size="sm" variant="outline">Try It</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Demo Mode Toggle
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Play className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Try Demo Mode</h1>
          </div>
          <CardDescription>
            Experience Rightly with sample data before connecting your own sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              See Rightly in Action
            </h3>
            <p className="text-slate-600 mb-6">
              Explore all features with realistic sample data. No setup required.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Database className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">Sample DSAR Requests</div>
                <div className="text-sm text-slate-500">See how requests are processed</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Compliance Reports</div>
                <div className="text-sm text-slate-500">View generated report examples</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Analytics Dashboard</div>
                <div className="text-sm text-slate-500">Explore metrics and insights</div>
              </div>
            </div>
          </div>

          <Button
            onClick={enableDemoMode}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Demo...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Demo Mode
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-slate-500">
              Demo mode uses sample data. Your real data remains secure.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
