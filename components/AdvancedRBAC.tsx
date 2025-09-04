// components/AdvancedRBAC.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Users, 
  Settings, 
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Database,
  FileText,
  BarChart3,
  Globe,
  Key
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: number;
  isSystem: boolean;
  createdAt: string;
  lastModified: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  category: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  permissions: string[];
}

export default function AdvancedRBAC() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const samplePermissions: Permission[] = [
    // DSAR Permissions
    { id: '1', name: 'View DSAR Requests', description: 'View all DSAR requests', resource: 'dsar', action: 'read', category: 'DSAR' },
    { id: '2', name: 'Create DSAR Requests', description: 'Create new DSAR requests', resource: 'dsar', action: 'create', category: 'DSAR' },
    { id: '3', name: 'Update DSAR Status', description: 'Update DSAR request status', resource: 'dsar', action: 'update', category: 'DSAR' },
    { id: '4', name: 'Delete DSAR Requests', description: 'Delete DSAR requests', resource: 'dsar', action: 'delete', category: 'DSAR' },
    { id: '5', name: 'Export DSAR Data', description: 'Export DSAR data to various formats', resource: 'dsar', action: 'export', category: 'DSAR' },
    
    // Analytics Permissions
    { id: '6', name: 'View Analytics', description: 'View analytics and reports', resource: 'analytics', action: 'read', category: 'Analytics' },
    { id: '7', name: 'Create Reports', description: 'Create custom reports', resource: 'analytics', action: 'create', category: 'Analytics' },
    { id: '8', name: 'Export Analytics', description: 'Export analytics data', resource: 'analytics', action: 'export', category: 'Analytics' },
    
    // User Management Permissions
    { id: '9', name: 'View Users', description: 'View user list and details', resource: 'users', action: 'read', category: 'Users' },
    { id: '10', name: 'Create Users', description: 'Create new users', resource: 'users', action: 'create', category: 'Users' },
    { id: '11', name: 'Update Users', description: 'Update user information', resource: 'users', action: 'update', category: 'Users' },
    { id: '12', name: 'Delete Users', description: 'Delete users', resource: 'users', action: 'delete', category: 'Users' },
    
    // Role Management Permissions
    { id: '13', name: 'View Roles', description: 'View roles and permissions', resource: 'roles', action: 'read', category: 'Roles' },
    { id: '14', name: 'Create Roles', description: 'Create new roles', resource: 'roles', action: 'create', category: 'Roles' },
    { id: '15', name: 'Update Roles', description: 'Update role permissions', resource: 'roles', action: 'update', category: 'Roles' },
    { id: '16', name: 'Delete Roles', description: 'Delete roles', resource: 'roles', action: 'delete', category: 'Roles' },
    
    // System Permissions
    { id: '17', name: 'View System Settings', description: 'View system configuration', resource: 'system', action: 'read', category: 'System' },
    { id: '18', name: 'Update System Settings', description: 'Update system configuration', resource: 'system', action: 'update', category: 'System' },
    { id: '19', name: 'View Audit Logs', description: 'View system audit logs', resource: 'audit', action: 'read', category: 'System' },
    { id: '20', name: 'Manage Connectors', description: 'Manage data connectors', resource: 'connectors', action: 'manage', category: 'System' }
  ];

  const sampleRoles: Role[] = [
    {
      id: '1',
      name: 'Super Admin',
      description: 'Full system access with all permissions',
      permissions: samplePermissions.map(p => p.id),
      users: 2,
      isSystem: true,
      createdAt: '2024-01-01',
      lastModified: '2024-01-15'
    },
    {
      id: '2',
      name: 'DSAR Manager',
      description: 'Manage DSAR requests and compliance',
      permissions: ['1', '2', '3', '5', '6', '7', '8'],
      users: 5,
      isSystem: false,
      createdAt: '2024-01-05',
      lastModified: '2024-01-12'
    },
    {
      id: '3',
      name: 'Analyst',
      description: 'View analytics and create reports',
      permissions: ['6', '7', '8'],
      users: 8,
      isSystem: false,
      createdAt: '2024-01-08',
      lastModified: '2024-01-10'
    },
    {
      id: '4',
      name: 'User Manager',
      description: 'Manage users and basic roles',
      permissions: ['9', '10', '11', '13'],
      users: 3,
      isSystem: false,
      createdAt: '2024-01-10',
      lastModified: '2024-01-14'
    },
    {
      id: '5',
      name: 'Viewer',
      description: 'Read-only access to basic features',
      permissions: ['1', '6'],
      users: 12,
      isSystem: false,
      createdAt: '2024-01-12',
      lastModified: '2024-01-15'
    }
  ];

  const sampleUsers: User[] = [
    {
      id: '1',
      name: 'John Admin',
      email: 'john@company.com',
      roles: ['1'],
      status: 'active',
      lastLogin: '2024-01-15',
      permissions: samplePermissions.map(p => p.id)
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'sarah@company.com',
      roles: ['2'],
      status: 'active',
      lastLogin: '2024-01-15',
      permissions: ['1', '2', '3', '5', '6', '7', '8']
    },
    {
      id: '3',
      name: 'Mike Analyst',
      email: 'mike@company.com',
      roles: ['3'],
      status: 'active',
      lastLogin: '2024-01-14',
      permissions: ['6', '7', '8']
    },
    {
      id: '4',
      name: 'Lisa HR',
      email: 'lisa@company.com',
      roles: ['4'],
      status: 'active',
      lastLogin: '2024-01-13',
      permissions: ['9', '10', '11', '13']
    },
    {
      id: '5',
      name: 'Tom Viewer',
      email: 'tom@company.com',
      roles: ['5'],
      status: 'active',
      lastLogin: '2024-01-12',
      permissions: ['1', '6']
    }
  ];

  useEffect(() => {
    setRoles(sampleRoles);
    setUsers(sampleUsers);
  }, []);

  const getPermissionIcon = (category: string) => {
    switch (category) {
      case 'DSAR':
        return <FileText className="h-4 w-4" />;
      case 'Analytics':
        return <BarChart3 className="h-4 w-4" />;
      case 'Users':
        return <Users className="h-4 w-4" />;
      case 'Roles':
        return <Shield className="h-4 w-4" />;
      case 'System':
        return <Settings className="h-4 w-4" />;
      default:
        return <Key className="h-4 w-4" />;
    }
  };

  const getPermissionColor = (category: string) => {
    switch (category) {
      case 'DSAR':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Analytics':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Users':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Roles':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'System':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const createRole = () => {
    // Simulate role creation
    const newRole: Role = {
      id: Date.now().toString(),
      name: 'New Role',
      description: 'Custom role with specific permissions',
      permissions: [],
      users: 0,
      isSystem: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setRoles([...roles, newRole]);
  };

  const deleteRole = (roleId: string) => {
    if (confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-slate-900">Advanced RBAC</h1>
        </div>
        <p className="text-lg text-slate-600 mb-4">
          Granular role-based access control with fine-grained permissions
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
          <span>🔐 Granular permissions</span>
          <span>•</span>
          <span>👥 Role management</span>
          <span>•</span>
          <span>📊 Access analytics</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{roles.length}</div>
                <div className="text-sm text-slate-600">Total Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                <div className="text-sm text-slate-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Key className="h-8 w-8 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">{samplePermissions.length}</div>
                <div className="text-sm text-slate-600">Permissions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.status === 'active').length}
                </div>
                <div className="text-sm text-slate-600">Active Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>
                  Manage roles and their associated permissions
                </CardDescription>
              </div>
              <Button onClick={createRole}>
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900">{role.name}</h3>
                        {role.isSystem && (
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            System
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 text-sm">{role.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500">{role.users} users</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!role.isSystem && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteRole(role.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {role.permissions.slice(0, 8).map((permissionId) => {
                      const permission = samplePermissions.find(p => p.id === permissionId);
                      if (!permission) return null;
                      
                      return (
                        <Badge
                          key={permissionId}
                          className={`${getPermissionColor(permission.category)} text-xs`}
                        >
                          <div className="flex items-center gap-1">
                            {getPermissionIcon(permission.category)}
                            {permission.name}
                          </div>
                        </Badge>
                      );
                    })}
                    {role.permissions.length > 8 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Grid */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Available Permissions
            </CardTitle>
            <CardDescription>
              All available permissions organized by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['DSAR', 'Analytics', 'Users', 'Roles', 'System'].map((category) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                    {getPermissionIcon(category)}
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {samplePermissions
                      .filter(p => p.category === category)
                      .map((permission) => (
                        <div
                          key={permission.id}
                          className="p-3 border rounded-lg text-sm"
                        >
                          <div className="font-medium text-slate-900">
                            {permission.name}
                          </div>
                          <div className="text-slate-600 text-xs mt-1">
                            {permission.description}
                          </div>
                          <div className="text-slate-500 text-xs mt-1">
                            {permission.resource}:{permission.action}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users with Roles */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users & Their Roles
            </CardTitle>
            <CardDescription>
              View users and their assigned roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{user.name}</h3>
                      <p className="text-slate-600 text-sm">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-red-100 text-red-800 border-red-200'
                      }>
                        {user.status}
                      </Badge>
                      <span className="text-sm text-slate-500">
                        Last login: {new Date(user.lastLogin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((roleId) => {
                      const role = roles.find(r => r.id === roleId);
                      return role ? (
                        <Badge key={roleId} className="bg-blue-100 text-blue-800 border-blue-200">
                          {role.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Access Analytics
          </CardTitle>
          <CardDescription>
            Monitor permission usage and access patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-sm text-slate-600">Permission Utilization</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">12</div>
              <div className="text-sm text-slate-600">Active Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">3.2</div>
              <div className="text-sm text-slate-600">Avg Roles per User</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
