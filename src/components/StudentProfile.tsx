import React, { useState } from 'react';
import { StudentUser } from '../types/internship';
import { 
  User, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Edit3, 
  ShieldCheck, 
  RotateCcw, 
  X,
  LogOut
} from 'lucide-react';

interface StudentProfileProps {
  student: StudentUser;
  onUpdateProfile: (updated: Partial<StudentUser>) => void;
  onSwitchToAdmin: () => void;
  onResetData: () => void;
  onLogout: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  student,
  onUpdateProfile,
  onSwitchToAdmin,
  onResetData,
  onLogout,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(student.name);
  const [collegeName, setCollegeName] = useState(student.collegeName);
  const [branch, setBranch] = useState(student.branch);
  const [gradYear, setGradYear] = useState(student.gradYear);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim(),
      collegeName: collegeName.trim(),
      branch: branch.trim(),
      gradYear: gradYear.trim(),
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black text-black dark:text-white">
      {/* Profile Header */}
      <div className="p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
          {student.name.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-black dark:text-white truncate">
              {student.name}
            </h3>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-zinc-500 truncate">{student.email}</p>
          <span className="inline-block mt-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
            Student Account · Class of {student.gradYear}
          </span>
        </div>
      </div>

      {/* Profile Information List */}
      <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 text-xs">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
          Academic Details
        </h4>

        <div className="space-y-2.5 divide-y divide-zinc-100 dark:divide-zinc-800/80">
          <div className="pt-1 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-zinc-400" />
              <span>College</span>
            </span>
            <span className="font-medium text-black dark:text-white text-right max-w-[200px] truncate">
              {student.collegeName}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span>Branch</span>
            </span>
            <span className="font-medium text-black dark:text-white text-right max-w-[200px] truncate">
              {student.branch}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              <span>Graduation Year</span>
            </span>
            <span className="font-mono font-medium text-black dark:text-white">
              {student.gradYear}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-between text-zinc-600 dark:text-zinc-400">
            <span className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>Email</span>
            </span>
            <span className="font-medium text-black dark:text-white truncate">
              {student.email}
            </span>
          </div>
        </div>
      </div>

      {/* Role Management Actions */}
      <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px] mb-2">
          Portal Controls
        </h4>

        <button
          onClick={onSwitchToAdmin}
          className="w-full p-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-semibold flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
            <span>Switch to Admin Panel</span>
          </div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono">Platform Admin</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo data back to factory defaults?')) {
              onResetData();
            }
          }}
          className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-2.5 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-zinc-400" />
          <span>Reset Sample Applications & Listings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold flex items-center justify-between transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-zinc-500" />
            <span>Sign Out</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 truncate max-w-[150px]">
            {student.email}
          </span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-h-[85vh] bg-white dark:bg-zinc-900 rounded-t-3xl p-5 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold text-sm">Edit Student Profile</h4>
              <button onClick={() => setIsEditing(false)} className="p-1 text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">College / University</label>
                <input
                  type="text"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 mb-1">Branch / Major</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={gradYear}
                    onChange={(e) => setGradYear(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs active:scale-98"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
