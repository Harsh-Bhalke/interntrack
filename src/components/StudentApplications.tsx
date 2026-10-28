import React, { useState, useMemo } from 'react';
import { Application, ApplicationStatus } from '../types/internship';
import { STATUS_CONFIG, ALL_STATUSES } from '../utils/stages';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ArrowUpDown, 
  X,
  Building2
} from 'lucide-react';

interface StudentApplicationsProps {
  applications: Application[];
  onOpenAddModal: () => void;
  onEditApplication: (app: Application) => void;
  onDeleteApplication: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onSelectApplication: (app: Application) => void;
}

export const StudentApplications: React.FC<StudentApplicationsProps> = ({
  applications,
  onOpenAddModal,
  onEditApplication,
  onDeleteApplication,
  onUpdateStatus,
  onSelectApplication,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'company' | 'deadline'>('newest');

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications
      .filter((app) => {
        if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            app.companyName.toLowerCase().includes(q) ||
            app.jobRole.toLowerCase().includes(q) ||
            app.notes?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
        }
        if (sortBy === 'company') {
          return a.companyName.localeCompare(b.companyName);
        }
        if (sortBy === 'deadline') {
          const dA = a.deadline || '9999-12-31';
          const dB = b.deadline || '9999-12-31';
          return new Date(dA).getTime() - new Date(dB).getTime();
        }
        return 0;
      });
  }, [applications, selectedStatus, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-black text-black dark:text-white">
      {/* Search & Sort Bar */}
      <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or role..."
              className="w-full pl-8 pr-7 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-black dark:text-white focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2 text-zinc-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-1">
            <ArrowUpDown className="w-3 h-3 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="company">A-Z</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        {/* Status Filter Horizontal Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedStatus === 'all'
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            All ({applications.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = applications.filter((a) => a.status === st).length;
            const config = STATUS_CONFIG[st];
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedStatus === st
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                <span>{config.label}</span>
                <span className="text-[10px] opacity-70 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredApps.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/50">
            <Building2 className="w-8 h-8 mx-auto text-zinc-400 mb-2" />
            <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
              No applications match
            </h4>
            <p className="text-[11px] text-zinc-500 mt-1 mb-3">
              Add a new application or clear active search filter.
            </p>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Application</span>
            </button>
          </div>
        ) : (
          filteredApps.map((app) => {
            const statusConf = STATUS_CONFIG[app.status];
            return (
              <div
                key={app.id}
                onClick={() => onSelectApplication(app)}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2.5 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                {/* Header: Company & Quick Status Dropdown */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {app.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                        {app.companyName}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                        {app.jobRole}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      e.stopPropagation();
                      onUpdateStatus(app.id, e.target.value as ApplicationStatus);
                    }}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none ${statusConf.badgeClass}`}
                  >
                    {ALL_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadlines & Dates */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500 font-mono">
                  <span>Applied: {app.applicationDate}</span>
                  {app.deadline && (
                    <>
                      <span>·</span>
                      <span className="text-zinc-700 dark:text-zinc-300">
                        Deadline: {app.deadline}
                      </span>
                    </>
                  )}
                  {app.interviewDate && (
                    <>
                      <span>·</span>
                      <span className="font-bold text-black dark:text-white flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Interview: {app.interviewDate.replace('T', ' ')}</span>
                      </span>
                    </>
                  )}
                </div>

                {/* Notes if available */}
                {app.notes && (
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-2 bg-zinc-50 dark:bg-zinc-800/60 p-2 rounded-xl">
                    {app.notes}
                  </p>
                )}

                {/* Footer Actions */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  {app.jobUrl ? (
                    <a
                      href={app.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-zinc-500 hover:text-black dark:hover:text-white font-medium flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Job Portal</span>
                    </a>
                  ) : (
                    <span className="text-zinc-400 text-[10px]">No link</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditApplication(app);
                      }}
                      className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Delete application for ${app.companyName}?`)) {
                          onDeleteApplication(app.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
