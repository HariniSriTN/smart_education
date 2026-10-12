import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Users, Award, Star, Plus, Upload, 
  CheckSquare, MessageSquare, ArrowRight, TrendingUp, 
  FileText, ExternalLink, ChevronRight, X
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid 
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { 
  getCourses, getEnrollments, getAssessments, 
  getFeedback, addCourse, addResource 
} from '../../data/storage';
import { useToast } from '../../components/common/Toast';
import { Course, LearningResource } from '../../types';

export const TrainerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [courses, setCourses] = useState(getCourses());
  const [enrollments] = useState(getEnrollments());
  const [assessments] = useState(getAssessments());
  const [feedback] = useState(getFeedback());

  // Modal states
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showUploadResourceModal, setShowUploadResourceModal] = useState(false);

  // New Course Form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    code: '',
    category: 'Meteorology',
    duration: '4 Weeks (28 Hours)',
    difficulty: 'Intermediate' as const,
    description: '',
    objectives: ''
  });

  // Resource Upload Form state
  const [resForm, setResForm] = useState({
    title: '',
    type: 'pdf' as const,
    subject: 'Meteorology',
    courseId: courses[0]?.id || '',
    description: '',
    fileSize: '6.4 MB'
  });

  const trainerCourses = courses.filter(c => c.trainerId === currentUser?.id || c.trainerName.includes('Venkataraman'));
  const totalTrainees = trainerCourses.reduce((sum, c) => sum + c.enrolledCount, 0);

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;

    const newCourse: Course = {
      id: 'course-' + Date.now(),
      title: courseForm.title,
      code: courseForm.code || `MOES-${Math.floor(100 + Math.random() * 900)}`,
      category: courseForm.category,
      trainerId: currentUser?.id || 'trainer-1',
      trainerName: currentUser?.name || 'Dr. M. K. Venkataraman',
      duration: courseForm.duration,
      difficulty: courseForm.difficulty,
      description: courseForm.description,
      learningObjectives: courseForm.objectives.split('\n').filter(Boolean),
      prerequisites: ['Basic Meteorology'],
      thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600',
      status: 'published',
      enrolledCount: 0,
      completionRate: 0,
      rating: 5.0,
      ratingCount: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      modules: [
        {
          id: 'mod-' + Date.now(),
          courseId: 'course-' + Date.now(),
          title: 'Module 1: Fundamental Concepts & Operational Setup',
          order: 1,
          lessons: [
            {
              id: 'les-' + Date.now(),
              moduleId: 'mod-' + Date.now(),
              title: 'Introduction & Scope of Subject',
              durationMinutes: 45,
              type: 'video',
              contentSummary: 'Overview of theory and field applications.',
              pdfNotes: 'Operational Lecture Note v1'
            }
          ]
        }
      ]
    };

    addCourse(newCourse);
    setCourses(getCourses());
    setShowCreateCourseModal(false);
    success('Course Created & Published', `"${newCourse.title}" is now available in the catalogue.`);
  };

  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resForm.title.trim()) return;

    const targetCourse = courses.find(c => c.id === resForm.courseId);

    const newResource: LearningResource = {
      id: 'res-' + Date.now(),
      title: resForm.title,
      type: resForm.type,
      subject: resForm.subject,
      courseId: resForm.courseId,
      courseTitle: targetCourse?.title || 'General Training',
      trainerName: currentUser?.name || 'Dr. M. K. Venkataraman',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: resForm.fileSize,
      description: resForm.description,
      viewCount: 1,
      downloadUrl: '#',
      isSimulated: true
    };

    addResource(newResource);
    setShowUploadResourceModal(false);
    success('Resource Uploaded', `"${newResource.title}" added to Trainer Library.`);
  };

  const participationData = [
    { name: 'NWP Models', enrolled: 384, completed: 300 },
    { name: 'DWR Radar', enrolled: 520, completed: 442 },
    { name: 'Sat Remote Sensing', enrolled: 462, completed: 379 },
    { name: 'DRR Warning', enrolled: 440, completed: 387 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              Faculty & Trainer Workspace
            </span>
            <span className="text-xs text-slate-400">
              {currentUser?.designation} • {currentUser?.department}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Trainer Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create curricula, manage scientific learning assets, monitor batch progress, and evaluate MCQ examinations.
          </p>
        </div>

        {/* Working Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowUploadResourceModal(true)}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-600" /> Upload Material
          </button>
          <button
            onClick={() => navigate('/assessments')}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5 text-purple-600" /> Manage Tests
          </button>
          <button
            onClick={() => setShowCreateCourseModal(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Create Course
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Managed Courses</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{trainerCourses.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Published & Active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Trained Personnel</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{totalTrainees}</p>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-emerald-600 font-semibold">
            <TrendingUp className="w-3 h-3" /> Across all batches
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Active Assessments</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{assessments.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Timed MCQ banks</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Faculty Rating</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">4.92 / 5.0</p>
          <p className="text-[11px] text-slate-400 mt-0.5">From 480 verified reviews</p>
        </div>
      </div>

      {/* Trainee Participation Chart & Feedback Snippets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Batch Participation & Completion</h2>
              <p className="text-[11px] text-slate-400">Total enrolled vs fully certified scientific officers</p>
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              83% Avg Completion
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#102A43', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="enrolled" name="Enrolled" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Learner Reviews</h2>
              <button onClick={() => navigate('/feedback')} className="text-xs font-semibold text-blue-600 hover:underline">
                View All →
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Recent feedback submitted by trainees</p>

            <div className="space-y-3">
              {feedback.slice(0, 2).map((fb) => (
                <div key={fb.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{fb.userName}</span>
                    <div className="flex text-amber-500 text-xs">
                      {'★'.repeat(fb.rating)}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    "{fb.comment}"
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block truncate">
                    {fb.courseTitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-[11px] text-slate-500">
            Average Content Clarity: <span className="font-bold text-slate-900">4.9 / 5.0</span>
          </div>
        </div>
      </div>

      {/* Managed Courses Table */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Faculty Managed Courses</h2>
            <p className="text-[11px] text-slate-400">Curricula assigned to your faculty profile</p>
          </div>
          <button
            onClick={() => navigate('/courses/manage')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            Course Manager <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                <th className="pb-3">Course Title</th>
                <th className="pb-3">Subject Category</th>
                <th className="pb-3">Enrolled</th>
                <th className="pb-3">Completion Rate</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trainerCourses.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <img src={c.thumbnail} alt="" className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200" />
                      <div>
                        <div>{c.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{c.code} • {c.duration}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600">{c.category}</td>
                  <td className="py-3 font-bold text-slate-800">{c.enrolledCount} officers</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.completionRate}%` }} />
                      </div>
                      <span className="font-semibold text-slate-700">{c.completionRate}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/courses/${c.id}`)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/courses/${c.id}/learn`)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Preview Lessons
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Course */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Create New Specialized Course</h2>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Polarimetric Radar Calibration and Wind Profiling"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Meteorology">Meteorology</option>
                    <option value="Weather Forecasting">Weather Forecasting</option>
                    <option value="Satellite Meteorology">Satellite Meteorology</option>
                    <option value="Climate Science">Climate Science</option>
                    <option value="Python for Scientific Computing">Python for Scientific Computing</option>
                    <option value="Disaster Risk Reduction">Disaster Risk Reduction</option>
                    <option value="Atmospheric Science">Atmospheric Science</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={(e) => setCourseForm({ ...courseForm, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the operational purpose, scientific models, and target participants..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Learning Objectives (One per line)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Master radar phase calibration&#10;Analyze wind profiler VAD algorithms"
                  value={courseForm.objectives}
                  onChange={(e) => setCourseForm({ ...courseForm, objectives: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Create & Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Resource */}
      {showUploadResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Upload Learning Material to Library</h2>
              <button onClick={() => setShowUploadResourceModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadResource} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SOP for Severe Squall Nowcasting in Eastern India"
                  value={resForm.title}
                  onChange={(e) => setResForm({ ...resForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Type</label>
                  <select
                    value={resForm.type}
                    onChange={(e) => setResForm({ ...resForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="pdf">PDF Manual / Document</option>
                    <option value="lecture">Recorded Lecture (MP4)</option>
                    <option value="presentation">Presentation (PPTX)</option>
                    <option value="document">Jupyter Notebook / Code</option>
                    <option value="questionnaire">Practice Questionnaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
                  <select
                    value={resForm.courseId}
                    onChange={(e) => setResForm({ ...resForm, courseId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of document or video contents..."
                  value={resForm.description}
                  onChange={(e) => setResForm({ ...resForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              {/* Simulated File Dropzone */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-700 font-semibold">Simulated File Upload</p>
                <p className="text-[11px] text-slate-400">PDF, PPTX, MP4, or IPYNB up to 100MB</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadResourceModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
