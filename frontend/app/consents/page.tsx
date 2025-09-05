'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Download, Plus, Mail, MessageSquare, Bell } from 'lucide-react';
import apiClient from '@/lib/api-client';

interface ConsentEvent {
  id: number;
  subject_id: string;
  channel: 'email' | 'sms' | 'push' | 'web' | 'phone';
  purpose: string;
  status: 'opt_in' | 'opt_out' | 'withdrawn';
  source?: string;
  occurred_at: string;
  ip_address?: string;
}

interface Preference {
  id: number;
  subject_id: string;
  email_opt_in: boolean;
  sms_opt_in: boolean;
  push_opt_in: boolean;
  phone_opt_in: boolean;
  marketing_email: boolean;
  marketing_sms: boolean;
  marketing_push: boolean;
  frequency_email: string;
  frequency_sms: string;
  updated_at: string;
}

const channelIcons = {
  email: Mail,
  sms: MessageSquare,
  push: Bell,
  web: Bell,
  phone: MessageSquare,
};

const statusColors = {
  opt_in: 'bg-green-100 text-green-800',
  opt_out: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-800',
};

export default function ConsentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch consent events
  const { data: consentEvents, isLoading } = useQuery({
    queryKey: ['consent-events', selectedChannel, selectedStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedChannel) params.append('channel', selectedChannel);
      if (selectedStatus) params.append('status', selectedStatus);
      
      const response = await apiClient.get(`/consents?${params.toString()}`);
      return response.data || [];
    },
  });

  // Export consent data
  const exportMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.get('/consents/export', {
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (data) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `consent-events-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });

  const filteredEvents = consentEvents?.filter((event: ConsentEvent) =>
    event.subject_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

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
          <h1 className="text-2xl font-bold text-gray-900">Consent Management</h1>
          <p className="text-gray-600">Track and manage user consent events</p>
        </div>
        <button
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          {exportMutation.isPending ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject ID or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Channel Filter */}
          <div className="min-w-32">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Channels</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
              <option value="web">Web</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-32">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="opt_in">Opt In</option>
              <option value="opt_out">Opt Out</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Consent Events List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Consent Events ({filteredEvents.length})
          </h2>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No consent events found</p>
            <p className="text-sm">Consent events will appear here when users interact with your forms</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Channel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.map((event: ConsentEvent) => {
                  const ChannelIcon = channelIcons[event.channel];
                  
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {event.subject_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <ChannelIcon className="h-4 w-4" />
                          {event.channel}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.purpose}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                          {event.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {event.source || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(event.occurred_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View History
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Email Opt-ins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {consentEvents?.filter((e: ConsentEvent) => e.channel === 'email' && e.status === 'opt_in').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Opt-outs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {consentEvents?.filter((e: ConsentEvent) => e.status === 'opt_out').length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900">
                {consentEvents?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
