/**
 * API hooks for vNext features using TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './api-client';

// Types
export interface ExportBundle {
  id: number;
  organization_id: number;
  bundle_type: string;
  region: string;
  title: string;
  description?: string;
  status: string;
  file_path?: string;
  file_size?: number;
  download_token?: string;
  expires_at?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ComplianceStatus {
  region: string;
  status: string;
  score: number;
  last_updated: string;
  issues: string[];
  recommendations: string[];
}

export interface MultiRegionCompliance {
  regions: Array<{
    region: string;
    region_name: string;
    description: string;
    status: ComplianceStatus;
    requirements: Array<{
      code: string;
      name: string;
      required: boolean;
    }>;
    deadlines: Array<{
      type: string;
      deadline: string;
      description: string;
    }>;
  }>;
  overall_score: number;
  critical_issues: number;
  last_updated: string;
}

export interface Breach {
  id: number;
  organization_id: number;
  description: string;
  severity: string;
  status: string;
  affected_records?: number;
  discovered_at?: string;
  notified_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ConsentEvent {
  id: number;
  organization_id: number;
  subject_id: string;
  channel: string;
  purpose: string;
  status: string;
  source: string;
  ip_address?: string;
  user_agent?: string;
  occurred_at: string;
  created_at: string;
}

// Export Bundle Hooks
export const useExportBundles = () => {
  return useQuery({
    queryKey: ['export-bundles'],
    queryFn: async (): Promise<ExportBundle[]> => {
      const response = await apiClient.get('/exports/bundles');
      return response.data;
    },
  });
};

export const useCreateExportBundle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      bundle_type: string;
      region: string;
      title: string;
      description?: string;
    }): Promise<ExportBundle> => {
      const response = await apiClient.post('/exports/bundles', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-bundles'] });
    },
  });
};

export const useExportBundle = (id: number) => {
  return useQuery({
    queryKey: ['export-bundle', id],
    queryFn: async (): Promise<ExportBundle> => {
      const response = await apiClient.get(`/exports/bundles/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// Compliance Hooks
export const useComplianceStatus = () => {
  return useQuery({
    queryKey: ['compliance-status'],
    queryFn: async (): Promise<MultiRegionCompliance> => {
      const response = await apiClient.get('/compliance/status');
      return response.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

// Breach Hooks
export const useBreaches = () => {
  return useQuery({
    queryKey: ['breaches'],
    queryFn: async (): Promise<Breach[]> => {
      const response = await apiClient.get('/breaches');
      return response.data;
    },
  });
};

export const useCreateBreach = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      description: string;
      severity: string;
      affected_records?: number;
    }): Promise<Breach> => {
      const response = await apiClient.post('/breaches', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breaches'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    },
  });
};

// Consent Hooks
export const useConsentEvents = () => {
  return useQuery({
    queryKey: ['consent-events'],
    queryFn: async (): Promise<ConsentEvent[]> => {
      const response = await apiClient.get('/consents');
      return response.data;
    },
  });
};

export const useCreateConsentEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      subject_id: string;
      channel: string;
      purpose: string;
      status: string;
      source: string;
      ip_address?: string;
      user_agent?: string;
    }): Promise<ConsentEvent> => {
      const response = await apiClient.post('/consents', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consent-events'] });
      queryClient.invalidateQueries({ queryKey: ['compliance-status'] });
    },
  });
};

// Health Check Hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: async () => {
      const response = await apiClient.get('/healthz');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });
};
