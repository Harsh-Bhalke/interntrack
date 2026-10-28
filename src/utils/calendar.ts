import { Application } from '../types/internship';

export function getDeadlineInfo(deadlineIsoString?: string): {
  label: string;
  isUrgent: boolean;
  isWarning: boolean;
  isPast: boolean;
  daysRemaining: number;
} {
  if (!deadlineIsoString) {
    return { label: 'No deadline', isUrgent: false, isWarning: false, isPast: false, daysRemaining: 999 };
  }

  const deadline = new Date(deadlineIsoString).getTime();
  const now = new Date('2026-10-28T03:38:00').getTime();
  const diffMs = deadline - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.round(diffMs / (1000 * 60 * 60));

  if (diffMs < 0) {
    return {
      label: 'Deadline passed',
      isUrgent: false,
      isWarning: false,
      isPast: true,
      daysRemaining: days,
    };
  }

  if (hours <= 24) {
    return {
      label: `Due in ${Math.max(1, hours)}h`,
      isUrgent: true,
      isWarning: true,
      isPast: false,
      daysRemaining: 0,
    };
  }

  if (days <= 2) {
    return {
      label: `Due in ${days} days`,
      isUrgent: true,
      isWarning: true,
      isPast: false,
      daysRemaining: days,
    };
  }

  if (days <= 5) {
    return {
      label: `Due in ${days} days`,
      isUrgent: false,
      isWarning: true,
      isPast: false,
      daysRemaining: days,
    };
  }

  return {
    label: `Due in ${days} days`,
    isUrgent: false,
    isWarning: false,
    isPast: false,
    daysRemaining: days,
  };
}

export function createGoogleCalendarUrl(app: Application): string {
  if (!app.interviewDate) return '#';
  const start = new Date(app.interviewDate);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const formatGCalDate = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d\d\d/g, '');

  const datesParam = `${formatGCalDate(start)}/${formatGCalDate(end)}`;
  const title = encodeURIComponent(`${app.companyName} Interview: ${app.jobRole}`);
  const details = encodeURIComponent(
    `Role: ${app.jobRole}\nNotes: ${app.notes || 'Review system design & data structures.'}`
  );
  const location = encodeURIComponent(`${app.companyName} Virtual / Online`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${datesParam}&details=${details}&location=${location}`;
}
