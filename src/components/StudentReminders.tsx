import React, { useState } from 'react';
import { Application } from '../types/internship';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Send
} from 'lucide-react';

interface StudentRemindersProps {
  applications: Application[];
  onSelectApplication: (app: Application) => void;
  onSendAlertToast: (title: string, message: string) => void;
}

export const StudentReminders: React.FC<StudentRemindersProps> = ({
  applications,
  onSelectApplication,
  onSendAlertToast,
}) => {
  const [filter, setFilter] = useState<'all' | 'interviews' | 'deadlines'>('all');

  const upcomingInterviews = applications
    .filter((a) => a.interviewDate)
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime());

  const upcomingDeadlines = applications
    .filter((a) => a.deadline && a.status !== 'rejected' && a.status !== 'withdrawn' && a.status !== 'selected')
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime());

  const createGoogleCalendarLink = (app: Application) => {
    if (!app.interviewDate) return '#';
    const start = new Date(app.interviewDate);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const formatD = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const title = encodeURIComponent(`${app.companyName} Interview: ${app.jobRole}`);
    const details = encodeURIComponent(`Notes: ${app.notes || 'Review system design & data structures.'}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatD(start)}/${formatD(end)}&details=${details}`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      {/* Filter */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            All Agenda ({upcomingInterviews.length + upcomingDeadlines.length})
          </button>
          <button
            onClick={() => setFilter('interviews')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'interviews'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Interviews ({upcomingInterviews.length})
          </button>
          <button
            onClick={() => setFilter('deadlines')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filter === 'deadlines'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-2xs'
                : 'text-zinc-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Deadlines ({upcomingDeadlines.length})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Test Alert Simulator Button */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div>
            <h4 className="font-bold text-black dark:text-white flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Reminder Notification</span>
            </h4>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Simulate high-priority push reminder on your device
            </p>
          </div>
          <button
            onClick={() => {
              onSendAlertToast(
                'Interview Alert: Microsoft Tomorrow',
                'Technical coding round at 2:30 PM. Review Azure fundamentals & Graph algorithms.'
              );
            }}
            className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[11px] font-semibold flex items-center gap-1 active:scale-95"
          >
            <Send className="w-3 h-3" />
            <span>Test Alert</span>
          </button>
        </div>

        {/* Section 1: Interviews */}
        {(filter === 'all' || filter === 'interviews') && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Scheduled Interviews</span>
            </h3>

            {upcomingInterviews.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                No interviews scheduled yet.
              </div>
            ) : (
              upcomingInterviews.map((app) => (
                <div
                  key={app.id}
                  className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-black dark:text-white">
                        {app.companyName}
                      </h4>
                      <p className="text-xs text-zinc-500">{app.jobRole}</p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                      Interview Round
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 font-mono text-[11px] flex items-center justify-between">
                    <span className="font-bold text-black dark:text-white">
                      {app.interviewDate?.replace('T', ' at ')}
                    </span>
                    <a
                      href={createGoogleCalendarLink(app)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-600 dark:text-zinc-300 font-sans hover:underline flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Google Cal</span>
                    </a>
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/40 p-2 rounded-lg">
                      <span className="font-semibold text-black dark:text-white">Prep Notes: </span>
                      {app.notes}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Section 2: Application Deadlines */}
        {(filter === 'all' || filter === 'deadlines') && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Approaching Application Deadlines</span>
            </h3>

            {upcomingDeadlines.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-400">
                No active deadlines.
              </div>
            ) : (
              upcomingDeadlines.map((app) => (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 text-xs cursor-pointer hover:border-zinc-400 transition-colors"
                >
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-100">
                      {app.companyName}
                    </h4>
                    <p className="text-[11px] text-zinc-500">{app.jobRole}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      Due: {app.deadline}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
