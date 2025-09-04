// components/MultiTenancy.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  Settings, 
  Shield,
  Database,
  Globe,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Eye,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'suspended' | 'pending';
  plan: 'free' | 'pro' | 'enterprise';
  users: number;
  maxUsers: number;
  storage: number; // GB
  maxStorage: number;
  createdAt: string;
  lastActive: string;
  complianceScore: number;
  dataSources: number;
  dsarRequests: number;
  customBranding: boolean;
  ssoEnabled: boolean;
  auditLogging: boolean;
}

export default function MultiTenancy() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const sampleTenants: Tenant[] = [
    {
      id: '1',
      name: 'Acme Corporation',
      domain: 'acme.rightly.com',
      status: 'active',
      plan: 'enterprise',
      users: 45,
      maxUsers: 100,
      storage: 2.3,
      maxStorage: 10,
      createdAt: '2024-01-01',
      lastActive: '2024-01-15',
      complianceScore: 94,
      dataSources: 8,
      dsarRequests: 23,
      customBranding: true,
      ssoEnabled: true,
      auditLogging: true
    },
    {
      id: '2',
      name: 'TechStart Inc',
      domain: 'techstart.rightly.com',
      status: 'active',
      plan: 'pro',
      users: 12,
      maxUsers: 25,
      storage: 0.8,
      maxStorage: 5,
      createdAt: '2024-01-05',
      lastActive: '2024-01-15',
      complianceScore: 87,
      dataSources: 3,
      dsarRequests: 7,
      customBranding: false,
      ssoEnabled: false,
      auditLogging: true
    },
    {
      id: '3',
      name: 'Global Retail',
      domain: 'globalretail.rightly.com',
      status: 'suspended',
      plan: 'enterprise',
      users: 78,
      maxUsers: 200,
      storage: 5.2,
      maxStorage: 20,
      createdAt: '2023-12-15',
      lastActive: '2024-01-10',
      complianceScore: 72,
      dataSources: 15,
      dsarRequests: 45,
      customBranding: true,
      ssoEnabled: true,
      auditLogging: true
    },
    {
      id: '4',
      name: 'Healthcare Plus',
      domain: 'healthcare.rightly.com',
      status: 'active',
      plan: 'enterprise',
      users: 34,
      maxUsers: 50,
      storage: 1.5,
      maxStorage: 10,
      createdAt: '2024-01-08',
      lastActive: '2024-01-15',
      complianceScore: 98,
      dataSources: 6,
      dsarRequests: 12,
      customBranding: true,
      ssoEnabled: true,
      auditLogging: true
    },
    {
      id: '5',
      name: 'EduTech Solutions',
      domain: 'edutech.rightly.com',
      status: 'pending',
      plan: 'free',
      users: 3,
      maxUsers: 5,
      storage: 0.1,
      maxStorage: 1,
      createdAt: '2024-01-14',
      lastActive: '2024-01-14',
      complianceScore: 65,
      dataSources: 1,
      dsarRequests: 0,
      customBranding: false,
      ssoEnabled: false,
      auditLogging: false
    }
  ];

  useEffect(() => {
    setTenants(sampleTenants);
  }, []);

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'pro':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const suspendTenant = (tenantId: string) => {
    setTenants(tenants.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: 'suspended' as const }
        : tenant
    ));
  };

  const activateTenant = (tenantId: string) => {
    setTenants(tenants.map(tenant => 
      tenant.id === tenantId 
        ? { ...tenant, status: 'active' as const }
        : tenant
    ));
  };

  const deleteTenant = (tenantId: string) => {
    if (confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      setTenants(tenants.filter(tenant => tenant.id !== tenantId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-slate-900">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Multi-Tenancy Management</h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
          Manage multiple tenants with isolated data and configurations
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>🏢 Tenant isolation</span>
          <span>•</span>
          <span>🔒 Data security</span>
          <span>•</span>
          <span>📊 Usage monitoring</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{tenants.length}</div>
                <div className="text-sm text-slate-600">Total Tenants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {tenants.reduce((sum, tenant) => sum + tenant.users, 0)}
                </div>
                <div className="text-sm text-slate-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {tenants.filter(t => t.status === 'active').length}
                </div>
                <div className="text-sm text-slate-600">Active Tenants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {(tenants.reduce((sum, tenant) => sum + tenant.complianceScore, 0) / tenants.length).toFixed(0)}%
                </div>
                <div className="text-sm text-slate-600">Avg Compliance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tenants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              aria-label="Search tenants"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={statusFilter === 'all' ? "default" : "outline"}
              onClick={() => setStatusFilter('all')}
              size="sm"
              aria-label="Show all status"
            >
              All Status
            </Button>
            <Button
              variant={statusFilter === 'active' ? "default" : "outline"}
              onClick={() => setStatusFilter('active')}
              size="sm"
              aria-label="Show active tenants"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Active
            </Button>
            <Button
              variant={statusFilter === 'suspended' ? "default" : "outline"}
              onClick={() => setStatusFilter('suspended')}
              size="sm"
              aria-label="Show suspended tenants"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Suspended
            </Button>
            <Button
              variant={statusFilter === 'pending' ? "default" : "outline"}
              onClick={() => setStatusFilter('pending')}
              size="sm"
              aria-label="Show pending tenants"
            >
              <Activity className="h-4 w-4 mr-2" />
              Pending
            </Button>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTenants.map((tenant) => (
          <Card key={tenant.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <CardDescription className="mt-2">
                    {tenant.domain}
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getStatusColor(tenant.status)}>
                    {tenant.status}
                  </Badge>
                  <Badge className={getPlanColor(tenant.plan)}>
                    {tenant.plan}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Usage Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-slate-600">Users</div>
                    <div className="font-semibold">
                      {tenant.users} / {tenant.maxUsers}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Storage</div>
                    <div className="font-semibold">
                      {tenant.storage}GB / {tenant.maxStorage}GB
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-600">Data Sources</div>
                    <div className="font-semibold">{tenant.dataSources}</div>
                  </div>
                  <div>
                    <div className="text-slate-600">DSAR Requests</div>
                    <div className="font-semibold">{tenant.dsarRequests}</div>
                  </div>
                </div>

                {/* Compliance Score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Compliance Score</span>
                  <span className={`font-semibold ${getComplianceColor(tenant.complianceScore)}`}>
                    {tenant.complianceScore}%
                  </span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-4 text-sm">
                  {tenant.customBranding && (
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3 text-blue-600" />
                      <span>Branding</span>
                    </div>
                  )}
                  {tenant.ssoEnabled && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span>SSO</span>
                    </div>
                  )}
                  {tenant.auditLogging && (
                    <div className="flex items-center gap-1">
                      <Database className="h-3 w-3 text-purple-600" />
                      <span>Audit</span>
                    </div>
                  )}
                </div>

                {/* Last Active */}
                <div className="text-sm text-slate-500">
                  Last active: {new Date(tenant.lastActive).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {tenant.status === 'active' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => suspendTenant(tenant.id)}
                    >
                      <Lock className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => activateTenant(tenant.id)}
                    >
                      <Unlock className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteTenant(tenant.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tenants found</h3>
              <p className="text-slate-600 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => { 
                setSearchQuery(''); 
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Tenant */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Tenant
          </CardTitle>
          <CardDescription>
            Set up a new tenant with isolated data and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Tenant Name</label>
              <Input placeholder="Enter tenant name" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Domain</label>
              <Input placeholder="tenant.rightly.com" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">Plan</label>
              <select className="w-full p-2 border rounded-md">
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Tenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
