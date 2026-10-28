import React, { useState, useMemo } from 'react';
import { 
  StudentUser, 
  Application, 
  InternshipListing, 
  ActivityLog, 
  AdminTab 
} from '../types/internship';
import { 
  Users, 
  Briefcase, 
  Building2, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Search, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  FileText, 
  Tag, 
  Activity,
  ArrowRight,
  LogOut
} from 'lucide-react';

interface AdminPanelProps {
  currentTab: AdminTab;
  users: StudentUser[];
  applications: Application[];
  listings: InternshipListing[];
  categories: string[];
  activityLogs: ActivityLog[];
  onToggleUserActive: (userId: string) => void;
  onSaveListing: (listing: Partial<InternshipListing>) => void;
  onDeleteListing: (listingId: string) => void;
  onTogglePublishListing: (listingId: string) => void;
  onAddCategory: (categoryName: string) => void;
  onDeleteCategory: (categoryName: string) => void;
  onSwitchToStudent: () => void;
  onLogout?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentTab,
  users,
  applications,
  listings,
  categories,
  activityLogs,
  onToggleUserActive,
  onSaveListing,
  onDeleteListing,
  onTogglePublishListing,
  onAddCategory,
  onDeleteCategory,
  onSwitchToStudent,
  onLogout,
}) => {
  // State for user search
  const [userSearch, setUserSearch] = useState('');

  // State for listing modal
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<InternshipListing | null>(null);
  const [lCompany, setLCompany] = useState('');
  const [lRole, setLRole] = useState('');
  const [lDescription, setLDescription] = useState('');
  const [lSkills, setLSkills] = useState('');
  const [lLocation, setLLocation] = useState('San Francisco, CA');
  const [lStipend, setLStipend] = useState('$60 / hour');
  const [lDeadline, setLDeadline] = useState('2026-11-20');
  const [lUrl, setLUrl] = useState('https://careers.company.com');
  const [lCategory, setLCategory] = useState(categories[0] || 'Software Development');

  // State for new category
  const [newCatInput, setNewCatInput] = useState('');

  // Calculations for Admin Dashboard
  const metrics = useMemo(() => {
    const totalUsers = users.length;
    const totalApps = applications.length;
    const companies = new Set([
      ...applications.map((a) => a.companyName.toLowerCase()),
      ...listings.map((l) => l.companyName.toLowerCase()),
    ]).size;
    const interviews = applications.filter((a) => a.status === 'interview').length;
    return { totalUsers, totalApps, companies, interviews };
  }, [users, applications, listings]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return users;
    const q = userSearch.toLowerCase();
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.collegeName.toLowerCase().includes(q));
  }, [users, userSearch]);

  const handleOpenAddListing = () => {
    setEditingListing(null);
    setLCompany('');
    setLRole('');
    setLDescription('');
    setLSkills('');
    setLLocation('San Francisco, CA');
    setLStipend('$60 / hour');
    setLDeadline('2026-11-20');
    setLUrl('https://careers.company.com');
    setLCategory(categories[0] || 'Software Development');
    setIsListingModalOpen(true);
  };

  const handleOpenEditListing = (item: InternshipListing) => {
    setEditingListing(item);
    setLCompany(item.companyName);
    setLRole(item.jobRole);
    setLDescription(item.description);
    setLSkills(item.requiredSkills);
    setLLocation(item.location);
    setLStipend(item.stipend);
    setLDeadline(item.deadline);
    setLUrl(item.applicationUrl);
    setLCategory(item.category);
    setIsListingModalOpen(true);
  };

  const handleSaveListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lCompany.trim() || !lRole.trim()) return;

    onSaveListing({
      id: editingListing ? editingListing.id : undefined,
      companyName: lCompany.trim(),
      jobRole: lRole.trim(),
      description: lDescription.trim(),
      requiredSkills: lSkills.trim(),
      location: lLocation.trim(),
      stipend: lStipend.trim(),
      deadline: lDeadline,
      applicationUrl: lUrl.trim(),
      category: lCategory,
      isPublished: editingListing ? editingListing.isPublished : true,
    });
    setIsListingModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black text-black dark:text-white">
      {/* 1. ADMIN DASHBOARD */}
      {currentTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-black dark:text-white" />
                <span>Admin Overview</span>
              </h2>
              <p className="text-xs text-zinc-500">
                Manage platform users, official internship opportunities, and categories.
              </p>
            </div>
            <button
              onClick={onSwitchToStudent}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Switch to Student View
            </button>
          </div>

          {/* 4-Box Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500 block">Total Registered Users</span>
              <span className="text-2xl font-bold font-mono text-black dark:text-white mt-1 block">
                {metrics.totalUsers}
              </span>
              <span className="text-[10px] text-zinc-400">All registered students</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500 block">Total Applications</span>
              <span className="text-2xl font-bold font-mono text-black dark:text-white mt-1 block">
                {metrics.totalApps}
              </span>
              <span className="text-[10px] text-zinc-400">Tracked platform-wide</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500 block">Companies Tracked</span>
              <span className="text-2xl font-bold font-mono text-black dark:text-white mt-1 block">
                {metrics.companies}
              </span>
              <span className="text-[10px] text-zinc-400">Unique organizations</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-[11px] text-zinc-500 block">Upcoming Interviews</span>
              <span className="text-2xl font-bold font-mono text-black dark:text-white mt-1 block">
                {metrics.interviews}
              </span>
              <span className="text-[10px] text-zinc-400">Active student interviews</span>
            </div>
          </div>

          {/* Recent User Registrations */}
          <div className="p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2.5">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              Recent User Registrations
            </h4>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.slice(0, 3).map((user) => (
                <div key={user.id} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-black dark:text-white">{user.name}</span>
                    <p className="text-[11px] text-zinc-400">{user.email} · {user.branch}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${user.isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200' : 'bg-red-100 text-red-700'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE USERS */}
      {currentTab === 'users' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span>Registered Users ({users.length})</span>
            </h3>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search user by name, email, or college..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-black dark:text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black dark:text-white">{user.name}</span>
                    {user.isReported && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-bold">
                        Reported
                      </span>
                    )}
                    {(user.hasPassword || user.password) && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono">
                        Password Assigned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{user.email} {user.phone ? `· ${user.phone}` : ''}</p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {user.collegeName} · {user.branch} ({user.gradYear})
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onToggleUserActive(user.id)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl transition-colors ${
                      user.isActive
                        ? 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200'
                        : 'bg-black text-white dark:bg-white dark:text-black'
                    }`}
                  >
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MANAGE INTERNSHIP LISTINGS */}
      {currentTab === 'listings' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                <span>Internship Listings ({listings.length})</span>
              </h3>
              <p className="text-[11px] text-zinc-500">Official listings broadcast to all student accounts</p>
            </div>
            <button
              onClick={handleOpenAddListing}
              className="h-8 px-3 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Listing</span>
            </button>
          </div>

          <div className="space-y-3">
            {listings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-black dark:text-white">{item.companyName}</h4>
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-zinc-100 dark:bg-zinc-800 font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{item.jobRole}</p>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.isPublished ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                    {item.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="text-[11px] text-zinc-500">
                  <span>{item.location} · {item.stipend} · Deadline: {item.deadline}</span>
                </div>

                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 line-clamp-2">
                  {item.description}
                </p>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={() => onTogglePublishListing(item.id)}
                    className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white flex items-center gap-1"
                  >
                    {item.isPublished ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{item.isPublished ? 'Unpublish' : 'Publish'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditListing(item)}
                      className="p-1.5 text-zinc-500 hover:text-black dark:hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete listing for ${item.companyName}?`)) {
                          onDeleteListing(item.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. MANAGE CATEGORIES */}
      {currentTab === 'categories' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
              <Tag className="w-4 h-4" />
              <span>Internship Categories</span>
            </h3>
            <p className="text-[11px] text-zinc-500">
              Categories used by students to filter opportunities.
            </p>
          </div>

          {/* Add Category Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newCatInput.trim()) {
                onAddCategory(newCatInput.trim());
                setNewCatInput('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              placeholder="e.g. Blockchain Development"
              className="flex-1 px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-black dark:text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-semibold shrink-0"
            >
              Add
            </button>
          </form>

          {/* Categories List */}
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900">
            {categories.map((cat) => (
              <div key={cat} className="p-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cat}</span>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete category "${cat}"?`)) {
                      onDeleteCategory(cat);
                    }
                  }}
                  className="p-1 text-zinc-400 hover:text-red-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SYSTEM LOGS & SETTINGS */}
      {currentTab === 'logs' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-black dark:text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>System Activity Logs</span>
            </h3>
            <p className="text-[11px] text-zinc-500">
              Audit trails and administrative actions.
            </p>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-black dark:text-white">{log.title}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{log.timestamp}</span>
                </div>
                <p className="text-[11px] text-zinc-500">{log.description}</p>
              </div>
            ))}
          </div>

          {/* Administrator Session Info & Sign Out */}
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                    AD
                  </div>
                  <div>
                    <div className="text-xs font-bold text-black dark:text-white">Admin Session</div>
                    <div className="text-[11px] text-zinc-500 font-mono">admin@interntrack.edu</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black text-white dark:bg-white dark:text-black">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onSwitchToStudent}
                  className="py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 flex items-center justify-center gap-1.5"
                >
                  <ArrowRight className="w-3 h-3" />
                  <span>Student View</span>
                </button>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="py-2 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Listing Modal */}
      {isListingModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsListingModalOpen(false)} />
          <div className="relative w-full max-h-[90vh] bg-white dark:bg-zinc-950 rounded-t-3xl shadow-2xl p-5 overflow-y-auto space-y-3.5 text-xs text-black dark:text-white animate-in slide-in-from-bottom duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold text-sm">{editingListing ? 'Edit Listing' : 'Post Internship Listing'}</h4>
              <button onClick={() => setIsListingModalOpen(false)} className="p-1 text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveListingSubmit} className="space-y-3">
              <div>
                <label className="block text-zinc-500 mb-1">Company Name</label>
                <input
                  type="text"
                  value={lCompany}
                  onChange={(e) => setLCompany(e.target.value)}
                  placeholder="e.g. Stripe, Google"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Internship Role</label>
                <input
                  type="text"
                  value={lRole}
                  onChange={(e) => setLRole(e.target.value)}
                  placeholder="e.g. Software Engineering Intern"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 mb-1">Category</label>
                  <select
                    value={lCategory}
                    onChange={(e) => setLCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Deadline</label>
                  <input
                    type="date"
                    value={lDeadline}
                    onChange={(e) => setLDeadline(e.target.value)}
                    required
                    className="w-full px-2.5 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-500 mb-1">Location</label>
                  <input
                    type="text"
                    value={lLocation}
                    onChange={(e) => setLLocation(e.target.value)}
                    placeholder="San Francisco, CA"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-zinc-500 mb-1">Stipend</label>
                  <input
                    type="text"
                    value={lStipend}
                    onChange={(e) => setLStipend(e.target.value)}
                    placeholder="$60 / hour + Housing"
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={lDescription}
                  onChange={(e) => setLDescription(e.target.value)}
                  placeholder="Internship summary, project domains..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Required Skills</label>
                <input
                  type="text"
                  value={lSkills}
                  onChange={(e) => setLSkills(e.target.value)}
                  placeholder="Python, React, Data structures..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-zinc-500 mb-1">Application URL</label>
                <input
                  type="url"
                  value={lUrl}
                  onChange={(e) => setLUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs active:scale-98 shadow-sm"
                >
                  {editingListing ? 'Update Listing' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
