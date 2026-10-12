import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, LayoutGrid, List, BookOpen, 
  Clock, Award, Star, ArrowRight, CheckCircle2, 
  X, Check, Sparkles
} from 'lucide-react';
import { getCourses, getUserEnrollments, enrollInCourse } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { CourseDifficulty } from '../../types';

export const CourseCatalogue: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [courses, setCourses] = useState(getCourses());
  const [enrollments, setEnrollments] = useState(
    currentUser ? getUserEnrollments(currentUser.id) : []
  );

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const categories = [
    'All',
    'Meteorology',
    'Weather Forecasting',
    'Satellite Meteorology',
    'Climate Science',
    'Python for Scientific Computing',
    'Disaster Risk Reduction'
  ];

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  const handleEnroll = (e: React.MouseEvent, courseId: string, courseTitle: string) => {
    e.stopPropagation();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    enrollInCourse(currentUser.id, courseId);
    setEnrollments(getUserEnrollments(currentUser.id));
    success('Enrolled Successfully', `You have been registered for "${courseTitle}".`);
  };

  // Filter & sort logic
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesDiff = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    return matchesSearch && matchesCat && matchesDiff;
  }).sort((a, b) => {
    if (sortBy === 'popular') return b.enrolledCount - a.enrolledCount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Official Course Directory
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Scientific Training Course Catalogue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Accredited capacity-building modules across operational meteorology, radar science, and climate dynamics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                viewMode === 'table' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, model code (e.g. MOES-NWP), or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none flex-1 sm:flex-initial"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none flex-1 sm:flex-initial"
            >
              <option value="popular">Most Enrolled</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Recently Updated</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing <strong className="text-slate-900">{filteredCourses.length}</strong> specialized training modules</span>
        {(search || selectedCategory !== 'All' || selectedDifficulty !== 'All') && (
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
            className="text-blue-600 hover:underline font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => {
            const isEnrolled = enrolledCourseIds.has(c.id);

            return (
              <div
                key={c.id}
                onClick={() => navigate(`/courses/${c.id}`)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between overflow-hidden cursor-pointer group"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={c.thumbnail}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white">
                        {c.category}
                      </span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.difficulty === 'Advanced' ? 'bg-amber-500/90 text-white' :
                        c.difficulty === 'Intermediate' ? 'bg-blue-500/90 text-white' :
                        'bg-emerald-500/90 text-white'
                      }`}>
                        {c.difficulty}
                      </span>
                    </div>

                    {isEnrolled && (
                      <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                        <Check className="w-3 h-3" /> Enrolled
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>{c.code}</span>
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {c.rating} ({c.ratingCount})
                      </span>
                    </div>

                    <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                      {c.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{c.trainerName}</span>
                    <span>{c.duration}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {isEnrolled ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/courses/${c.id}/learn`);
                        }}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Continue Course
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleEnroll(e, c.id, c.title)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        Enroll Now ({c.enrolledCount} learners)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold text-[11px]">
                <th className="p-4">Course</th>
                <th className="p-4">Category</th>
                <th className="p-4">Faculty</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((c) => {
                const isEnrolled = enrolledCourseIds.has(c.id);

                return (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/courses/${c.id}`)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 hover:text-blue-600">{c.title}</p>
                          <p className="text-[10px] text-slate-400">{c.code} • {c.difficulty}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{c.category}</td>
                    <td className="p-4 text-slate-600">{c.trainerName}</td>
                    <td className="p-4 text-slate-600">{c.duration}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        ★ {c.rating}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {isEnrolled ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${c.id}/learn`);
                          }}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold"
                        >
                          Resume
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleEnroll(e, c.id, c.title)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold"
                        >
                          Enroll
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
