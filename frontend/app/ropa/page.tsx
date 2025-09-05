'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Database, Users, Shield, Globe, Clock, CheckCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface ROPA {
  id: number;
  activity_name: string;
  purpose: string;
  description?: string;
  legal_basis: string;
  data_subjects: string;
  data_categories?: string[];
  recipients?: string[];
  third_countries?: string[];
  retention_period?: string;
  security_measures?: string[];
  status: 'active' | 'inactive' | 'under_review';
  last_reviewed?: string;
  next_review?: string;
  data_controller?: string;
  created_at: string;
  updated_at: string;
}

interface ROPACreate {
  activity_name: string;
  purpose: string;
  description?: string;
  legal_basis: string;
  data_subjects: string;
  data_categories?: string[];
  retention_period?: string;
  security_measures?: string[];
}

const legalBasisOptions = [
  { value: 'consent', label: 'Consent' },
  { value: 'contract', label: 'Contract' },
  { value: 'legal_obligation', label: 'Legal Obligation' },
  { value: 'vital_interests', label: 'Vital Interests' },
  { value: 'public_task', label: 'Public Task' },
  { value: 'legitimate_interests', label: 'Legitimate Interests' },
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  under_review: 'bg-yellow-100 text-yellow-800',
};

export default function ROPAPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch ROPAs
  const { data: ropas, isLoading } = useQuery({
    queryKey: ['ropas', selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await apiClient.get(`/ropas?${params.toString()}`);
      return response.data.ropas || [];
    },
  });

  // Create ROPA mutation
  const createROPAMutation = useMutation({
    mutationFn: async (ropaData: ROPACreate) => {
      const response = await apiClient.post('/ropas', ropaData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ropas'] });
      setShowCreateModal(false);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Record of Processing Activities (ROPA)</h1>
          <p className="text-gray-600">Maintain an inventory of all data processing activities in your organization</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Activity
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ropas?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ropas?.filter((r: ROPA) => r.status === 'active').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Under Review</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ropas?.filter((r: ROPA) => r.status === 'under_review').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Cross-Border</p>
              <p className="text-2xl font-semibold text-gray-900">
                {ropas?.filter((r: ROPA) => r.third_countries && r.third_countries.length > 0).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          <div className="min-w-32">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="under_review">Under Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* ROPA List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Processing Activities ({ropas?.length || 0})
          </h2>
        </div>
        
        {ropas?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Database className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No processing activities found</p>
            <p className="text-sm">Create your first processing activity record to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Legal Basis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Review
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ropas?.map((ropa: ROPA) => (
                  <tr key={ropa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{ropa.activity_name}</div>
                        {ropa.description && (
                          <div className="text-sm text-gray-500">{ropa.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ropa.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {legalBasisOptions.find(option => option.value === ropa.legal_basis)?.label || ropa.legal_basis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {ropa.data_subjects}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[ropa.status]}`}>
                        {ropa.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ropa.last_reviewed 
                        ? new Date(ropa.last_reviewed).toLocaleDateString()
                        : 'Not reviewed'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          Edit
                        </button>
                        <button className="text-green-600 hover:text-green-800 font-medium">
                          Export
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create ROPA Modal */}
      {showCreateModal && (
        <CreateROPAModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createROPAMutation.mutate}
          isLoading={createROPAMutation.isPending}
        />
      )}
    </div>
  );
}

// Create ROPA Modal Component
function CreateROPAModal({ 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  onClose: () => void;
  onSubmit: (data: ROPACreate) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<ROPACreate>({
    activity_name: '',
    purpose: '',
    description: '',
    legal_basis: '',
    data_subjects: '',
    data_categories: [],
    retention_period: '',
    security_measures: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Processing Activity</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Name
            </label>
            <input
              type="text"
              value={formData.activity_name}
              onChange={(e) => setFormData({ ...formData, activity_name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Legal Basis
              </label>
              <select
                value={formData.legal_basis}
                onChange={(e) => setFormData({ ...formData, legal_basis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select legal basis</option>
                {legalBasisOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Subjects
              </label>
              <input
                type="text"
                value={formData.data_subjects}
                onChange={(e) => setFormData({ ...formData, data_subjects: e.target.value })}
                placeholder="e.g., Customers, Employees"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retention Period (Optional)
            </label>
            <input
              type="text"
              value={formData.retention_period}
              onChange={(e) => setFormData({ ...formData, retention_period: e.target.value })}
              placeholder="e.g., 7 years, Until account closure"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
