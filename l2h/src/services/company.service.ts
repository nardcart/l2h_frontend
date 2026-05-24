import { API_BASE_URL, API_ENDPOINTS, type ApiResponse } from '@/config/api';
import { apiService } from '@/services/api.service';
import type {
  CompanyApprovalStatus,
  CompanyLoginPayload,
  CompanyLoginResponse,
  CompanyRecord,
  CompanyRegistrationPayload,
  CompanyRegistrationResponse,
  CompanyUpdatePayload,
  CompanyUploadResult,
} from '@/types/company';

export const companyService = {
  register: async (
    payload: CompanyRegistrationPayload
  ): Promise<CompanyRegistrationResponse> => {
    return apiService.post<CompanyRegistrationResponse>(
      API_ENDPOINTS.COMPANY_REGISTER,
      payload
    );
  },

  login: async (payload: CompanyLoginPayload): Promise<CompanyLoginResponse> => {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.COMPANY_LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    const data = (await response.json()) as ApiResponse<CompanyLoginResponse>;

    if (!response.ok || !data.status || !data.data) {
      throw new Error(data.message || data.error || 'Company login failed');
    }

    return data.data;
  },

  uploadLogo: async (file: File): Promise<CompanyUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiService.uploadFileSimple<CompanyUploadResult>(
      API_ENDPOINTS.COMPANY_UPLOAD_LOGO,
      formData,
      false
    );
  },

  listPublic: async (): Promise<CompanyRecord[]> => {
    return apiService.get<CompanyRecord[]>(API_ENDPOINTS.COMPANY_PUBLIC);
  },

  listAdmin: async (status?: CompanyApprovalStatus): Promise<CompanyRecord[]> => {
    const params = new URLSearchParams();

    if (status) {
      params.set('status', status);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.COMPANY_ADMIN}?${queryString}`
      : API_ENDPOINTS.COMPANY_ADMIN;

    return apiService.get<CompanyRecord[]>(endpoint, true);
  },

  update: async (
    id: number,
    payload: CompanyUpdatePayload
  ): Promise<CompanyRecord> => {
    return apiService.put<CompanyRecord>(
      API_ENDPOINTS.COMPANY_ADMIN_BY_ID(id),
      payload,
      true
    );
  },

  updateStatus: async (
    id: number,
    status: CompanyApprovalStatus
  ): Promise<CompanyRecord> => {
    return apiService.patch<CompanyRecord>(
      API_ENDPOINTS.COMPANY_STATUS(id),
      { status },
      true
    );
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(API_ENDPOINTS.COMPANY_ADMIN_BY_ID(id), true);
  },
};
