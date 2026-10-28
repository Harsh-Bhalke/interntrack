import { 
  Application, 
  StudentUser, 
  InternshipListing, 
  UserRole, 
  ActivityLog,
  AuthUser
} from '../types/internship';
import { 
  INITIAL_STUDENT_APPLICATIONS, 
  INITIAL_USERS, 
  INITIAL_INTERNSHIP_LISTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_ACTIVITY_LOGS,
  CURRENT_STUDENT_DEFAULT
} from '../data/mockApplications';

const KEYS = {
  APPLICATIONS: 'interntrack_applications_v3',
  USERS: 'interntrack_users_v3',
  LISTINGS: 'interntrack_listings_v3',
  CATEGORIES: 'interntrack_categories_v3',
  CURRENT_STUDENT: 'interntrack_student_profile_v3',
  ROLE: 'interntrack_role_v3',
  LOGS: 'interntrack_logs_v3',
  AUTH: 'interntrack_auth_session_v3',
};

export const DEFAULT_STUDENT_AUTH: AuthUser = {
  id: 'user-harsh',
  name: 'Harsh Bhalke',
  email: 'harshbhalke07@gmail.com',
  phone: '+91 98765 43210',
  role: 'user',
  authMethod: 'google',
};

export const DEFAULT_ADMIN_AUTH: AuthUser = {
  id: 'admin-1',
  name: 'Placement Director (Admin)',
  email: 'admin@interntrack.edu',
  phone: '+91 98000 11223',
  role: 'admin',
  authMethod: 'google',
};

export function loadAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEYS.AUTH);
    return raw ? JSON.parse(raw) : DEFAULT_STUDENT_AUTH;
  } catch {
    return DEFAULT_STUDENT_AUTH;
  }
}

export function saveAuthUser(user: AuthUser | null): void {
  try {
    if (user) {
      localStorage.setItem(KEYS.AUTH, JSON.stringify(user));
      localStorage.setItem(KEYS.ROLE, user.role);
    } else {
      localStorage.removeItem(KEYS.AUTH);
    }
  } catch (err) {
    console.error('Failed to save auth user:', err);
  }
}

export function loadUserRole(): UserRole {
  try {
    const user = loadAuthUser();
    if (user) return user.role;
    const role = localStorage.getItem(KEYS.ROLE);
    return role === 'admin' ? 'admin' : 'user';
  } catch {
    return 'user';
  }
}

export function saveUserRole(role: UserRole): void {
  try {
    localStorage.setItem(KEYS.ROLE, role);
  } catch (err) {
    console.error('Failed to save role:', err);
  }
}

export function loadStudentProfile(): StudentUser {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_STUDENT);
    return raw ? JSON.parse(raw) : CURRENT_STUDENT_DEFAULT;
  } catch {
    return CURRENT_STUDENT_DEFAULT;
  }
}

export function saveStudentProfile(profile: StudentUser): void {
  try {
    localStorage.setItem(KEYS.CURRENT_STUDENT, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save student profile:', err);
  }
}

export function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(KEYS.APPLICATIONS);
    if (!raw) {
      saveApplications(INITIAL_STUDENT_APPLICATIONS);
      return INITIAL_STUDENT_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_STUDENT_APPLICATIONS;
  } catch {
    return INITIAL_STUDENT_APPLICATIONS;
  }
}

export function saveApplications(apps: Application[]): void {
  try {
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps));
  } catch (err) {
    console.error('Failed to save applications:', err);
  }
}

export function loadUsers(): StudentUser[] {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    if (!raw) {
      saveUsers(INITIAL_USERS);
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUsers(users: StudentUser[]): void {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users:', err);
  }
}

export function loadListings(): InternshipListing[] {
  try {
    const raw = localStorage.getItem(KEYS.LISTINGS);
    if (!raw) {
      saveListings(INITIAL_INTERNSHIP_LISTINGS);
      return INITIAL_INTERNSHIP_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_INTERNSHIP_LISTINGS;
  } catch {
    return INITIAL_INTERNSHIP_LISTINGS;
  }
}

export function saveListings(listings: InternshipListing[]): void {
  try {
    localStorage.setItem(KEYS.LISTINGS, JSON.stringify(listings));
  } catch (err) {
    console.error('Failed to save listings:', err);
  }
}

export function loadCategories(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.CATEGORIES);
    if (!raw) {
      saveCategories(INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_CATEGORIES;
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export function saveCategories(categories: string[]): void {
  try {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (err) {
    console.error('Failed to save categories:', err);
  }
}

export function loadActivityLogs(): ActivityLog[] {
  try {
    const raw = localStorage.getItem(KEYS.LOGS);
    if (!raw) {
      saveActivityLogs(INITIAL_ACTIVITY_LOGS);
      return INITIAL_ACTIVITY_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ACTIVITY_LOGS;
  } catch {
    return INITIAL_ACTIVITY_LOGS;
  }
}

export function saveActivityLogs(logs: ActivityLog[]): void {
  try {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs:', err);
  }
}

export function resetAllData() {
  saveApplications(INITIAL_STUDENT_APPLICATIONS);
  saveUsers(INITIAL_USERS);
  saveListings(INITIAL_INTERNSHIP_LISTINGS);
  saveCategories(INITIAL_CATEGORIES);
  saveStudentProfile(CURRENT_STUDENT_DEFAULT);
  saveActivityLogs(INITIAL_ACTIVITY_LOGS);
}
