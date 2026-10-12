import React, { useState } from 'react';
import { 
  User as UserIcon, Settings, Lock, Bell, 
  ShieldCheck, CheckCircle2, Award, Briefcase, 
  GraduationCap, Mail, Phone, Building, Save, LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const ProfileSettings: React.FC = () => {
  const { currentUser, updateProfile, logout } = useAuth();
  const { success, info } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications'>('profile');

  // Edit Profile State
  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [bio, setBio] = useState(currentUser?.bio || '');

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Notification toggles
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifCourses, setNotifCourses] = useState(true);
  const [notifAnnouncements, setNotifAnnouncements] = useState(true);

  if (!currentUser) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      department,
      designation,
      phone,
      bio
    });
    success('Profile Updated', 'Your organizational details have been saved.');
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      info('Password Mismatch', 'New password and confirmation do not match.');
      return;
    }
    if (newPass.length < 6) {
      info('Weak Password', 'Password should be at least 6 characters.');
      return;
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    success('Password Changed', 'Demo password credentials updated successfully.');
  };

  return (
    <div className="space-y-6">
      {/* Top Profile Banner */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#163654] to-[#102A43] rounded-2xl p-6 md:p-8 text-white shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30">
                {currentUser.role}
              </span>
              <span className="text-xs text-slate-300">{currentUser.designation}</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">{currentUser.name}</h1>
            <p className="text-xs text-slate-300">{currentUser.department}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-center"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-soft flex gap-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Official Profile
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'password' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Password
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
            activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Bell className="w-4 h-4" /> Preferences
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Edit Personnel Details</h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Extension / Mobile</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Bio & Focus</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Profile Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4 h-fit">
            <h2 className="text-sm font-bold text-slate-900">Academic & Skills Credentials</h2>

            {currentUser.qualifications && (
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                  Qualifications
                </span>
                <ul className="space-y-1 text-xs text-slate-600">
                  {currentUser.qualifications.map((q, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentUser.skills && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                  Scientific Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentUser.skills.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-lg space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Change Workstation Password</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates your active demo session authentication credentials.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notification Preferences */}
      {activeTab === 'notifications' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-lg space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Notification & Alert Preferences</h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Assessment Deadline Alerts</p>
                <p className="text-[11px] text-slate-500">Receive reminders 48 hours prior to examination cutoff</p>
              </div>
              <input
                type="checkbox"
                checked={notifDeadlines}
                onChange={(e) => setNotifDeadlines(e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">New Course Releases</p>
                <p className="text-[11px] text-slate-500">Alerts when courses in your domain are published</p>
              </div>
              <input
                type="checkbox"
                checked={notifCourses}
                onChange={(e) => setNotifCourses(e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 cursor-pointer">
              <div>
                <p className="font-bold text-slate-800">Department Circulars & Bulletins</p>
                <p className="text-[11px] text-slate-500">Official directives from Director (Training)</p>
              </div>
              <input
                type="checkbox"
                checked={notifAnnouncements}
                onChange={(e) => setNotifAnnouncements(e.target.checked)}
                className="rounded text-blue-600 w-4 h-4"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
