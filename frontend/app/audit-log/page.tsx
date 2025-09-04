"use client";

import { NextPage } from "next";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Download, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface AuditEvent {
  id: string;
  request_id: string;
  event_type: string;
  details: any;
  created_at: string;
  status: "completed" | "processing" | "failed";
}

const AuditLogPage: NextPage = () => {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Mock data - production'da API'den gelecek
  useEffect(() => {
    const mockEvents: AuditEvent[] = [
      {
        id: "1",
        request_id: "DSAR-2024-001",
        event_type: "dsar_received",
        details: { email: "customer@example.com", source: "shopify" },
        created_at: "2024-01-15T10:30:00Z",
        status: "completed"
      },
      {
        id: "2",
        request_id: "DSAR-2024-001",
        event_type: "export_generated",
        details: { file_size: "2.3MB", format: "ZIP", sha256: "abc123..." },
        created_at: "2024-01-15T10:35:00Z",
        status: "completed"
      },
      {
        id: "3",
        request_id: "DSAR-2024-002",
        event_type: "dsar_received",
        details: { email: "user@test.com", source: "woocommerce" },
        created_at: "2024-01-14T15:20:00Z",
        status: "processing"
      },
      {
        id: "4",
        request_id: "DSAR-2024-003",
        event_type: "data_erased",
        details: { email: "deleted@example.com", records_deleted: 15 },
        created_at: "2024-01-13T09:45:00Z",
        status: "completed"
      }
    ];
    
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "dsar_received":
        return "DSAR Request Received";
      case "export_generated":
        return "Export Generated";
      case "data_erased":
        return "Data Erased";
      case "package_created":
        return "Package Created";
      default:
        return type;
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === "all") return true;
    return event.status === filter;
  });

  const downloadExport = (requestId: string) => {
    // Mock download - production'da JWT token ile presigned URL
    console.log(`Downloading export for ${requestId}`);
    window.open(`/api/downloads/${requestId}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Audit Log</h1>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "primary" : "outline"}
                onClick={() => setFilter("all")}
              >
                All Events
              </Button>
              <Button
                variant={filter === "completed" ? "primary" : "outline"}
                onClick={() => setFilter("completed")}
              >
                Completed
              </Button>
              <Button
                variant={filter === "processing" ? "primary" : "outline"}
                onClick={() => setFilter("processing")}
              >
                Processing
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Requests</p>
                  <p className="text-2xl font-bold text-slate-900">{events.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {events.filter(e => e.status === "completed").length}
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
                  <p className="text-2xl font-bold text-yellow-600">
                    {events.filter(e => e.status === "processing").length}
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
                  <p className="text-sm text-slate-600">This Month</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {events.filter(e => new Date(e.created_at).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Audit Log Table */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Request ID</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Event</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm text-slate-600">
                            {event.request_id}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {getEventTypeLabel(event.event_type)}
                            </p>
                            {event.details.email && (
                              <p className="text-sm text-slate-500">
                                {event.details.email}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(event.status)}
                            <span className="text-sm capitalize text-slate-600">
                              {event.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-500">
                            {new Date(event.created_at).toLocaleDateString()} {new Date(event.created_at).toLocaleTimeString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {event.event_type === "export_generated" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadExport(event.request_id)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {filteredEvents.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-slate-500">No events found</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuditLogPage;
