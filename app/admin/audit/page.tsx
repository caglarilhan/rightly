// app/admin/audit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, Info, Clock, User, Activity } from "lucide-react";

interface AuditEvent {
  id: number;
  action: string;
  resource?: string;
  severity: string;
  actor_user_id: string;
  acting_as_user_id?: string;
  details: any;
  ip?: string;
  created_at: string;
}

export default function AuditPage() {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    severity: "all",
    resource: "all",
    actor: "all"
  });

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  const fetchAuditEvents = async () => {
    try {
      const response = await fetch("/api/admin/audit?page=1&limit=50", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch audit events");
      }
      
      const data = await response.json();
      setAuditEvents(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "WARN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "INFO":
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "HIGH":
        return <AlertTriangle className="h-3 w-3" />;
      case "WARN":
        return <AlertTriangle className="h-3 w-3" />;
      case "INFO":
      default:
        return <Info className="h-3 w-3" />;
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/\./g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredEvents = auditEvents.filter(event => {
    if (filters.severity !== "all" && event.severity !== filters.severity) return false;
    if (filters.resource !== "all" && event.resource !== filters.resource) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p>Error: {error}</p>
            <Button onClick={fetchAuditEvents} className="mt-4">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Audit Log</h1>
        <p className="text-slate-600 mt-2">
          Monitor all admin activities and security events
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditEvents.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 50 events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {auditEvents.filter(e => e.severity === "HIGH").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Critical events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impersonations</CardTitle>
            <User className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {auditEvents.filter(e => e.action.includes("impersonate")).length}
            </div>
            <p className="text-xs text-muted-foreground">
              "Sınırsız Mod" events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {auditEvents.filter(e => {
                const eventTime = new Date(e.created_at);
                const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
                return eventTime > oneHourAgo;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Last hour
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter audit events by severity, resource, and actor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div>
              <label className="text-sm font-medium">Severity</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters({...filters, severity: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="HIGH">High</option>
                <option value="WARN">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Resource</label>
              <select
                value={filters.resource}
                onChange={(e) => setFilters({...filters, resource: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Resources</option>
                <option value="users">Users</option>
                <option value="roles">Roles</option>
                <option value="flags">Feature Flags</option>
                <option value="audit">Audit</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Events</CardTitle>
          <CardDescription>
            Recent admin activities and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Event</th>
                  <th className="text-left py-3 px-4 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 font-medium">Actor</th>
                  <th className="text-left py-3 px-4 font-medium">Resource</th>
                  <th className="text-left py-3 px-4 font-medium">IP</th>
                  <th className="text-left py-3 px-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{formatAction(event.action)}</div>
                        <div className="text-sm text-slate-500">
                          {event.details?.path && `Path: ${event.details.path}`}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getSeverityColor(event.severity)}>
                        <div className="flex items-center gap-1">
                          {getSeverityIcon(event.severity)}
                          {event.severity}
                        </div>
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{event.actor_user_id}</div>
                        {event.acting_as_user_id && event.acting_as_user_id !== event.actor_user_id && (
                          <div className="text-sm text-purple-600">
                            → Acting as: {event.acting_as_user_id}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline">
                        {event.resource || "N/A"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500">
                      {event.ip || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No audit events found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
