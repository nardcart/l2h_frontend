export interface Ebook {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  brochure: string;
  category?: string;
  categoryId?: string;
  tags: string[];
  fileSize?: number;
  pageCount?: number;
  author?: string;
  publishYear?: number;
  bookLanguage?: string;
  status: 0 | 1;
  position: number;
  downloadCount: number;
  viewCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EbookDownloadRequest {
  name: string;
  email: string;
  mobile?: string;
  countryCode?: string;
  ebookId: string;
  stateId?: number;
  cityId?: number;
  hearAbout?: string;
}

export interface DownloadResponse {
  status: boolean;
  message: string;
  data: {
    downloadUrl: string;
    ebookName: string;
    fileName: string;
    email: string;
  };
}

export interface EbookUser {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  countryCode: string;
  ebookName: string;
  ebookId: string | Ebook;
  type: number; // 1=user download, 2=admin send
  typeDescription?: string;
  hearAbout?: string;
  ipAddress?: string;
  userAgent?: string;
  downloadedAt: string;
  emailSent: boolean;
  sentBy?: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface EbookCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: 0 | 1;
  position: number;
  ebookCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalDownloads: number;
  userDownloads: number;
  adminSends: number;
  uniqueUsers: number;
  topEbooks: Array<{
    _id: string;
    ebookName: string;
    count: number;
  }>;
  downloadsByDate: Array<{
    _id: string;
    count: number;
  }>;
}

export interface EmailCountData {
  totalCount: number;
  userDownloads: number;
  adminSends: number;
  uniqueEmails: number;
}

export interface PaginatedResponse<T> {
  status: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

export interface BulkSendRequest {
  emails: string[];
  ebookId: string;
}

export interface BulkSendResponse {
  status: boolean;
  message: string;
  data: {
    totalSent: number;
    totalFailed: number;
    successEmails: string[];
    failedEmails: string[];
    ebookName: string;
  };
}

export interface SingleSendRequest {
  email: string;
  name?: string;
  ebookId: string;
}


