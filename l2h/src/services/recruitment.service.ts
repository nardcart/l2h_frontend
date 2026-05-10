import { API_BASE_URL, ApiError } from '@/config/api';
import { logout } from '@/hooks/useAuth';
import type {
  ApplicationUpdatePayload,
  JobApplication,
  JobOpening,
  JobPayload,
  RecruitmentDashboard,
  RecruitmentListResponse,
  RecruitmentPortal,
  PortalPayload,
} from '@/types/recruitment';

interface ApiEnvelope<T> {
  status: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

const buildQuery = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const getHeaders = (requiresAuth: boolean, body?: BodyInit | null): HeadersInit => {
  const headers: HeadersInit = {};
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const request = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiEnvelope<T>> => {
  const { requiresAuth = true, headers, body, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      ...getHeaders(requiresAuth, body),
      ...headers,
    },
    body,
  });

  let payload: ApiEnvelope<T>;

  try {
    payload = await response.json();
  } catch (_error) {
    throw new ApiError('Failed to parse server response', response.status);
  }

  if (response.status === 401) {
    logout();
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }

  if (!response.ok || !payload.status) {
    throw new ApiError(
      payload.message || payload.error || 'Something went wrong',
      response.status,
      payload
    );
  }

  return payload;
};

export const recruitmentService = {
  async listPortals(): Promise<RecruitmentPortal[]> {
    const response = await request<RecruitmentPortal[]>(
      '/recruitment/admin/portals',
      { method: 'GET' }
    );
    return response.data ?? [];
  },

  async createPortal(payload: PortalPayload): Promise<RecruitmentPortal> {
    const response = await request<RecruitmentPortal>(
      '/recruitment/admin/portals',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    return response.data as RecruitmentPortal;
  },

  async updatePortal(id: string, payload: Partial<PortalPayload>): Promise<RecruitmentPortal> {
    const response = await request<RecruitmentPortal>(
      `/recruitment/admin/portals/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(payload),
      }
    );
    return response.data as RecruitmentPortal;
  },

  async regeneratePortalToken(id: string): Promise<RecruitmentPortal> {
    const response = await request<RecruitmentPortal>(
      `/recruitment/admin/portals/${id}/regenerate-token`,
      {
        method: 'POST',
      }
    );
    return response.data as RecruitmentPortal;
  },

  async getDashboard(portalId?: string): Promise<RecruitmentDashboard> {
    const response = await request<RecruitmentDashboard>(
      `/recruitment/admin/dashboard${buildQuery({ portalId })}`,
      { method: 'GET' }
    );
    return response.data as RecruitmentDashboard;
  },

  async listJobs(params: {
    portalId?: string;
    status?: string;
    department?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<RecruitmentListResponse<JobOpening>> {
    const response = await request<JobOpening[]>(
      `/recruitment/admin/jobs${buildQuery(params)}`,
      { method: 'GET' }
    );

    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  async createJob(payload: JobPayload): Promise<JobOpening> {
    const response = await request<JobOpening>('/recruitment/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data as JobOpening;
  },

  async updateJob(id: string, payload: Partial<JobPayload>): Promise<JobOpening> {
    const response = await request<JobOpening>(`/recruitment/admin/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return response.data as JobOpening;
  },

  async deleteJob(id: string): Promise<void> {
    await request(`/recruitment/admin/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  async listApplications(params: {
    portalId?: string;
    jobId?: string;
    stage?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<RecruitmentListResponse<JobApplication>> {
    const response = await request<JobApplication[]>(
      `/recruitment/admin/applications${buildQuery(params)}`,
      { method: 'GET' }
    );

    return {
      data: response.data ?? [],
      pagination: response.pagination,
    };
  },

  async updateApplication(
    id: string,
    payload: ApplicationUpdatePayload
  ): Promise<JobApplication> {
    const response = await request<JobApplication>(
      `/recruitment/admin/applications/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }
    );
    return response.data as JobApplication;
  },
};
