import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-start antialiased selection:bg-zinc-800 selection:text-white">
      {/* Top desktop control banner */}
      <div className="w-full hidden md:flex items-center justify-between px-6 py-2.5 bg-black border-b border-zinc-800 text-xs text-zinc-400 z-50">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white tracking-tight flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white" />
            InternTrack
          </span>
          <span>·</span>
          <span>Student Application & Admin Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">View:</span>
          <button
            onClick={() => setIsPhoneFrame(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              isPhoneFrame
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device (390px)</span>
          </button>
          <button
            onClick={() => setIsPhoneFrame(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              !isPhoneFrame
                ? 'bg-zinc-800 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full flex-1 flex justify-center items-start transition-all duration-200 ${
          isPhoneFrame ? 'md:py-6' : 'w-full'
        }`}
      >
        <div
          className={`w-full bg-white dark:bg-black text-black dark:text-white flex flex-col relative overflow-hidden transition-all duration-300 ${
            isPhoneFrame
              ? 'md:max-w-[420px] md:h-[870px] md:rounded-[44px] md:border-[10px] md:border-zinc-800 md:shadow-2xl md:shadow-black md:ring-1 md:ring-zinc-800 min-h-screen md:min-h-0'
              : 'max-w-4xl min-h-screen md:border-x md:border-zinc-800 shadow-2xl'
          }`}
        >
          {/* Mobile Status Bar */}
          <div className="shrink-0 h-10 px-6 flex items-center justify-between text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-white dark:bg-black select-none pt-1">
            <span className="font-semibold text-[13px] tracking-tight">9:41</span>
            
            {/* Dynamic Island Notch Pill */}
            <div className="w-24 h-4 bg-zinc-900 dark:bg-zinc-900 rounded-full flex items-center justify-center gap-1.5 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-black flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-zinc-400" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Body Content */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
