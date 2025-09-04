// components/ReportBuilder.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  BarChart3, 
  Table, 
  PieChart,
  Download,
  Share2,
  Plus,
  Trash2,
  Move,
  Settings,
  Calendar,
  Users,
  Database
} from "lucide-react";

interface ReportBlock {
  id: string;
  type: 'chart' | 'table' | 'kpi' | 'text';
  title: string;
  data?: any;
  position: number;
}

interface Report {
  id: string;
  title: string;
  description: string;
  blocks: ReportBlock[];
  createdAt: string;
  updatedAt: string;
}

export default function ReportBuilder() {
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const sampleReports: Report[] = [
    {
      id: '1',
      title: 'Monthly Compliance Report',
      description: 'Comprehensive GDPR compliance overview',
      blocks: [
        {
          id: '1',
          type: 'kpi',
          title: 'Total DSAR Requests',
          data: { value: 47, change: '+12%' },
          position: 0
        },
        {
          id: '2',
          type: 'chart',
          title: 'Request Status Distribution',
          data: { type: 'pie', labels: ['Completed', 'Pending', 'Rejected'], values: [35, 8, 4] },
          position: 1
        },
        {
          id: '3',
          type: 'table',
          title: 'Recent Requests',
          data: { headers: ['ID', 'Customer', 'Status', 'Date'], rows: [] },
          position: 2
        }
      ],
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  ];

  useEffect(() => {
    setReports(sampleReports);
  }, []);

  const createNewReport = () => {
    const newReport: Report = {
      id: Date.now().toString(),
      title: 'New Report',
      description: 'Report description',
      blocks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCurrentReport(newReport);
    setIsEditing(true);
  };

  const addBlock = (type: ReportBlock['type']) => {
    if (!currentReport) return;

    const newBlock: ReportBlock = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Block`,
      position: currentReport.blocks.length,
      data: getDefaultData(type)
    };

    const updatedReport = {
      ...currentReport,
      blocks: [...currentReport.blocks, newBlock],
      updatedAt: new Date().toISOString()
    };

    setCurrentReport(updatedReport);
  };

  const getDefaultData = (type: ReportBlock['type']) => {
    switch (type) {
      case 'kpi':
        return { value: 0, change: '0%' };
      case 'chart':
        return { type: 'bar', labels: ['Jan', 'Feb', 'Mar'], values: [10, 20, 15] };
      case 'table':
        return { headers: ['Column 1', 'Column 2', 'Column 3'], rows: [] };
      case 'text':
        return { content: 'Add your text content here' };
      default:
        return {};
    }
  };

  const removeBlock = (blockId: string) => {
    if (!currentReport) return;

    const updatedReport = {
      ...currentReport,
      blocks: currentReport.blocks.filter(block => block.id !== blockId),
      updatedAt: new Date().toISOString()
    };

    setCurrentReport(updatedReport);
  };

  const saveReport = () => {
    if (!currentReport || !reportTitle) return;

    const updatedReport = {
      ...currentReport,
      title: reportTitle,
      description: reportDescription,
      updatedAt: new Date().toISOString()
    };

    setReports(prev => {
      const existingIndex = prev.findIndex(r => r.id === updatedReport.id);
      if (existingIndex >= 0) {
        const newReports = [...prev];
        newReports[existingIndex] = updatedReport;
        return newReports;
      } else {
        return [...prev, updatedReport];
      }
    });

    setIsEditing(false);
    setCurrentReport(null);
  };

  const exportReport = (format: 'pdf' | 'excel') => {
    if (!currentReport) return;
    
    // Simulate export
    console.log(`Exporting report ${currentReport.title} as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}`);
  };

  const shareReport = () => {
    if (!currentReport) return;
    
    const shareUrl = `${window.location.origin}/reports/${currentReport.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Share link copied to clipboard!');
  };

  const getBlockIcon = (type: ReportBlock['type']) => {
    switch (type) {
      case 'chart':
        return <BarChart3 className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'kpi':
        return <Database className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const renderBlock = (block: ReportBlock) => {
    switch (block.type) {
      case 'kpi':
        return (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">{block.data.value}</div>
            <div className="text-sm text-slate-600">{block.title}</div>
            <div className="text-xs text-green-600">{block.data.change}</div>
          </div>
        );
      case 'chart':
        return (
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">{block.title}</div>
            <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        );
      case 'table':
        return (
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">{block.title}</div>
            <div className="h-32 bg-slate-100 rounded flex items-center justify-center">
              <Table className="h-8 w-8 text-slate-400" />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">{block.title}</div>
            <div className="text-sm text-slate-600">{block.data.content}</div>
          </div>
        );
      default:
        return null;
    }
  };

  if (isEditing && currentReport) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Report Builder</h1>
            <p className="text-slate-600">Create and customize your reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={saveReport} className="bg-blue-600 hover:bg-blue-700">
              Save Report
            </Button>
          </div>
        </div>

        {/* Report Details */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Report Title
                </label>
                <Input
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="Enter report title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Description
                </label>
                <Input
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Enter report description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Block Library */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Blocks
            </CardTitle>
            <CardDescription>
              Drag and drop blocks to build your report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                onClick={() => addBlock('kpi')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Database className="h-6 w-6 mb-2" />
                <span className="text-sm">KPI</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => addBlock('chart')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <BarChart3 className="h-6 w-6 mb-2" />
                <span className="text-sm">Chart</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => addBlock('table')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Table className="h-6 w-6 mb-2" />
                <span className="text-sm">Table</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => addBlock('text')}
                className="h-20 flex flex-col items-center justify-center"
              >
                <FileText className="h-6 w-6 mb-2" />
                <span className="text-sm">Text</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Canvas */}
        <Card>
          <CardHeader>
            <CardTitle>Report Canvas</CardTitle>
            <CardDescription>
              Your report blocks will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentReport.blocks.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No blocks yet</h3>
                <p className="text-slate-600 mb-4">
                  Add blocks from the library above to start building your report
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentReport.blocks.map((block) => (
                  <div key={block.id} className="relative group">
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBlock(block.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {renderBlock(block)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Report Builder</h1>
          <p className="text-slate-600">Create and manage your compliance reports</p>
        </div>
        <Button onClick={createNewReport} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
                <Badge variant="secondary">
                  {report.blocks.length} blocks
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(report.updatedAt).toLocaleDateString()}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentReport(report);
                      setReportTitle(report.title);
                      setReportDescription(report.description);
                      setIsEditing(true);
                    }}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportReport('pdf')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareReport()}
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {reports.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first report to get started
              </p>
              <Button onClick={createNewReport} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
