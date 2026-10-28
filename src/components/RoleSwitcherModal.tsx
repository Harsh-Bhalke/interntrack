import React from 'react';
import { UserRole } from '../types/internship';
import { User, ShieldCheck, Check, X, LogOut } from 'lucide-react';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onLogout?: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  onLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-950 text-black dark:text-white rounded-3xl p-5 shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white">
              Switch Account Access
            </h3>
            <p className="text-[11px] text-zinc-500">
              Select student or admin portal
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-black dark:hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Option 1: Student User */}
          <button
            onClick={() => {
              onSelectRole('user');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              currentRole === 'user'
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                currentRole === 'user'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}>
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Student Panel</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    currentRole === 'user' ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}>
                    Harsh Bhalke
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${currentRole === 'user' ? 'opacity-80' : 'text-zinc-500'}`}>
                  Personal application tracking, interview schedules, and campus job exploration.
                </p>
              </div>
            </div>
            {currentRole === 'user' && (
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
            )}
          </button>

          {/* Option 2: Career Admin */}
          <button
            onClick={() => {
              onSelectRole('admin');
              onClose();
            }}
            className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
              currentRole === 'admin'
                ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-sm'
                : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                currentRole === 'admin'
                  ? 'bg-zinc-800 text-white dark:bg-zinc-200 dark:text-black'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}>
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">Admin Panel</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    currentRole === 'admin' ? 'bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800'
                  }`}>
                    Platform Admin
                  </span>
                </div>
                <p className={`text-[11px] mt-0.5 leading-snug ${currentRole === 'admin' ? 'opacity-80' : 'text-zinc-500'}`}>
                  Manage registered users, publish official internship opportunities, and manage categories.
                </p>
              </div>
            </div>
            {currentRole === 'admin' && (
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
            )}
          </button>

          {onLogout && (
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center gap-2 transition-colors text-xs"
              >
                <LogOut className="w-3.5 h-3.5 text-zinc-400" />
                <span>Log Out of Current Session</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
