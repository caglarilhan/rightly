'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface Breach {
  id: number;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'investigating' | 'reported' | 'resolved' | 'closed';
  affected_count: number;
  detected_at: string;
  countdown_deadline: string;
  created_at: string;
}

interface BreachCreate {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  started_at: string;
  detected_at: string;
  affected_count: number;
  data_types?: string[];
}

const severityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const statusIcons = {
  detected: AlertTriangle,
  investigating: Clock,
  reported: CheckCircle,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function BreachesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch breaches
  const { data: breaches, isLoading } = useQuery({
    queryKey: ['breaches'],
    queryFn: async () => {
      const response = await apiClient.get('/breaches');
      return response.data.breaches || [];
    },
  });

  // Create breach mutation
  const createBreachMutation = useMutation({
    mutationFn: async (breachData: BreachCreate) => {
      const response = await apiClient.post('/breaches', breachData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaches'] });
      setShowCreateModal(false);
    },
  });

  const formatTimeRemaining = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Data Breaches</h1>
          <p className="text-gray-600">Manage and track data breach incidents</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Breach
        </button>
      </div>

      {/* Breaches List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Breaches</h2>
        </div>
        
        {breaches?.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No breaches found</p>
            <p className="text-sm">Create your first breach record to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {breaches?.map((breach: Breach) => {
              const StatusIcon = statusIcons[breach.status];
              const timeRemaining = formatTimeRemaining(breach.countdown_deadline);
              const isOverdue = timeRemaining === 'Overdue';
              
              return (
                <div key={breach.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{breach.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${severityColors[breach.severity]}`}>
                          {breach.severity}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <StatusIcon className="h-4 w-4" />
                          {breach.status}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{breach.description}</p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span>Affected: {breach.affected_count} individuals</span>
                        <span>Detected: {new Date(breach.detected_at).toLocaleDateString()}</span>
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-orange-600'}`}>
                          <Clock className="h-4 w-4" />
                          {isOverdue ? 'Overdue' : `${timeRemaining} remaining`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Report to Regulator
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Breach Modal */}
      {showCreateModal && (
        <CreateBreachModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={createBreachMutation.mutate}
          isLoading={createBreachMutation.isPending}
        />
      )}
    </div>
  );
}

// Create Breach Modal Component
function CreateBreachModal({ 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  onClose: () => void;
  onSubmit: (data: BreachCreate) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<BreachCreate>({
    title: '',
    description: '',
    severity: 'medium',
    started_at: new Date().toISOString(),
    detected_at: new Date().toISOString(),
    affected_count: 0,
    data_types: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Create New Breach</h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Affected Count
              </label>
              <input
                type="number"
                value={formData.affected_count}
                onChange={(e) => setFormData({ ...formData, affected_count: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
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
              {isLoading ? 'Creating...' : 'Create Breach'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
