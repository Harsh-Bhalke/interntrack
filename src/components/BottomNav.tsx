import React from 'react';
import { UserRole, UserTab, AdminTab } from '../types/internship';
import { 
  Home, 
  Briefcase, 
  Calendar, 
  Sparkles, 
  User, 
  Users, 
  Tag, 
  Activity,
  BarChart2
} from 'lucide-react';

interface BottomNavProps {
  currentRole: UserRole;
  studentTab: UserTab;
  onStudentTabChange: (tab: UserTab) => void;
  adminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
  interviewsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentRole,
  studentTab,
  onStudentTabChange,
  adminTab,
  onAdminTabChange,
  interviewsCount,
}) => {
  return (
    <nav className="shrink-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <div className="h-14 px-2 flex items-center justify-around">
        {currentRole === 'user' ? (
          <>
            {/* Student 1: Dashboard / Home */}
            <button
              onClick={() => onStudentTabChange('dashboard')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                studentTab === 'dashboard'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="text-[10px] mt-1">Home</span>
            </button>

            {/* Student 2: Applications */}
            <button
              onClick={() => onStudentTabChange('applications')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                studentTab === 'applications'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] mt-1">Apps</span>
            </button>

            {/* Student 3: Reminders */}
            <button
              onClick={() => onStudentTabChange('reminders')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors relative ${
                studentTab === 'reminders'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <div className="relative">
                <Calendar className="w-4 h-4" />
                {interviewsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-black dark:bg-white" />
                )}
              </div>
              <span className="text-[10px] mt-1">Reminders</span>
            </button>

            {/* Student 4: Discover Campus Opportunities */}
            <button
              onClick={() => onStudentTabChange('discover')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                studentTab === 'discover'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] mt-1">Discover</span>
            </button>

            {/* Student 5: Profile */}
            <button
              onClick={() => onStudentTabChange('profile')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                studentTab === 'profile'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px] mt-1">Profile</span>
            </button>
          </>
        ) : (
          <>
            {/* Admin 1: Overview */}
            <button
              onClick={() => onAdminTabChange('dashboard')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                adminTab === 'dashboard'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span className="text-[10px] mt-1">Dashboard</span>
            </button>

            {/* Admin 2: Users */}
            <button
              onClick={() => onAdminTabChange('users')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                adminTab === 'users'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[10px] mt-1">Users</span>
            </button>

            {/* Admin 3: Listings */}
            <button
              onClick={() => onAdminTabChange('listings')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                adminTab === 'listings'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] mt-1">Listings</span>
            </button>

            {/* Admin 4: Categories */}
            <button
              onClick={() => onAdminTabChange('categories')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                adminTab === 'categories'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span className="text-[10px] mt-1">Categories</span>
            </button>

            {/* Admin 5: Audit Logs */}
            <button
              onClick={() => onAdminTabChange('logs')}
              className={`flex-1 min-h-[44px] flex flex-col items-center justify-center transition-colors ${
                adminTab === 'logs'
                  ? 'text-black dark:text-white font-bold'
                  : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span className="text-[10px] mt-1">Logs</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
};
