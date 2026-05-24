import { API_BASE_URL, API_ENDPOINTS, type ApiResponse } from '@/config/api';
import { apiService } from '@/services/api.service';
import type {
  CandidateApprovalStatus,
  CandidateLoginPayload,
  CandidateLoginResponse,
  CandidateRecord,
  CandidateRegistrationPayload,
  CandidateRegistrationResponse,
  CandidateUpdatePayload,
  CandidateUploadResult,
} from '@/types/candidate';

export const candidateService = {
  register: async (
    payload: CandidateRegistrationPayload
  ): Promise<CandidateRegistrationResponse> => {
    return apiService.post<CandidateRegistrationResponse>(
      API_ENDPOINTS.CANDIDATE_REGISTER,
      payload
    );
  },

  create: async (
    payload: CandidateRegistrationPayload
  ): Promise<CandidateRecord> => {
    const response = await apiService.post<CandidateRegistrationResponse>(
      API_ENDPOINTS.CANDIDATE_REGISTER,
      payload
    );
    return response.candidate;
  },

  login: async (
    payload: CandidateLoginPayload
  ): Promise<CandidateLoginResponse> => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.CANDIDATE_LOGIN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: payload.email.trim().toLowerCase(),
          password: payload.password,
        }),
      }
    );

    const data = (await response.json()) as ApiResponse<CandidateLoginResponse>;

    if (!response.ok || !data.status || !data.data) {
      throw new Error(data.message || data.error || 'Candidate login failed');
    }

    return data.data;
  },

  listPublic: async (): Promise<CandidateRecord[]> => {
    return apiService.get<CandidateRecord[]>(API_ENDPOINTS.CANDIDATE_PUBLIC);
  },

  getProfile: async (): Promise<CandidateRecord> => {
    return apiService.get<CandidateRecord>(API_ENDPOINTS.CANDIDATE_PROFILE, true);
  },

  listAdmin: async (
    status?: CandidateApprovalStatus
  ): Promise<CandidateRecord[]> => {
    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.CANDIDATE_ADMIN}?${queryString}`
      : API_ENDPOINTS.CANDIDATE_ADMIN;

    return apiService.get<CandidateRecord[]>(endpoint, true);
  },

  getById: async (id: number): Promise<CandidateRecord> => {
    return apiService.get<CandidateRecord>(
      API_ENDPOINTS.CANDIDATE_ADMIN_BY_ID(id),
      true
    );
  },

  update: async (
    id: number,
    payload: CandidateUpdatePayload
  ): Promise<CandidateRecord> => {
    return apiService.put<CandidateRecord>(
      API_ENDPOINTS.CANDIDATE_ADMIN_BY_ID(id),
      payload,
      true
    );
  },

  updateStatus: async (
    id: number,
    status: CandidateApprovalStatus
  ): Promise<CandidateRecord> => {
    return apiService.patch<CandidateRecord>(
      API_ENDPOINTS.CANDIDATE_STATUS(id),
      { status },
      true
    );
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(
      API_ENDPOINTS.CANDIDATE_ADMIN_BY_ID(id),
      true
    );
  },

  uploadResume: async (file: File): Promise<CandidateUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.uploadFileSimple<CandidateUploadResult>(
      API_ENDPOINTS.CANDIDATE_UPLOAD_RESUME,
      formData,
      false
    );
  },

  uploadPhotograph: async (file: File): Promise<CandidateUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.uploadFileSimple<CandidateUploadResult>(
      API_ENDPOINTS.CANDIDATE_UPLOAD_PHOTOGRAPH,
      formData,
      false
    );
  },

  uploadVideo: async (file: File): Promise<CandidateUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiService.uploadFileSimple<CandidateUploadResult>(
      API_ENDPOINTS.CANDIDATE_UPLOAD_VIDEO,
      formData,
      false
    );
  },
};
