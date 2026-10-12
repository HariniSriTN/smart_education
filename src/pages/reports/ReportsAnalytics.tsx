import React, { useState } from 'react';
import { 
  BarChart3, Download, Filter, TrendingUp, 
  Calendar, CheckCircle, Award, BookOpen, Users 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, 
  PieChart, Pie, Cell 
} from 'recharts';
import { getCourses, getUsers, getEnrollments, getCertificates } from '../../data/storage';
import { useToast } from '../../components/common/Toast';

export const ReportsAnalytics: React.FC = () => {
  const { success } = useToast();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [timeframe, setTimeframe] = useState('6months');

  const courses = getCourses();
  const users = getUsers();
  const enrollments = getEnrollments();
  const certificates = getCertificates();

  // Dataset
  const monthlyTrends = [
    { month: 'Nov 2025', trainees: 140, coursesCompleted: 95, passRate: 88 },
    { month: 'Dec 2025', trainees: 190, coursesCompleted: 135, passRate: 91 },
    { month: 'Jan 2026', trainees: 245, coursesCompleted: 180, passRate: 89 },
    { month: 'Feb 2026', trainees: 320, coursesCompleted: 230, passRate: 92 },
    { month: 'Mar 2026', trainees: 410, coursesCompleted: 310, passRate: 94 },
    { month: 'Apr 2026', trainees: 485, coursesCompleted: 375, passRate: 93 },
  ];

  const courseCompletionData = courses.map(c => ({
    name: c.title.split(' ')[0] + ' ' + (c.title.split(' ')[1] || ''),
    enrolled: c.enrolledCount,
    completion: c.completionRate
  }));

  const divisionStats = [
    { name: 'NWP Division', trainees: 412, completed: 340 },
    { name: 'Satellite Met', trainees: 530, completed: 420 },
    { name: 'Cyclone Warning', trainees: 310, completed: 285 },
    { name: 'Radar Network', trainees: 480, completed: 410 },
    { name: 'Climate Centre', trainees: 290, completed: 240 },
    { name: 'Agro-Met', trainees: 360, completed: 310 }
  ];

  // Genuine CSV Export Generation
  const handleExportCSV = () => {
    const csvRows = [
      ['Course Code', 'Course Title', 'Category', 'Faculty', 'Enrolled Count', 'Completion Rate (%)', 'Rating'],
      ...courses.map(c => [
        `"${c.code}"`,
        `"${c.title}"`,
        `"${c.category}"`,
        `"${c.trainerName}"`,
        c.enrolledCount,
        c.completionRate,
        c.rating
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MoES_Capacity_Connect_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    success('CSV Exported', 'Capacity building operational report downloaded.');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Institutional Analytics
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Reports & Training Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical breakdown of national meteorology workforce capacity building and learning progress.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-400 font-medium">Total Trained Officers</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">2,746</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +28% YoY growth
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-400 font-medium">Average Pass Rate</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">91.8%</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Above benchmark (85%)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-400 font-medium">Curricula Completed</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">2,280</p>
          <p className="text-[11px] text-slate-400 mt-1">Across 6 operational areas</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <span className="text-xs text-slate-400 font-medium">Accreditation Rate</span>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">84.2%</p>
          <p className="text-[11px] text-slate-400 mt-1">Issued with MoES digital seal</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trainee Growth & Course Completion Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Training Completion Trajectory</h2>
              <p className="text-[11px] text-slate-400">Monthly officers active vs courses fully certified</p>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              Trend
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="areaTrainees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Area type="monotone" dataKey="trainees" name="Active Learners" stroke="#2563EB" strokeWidth={2.5} fill="url(#areaTrainees)" />
                <Line type="monotone" dataKey="coursesCompleted" name="Certifications" stroke="#10B981" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Division Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Training Across Meteorological Divisions</h2>
              <p className="text-[11px] text-slate-400">Total participants enrolled vs completed per department</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Divisional
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={divisionStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                <Bar dataKey="trainees" name="Participants" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Course Completion Rate Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Course-Wise Completion Metrics</h2>
        <p className="text-[11px] text-slate-400 mb-4">Detailed retention and certification ratios</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                <th className="pb-3">Course Code & Title</th>
                <th className="pb-3">Discipline</th>
                <th className="pb-3">Enrolled</th>
                <th className="pb-3">Completion Bar</th>
                <th className="pb-3">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/70">
                  <td className="py-3 font-semibold text-slate-900">
                    {c.title} <span className="text-[10px] text-slate-400 font-normal">({c.code})</span>
                  </td>
                  <td className="py-3 text-slate-600">{c.category}</td>
                  <td className="py-3 font-bold text-slate-800">{c.enrolledCount}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${c.completionRate}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-700">{c.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-amber-500 font-bold">★ {c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
