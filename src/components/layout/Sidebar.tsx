import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, GraduationCap, Library, CheckSquare, 
  Award, Bell, MessageSquare, BarChart3, Users, Settings, 
  LogOut, ChevronLeft, ChevronRight, UserCheck, FolderKanban, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen
}) => {
  const { currentUser, logout, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const { info } = useToast();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Define navigation items per role
  const navItems = [
    // Common Dashboard
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    
    // Trainee items
    ...(role === 'trainee' ? [
      { path: '/catalogue', label: 'Course Catalogue', icon: BookOpen },
      { path: '/my-learning', label: 'My Learning', icon: GraduationCap },
      { path: '/library', label: 'Trainer Library', icon: Library },
      { path: '/assessments', label: 'Assessments', icon: CheckSquare },
      { path: '/competencies', label: 'Competency Mapping', icon: UserCheck },
      { path: '/certifications', label: 'Certifications', icon: Award },
      { path: '/announcements', label: 'Announcements', icon: Bell },
      { path: '/feedback', label: 'Feedback', icon: MessageSquare },
    ] : []),

    // Trainer items
    ...(role === 'trainer' ? [
      { path: '/courses/manage', label: 'Course Management', icon: FolderKanban },
      { path: '/catalogue', label: 'Course Catalogue', icon: BookOpen },
      { path: '/library', label: 'Trainer Library', icon: Library },
      { path: '/assessments', label: 'Assessments & Tests', icon: CheckSquare },
      { path: '/competencies', label: 'Competency Mapping', icon: UserCheck },
      { path: '/announcements', label: 'Announcements', icon: Bell },
      { path: '/feedback', label: 'Course Feedback', icon: MessageSquare },
      { path: '/reports', label: 'Training Reports', icon: BarChart3 },
    ] : []),

    // Admin items
    ...(role === 'admin' ? [
      { path: '/users', label: 'User Management', icon: Users },
      { path: '/courses/manage', label: 'Course Management', icon: FolderKanban },
      { path: '/catalogue', label: 'Course Catalogue', icon: BookOpen },
      { path: '/library', label: 'Trainer Library', icon: Library },
      { path: '/assessments', label: 'Assessments', icon: CheckSquare },
      { path: '/competencies', label: 'Competency Mapping', icon: UserCheck },
      { path: '/certifications', label: 'Certifications', icon: Award },
      { path: '/announcements', label: 'Announcements', icon: Bell },
      { path: '/feedback', label: 'Feedback Review', icon: MessageSquare },
      { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    ] : []),

    // Shared items
    { path: '/settings', label: 'Profile & Settings', icon: Settings },
  ];

  const handleRoleChange = (targetRole: 'trainee' | 'trainer' | 'admin') => {
    switchDemoRole(targetRole);
    info('Role Switched', `Active view changed to ${targetRole.toUpperCase()}`);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#102A43] text-slate-100 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0 shadow-md">
            <span className="font-bold text-white text-base">CC</span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-bold text-sm tracking-wide text-white truncate">CAPACITY CONNECT</h1>
              <p className="text-[10px] text-sky-300 uppercase tracking-wider font-medium truncate">MoES • IMD PORTAL</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Pill Display */}
      {!collapsed && (
        <div className="px-4 py-3 bg-[#0d2236] border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400">ACTIVE ROLE</span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
              role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              role === 'trainer' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
              'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {role}
            </span>
          </div>
          <div className="mt-1.5 truncate text-xs text-slate-300 font-medium">
            {currentUser.name}
          </div>
          <div className="truncate text-[11px] text-slate-400">
            {currentUser.department}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                } ${collapsed ? 'justify-center px-2' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Demo Switcher Section */}
      <div className="p-3 border-t border-slate-800 bg-[#0d2236]">
        {!collapsed && (
          <div className="mb-2">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-sky-400" /> Demo Switcher
            </span>
          </div>
        )}
        <div className={`flex gap-1 ${collapsed ? 'flex-col items-center' : ''}`}>
          <button
            onClick={() => handleRoleChange('trainee')}
            className={`px-2 py-1 text-[11px] rounded transition-all font-medium ${
              role === 'trainee'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            } ${collapsed ? 'w-8 h-8 flex items-center justify-center p-0' : 'flex-1'}`}
            title="Switch to Trainee View"
          >
            {collapsed ? 'TR' : 'Trainee'}
          </button>
          <button
            onClick={() => handleRoleChange('trainer')}
            className={`px-2 py-1 text-[11px] rounded transition-all font-medium ${
              role === 'trainer'
                ? 'bg-purple-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            } ${collapsed ? 'w-8 h-8 flex items-center justify-center p-0' : 'flex-1'}`}
            title="Switch to Trainer View"
          >
            {collapsed ? 'TN' : 'Trainer'}
          </button>
          <button
            onClick={() => handleRoleChange('admin')}
            className={`px-2 py-1 text-[11px] rounded transition-all font-medium ${
              role === 'admin'
                ? 'bg-amber-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            } ${collapsed ? 'w-8 h-8 flex items-center justify-center p-0' : 'flex-1'}`}
            title="Switch to Admin View"
          >
            {collapsed ? 'AD' : 'Admin'}
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`mt-2 flex items-center gap-2.5 w-full px-2.5 py-1.5 text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded transition-colors ${
            collapsed ? 'justify-center px-1' : ''
          }`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 z-30 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="fixed inset-y-0 left-0 h-screen transition-all duration-300 z-30" style={{ width: collapsed ? '4rem' : '16rem' }}>
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
