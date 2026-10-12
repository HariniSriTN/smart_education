import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Menu, Search, Bell, RotateCcw, User as UserIcon, 
  Settings, LogOut, CheckCircle2, BookOpen, 
  Clock, X, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resetDemoData, getCourses, getAssessments, getResources } from '../../data/storage';
import { useToast } from '../common/Toast';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { currentUser, logout, notifications, unreadNotifsCount, markAllNotificationsRead, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { info, success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick Global Search Results
  const courses = getCourses();
  const assessments = getAssessments();
  const resources = getResources();

  const searchResults = searchQuery.trim().length > 1 ? [
    ...courses
      .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 3)
      .map(c => ({ id: c.id, title: c.title, category: c.category, type: 'Course', link: `/courses/${c.id}` })),
    ...assessments
      .filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subject.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 2)
      .map(a => ({ id: a.id, title: a.title, category: a.subject, type: 'Assessment', link: `/assessments/${a.id}/take` })),
    ...resources
      .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 2)
      .map(r => ({ id: r.id, title: r.title, category: r.subject, type: 'Resource', link: '/library' }))
  ] : [];

  // Breadcrumbs generator
  const pathnames = location.pathname.split('/').filter(x => x);
  const getBreadcrumbName = (part: string) => {
    switch (part) {
      case 'catalogue': return 'Course Catalogue';
      case 'my-learning': return 'My Learning';
      case 'library': return 'Trainer Library';
      case 'assessments': return 'Assessments';
      case 'competencies': return 'Competency Mapping';
      case 'certifications': return 'Certifications';
      case 'announcements': return 'Announcements';
      case 'feedback': return 'Feedback';
      case 'reports': return 'Reports & Analytics';
      case 'users': return 'User Management';
      case 'settings': return 'Settings';
      case 'courses': return 'Courses';
      case 'manage': return 'Manage';
      default: return part.charAt(0).toUpperCase() + part.slice(1);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default MoES/IMD state?')) {
      resetDemoData();
    }
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 md:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-hidden">
          <Link to="/" className="text-slate-700 hover:text-blue-600 font-semibold truncate">
            Portal
          </Link>
          {pathnames.length > 0 && <span className="text-slate-400">/</span>}
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            return (
              <React.Fragment key={routeTo}>
                {isLast ? (
                  <span className="text-blue-700 font-semibold truncate">
                    {getBreadcrumbName(name)}
                  </span>
                ) : (
                  <>
                    <Link to={routeTo} className="hover:text-blue-600 truncate">
                      {getBreadcrumbName(name)}
                    </Link>
                    <span className="text-slate-400">/</span>
                  </>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchRef} className="relative flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, radar datasets, assessments..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-lg border border-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchOpen && searchQuery.trim().length > 1 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
            <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Matching Records</span>
              <span>{searchResults.length} found</span>
            </div>
            {searchResults.length > 0 ? (
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {searchResults.map((res) => (
                  <button
                    key={`${res.type}-${res.id}`}
                    onClick={() => {
                      navigate(res.link);
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2.5 hover:bg-blue-50/60 transition-colors flex items-center justify-between group"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-700 truncate">
                        {res.title}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{res.category}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {res.type}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching materials found for "{searchQuery}".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Role Quick Indicator Switcher (top bar convenience) */}
        <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => { switchDemoRole('trainee'); info('Role Switched', 'Viewing as Trainee (Priya Sharma)'); }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentUser.role === 'trainee' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trainee
          </button>
          <button
            onClick={() => { switchDemoRole('trainer'); info('Role Switched', 'Viewing as Trainer (Dr. Venkataraman)'); }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentUser.role === 'trainer' ? 'bg-white text-purple-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trainer
          </button>
          <button
            onClick={() => { switchDemoRole('admin'); info('Role Switched', 'Viewing as Admin (Shri R.K. Saxena)'); }}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              currentUser.role === 'admin' ? 'bg-white text-amber-700 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Admin
          </button>
        </div>

        {/* Reset Demo Data Button */}
        <button
          onClick={handleReset}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="Reset Demo Data to Initial MoES State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={() => {
                      markAllNotificationsRead();
                      success('All notifications marked as read');
                    }}
                    className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link) navigate(n.link);
                        setNotifOpen(false);
                      }}
                      className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-slate-800 leading-snug">{n.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none truncate max-w-[120px]">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mt-0.5">
                {currentUser.role}
              </p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 py-1">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                <span className="mt-1.5 inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {currentUser.designation}
                </span>
              </div>

              <button
                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" /> My Profile
              </button>
              <button
                onClick={() => { navigate('/settings'); setProfileOpen(false); }}
                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" /> Account Settings
              </button>

              <div className="border-t border-slate-100 my-1" />

              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
