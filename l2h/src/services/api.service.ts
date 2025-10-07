/**
 * API Service
 * Centralized service for making API requests
 */

import { API_BASE_URL, ApiResponse, ApiError } from '@/config/api';
import { logout } from '@/hooks/useAuth';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  timeout?: number;
}

class ApiService {
  private baseURL: string;
  private defaultTimeout: number = 30000; // 30 seconds

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication headers
   */
  private getHeaders(requiresAuth: boolean = false, excludeContentType: boolean = false): HeadersInit {
    const headers: HeadersInit = {};

    // Add Content-Type header unless explicitly excluded (for FormData)
    if (!excludeContentType) {
      headers['Content-Type'] = 'application/json';
    }

    // Add authorization header if required
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    let data: ApiResponse<T>;

    try {
      data = await response.json();
    } catch (error) {
      throw new ApiError('Failed to parse response', response.status);
    }

    // Handle token expiration
    if (response.status === 401) {
      // Clear authentication data and redirect to login
      logout();
      
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      
      throw new ApiError(data.message || 'Unauthorized', 401, data);
    }

    // Handle other errors
    if (!response.ok || !data.status) {
      throw new ApiError(
        data.message || data.error || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data.data as T;
  }

  /**
   * Make an API request
   */
  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { 
      requiresAuth = false, 
      timeout = this.defaultTimeout,
      headers: customHeaders,
      ...fetchOptions 
    } = options;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...fetchOptions,
        headers: {
          ...this.getHeaders(requiresAuth),
          ...customHeaders,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(error.message || 'Network error occurred');
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      requiresAuth,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      requiresAuth,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      requiresAuth,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body: any,
    requiresAuth: boolean = false
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
      requiresAuth,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, requiresAuth: boolean = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      requiresAuth,
    });
  }

  /**
   * Upload file using FormData
   */
  async uploadFile<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth: boolean = true,
    onProgress?: (progress: number) => void,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Handle progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }

      // Handle completion
      xhr.addEventListener('load', async () => {
        try {
          const response = new Response(xhr.response, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers(xhr.getAllResponseHeaders().split('\r\n').reduce((acc, line) => {
              const [key, value] = line.split(': ');
              if (key && value) acc[key] = value;
              return acc;
            }, {} as Record<string, string>)),
          });

          const data = await this.handleResponse<T>(response);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new ApiError('Network error occurred'));
      });

      xhr.addEventListener('abort', () => {
        reject(new ApiError('Upload cancelled'));
      });

      // Send request
      xhr.open(method, `${this.baseURL}${endpoint}`);

      // Add auth header if required
      if (requiresAuth) {
        const token = localStorage.getItem('token');
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
      }

      xhr.responseType = 'json';
      xhr.send(formData);
    });
  }

  /**
   * Upload file using multipart/form-data with fetch
   * Use this for simple uploads without progress tracking
   */
  async uploadFileSimple<T>(
    endpoint: string,
    formData: FormData,
    requiresAuth: boolean = true,
    method: 'POST' | 'PUT' | 'PATCH' = 'POST'
  ): Promise<T> {
    const headers: HeadersInit = {};

    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      body: formData,
    });

    return await this.handleResponse<T>(response);
  }
}

// Export singleton instance
export const apiService = new ApiService(API_BASE_URL);

// Export class for testing or multiple instances
export default ApiService;

