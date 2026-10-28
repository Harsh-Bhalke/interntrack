import { ApplicationStatus } from '../types/internship';

export interface StatusConfig {
  id: ApplicationStatus;
  label: string;
  meaning: string;
  // ChatGPT-style clean black/white/gray styling
  badgeClass: string;
  dotClass: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  applied: {
    id: 'applied',
    label: 'Applied',
    meaning: 'Application submitted',
    badgeClass: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700',
    dotClass: 'bg-zinc-900 dark:bg-zinc-100',
  },
  in_review: {
    id: 'in_review',
    label: 'In Review',
    meaning: 'Company reviewing application',
    badgeClass: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-dashed border-zinc-300 dark:border-zinc-600',
    dotClass: 'bg-zinc-500',
  },
  interview: {
    id: 'interview',
    label: 'Interview',
    meaning: 'Interview scheduled',
    badgeClass: 'bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white shadow-2xs',
    dotClass: 'bg-black dark:bg-white',
  },
  selected: {
    id: 'selected',
    label: 'Selected',
    meaning: 'Student selected for internship',
    badgeClass: 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 ring-1 ring-zinc-900 dark:ring-zinc-100 font-bold',
    dotClass: 'bg-emerald-500',
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    meaning: 'Application not selected',
    badgeClass: 'bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 line-through decoration-zinc-400',
    dotClass: 'bg-zinc-400',
  },
  withdrawn: {
    id: 'withdrawn',
    label: 'Withdrawn',
    meaning: 'Application withdrawn by student',
    badgeClass: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700',
    dotClass: 'bg-zinc-300',
  },
};

export const ALL_STATUSES: ApplicationStatus[] = [
  'applied',
  'in_review',
  'interview',
  'selected',
  'rejected',
  'withdrawn',
];
