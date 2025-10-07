import axios from 'axios';
import type {
  Ebook,
  EbookDownloadRequest,
  DownloadResponse,
  EbookUser,
  DashboardStats,
  EmailCountData,
  PaginatedResponse,
  ApiResponse,
  BulkSendRequest,
  BulkSendResponse,
  SingleSendRequest,
} from '@/types/ebook';
import { API_BASE_URL as CONFIG_API_BASE_URL } from '@/config/api';

// Remove /api suffix if present in the base URL
const API_BASE_URL = CONFIG_API_BASE_URL?.replace('/api', '') || CONFIG_API_BASE_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/ebooks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const adminApiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/admin/ebooks`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to admin requests
adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ebookApi = {
  // ==================== PUBLIC ROUTES ====================
  
  /**
   * Get all active ebooks
   */
  getEbooks: async (filters?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }): Promise<PaginatedResponse<Ebook>> => {
    const response = await apiClient.get('/', { params: filters });
    return response.data;
  },

  /**
   * Get single ebook by ID or slug
   */
  getEbook: async (id: string): Promise<ApiResponse<Ebook>> => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  /**
   * Get popular ebooks
   */
  getPopularEbooks: async (limit = 6): Promise<ApiResponse<Ebook[]>> => {
    const response = await apiClient.get('/popular', { params: { limit } });
    return response.data;
  },

  /**
   * Download ebook (Direct - No OTP)
   */
  downloadEbook: async (data: EbookDownloadRequest): Promise<DownloadResponse> => {
    const response = await apiClient.post('/download', data);
    return response.data;
  },

  // ==================== ADMIN ROUTES ====================
  
  /**
   * Get all ebooks (admin - includes inactive)
   */
  getAllEbooksAdmin: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: number;
  }): Promise<PaginatedResponse<Ebook>> => {
    const response = await adminApiClient.get('/ebooks', { params });
    return response.data;
  },

  /**
   * Create new ebook
   */
  createEbook: async (data: Partial<Ebook>): Promise<ApiResponse<Ebook>> => {
    const response = await adminApiClient.post('/ebooks', data);
    return response.data;
  },

  /**
   * Update ebook
   */
  updateEbook: async (id: string, data: Partial<Ebook>): Promise<ApiResponse<Ebook>> => {
    const response = await adminApiClient.put(`/ebooks/${id}`, data);
    return response.data;
  },

  /**
   * Delete ebook
   */
  deleteEbook: async (id: string): Promise<ApiResponse<null>> => {
    const response = await adminApiClient.delete(`/ebooks/${id}`);
    return response.data;
  },

  /**
   * Get download dashboard statistics
   */
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await adminApiClient.get('/downloads/dashboard');
    return response.data;
  },

  /**
   * Get all downloads with filters
   */
  getAllDownloads: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    ebookId?: string;
    type?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<PaginatedResponse<EbookUser>> => {
    const response = await adminApiClient.get('/downloads', { params });
    return response.data;
  },

  /**
   * Get email count for specific ebook
   */
  getEbookEmailCount: async (id: string): Promise<ApiResponse<EmailCountData>> => {
    const response = await adminApiClient.get(`/ebooks/${id}/email-count`);
    return response.data;
  },

  /**
   * Send ebook to single email (admin)
   */
  sendEbookToEmail: async (data: SingleSendRequest): Promise<ApiResponse<{ email: string; ebookName: string }>> => {
    const response = await adminApiClient.post('/send-ebook', data);
    return response.data;
  },

  /**
   * Send ebook to multiple emails (bulk - admin)
   */
  bulkSendEbook: async (data: BulkSendRequest): Promise<BulkSendResponse> => {
    const response = await adminApiClient.post('/bulk-send-ebook', data);
    return response.data;
  },

  /**
   * Export downloads to CSV
   */
  exportDownloadsCSV: async (params?: {
    ebookId?: string;
    type?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<Blob> => {
    const response = await adminApiClient.get('/downloads/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },
};

export default ebookApi;


