export type PortalStatus = 'active' | 'inactive';

export type WorkplaceType = 'on-site' | 'remote' | 'hybrid';
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'freelance';

export type JobStatus = 'draft' | 'published' | 'closed';
export type ApplicationStatus = 'active' | 'rejected' | 'hired' | 'withdrawn';

export interface RecruitmentPortal {
  _id: string;
  companyName: string;
  slug: string;
  companyWebsite?: string;
  companyDescription?: string;
  careersTitle?: string;
  careersDescription?: string;
  logoUrl?: string;
  brandColor: string;
  accentColor: string;
  embedToken: string;
  isActive: boolean;
  widgetScriptUrl: string;
  embedCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScreeningQuestion {
  question: string;
  type: 'text' | 'textarea' | 'number' | 'select';
  required: boolean;
  options: string[];
}

export interface JobOpening {
  _id: string;
  portalId:
    | string
    | {
        _id: string;
        companyName?: string;
        slug?: string;
      };
  title: string;
  slug: string;
  department?: string;
  location?: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  shortDescription?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  screeningQuestions: ScreeningQuestion[];
  openings: number;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  status: JobStatus;
  publishAt?: string;
  recruitmentStages: string[];
  applicationCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  _id: string;
  portalId:
    | string
    | {
        _id: string;
        companyName?: string;
        slug?: string;
      };
  jobId:
    | string
    | {
        _id: string;
        title?: string;
        slug?: string;
        department?: string;
        location?: string;
        recruitmentStages?: string[];
        status?: JobStatus;
      };
  fullName: string;
  email: string;
  phone?: string;
  currentLocation?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  yearsExperience?: number;
  currentCompany?: string;
  currentDesignation?: string;
  currentCTC?: number;
  expectedCTC?: number;
  noticePeriodDays?: number;
  skills: string[];
  coverLetter?: string;
  source: string;
  customAnswers: {
    question: string;
    answer: string;
  }[];
  resumeUrl?: string;
  resumeFileName?: string;
  resumeMimeType?: string;
  candidateSummary: string;
  stage: string;
  status: ApplicationStatus;
  adminNotes?: string;
  score?: number;
  metadata?: {
    userAgent?: string;
    referrer?: string;
    submittedFrom?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface RecruitmentDashboard {
  totals: {
    totalJobs: number;
    publishedJobs: number;
    totalApplications: number;
    activeApplications: number;
  };
  stageSummary: {
    stage: string;
    count: number;
  }[];
  topJobs: {
    jobId: string;
    count: number;
    title: string;
    slug?: string;
  }[];
  recentApplications: JobApplication[];
}

export interface RecruitmentListResponse<T> {
  data: T[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PortalPayload {
  companyName: string;
  slug?: string;
  companyWebsite?: string;
  companyDescription?: string;
  careersTitle?: string;
  careersDescription?: string;
  logoUrl?: string;
  brandColor?: string;
  accentColor?: string;
  isActive?: boolean;
}

export interface JobPayload {
  portalId?: string;
  title: string;
  slug?: string;
  department?: string;
  location?: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  shortDescription?: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  recruitmentStages: string[];
  screeningQuestions: ScreeningQuestion[];
  openings: number;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status: JobStatus;
  publishAt?: string;
  isFeatured?: boolean;
}

export interface ApplicationUpdatePayload {
  stage?: string;
  status?: ApplicationStatus;
  adminNotes?: string;
  score?: number;
}

export const DEFAULT_PORTAL_FORM: PortalPayload = {
  companyName: '',
  slug: '',
  companyWebsite: '',
  companyDescription: '',
  careersTitle: '',
  careersDescription: '',
  logoUrl: '',
  brandColor: '#0f766e',
  accentColor: '#111827',
  isActive: true,
};

export const DEFAULT_JOB_FORM: JobPayload = {
  title: '',
  slug: '',
  department: '',
  location: '',
  workplaceType: 'hybrid',
  employmentType: 'full-time',
  shortDescription: '',
  description: '',
  requirements: [],
  responsibilities: [],
  perks: [],
  recruitmentStages: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
  screeningQuestions: [],
  openings: 1,
  minExperienceYears: undefined,
  maxExperienceYears: undefined,
  salaryMin: undefined,
  salaryMax: undefined,
  currency: 'INR',
  status: 'draft',
  publishAt: '',
  isFeatured: false,
};
