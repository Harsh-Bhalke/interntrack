import React from 'react';
import { UserRole } from '../types/internship';
import { Bell, Plus, ShieldCheck, User } from 'lucide-react';

interface TopAppBarProps {
  currentRole: UserRole;
  onOpenRoleSwitcher: () => void;
  onOpenAddModal: () => void;
  onTriggerBellAlert: () => void;
  unreadAlertsCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentRole,
  onOpenRoleSwitcher,
  onOpenAddModal,
  onTriggerBellAlert,
  unreadAlertsCount,
}) => {
  return (
    <header className="shrink-0 z-30 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800">
      <div className="h-14 px-4 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs tracking-tighter shrink-0">
            IT
          </div>
          <span className="font-bold text-sm tracking-tight text-black dark:text-white">
            InternTrack
          </span>
        </div>

        {/* Right Zone: Role Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Fast Role Switcher */}
          <button
            onClick={onOpenRoleSwitcher}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 transition-colors"
          >
            {currentRole === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5" />
                <span>Student</span>
              </>
            )}
          </button>

          {/* Bell Notification */}
          <button
            onClick={onTriggerBellAlert}
            aria-label="View alerts"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-black dark:bg-white ring-2 ring-white dark:ring-black" />
            )}
          </button>

          {/* Add Action Button */}
          <button
            onClick={onOpenAddModal}
            className="h-8 px-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{currentRole === 'admin' ? 'Listing' : 'Add'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
