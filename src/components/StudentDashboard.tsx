import React from 'react';
import { Application, StudentUser, InternshipListing, UserTab } from '../types/internship';
import { STATUS_CONFIG } from '../utils/stages';
import { 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';

interface StudentDashboardProps {
  student: StudentUser;
  applications: Application[];
  listings: InternshipListing[];
  onNavigateTab: (tab: UserTab) => void;
  onOpenAddModal: () => void;
  onSelectApplication: (app: Application) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  student,
  applications,
  listings,
  onNavigateTab,
  onOpenAddModal,
  onSelectApplication,
}) => {
  const totalApps = applications.length;
  const interviewsCount = applications.filter((a) => a.status === 'interview').length;
  const selectedCount = applications.filter((a) => a.status === 'selected').length;
  const pendingCount = applications.filter((a) => a.status === 'applied' || a.status === 'in_review').length;

  const nextInterview = applications
    .filter((a) => a.interviewDate && new Date(a.interviewDate).getTime() >= new Date('2026-10-28T03:38:00').getTime())
    .sort((a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime())[0];

  const recentApps = [...applications]
    .sort((a, b) => new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime())
    .slice(0, 4);

  const publishedListings = listings.filter((l) => l.isPublished).slice(0, 2);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black text-black dark:text-white">
      {/* Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-black dark:text-white">
            Hello, {student.name.split(' ')[0]}!
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track your career journey & applications
          </p>
        </div>
        <button
          onClick={onOpenAddModal}
          className="h-9 px-3.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New App</span>
        </button>
      </div>

      {/* 2x2 Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-medium">Total Apps</span>
            <Briefcase className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-mono text-black dark:text-white">
            {totalApps}
          </span>
        </div>

        <div 
          onClick={() => onNavigateTab('reminders')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-medium">Interviews</span>
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-mono text-black dark:text-white">
            {interviewsCount}
          </span>
        </div>

        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-medium">Selected</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-mono text-black dark:text-white">
            {selectedCount}
          </span>
        </div>

        <div 
          onClick={() => onNavigateTab('applications')}
          className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 cursor-pointer hover:border-zinc-400 transition-colors"
        >
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-1">
            <span className="text-[11px] font-medium">Pending</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="text-2xl font-bold tracking-tight font-mono text-black dark:text-white">
            {pendingCount}
          </span>
        </div>
      </div>

      {/* Immediate Next Interview Alert Banner (if scheduled) */}
      {nextInterview && (
        <div 
          onClick={() => onSelectApplication(nextInterview)}
          className="p-3.5 rounded-2xl bg-black text-white dark:bg-zinc-900 dark:text-white border border-zinc-800 dark:border-zinc-700 flex items-center justify-between gap-3 cursor-pointer shadow-md"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white text-black dark:bg-zinc-800 dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
              {nextInterview.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Next Upcoming Interview
              </span>
              <h4 className="text-xs font-bold truncate">
                {nextInterview.companyName} · {nextInterview.jobRole}
              </h4>
              <p className="text-[11px] text-zinc-300 font-mono mt-0.5">
                {nextInterview.interviewDate?.replace('T', ' ')}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
        </div>
      )}

      {/* My Applications Section with View All */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            My Applications
          </h3>
          <button
            onClick={() => onNavigateTab('applications')}
            className="text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-0.5 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
          {recentApps.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              No applications added yet. Tap "+ New App" above.
            </div>
          ) : (
            recentApps.map((app) => {
              const statusConf = STATUS_CONFIG[app.status];
              return (
                <div
                  key={app.id}
                  onClick={() => onSelectApplication(app)}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center shrink-0">
                      {app.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {app.companyName}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                        {app.jobRole}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusConf.badgeClass}`}>
                      {statusConf.label}
                    </span>
                    <p className="text-[10px] text-zinc-400 mt-1 font-mono">
                      {app.applicationDate}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Featured Campus Internship Listings from Admin */}
      {publishedListings.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
              <span>Campus Opportunities</span>
            </h3>
            <button
              onClick={() => onNavigateTab('discover')}
              className="text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-0.5"
            >
              <span>Explore</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {publishedListings.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateTab('discover')}
                className="p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between gap-2 cursor-pointer hover:border-zinc-400 transition-colors"
              >
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {item.companyName} · {item.jobRole}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {item.stipend} · Deadline: {item.deadline}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
