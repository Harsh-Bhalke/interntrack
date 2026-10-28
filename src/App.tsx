import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Application, 
  ApplicationStatus, 
  StudentUser, 
  InternshipListing, 
  UserRole, 
  UserTab, 
  AdminTab, 
  ActivityLog,
  AuthUser
} from './types/internship';
import { 
  loadUserRole, 
  saveUserRole, 
  loadStudentProfile, 
  saveStudentProfile, 
  loadApplications, 
  saveApplications, 
  loadUsers, 
  saveUsers, 
  loadListings, 
  saveListings, 
  loadCategories, 
  saveCategories, 
  loadActivityLogs, 
  saveActivityLogs, 
  resetAllData,
  loadAuthUser,
  saveAuthUser
} from './utils/storage';
import { fetchBackendUsers, toggleBackendUserActive } from './utils/api';
import { MobileFrame } from './components/MobileFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNav } from './components/BottomNav';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentApplications } from './components/StudentApplications';
import { StudentReminders } from './components/StudentReminders';
import { StudentDiscover } from './components/StudentDiscover';
import { StudentProfile } from './components/StudentProfile';
import { AdminPanel } from './components/AdminPanel';
import { AddApplicationModal } from './components/AddApplicationModal';
import { ApplicationDetailModal } from './components/ApplicationDetailModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { AlertToast } from './components/AlertToast';
import { LoginScreen } from './components/LoginScreen';
import confetti from 'canvas-confetti';

export default function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => loadAuthUser());
  const [role, setRole] = useState<UserRole>(() => authUser?.role || loadUserRole());
  const [student, setStudent] = useState<StudentUser>(() => loadStudentProfile());
  const [applications, setApplications] = useState<Application[]>(() => loadApplications());
  const [users, setUsers] = useState<StudentUser[]>(() => loadUsers());
  const [listings, setListings] = useState<InternshipListing[]>(() => loadListings());
  const [categories, setCategories] = useState<string[]>(() => loadCategories());
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => loadActivityLogs());

  // Navigation tabs
  const [studentTab, setStudentTab] = useState<UserTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  // Modals & Drawers
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState<Application | null>(null);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [activeAlert, setActiveAlert] = useState<{ title: string; message: string } | null>(null);

  // Persistence effects
  useEffect(() => {
    saveAuthUser(authUser);
  }, [authUser]);

  useEffect(() => {
    saveUserRole(role);
  }, [role]);

  useEffect(() => {
    saveStudentProfile(student);
  }, [student]);

  useEffect(() => {
    saveApplications(applications);
  }, [applications]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    saveListings(listings);
  }, [listings]);

  useEffect(() => {
    saveCategories(categories);
  }, [categories]);

  useEffect(() => {
    saveActivityLogs(activityLogs);
  }, [activityLogs]);

  // Sync users from backend storage on mount
  useEffect(() => {
    fetchBackendUsers()
      .then((backendUsers) => {
        if (backendUsers && backendUsers.length > 0) {
          setUsers(backendUsers);
        }
      })
      .catch(() => {});
  }, []);

  // Compute interviews count for badges
  const upcomingInterviewsCount = useMemo(() => {
    return applications.filter((a) => a.status === 'interview').length;
  }, [applications]);

  // Student Handlers
  const handleSaveApplication = useCallback((data: Partial<Application>) => {
    if (editingApplication) {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === editingApplication.id
            ? { ...app, ...data, updatedAt: new Date().toISOString() }
            : app
        )
      );
      setEditingApplication(null);
      setActiveAlert({
        title: 'Application Updated',
        message: `${data.companyName} details have been updated.`,
      });
    } else {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        userId: student.id,
        companyName: data.companyName || 'Target Company',
        jobRole: data.jobRole || 'Software Engineering Intern',
        jobDescription: data.jobDescription,
        applicationDate: data.applicationDate || '2026-10-28',
        deadline: data.deadline,
        interviewDate: data.interviewDate,
        jobUrl: data.jobUrl,
        status: data.status || 'applied',
        notes: data.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setApplications((prev) => [newApp, ...prev]);
      setActiveAlert({
        title: 'Application Added',
        message: `Now tracking application for ${newApp.companyName}.`,
      });
    }
  }, [editingApplication, student.id]);

  const handleDeleteApplication = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (viewingApplication?.id === id) {
      setViewingApplication(null);
    }
  }, [viewingApplication]);

  const handleUpdateStatus = useCallback((id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus, updatedAt: new Date().toISOString() } : a))
    );
    if (viewingApplication && viewingApplication.id === id) {
      setViewingApplication((prev) => prev ? { ...prev, status: newStatus } : null);
    }
    if (newStatus === 'selected') {
      confetti({ particleCount: 70, spread: 65 });
      setActiveAlert({
        title: '🎉 Congratulations!',
        message: 'Application marked as Selected. Super proud of you!',
      });
    }
  }, [viewingApplication]);

  const handleAddFromListing = useCallback((listing: InternshipListing) => {
    const newApp: Application = {
      id: `app-from-listing-${Date.now()}`,
      userId: student.id,
      companyName: listing.companyName,
      jobRole: listing.jobRole,
      jobDescription: listing.description,
      applicationDate: new Date().toISOString().split('T')[0],
      deadline: listing.deadline,
      jobUrl: listing.applicationUrl,
      status: 'applied',
      notes: `Applied through official campus listing. Stipend: ${listing.stipend}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
    confetti({ particleCount: 50, spread: 50 });
    setActiveAlert({
      title: 'Added to Tracker',
      message: `${listing.companyName} is now tracked in My Applications.`,
    });
  }, [student.id]);

  const handleUpdateProfile = useCallback((updated: Partial<StudentUser>) => {
    setStudent((prev) => ({ ...prev, ...updated }));
    setActiveAlert({
      title: 'Profile Saved',
      message: 'Student academic details updated successfully.',
    });
  }, []);

  // Admin Handlers
  const handleToggleUserActive = useCallback((userId: string) => {
    toggleBackendUserActive(userId).catch(() => {});
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  }, []);

  const handleSaveListing = useCallback((data: Partial<InternshipListing>) => {
    if (data.id) {
      setListings((prev) =>
        prev.map((l) => (l.id === data.id ? { ...l, ...data } as InternshipListing : l))
      );
      setActiveAlert({
        title: 'Listing Updated',
        message: `${data.companyName} opportunity updated.`,
      });
    } else {
      const newListing: InternshipListing = {
        id: `list-${Date.now()}`,
        companyName: data.companyName || 'Company',
        jobRole: data.jobRole || 'Software Engineering Intern',
        description: data.description || '',
        requiredSkills: data.requiredSkills || '',
        location: data.location || 'Remote',
        stipend: data.stipend || '$60 / hour',
        deadline: data.deadline || '2026-11-20',
        applicationUrl: data.applicationUrl || 'https://careers.company.com',
        category: data.category || categories[0] || 'Software Development',
        isPublished: true,
        postedAt: new Date().toISOString().split('T')[0],
      };
      setListings((prev) => [newListing, ...prev]);
      // Add activity log
      setActivityLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          title: 'New Listing Published',
          description: `Admin published ${newListing.companyName} - ${newListing.jobRole}.`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev,
      ]);
      setActiveAlert({
        title: 'Listing Published',
        message: 'Opportunity is now visible to all students on campus feed.',
      });
    }
  }, [categories]);

  const handleDeleteListing = useCallback((id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const handleTogglePublishListing = useCallback((id: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPublished: !l.isPublished } : l))
    );
  }, []);

  const handleAddCategory = useCallback((name: string) => {
    if (!categories.includes(name)) {
      setCategories((prev) => [...prev, name]);
      setActiveAlert({
        title: 'Category Added',
        message: `Category "${name}" created.`,
      });
    }
  }, [categories]);

  const handleDeleteCategory = useCallback((name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  }, []);

  const handleResetData = useCallback(() => {
    resetAllData();
    setRole('user');
    setStudent(loadStudentProfile());
    setApplications(loadApplications());
    setUsers(loadUsers());
    setListings(loadListings());
    setCategories(loadCategories());
    setActivityLogs(loadActivityLogs());
    setActiveAlert({
      title: 'Data Reset',
      message: 'Restored original demo data for user and admin.',
    });
  }, []);

  const handleLogin = useCallback((user: AuthUser, profile?: StudentUser) => {
    setAuthUser(user);
    saveAuthUser(user);
    setRole(user.role);
    saveUserRole(user.role);
    if (user.role === 'user') {
      if (profile) {
        setStudent(profile);
        saveStudentProfile(profile);
      } else {
        setStudent((prev) => ({
          ...prev,
          name: user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      }
    }
    // Re-sync backend users
    fetchBackendUsers()
      .then((backendUsers) => {
        if (backendUsers && backendUsers.length > 0) setUsers(backendUsers);
      })
      .catch(() => {});

    setActiveAlert({
      title: `Signed In`,
      message: `Welcome, ${user.name}! Accessing ${user.role === 'admin' ? 'Admin Portal' : 'Student Tracker'}.`,
    });
  }, []);

  const handleLogout = useCallback(() => {
    setAuthUser(null);
    saveAuthUser(null);
    setActiveAlert({
      title: 'Signed Out',
      message: 'You have been safely signed out. Login anytime.',
    });
  }, []);

  if (!authUser) {
    return (
      <MobileFrame>
        <AlertToast
          alert={activeAlert}
          onDismiss={() => setActiveAlert(null)}
        />
        <LoginScreen onLogin={handleLogin} />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      {/* Top Banner Alert Simulation */}
      <AlertToast
        alert={activeAlert}
        onDismiss={() => setActiveAlert(null)}
      />

      {/* Top Header */}
      <TopAppBar
        currentRole={role}
        onOpenRoleSwitcher={() => setIsRoleSwitcherOpen(true)}
        onOpenAddModal={() => {
          if (role === 'admin') {
            setAdminTab('listings');
          } else {
            setEditingApplication(null);
            setIsAddModalOpen(true);
          }
        }}
        onTriggerBellAlert={() => {
          if (role === 'user') {
            setStudentTab('reminders');
          } else {
            setAdminTab('logs');
          }
        }}
        unreadAlertsCount={upcomingInterviewsCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {role === 'user' ? (
          <>
            {studentTab === 'dashboard' && (
              <StudentDashboard
                student={student}
                applications={applications}
                listings={listings}
                onNavigateTab={(tab) => setStudentTab(tab)}
                onOpenAddModal={() => {
                  setEditingApplication(null);
                  setIsAddModalOpen(true);
                }}
                onSelectApplication={(app) => setViewingApplication(app)}
              />
            )}

            {studentTab === 'applications' && (
              <StudentApplications
                applications={applications}
                onOpenAddModal={() => {
                  setEditingApplication(null);
                  setIsAddModalOpen(true);
                }}
                onEditApplication={(app) => {
                  setEditingApplication(app);
                  setIsAddModalOpen(true);
                }}
                onDeleteApplication={handleDeleteApplication}
                onUpdateStatus={handleUpdateStatus}
                onSelectApplication={(app) => setViewingApplication(app)}
              />
            )}

            {studentTab === 'reminders' && (
              <StudentReminders
                applications={applications}
                onSelectApplication={(app) => setViewingApplication(app)}
                onSendAlertToast={(title, message) => setActiveAlert({ title, message })}
              />
            )}

            {studentTab === 'discover' && (
              <StudentDiscover
                listings={listings}
                categories={categories}
                applications={applications}
                onAddFromListing={handleAddFromListing}
              />
            )}

            {studentTab === 'profile' && (
              <StudentProfile
                student={student}
                onUpdateProfile={handleUpdateProfile}
                onSwitchToAdmin={() => setRole('admin')}
                onResetData={handleResetData}
                onLogout={handleLogout}
              />
            )}
          </>
        ) : (
          <AdminPanel
            currentTab={adminTab}
            users={users}
            applications={applications}
            listings={listings}
            categories={categories}
            activityLogs={activityLogs}
            onToggleUserActive={handleToggleUserActive}
            onSaveListing={handleSaveListing}
            onDeleteListing={handleDeleteListing}
            onTogglePublishListing={handleTogglePublishListing}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onSwitchToStudent={() => setRole('user')}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        currentRole={role}
        studentTab={studentTab}
        onStudentTabChange={(t) => setStudentTab(t)}
        adminTab={adminTab}
        onAdminTabChange={(t) => setAdminTab(t)}
        interviewsCount={upcomingInterviewsCount}
      />

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
        currentRole={role}
        onSelectRole={(r) => {
          setRole(r);
          setIsRoleSwitcherOpen(false);
          if (authUser) {
            const updatedAuth: AuthUser = {
              ...authUser,
              role: r,
              email: r === 'admin' ? 'admin@interntrack.edu' : (student.email || 'harshbhalke07@gmail.com'),
              name: r === 'admin' ? 'Career Officer (Admin)' : student.name,
            };
            setAuthUser(updatedAuth);
          }
        }}
        onLogout={handleLogout}
      />

      {/* Add / Edit Application Modal */}
      <AddApplicationModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleSaveApplication}
        initialApplication={editingApplication}
      />

      {/* Application Detail View Modal */}
      <ApplicationDetailModal
        application={viewingApplication}
        onClose={() => setViewingApplication(null)}
        onEdit={(app) => {
          setViewingApplication(null);
          setEditingApplication(app);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteApplication}
        onUpdateStatus={handleUpdateStatus}
      />
    </MobileFrame>
  );
}
