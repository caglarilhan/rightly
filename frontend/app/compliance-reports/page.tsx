import { NextPage } from "next";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { 
  FileText, 
  Download, 
  Calendar,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3
} from "lucide-react";

interface ComplianceReport {
  id: string;
  title: string;
  period: string;
  status: "generated" | "processing" | "failed";
  createdAt: string;
  fileSize?: string;
  score: number;
  metrics: {
    totalRequests: number;
    avgResponseTime: number;
    slaCompliance: number;
    dataBreaches: number;
  };
}

const ComplianceReportsPage: NextPage = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([
    {
      id: "1",
      title: "January 2024 Compliance Report",
      period: "Jan 1 - Jan 31, 2024",
      status: "generated",
      createdAt: "2024-02-01T10:00:00Z",
      fileSize: "2.3MB",
      score: 98,
      metrics: {
        totalRequests: 47,
        avgResponseTime: 2.3,
        slaCompliance: 100,
        dataBreaches: 0
      }
    },
    {
      id: "2",
      title: "December 2023 Compliance Report",
      period: "Dec 1 - Dec 31, 2023",
      status: "generated",
      createdAt: "2024-01-01T10:00:00Z",
      fileSize: "1.8MB",
      score: 95,
      metrics: {
        totalRequests: 32,
        avgResponseTime: 3.1,
        slaCompliance: 96,
        dataBreaches: 0
      }
    },
    {
      id: "3",
      title: "November 2023 Compliance Report",
      period: "Nov 1 - Nov 30, 2023",
      status: "generated",
      createdAt: "2023-12-01T10:00:00Z",
      fileSize: "1.5MB",
      score: 92,
      metrics: {
        totalRequests: 28,
        avgResponseTime: 4.2,
        slaCompliance: 89,
        dataBreaches: 0
      }
    }
  ]);

  const [generating, setGenerating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generated":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "generated":
        return <Badge variant="default" className="bg-green-100 text-green-800">Generated</Badge>;
      case "processing":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case "failed":
        return <Badge variant="default" className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const generateReport = () => {
    setGenerating(true);
    // Mock report generation
    setTimeout(() => {
      const newReport: ComplianceReport = {
        id: Date.now().toString(),
        title: `February 2024 Compliance Report`,
        period: "Feb 1 - Feb 29, 2024",
        status: "generated",
        createdAt: new Date().toISOString(),
        fileSize: "2.1MB",
        score: 97,
        metrics: {
          totalRequests: 52,
          avgResponseTime: 2.1,
          slaCompliance: 100,
          dataBreaches: 0
        }
      };
      setReports(prev => [newReport, ...prev]);
      setGenerating(false);
    }, 3000);
  };

  const downloadReport = (reportId: string) => {
    console.log(`Downloading report ${reportId}`);
    // Mock download - production'da JWT token ile presigned URL
    window.open(`/api/reports/${reportId}/download`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Compliance Reports</h1>
              <p className="text-slate-600">
                Monthly GDPR compliance reports for audit and regulatory requirements
              </p>
            </div>
            <Button 
              onClick={generateReport}
              disabled={generating}
              className="flex items-center gap-2"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Reports</p>
                  <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Compliance Score</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(reports.reduce((acc, r) => acc + r.score, 0) / reports.length)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total DSAR Requests</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {reports.reduce((acc, r) => acc + r.metrics.totalRequests, 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">SLA Compliance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(reports.reduce((acc, r) => acc + r.metrics.slaCompliance, 0) / reports.length)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Reports List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Generated Reports</h2>
            
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-slate-200 rounded-lg p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{report.period}</p>
                      <p className="text-xs text-slate-500">
                        Generated: {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(report.score)}`}>
                        {report.score}%
                      </p>
                      <p className="text-sm text-slate-600">Compliance Score</p>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-sm text-slate-600">DSAR Requests</p>
                      <p className="text-lg font-semibold text-slate-900">{report.metrics.totalRequests}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">Avg Response</p>
                      <p className="text-lg font-semibold text-slate-900">{report.metrics.avgResponseTime}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">SLA Compliance</p>
                      <p className="text-lg font-semibold text-green-600">{report.metrics.slaCompliance}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-slate-600">Data Breaches</p>
                      <p className="text-lg font-semibold text-red-600">{report.metrics.dataBreaches}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {report.fileSize && (
                        <span className="text-sm text-slate-500">
                          Size: {report.fileSize}
                        </span>
                      )}
                      <span className="text-sm text-slate-500">
                        {getStatusIcon(report.status)} {getStatusBadge(report.status).props.children}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {report.status === "generated" && (
                        <Button
                          size="sm"
                          onClick={() => downloadReport(report.id)}
                          className="flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download PDF
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No compliance reports generated yet</p>
                <p className="text-sm text-slate-400 mt-2">
                  Generate your first report to track GDPR compliance
                </p>
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="p-6 mt-8 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Compliance Report Features</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Monthly GDPR compliance summaries</li>
                  <li>• DSAR request processing metrics</li>
                  <li>• SLA compliance tracking</li>
                  <li>• Data breach monitoring</li>
                  <li>• Audit-ready PDF reports</li>
                  <li>• Regulatory submission support</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ComplianceReportsPage;
