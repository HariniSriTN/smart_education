import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, Clock, Award, Star, CheckCircle, 
  PlayCircle, Users, ArrowLeft, ChevronDown, 
  ChevronUp, FileText, Check, ShieldCheck, Share2 
} from 'lucide-react';
import { getCourseById, getUserEnrollments, enrollInCourse } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const course = getCourseById(id || '');
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    [course?.modules[0]?.id || '']: true
  });

  if (!course) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Course Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested course does not exist or has been archived.</p>
        <Link to="/catalogue" className="mt-4 inline-block text-xs font-semibold text-blue-600 hover:underline">
          Return to Course Catalogue
        </Link>
      </div>
    );
  }

  const enrollments = currentUser ? getUserEnrollments(currentUser.id) : [];
  const enrollment = enrollments.find(e => e.courseId === course.id);
  const isEnrolled = !!enrollment;

  const toggleModule = (modId: string) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnroll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    enrollInCourse(currentUser.id, course.id);
    success('Enrolled Successfully', `You are now enrolled in ${course.title}`);
    navigate(`/courses/${course.id}/learn`);
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/catalogue')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Course Catalogue
        </button>
      </div>

      {/* Main Hero Header */}
      <div className="bg-[#102A43] text-white rounded-2xl p-6 md:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30">
                {course.category}
              </span>
              <span className="text-xs text-slate-300">
                Course Code: <strong className="text-white">{course.code}</strong>
              </span>
              <span className="text-xs text-slate-300">•</span>
              <span className="text-xs text-amber-300 flex items-center gap-1 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                {course.rating} ({course.ratingCount} reviews)
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {course.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>{course.enrolledCount} Officers Enrolled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>{course.modules.length} Modules • {totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Official MoES Certification</span>
              </div>
            </div>
          </div>

          {/* Quick Action Side Card */}
          <div className="lg:w-80 bg-white text-slate-900 rounded-2xl p-5 shadow-xl border border-slate-200 shrink-0 flex flex-col justify-between">
            <div>
              <div className="relative rounded-xl overflow-hidden mb-4">
                <img src={course.thumbnail} alt="" className="w-full h-36 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-[11px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded">
                    Level: {course.difficulty}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Lead Faculty</span>
                  <span className="font-semibold text-slate-900">{course.trainerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Passing Criteria</span>
                  <span className="font-semibold text-slate-900">70% in Assessment</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Access Mode</span>
                  <span className="font-semibold text-emerald-600">On-Demand & Self-Paced</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {isEnrolled ? (
                <button
                  onClick={() => navigate(`/courses/${course.id}/learn`)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <PlayCircle className="w-4 h-4" />
                  Continue Course ({enrollment.progressPercentage}%)
                </button>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Enroll Now
                </button>
              )}
              <p className="text-[10px] text-center text-slate-400">
                Accredited for MoES Scientific Advancement Credits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Learning Objectives & Prerequisites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Core Learning Objectives
          </h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {course.learningObjectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600" />
            Recommended Prerequisites
          </h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {course.prerequisites.map((pre, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{pre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Course Curriculum Modules & Lessons */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Curriculum & Course Modules</h2>
            <p className="text-xs text-slate-400">{course.modules.length} Modules • {totalLessons} Interactive Lessons</p>
          </div>
        </div>

        <div className="space-y-3">
          {course.modules.map((mod, index) => {
            const isOpen = !!openModules[mod.id];

            return (
              <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{mod.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{mod.lessons.length} lessons</span>
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="divide-y divide-slate-100 bg-white">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 pl-6 flex items-center justify-between hover:bg-blue-50/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {lesson.type === 'video' ? (
                            <PlayCircle className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{lesson.title}</p>
                            <p className="text-[11px] text-slate-400">{lesson.contentSummary}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 pl-3">
                          <span className="text-[11px] text-slate-400 font-medium">
                            {lesson.durationMinutes} mins
                          </span>
                          {isEnrolled && enrollment.completedLessonIds.includes(lesson.id) && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
