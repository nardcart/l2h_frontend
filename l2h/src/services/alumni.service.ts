import { API_ENDPOINTS } from '@/config/api';
import { apiService } from '@/services/api.service';
import type {
  AlumniCreatePayload,
  AlumniRecord,
  AlumniUpdatePayload,
} from '@/types/alumni';

export const alumniService = {
  listPublic: async (): Promise<AlumniRecord[]> => {
    return apiService.get<AlumniRecord[]>(API_ENDPOINTS.ALUMNI_PUBLIC);
  },

  listAdmin: async (status?: 'true' | 'false'): Promise<AlumniRecord[]> => {
    const params = new URLSearchParams();

    if (status) {
      params.set('status', status);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.ALUMNI_ADMIN}?${queryString}`
      : API_ENDPOINTS.ALUMNI_ADMIN;

    return apiService.get<AlumniRecord[]>(endpoint, true);
  },

  getById: async (id: number): Promise<AlumniRecord> => {
    return apiService.get<AlumniRecord>(API_ENDPOINTS.ALUMNI_BY_ID(id), true);
  },

  create: async (payload: AlumniCreatePayload): Promise<AlumniRecord> => {
    return apiService.post<AlumniRecord>(API_ENDPOINTS.ALUMNI_PUBLIC, payload);
  },

  update: async (
    id: number,
    payload: AlumniUpdatePayload
  ): Promise<AlumniRecord> => {
    return apiService.put<AlumniRecord>(API_ENDPOINTS.ALUMNI_BY_ID(id), payload, true);
  },

  updateStatus: async (id: number, status: boolean): Promise<AlumniRecord> => {
    return apiService.patch<AlumniRecord>(
      API_ENDPOINTS.ALUMNI_STATUS(id),
      { status },
      true
    );
  },

  delete: async (id: number): Promise<void> => {
    return apiService.delete<void>(API_ENDPOINTS.ALUMNI_BY_ID(id), true);
  },
};
