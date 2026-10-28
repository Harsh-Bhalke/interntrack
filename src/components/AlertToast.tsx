import React, { useEffect } from 'react';
import { Bell, X } from 'lucide-react';

interface AlertToastProps {
  alert: { title: string; message: string } | null;
  onDismiss: () => void;
}

export const AlertToast: React.FC<AlertToastProps> = ({ alert, onDismiss }) => {
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [alert, onDismiss]);

  if (!alert) return null;

  return (
    <div className="absolute top-12 left-3 right-3 z-50 animate-in slide-in-from-top-3 duration-150">
      <div className="p-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black border border-zinc-800 dark:border-zinc-200 shadow-xl flex items-start justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-zinc-800 dark:bg-zinc-200 text-white dark:text-black flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold truncate">{alert.title}</h4>
            <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{alert.message}</p>
          </div>
        </div>

        <button onClick={onDismiss} className="p-1 opacity-70 hover:opacity-100 shrink-0">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
