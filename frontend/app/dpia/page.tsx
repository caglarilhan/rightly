'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, FileText, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface DPIA {
  id: number;
  title: string;
  description: string;
  processing_activity: string;
  risk_level: 'low' | 'medium' | 'high';
  risk_score?: number;
  status: 'draft' | 'review' | 'approved' | 'rejected';
  due_date?: string;
  completed_at?: string;
  data_categories?: string[];
  legal_basis?: string;
  dpo_consulted: boolean;
  created_at: string;
  updated_at: string;
}

interface DPIACreate {
  title: string;
  description: string;
  processing_activity: string;
  risk_level: 'low' | 'medium' | 'high';
  legal_basis?: string;
  data_categories?: string[];
  due_date?: string;
}

const riskColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusIcons = {
  draft: FileText,
  review: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

const statusColors = {
  draft: 'bg-gray-100 text-gray-800',
  review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function DPIAPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch DPIAs
  const { data: dpias, isLoading } = useQuery({
    queryKey: ['dpias'],
    queryFn: async () => {
      const response = await apiClient.get('/dpias');
      return response.data.dpias || [];
    },
  });

  // Create DPIA mutation
  const createDPIAMutation = useMutation({
    mutationFn: async (dpiaData: DPIACreate) => {
      const response = await apiClient.post('/dpias', dpiaData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dpias'] });
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
          <h1 className="text-2xl font-bold text-gray-900">Data Protection Impact Assessments</h1>
          <p className="text-gray-600">Assess and manage privacy risks for high-risk processing activities</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New DPIA
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total DPIAs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dpias?.length || 0}
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
                {dpias?.filter((d: DPIA) => d.status === 'review').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">High Risk</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dpias?.filter((d: DPIA) => d.risk_level === 'high').length || 0}
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
              <p className="text-sm font-medium text-gray-500">Approved</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dpias?.filter((d: DPIA) => d.status === 'approved').length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DPIAs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Impact Assessments</h2>
        </div>
        
        {dpias?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No DPIAs found</p>
            <p className="text-sm">Create your first Data Protection Impact Assessment to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {dpias?.map((dpia: DPIA) => {
              const StatusIcon = statusIcons[dpia.status];
              
              return (
                <div key={dpia.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{dpia.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${riskColors[dpia.risk_level]}`}>
                          {dpia.risk_level} risk
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                          <StatusIcon className="h-4 w-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[dpia.status]}`}>
                            {dpia.status}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-2">{dpia.description}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        <strong>Processing Activity:</strong> {dpia.processing_activity}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Created: {new Date(dpia.created_at).toLocaleDateString()}</span>
                        {dpia.due_date && (
                          <span>Due: {new Date(dpia.due_date).toLocaleDateString()}</span>
                        )}
                        {dpia.risk_score && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>Risk Score: {dpia.risk_score}/100</span>
                          </div>
                        )}
                        <span className={`px-2 py-1 rounded text-xs ${dpia.dpo_consulted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {dpia.dpo_consulted ? 'DPO Consulted' : 'DPO Not Consulted'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create DPIA Modal */}
      {showCreateModal && (
        <CreateDPIAModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createDPIAMutation.mutate}
          isLoading={createDPIAMutation.isPending}
        />
      )}
    </div>
  );
}

// Create DPIA Modal Component
function CreateDPIAModal({ 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  onClose: () => void;
  onSubmit: (data: DPIACreate) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<DPIACreate>({
    title: '',
    description: '',
    processing_activity: '',
    risk_level: 'medium',
    legal_basis: '',
    data_categories: [],
    due_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New DPIA</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Processing Activity
            </label>
            <input
              type="text"
              value={formData.processing_activity}
              onChange={(e) => setFormData({ ...formData, processing_activity: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Risk Level
              </label>
              <select
                value={formData.risk_level}
                onChange={(e) => setFormData({ ...formData, risk_level: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Legal Basis
            </label>
            <select
              value={formData.legal_basis}
              onChange={(e) => setFormData({ ...formData, legal_basis: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select legal basis</option>
              <option value="consent">Consent</option>
              <option value="contract">Contract</option>
              <option value="legal_obligation">Legal Obligation</option>
              <option value="vital_interests">Vital Interests</option>
              <option value="public_task">Public Task</option>
              <option value="legitimate_interests">Legitimate Interests</option>
            </select>
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
              {isLoading ? 'Creating...' : 'Create DPIA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
