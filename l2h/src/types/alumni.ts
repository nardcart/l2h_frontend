export interface AlumniRecord {
  _id: string;
  id: number;
  full_name: string;
  email: string;
  mobile?: string;
  unique_id: string;
  program_name: string;
  profession?: string;
  skills?: string;
  profile_image_url?: string;
  certificate_url?: string;
  storage_folder?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniCreatePayload {
  full_name: string;
  email: string;
  mobile?: string;
  program_name: string;
  profession?: string;
  skills?: string;
  profile_image_url?: string;
  certificate_url?: string;
  storage_folder?: string;
}

export interface AlumniUpdatePayload extends AlumniCreatePayload {}

export const DEFAULT_ALUMNI_FORM: AlumniCreatePayload = {
  full_name: '',
  email: '',
  mobile: '',
  program_name: '',
  profession: '',
  skills: '',
  profile_image_url: '',
  certificate_url: '',
  storage_folder: '',
};
