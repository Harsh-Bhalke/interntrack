export type UserRole = 'user' | 'admin';

export type ApplicationStatus = 
  | 'applied'
  | 'in_review'
  | 'interview'
  | 'selected'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobRole: string;
  jobDescription?: string;
  applicationDate: string; // e.g. "2026-10-15"
  deadline?: string; // e.g. "2026-11-05"
  interviewDate?: string; // e.g. "2026-10-29T14:30" (Optional)
  jobUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  hasPassword?: boolean;
  collegeName: string;
  branch: string;
  gradYear: string;
  role: 'user' | 'admin';
  isActive: boolean;
  isReported?: boolean;
  registeredDate: string;
}

export interface InternshipListing {
  id: string;
  companyName: string;
  jobRole: string;
  description: string;
  requiredSkills: string;
  location: string;
  stipend: string;
  deadline: string;
  applicationUrl: string;
  category: string;
  isPublished: boolean;
  postedAt: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  description: string;
  timestamp: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  authMethod: 'google' | 'phone_otp' | 'password';
}

export type UserTab = 'dashboard' | 'applications' | 'reminders' | 'discover' | 'profile';
export type AdminTab = 'dashboard' | 'users' | 'listings' | 'categories' | 'logs';
