import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FolderKanban, Plus, Search, Filter, Edit, 
  Trash2, Eye, CheckCircle, Archive, AlertCircle, 
  X, Check, ExternalLink, Star 
} from 'lucide-react';
import { getCourses, saveCourses, addCourse, updateCourse } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Course, CourseStatus, CourseDifficulty } from '../../types';

export const CourseManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [courses, setCourses] = useState(getCourses());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Edit / Create Modal state
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    code: '',
    category: 'Meteorology',
    duration: '4 Weeks (28 Hours)',
    difficulty: 'Intermediate' as CourseDifficulty,
    status: 'published' as CourseStatus,
    description: '',
    trainerName: currentUser?.name || 'Dr. M. K. Venkataraman'
  });

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      code: `MOES-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Meteorology',
      duration: '4 Weeks (28 Hours)',
      difficulty: 'Intermediate',
      status: 'published',
      description: '',
      trainerName: currentUser?.name || 'Dr. M. K. Venkataraman'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setFormData({
      title: c.title,
      code: c.code,
      category: c.category,
      duration: c.duration,
      difficulty: c.difficulty,
      status: c.status,
      description: c.description,
      trainerName: c.trainerName
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingCourse) {
      // Update
      const updated: Course = {
        ...editingCourse,
        ...formData,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      updateCourse(updated);
      setCourses(getCourses());
      success('Course Updated', `Changes to "${updated.title}" saved successfully.`);
    } else {
      // Create
      const newCourse: Course = {
        id: 'course-' + Date.now(),
        ...formData,
        trainerId: currentUser?.id || 'trainer-1',
        learningObjectives: ['Understand fundamental principles', 'Operational application in forecast office'],
        prerequisites: ['Basic Meteorology'],
        thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600',
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
            title: 'Module 1: Orientation and Foundations',
            order: 1,
            lessons: [
              {
                id: 'les-' + Date.now(),
                moduleId: 'mod-' + Date.now(),
                title: 'Overview of Module Objectives',
                durationMinutes: 45,
                type: 'video',
                contentSummary: 'Core principles and applications.'
              }
            ]
          }
        ]
      };
      addCourse(newCourse);
      setCourses(getCourses());
      success('Course Published', `"${newCourse.title}" created.`);
    }

    setIsModalOpen(false);
  };

  const toggleArchive = (c: Course) => {
    const newStatus: CourseStatus = c.status === 'published' ? 'archived' : 'published';
    const updated: Course = { ...c, status: newStatus };
    updateCourse(updated);
    setCourses(getCourses());
    info('Status Updated', `"${c.title}" is now ${newStatus}.`);
  };

  const filtered = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Curriculum Administration
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Course Management & Publishing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Oversee course lifecycle, publication status, faculty assignments, and syllabus configurations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses by code, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Disciplines</option>
            <option value="Meteorology">Meteorology</option>
            <option value="Weather Forecasting">Weather Forecasting</option>
            <option value="Satellite Meteorology">Satellite Meteorology</option>
            <option value="Climate Science">Climate Science</option>
            <option value="Python for Scientific Computing">Python Science</option>
            <option value="Disaster Risk Reduction">Disaster Risk</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
              <th className="p-4">Course Details</th>
              <th className="p-4">Discipline</th>
              <th className="p-4">Assigned Trainer</th>
              <th className="p-4">Enrollments</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900">{c.title}</p>
                      <p className="text-[10px] text-slate-400">{c.code} • {c.difficulty} • {c.duration}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{c.category}</td>
                <td className="p-4 text-slate-700 font-medium">{c.trainerName}</td>
                <td className="p-4">
                  <span className="font-bold text-slate-900">{c.enrolledCount}</span>
                  <span className="text-[10px] text-slate-400 block">{c.completionRate}% completed</span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    c.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                    c.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1 text-slate-500 hover:text-blue-600 transition-colors"
                    title="Edit course"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleArchive(c)}
                    className="p-1 text-slate-500 hover:text-amber-600 transition-colors"
                    title={c.status === 'published' ? 'Archive course' : 'Publish course'}
                  >
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/courses/${c.id}`)}
                    className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
                    title="View public details"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                {editingCourse ? 'Edit Course Curricula' : 'Create New Course'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Atmospheric Boundary Layer Turbulence Modeling"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Course Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Meteorology">Meteorology</option>
                    <option value="Weather Forecasting">Weather Forecasting</option>
                    <option value="Satellite Meteorology">Satellite Meteorology</option>
                    <option value="Climate Science">Climate Science</option>
                    <option value="Python for Scientific Computing">Python Science</option>
                    <option value="Disaster Risk Reduction">Disaster Risk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Course Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline purpose, scope, and target participants..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
