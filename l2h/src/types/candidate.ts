export type CandidateApprovalStatus = 'pending' | 'accepted' | 'denied';

export type WorkMode = 'remote' | 'onsite' | 'hybrid';

export type ExperienceLevel = 'fresher' | 'experienced';

export type Qualification =
  | 'high_school'
  | 'diploma'
  | 'bachelors'
  | 'masters'
  | 'phd'
  | 'other';

export const QUALIFICATION_LABELS: Record<Qualification, string> = {
  high_school: 'High School (10+2)',
  diploma: 'Diploma',
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: 'Ph.D.',
  other: 'Other',
};

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remote',
  onsite: 'On-site',
  hybrid: 'Hybrid',
};

export const EXPERIENCE_LEVEL_LABELS: Record<ExperienceLevel, string> = {
  fresher: 'Fresher',
  experienced: 'Experienced',
};

export interface WorkExperience {
  company_name: string;
  position: string;
  description?: string;
  duration?: string;
  is_current: boolean;
}

export const DEFAULT_WORK_EXPERIENCE: WorkExperience = {
  company_name: '',
  position: '',
  description: '',
  duration: '',
  is_current: false,
};

export interface CandidateRecord {
  _id: string;
  id: number;
  unique_id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  state: string;
  linkedin_url?: string;
  portfolio_url?: string;
  photograph_url?: string;
  photograph_key?: string;
  college_name: string;
  highest_qualification: Qualification;
  current_course?: string;
  preferred_job_role: string;
  preferred_work_mode: WorkMode;
  preferred_job_location: string;
  expected_salary: number;
  available_joining_date: string;
  additional_skills?: string;
  resume_url?: string;
  resume_key?: string;
  experience_level: ExperienceLevel;
  previous_company_name?: string;
  company_position?: string;
  description?: string;
  work_experiences: WorkExperience[];
  internship_experience?: string;
  total_work_experience?: number;
  key_responsibilities?: string;
  career_goals?: string;
  video_introduction_url?: string;
  video_introduction_key?: string;
  terms_accepted: boolean;
  status: CandidateApprovalStatus;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateRegistrationPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  city: string;
  state: string;
  linkedin_url?: string;
  portfolio_url?: string;
  photograph_url?: string;
  photograph_key?: string;
  college_name: string;
  highest_qualification: Qualification;
  current_course?: string;
  preferred_job_role: string;
  preferred_work_mode: WorkMode;
  preferred_job_location: string;
  expected_salary: number | '';
  available_joining_date: string;
  additional_skills?: string;
  resume_url?: string;
  resume_key?: string;
  experience_level: ExperienceLevel;
  previous_company_name?: string;
  company_position?: string;
  description?: string;
  internship_experience?: string;
  total_work_experience?: number | '';
  key_responsibilities?: string;
  career_goals?: string;
  video_introduction_url?: string;
  video_introduction_key?: string;
  terms_accepted: boolean;
  password: string;
}

export interface CandidateRegistrationResponse {
  candidate: CandidateRecord;
  accessToken: string;
  refreshToken: string;
}

export interface CandidateLoginPayload {
  email: string;
  password: string;
}

export interface CandidateLoginResponse {
  candidate: CandidateRecord;
  accessToken: string;
  refreshToken: string;
}

export type CandidateUpdatePayload = Omit<CandidateRegistrationPayload, 'password'>;

export interface CandidateUploadResult {
  url: string;
  key: string;
  size: number;
  fileName?: string;
}

export const DEFAULT_CANDIDATE_FORM: CandidateRegistrationPayload = {
  full_name: '',
  mobile_number: '',
  email: '',
  city: '',
  state: '',
  linkedin_url: '',
  portfolio_url: '',
  photograph_url: '',
  photograph_key: '',
  college_name: '',
  highest_qualification: 'bachelors',
  current_course: '',
  preferred_job_role: '',
  preferred_work_mode: 'onsite',
  preferred_job_location: '',
  expected_salary: '',
  available_joining_date: '',
  additional_skills: '',
  resume_url: '',
  resume_key: '',
  experience_level: 'fresher',
  previous_company_name: '',
  company_position: '',
  description: '',
  work_experiences: [],
  internship_experience: '',
  total_work_experience: '',
  key_responsibilities: '',
  career_goals: '',
  video_introduction_url: '',
  video_introduction_key: '',
  terms_accepted: false,
  password: '',
};
