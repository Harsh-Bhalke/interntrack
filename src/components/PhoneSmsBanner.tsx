import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

export interface SmsNotification {
  sender: string;
  message: string;
  code?: string;
  timestamp?: string;
}

interface PhoneSmsBannerProps {
  notification: SmsNotification | null;
  onDismiss: () => void;
  onTapCode?: (code: string) => void;
}

export const PhoneSmsBanner: React.FC<PhoneSmsBannerProps> = ({
  notification,
  onDismiss,
  onTapCode,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 300);
      }, 9000); // Visible for 9 seconds
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [notification, onDismiss]);

  if (!notification && !isVisible) return null;

  return (
    <div
      className={`absolute top-10 left-3 right-3 z-50 transition-all duration-300 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-6 opacity-0 scale-95'
      }`}
    >
      <div className="bg-black/90 dark:bg-zinc-800/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-zinc-700/60 dark:border-zinc-600/50 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-green-500 flex items-center justify-center text-white shrink-0">
              <MessageSquare className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] font-bold tracking-tight text-zinc-200">
              {notification?.sender || 'Messages'}
            </span>
            <span className="text-[9px] text-zinc-400">• now</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onDismiss, 200);
            }}
            className="p-1 text-zinc-400 hover:text-white rounded-md"
            aria-label="Dismiss message"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-[12px] text-zinc-100 font-medium leading-relaxed pl-7">
          {notification?.message}
        </div>

        {notification?.code && onTapCode && (
          <div className="pl-7 pt-1 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">
              Code: <span className="font-mono font-bold text-white tracking-widest">{notification.code}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                if (notification.code) onTapCode(notification.code);
              }}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-300 underline"
            >
              Copy to form
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
