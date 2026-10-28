import React from 'react';
import { Application, ApplicationStatus } from '../types/internship';
import { STATUS_CONFIG, ALL_STATUSES } from '../utils/stages';
import { X, Calendar, Clock, ExternalLink, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationDetailModalProps {
  application: Application | null;
  onClose: () => void;
  onEdit: (app: Application) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  if (!application) return null;

  const statusConf = STATUS_CONFIG[application.status];

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    if (newStatus === 'selected') {
      confetti({ particleCount: 70, spread: 60 });
    }
    onUpdateStatus(application.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-h-[85vh] bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl p-5 overflow-y-auto space-y-4 text-xs text-black dark:text-white animate-in slide-in-from-bottom duration-150">
        <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto -mt-2 mb-2" />

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-sm flex items-center justify-center shrink-0">
              {application.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">
                {application.companyName}
              </h3>
              <p className="text-xs text-zinc-500">{application.jobRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Changer */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">
            Application Status
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {ALL_STATUSES.map((st) => {
              const conf = STATUS_CONFIG[st];
              const isSelected = application.status === st;
              return (
                <button
                  key={st}
                  onClick={() => handleStatusChange(st)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs font-bold'
                      : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {conf.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dates Details */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5 font-mono text-xs">
          <div className="flex justify-between text-zinc-500">
            <span>Applied Date:</span>
            <span className="text-black dark:text-white font-semibold">{application.applicationDate}</span>
          </div>

          {application.deadline && (
            <div className="flex justify-between text-zinc-500">
              <span>Application Deadline:</span>
              <span className="text-black dark:text-white font-semibold">{application.deadline}</span>
            </div>
          )}

          {application.interviewDate && (
            <div className="flex justify-between text-zinc-500">
              <span>Interview Date & Time:</span>
              <span className="text-black dark:text-white font-bold">{application.interviewDate.replace('T', ' ')}</span>
            </div>
          )}

          {application.jobUrl && (
            <div className="flex justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500 font-sans">Application Portal:</span>
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black dark:text-white hover:underline flex items-center gap-1 font-sans font-semibold"
              >
                <span>Visit Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>

        {/* Description & Notes */}
        {application.jobDescription && (
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block mb-1">
              Job Description
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {application.jobDescription}
            </p>
          </div>
        )}

        {application.notes && (
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block mb-1">
              Preparation Notes
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {application.notes}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm(`Delete application for ${application.companyName}?`)) {
                onDelete(application.id);
                onClose();
              }
            }}
            className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Application</span>
          </button>

          <button
            onClick={() => {
              onEdit(application);
              onClose();
            }}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};
