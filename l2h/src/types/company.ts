export type CompanyApprovalStatus = 'pending' | 'accepted' | 'denied';

export interface CompanyRecord {
  _id: string;
  id: number;
  unique_id: string;
  company_name: string;
  company_website?: string;
  established_year?: number;
  no_of_employees?: string;
  sector?: string;
  business_entity_type?: string;
  category?: string;
  organization_type?: string;
  company_logo_url?: string;
  company_logo_key?: string;
  contact_person_name: string;
  contact_person_title?: string;
  phone_number?: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  area?: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  email: string;
  status: CompanyApprovalStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRegistrationPayload {
  company_name: string;
  company_website?: string;
  established_year?: number | '';
  no_of_employees?: string;
  sector?: string;
  business_entity_type?: string;
  category?: string;
  organization_type?: string;
  company_logo_url?: string;
  company_logo_key?: string;
  contact_person_name: string;
  contact_person_title?: string;
  phone_number?: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  area?: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  email: string;
  password: string;
}

export interface CompanyRegistrationResponse {
  company: CompanyRecord;
  accessToken: string;
  refreshToken: string;
}

export interface CompanyLoginPayload {
  email: string;
  password: string;
}

export interface CompanyLoginResponse {
  company: CompanyRecord;
  accessToken: string;
  refreshToken: string;
}

export type CompanyUpdatePayload = Omit<CompanyRegistrationPayload, 'password'>;

export interface CompanyUploadResult {
  url: string;
  key: string;
  size: number;
  fileName?: string;
}

export const DEFAULT_COMPANY_FORM: CompanyRegistrationPayload = {
  company_name: '',
  company_website: '',
  established_year: '',
  no_of_employees: '',
  sector: '',
  business_entity_type: '',
  category: '',
  organization_type: '',
  company_logo_url: '',
  company_logo_key: '',
  contact_person_name: '',
  contact_person_title: '',
  phone_number: '',
  address_line_1: '',
  address_line_2: '',
  landmark: '',
  area: '',
  zip_code: '',
  city: '',
  state: '',
  country: 'India',
  email: '',
  password: '',
};
