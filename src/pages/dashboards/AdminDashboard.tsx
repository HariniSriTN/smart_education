import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, GraduationCap, Award, BookOpen, Clock, 
  TrendingUp, CheckCircle, XCircle, ArrowUpRight, 
  FileText, Plus, Bell, ChevronRight, Activity, 
  Check, X, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { 
  getUsers, getCourses, getEnrollments, getCertificates, 
  getActivities, approveUser, rejectUser, getAssessments,
  addAnnouncement
} from '../../data/storage';
import { useToast } from '../../components/common/Toast';

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [users, setUsers] = useState(getUsers());
  const [courses] = useState(getCourses());
  const [enrollments] = useState(getEnrollments());
  const [certificates] = useState(getCertificates());
  const [activities] = useState(getActivities());
  const [assessments] = useState(getAssessments());

  // Announcement modal state
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annCategory, setAnnCategory] = useState<'New Courses' | 'Training Schedules' | 'Assessment Deadlines' | 'General Announcements'>('General Announcements');
  const [annContent, setAnnContent] = useState('');

  // Approval handlers
  const handleApprove = (userId: string, name: string) => {
    approveUser(userId);
    setUsers(getUsers());
    success('User Approved', `${name} now has active access to the portal.`);
  };

  const handleReject = (userId: string, name: string) => {
    if (window.confirm(`Reject registration request for ${name}?`)) {
      rejectUser(userId);
      setUsers(getUsers());
      info('User Rejected', `${name}'s registration was rejected.`);
    }
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      id: 'ann-' + Date.now(),
      title: annTitle,
      category: annCategory,
      priority: 'Normal',
      content: annContent,
      publishDate: new Date().toISOString().split('T')[0],
      author: currentUser?.name || 'Administrator',
      authorRole: 'Director (Training)',
      readBy: []
    });

    setShowAnnounceModal(false);
    setAnnTitle('');
    setAnnContent('');
    success('Announcement Published', 'All trainees and faculty have been notified.');
  };

  // Metrics
  const totalUsers = users.length;
  const activeTrainees = users.filter(u => u.role === 'trainee' && u.status === 'active').length;
  const totalTrainers = users.filter(u => u.role === 'trainer').length;
  const publishedCourses = courses.filter(c => c.status === 'published').length;
  const totalEnrollments = enrollments.length;
  const totalCertificates = certificates.length;
  const pendingUsers = users.filter(u => u.status === 'pending');

  // Chart data
  const registrationTrends = [
    { month: 'Nov 25', users: 120, enrollments: 180 },
    { month: 'Dec 25', users: 165, enrollments: 240 },
    { month: 'Jan 26', users: 210, enrollments: 320 },
    { month: 'Feb 26', users: 285, enrollments: 410 },
    { month: 'Mar 26', users: 370, enrollments: 530 },
    { month: 'Apr 26', users: 445, enrollments: 680 }
  ];

  const categoryDistribution = [
    { name: 'Meteorology', value: 384, color: '#2563EB' },
    { name: 'Weather Forecasting', value: 520, color: '#38BDF8' },
    { name: 'Satellite Met', value: 462, color: '#818CF8' },
    { name: 'Python Science', value: 610, color: '#10B981' },
    { name: 'Climate Science', value: 320, color: '#F59E0B' },
    { name: 'Disaster Risk', value: 440, color: '#EC4899' },
  ];

  const assessmentStats = [
    { name: 'Radar DWR Ops', passed: 410, failed: 45 },
    { name: 'Python NetCDF', passed: 520, failed: 38 },
    { name: 'Satellite ADT', passed: 380, failed: 62 },
    { name: 'NWP Models', passed: 290, failed: 55 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              Administrative Control Center
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Platform Overview
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor organizational capacity development, course completion trends, and national training compliance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAnnounceModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-blue-600" /> Publish Notice
          </button>
          <button
            onClick={() => navigate('/courses/manage')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" /> Manage Courses
          </button>
          <button
            onClick={() => navigate('/users')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5" /> Manage Personnel
          </button>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Total Users</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalUsers}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" /> +14% this month
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Active Trainees</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{activeTrainees}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" /> 89% engagement
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Faculty Trainers</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalTrainers}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
            Across 5 Divisions
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Published Courses</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{publishedCourses}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">
            <CheckCircle className="w-3 h-3" /> 100% active
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Total Enrollments</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalEnrollments + 2736}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" /> +240 this quarter
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium text-slate-500">Certificates Issued</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalCertificates + 840}</p>
          <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-semibold">
            <CheckCircle className="w-3 h-3" /> 84% pass rate
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration & Enrollment Trends */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Training Engagement & Enrollment Velocity</h2>
              <p className="text-[11px] text-slate-400">Monthly MoES personnel registrations vs course enrollments</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              FY 2025-26
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="enrollments" name="Course Enrollments" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#enrollGrad)" />
                <Area type="monotone" dataKey="users" name="New Personnel" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Enrolled Learners by Domain</h2>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Share</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Distribution across meteorological & climate disciplines</p>
          </div>

          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900">2,746</span>
              <span className="text-[10px] text-slate-400 uppercase">Learners</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-100 text-[11px]">
            {categoryDistribution.slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Pending User Approvals & Assessment Pass Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Approvals (Interactive admin action) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Pending Account Approvals ({pendingUsers.length})
                </h2>
                <p className="text-[11px] text-slate-400">Newly registered personnel awaiting administrative verification</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/users')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {pendingUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold text-[11px]">
                    <th className="pb-2">Officer Name</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Designation</th>
                    <th className="pb-2">Requested Role</th>
                    <th className="pb-2 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 font-medium text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px]">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-600 truncate max-w-[140px]">{u.department}</td>
                      <td className="py-2.5 text-slate-600">{u.designation}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleApprove(u.id, u.name)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(u.id, u.name)}
                          className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-md text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-xs font-semibold text-slate-800">No Pending Approvals</p>
              <p className="text-[11px] text-slate-400 mt-0.5">All registered government personnel have been reviewed.</p>
            </div>
          )}
        </div>

        {/* Assessment Completion & Pass Rates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-slate-900">Assessment Pass Rates</h2>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                91.4% Avg
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Passing vs failure scores on timed subject examinations</p>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assessmentStats} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                />
                <Bar dataKey="passed" name="Passed" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="failed" name="Needs Retake" fill="#F43F5E" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Minimum passing benchmark: 70%</span>
            <button onClick={() => navigate('/assessments')} className="text-blue-600 font-semibold hover:underline">
              View Tests →
            </button>
          </div>
        </div>
      </div>

      {/* Row: Recent Platform Activity & Published Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Platform Activity</h2>
            </div>
            <span className="text-[11px] text-slate-400">Live Event Feed</span>
          </div>

          <div className="space-y-3.5">
            {activities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-medium leading-snug">{act.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{act.timestamp} • {act.user}</p>
                </div>
                {act.meta && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {act.meta}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recently Published Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Operational Courses Catalogue</h2>
            <button
              onClick={() => navigate('/catalogue')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Browse All <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/courses/${c.id}`)}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-11 h-11 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 truncate">
                      {c.title}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {c.code} • {c.trainerName} • {c.duration}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <span className="text-xs font-bold text-slate-800">{c.enrolledCount}</span>
                  <p className="text-[10px] text-slate-400">Officers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publish Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Publish Official Training Announcement</h2>
              </div>
              <button onClick={() => setShowAnnounceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandatory Pre-Monsoon Radar Refresher Schedule"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={annCategory}
                  onChange={(e) => setAnnCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                >
                  <option value="General Announcements">General Announcements</option>
                  <option value="Training Schedules">Training Schedules</option>
                  <option value="New Courses">New Courses</option>
                  <option value="Assessment Deadlines">Assessment Deadlines</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Announcement Body *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter detailed directives, target meteorological batches, and instructions..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
