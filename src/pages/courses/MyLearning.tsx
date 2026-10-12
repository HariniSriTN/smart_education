import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, PlayCircle, Award, CheckCircle2, 
  Clock, BookOpen, Compass, ChevronRight 
} from 'lucide-react';
import { getCourses, getUserEnrollments } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';

export const MyLearning: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  const allCourses = getCourses();
  const enrollments = currentUser ? getUserEnrollments(currentUser.id) : [];

  const enrolledWithData = enrollments.map(enr => ({
    enrollment: enr,
    course: allCourses.find(c => c.id === enr.courseId) || {
      id: enr.courseId,
      title: 'Meteorology Course',
      code: 'MOES-MET',
      category: 'Meteorology',
      trainerName: 'Faculty Trainer',
      duration: '4 Weeks',
      thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600',
      modules: []
    }
  }));

  const filtered = enrolledWithData.filter(({ enrollment }) => {
    if (tab === 'in-progress') return enrollment.status === 'in-progress';
    if (tab === 'completed') return enrollment.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Personalized Curriculum
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            My Enrolled Learning Modules
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your course progress, attend scheduled lectures, and review certification status.
          </p>
        </div>

        <button
          onClick={() => navigate('/catalogue')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Compass className="w-4 h-4" /> Browse More Courses
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setTab('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            tab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Enrolled ({enrollments.length})
        </button>
        <button
          onClick={() => setTab('in-progress')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            tab === 'in-progress' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          In Progress ({enrollments.filter(e => e.status === 'in-progress').length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            tab === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({enrollments.filter(e => e.status === 'completed').length})
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length > 0 ? (
          filtered.map(({ enrollment, course }) => (
            <div
              key={enrollment.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40">
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {course.category}
                  </div>
                  {enrollment.status === 'completed' && (
                    <div className="absolute top-3 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-sm font-bold text-slate-900 line-clamp-1">{course.title}</h2>
                  <p className="text-xs text-slate-500 mt-1">{course.trainerName} • {course.duration}</p>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[11px] text-slate-500 font-medium">Progress</span>
                      <span className="text-xs font-bold text-blue-700">{enrollment.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Enrolled: {enrollment.enrolledDate}</span>
                  <span>{enrollment.completedLessonIds.length} lessons done</span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    {enrollment.status === 'completed' ? 'Review Course Material' : 'Continue Learning'}
                  </button>
                  {enrollment.status === 'completed' && (
                    <button
                      onClick={() => navigate('/certifications')}
                      className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold transition-colors"
                      title="View certificate"
                    >
                      <Award className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-12 text-center bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No courses matching this filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
