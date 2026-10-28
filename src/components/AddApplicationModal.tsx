import React, { useState, useEffect } from 'react';
import { Application, ApplicationStatus } from '../types/internship';
import { STATUS_CONFIG, ALL_STATUSES } from '../utils/stages';
import { X, Building2, Briefcase, Calendar, Clock, Link, FileText } from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appData: Partial<Application>) => void;
  initialApplication?: Application | null;
}

const POPULAR_COMPANIES = ['Google', 'Microsoft', 'Infosys', 'Stripe', 'Amazon', 'Meta', 'Apple', 'TCS'];

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialApplication,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [jobRole, setJobRole] = useState('Software Engineering Intern');
  const [jobDescription, setJobDescription] = useState('');
  const [applicationDate, setApplicationDate] = useState('2026-10-28');
  const [deadline, setDeadline] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('applied');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialApplication) {
      setCompanyName(initialApplication.companyName || '');
      setJobRole(initialApplication.jobRole || '');
      setJobDescription(initialApplication.jobDescription || '');
      setApplicationDate(initialApplication.applicationDate || '2026-10-28');
      setDeadline(initialApplication.deadline || '');
      setInterviewDate(initialApplication.interviewDate || '');
      setJobUrl(initialApplication.jobUrl || '');
      setStatus(initialApplication.status || 'applied');
      setNotes(initialApplication.notes || '');
    } else {
      setCompanyName('');
      setJobRole('Software Engineering Intern');
      setJobDescription('');
      setApplicationDate('2026-10-28');
      setDeadline('2026-11-15');
      setInterviewDate('');
      setJobUrl('');
      setStatus('applied');
      setNotes('');
    }
  }, [initialApplication, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !jobRole.trim()) return;

    onSave({
      companyName: companyName.trim(),
      jobRole: jobRole.trim(),
      jobDescription: jobDescription.trim() || undefined,
      applicationDate,
      deadline: deadline || undefined,
      interviewDate: interviewDate || undefined,
      jobUrl: jobUrl.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-h-[92vh] bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-150">
        <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full mx-auto my-3" />

        <div className="px-5 pb-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-black dark:text-white">
              {initialApplication ? 'Edit Application' : 'Add Internship Application'}
            </h3>
            <p className="text-[11px] text-zinc-500">
              Track dates, interviews, and status in one place.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs text-black dark:text-white">
          {/* Company Quick Select */}
          <div>
            <label className="block text-zinc-500 font-medium mb-1">Quick Company Fill</label>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {POPULAR_COMPANIES.map((name) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setCompanyName(name)}
                  className={`px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap transition-colors ${
                    companyName === name
                      ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                      : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
              Company Name *
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Google, Microsoft, Infosys"
              required
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          {/* Internship Role */}
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-semibold mb-1">
              Internship Role *
            </label>
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              placeholder="e.g. Software Engineering Intern"
              required
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              Job Description (Optional)
            </label>
            <textarea
              rows={2}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Key responsibilities, team details..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          {/* Status & Application Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Application Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl font-semibold"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {STATUS_CONFIG[st].label} ({STATUS_CONFIG[st].meaning})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Application Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                required
                className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Deadlines & Optional Interview Date */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
                Interview Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Application Link */}
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              Job Application Link
            </label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://careers.company.com/job/..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 font-medium mb-1">
              Notes & Preparation
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Referral contact, topics to revise, interview rounds..."
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
            />
          </div>

          {/* Action Buttons: Save Application | Cancel */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs active:scale-98 transition-transform shadow-sm"
            >
              Save Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
