/**
 * API Configuration
 * Centralized API endpoints and configuration
 */

// Get API base URL from environment variable or use default
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * API Endpoints
 * All API endpoints used in the application
 */
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Blogs
  BLOGS: '/blogs',
  BLOG_BY_ID: (id: string) => `/blogs/${id}`,
  BLOG_BY_SLUG: (slug: string) => `/blogs/slug/${slug}`,
  BLOG_RELATED: (id: string) => `/blogs/${id}/related`,
  
  // Categories
  CATEGORIES: '/categories',
  CATEGORY_BY_ID: (id: string) => `/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/categories/${slug}`,
  
  // Comments
  COMMENTS: '/comments',
  COMMENT_BY_ID: (id: string) => `/comments/${id}`,
  BLOG_COMMENTS: (blogId: string) => `/comments/blog/${blogId}`,
  
  // Upload
  UPLOAD_HEALTH: '/upload/health',
  UPLOAD_DIRECT: '/upload/direct',
  UPLOAD_IMAGE: '/upload/image',
  UPLOAD_VIDEO: '/upload/video',
  UPLOAD_MULTIPLE: '/upload/images',
  
  // Newsletter
  NEWSLETTER_SUBSCRIBE: '/newsletter/subscribe',
  NEWSLETTER_UNSUBSCRIBE: '/newsletter/unsubscribe',
  
  // File Manager
  FILES: '/files',
  FILES_INFO: '/files/info',
  FILES_BULK_DELETE: '/files/bulk-delete',
  
  // User Management (Admin)
  USERS: '/admin/users',
  USER_BY_ID: (id: string) => `/admin/users/${id}`,
  USER_STATS: '/admin/users/stats',
  USER_TOGGLE_STATUS: (id: string) => `/admin/users/${id}/toggle-status`,
  USER_PASSWORD: (id: string) => `/admin/users/${id}/password`,
  
  // Health
  HEALTH: '/health',
};

/**
 * HTTP Methods
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

/**
 * API Response Status
 */
export interface ApiResponse<T = any> {
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

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

