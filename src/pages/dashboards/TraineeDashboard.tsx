import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, CheckCircle, Clock, Award, PlayCircle, 
  ArrowRight, Calendar, AlertCircle, Compass, 
  ExternalLink, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  getCourses, getUserEnrollments, getAssessments, 
  getCertificates, getAnnouncements 
} from '../../data/storage';

export const TraineeDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const allCourses = getCourses();
  const enrollments = getUserEnrollments(currentUser.id);
  const certificates = getCertificates().filter(c => c.userId === currentUser.id);
  const assessments = getAssessments();
  const announcements = getAnnouncements();

  // Matched Enrolled Courses
  const enrolledCoursesWithProgress = enrollments.map(enr => {
    const course = allCourses.find(c => c.id === enr.courseId);
    return {
      enrollment: enr,
      course: course || {
        id: enr.courseId,
        title: 'Meteorology Course',
        code: 'MOES-MET',
        category: 'Meteorology',
        trainerName: 'Faculty Lead',
        duration: '4 Weeks',
        thumbnail: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600',
        modules: []
      }
    };
  });

  const completedCount = enrollments.filter(e => e.status === 'completed').length;
  const inProgressCourses = enrolledCoursesWithProgress.filter(item => item.enrollment.status === 'in-progress');

  // Recommended courses (courses user not yet enrolled in)
  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));
  const recommendedCourses = allCourses.filter(c => !enrolledCourseIds.has(c.id)).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Header */}
      <div className="bg-gradient-to-r from-[#102A43] via-[#1b3a5b] to-[#102A43] rounded-2xl p-6 md:p-8 text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-sky-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/30 text-sky-300 border border-blue-400/30">
                  {currentUser.designation}
                </span>
                <span className="text-xs text-slate-300">{currentUser.department}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Continue your specialized training in Numerical Weather Prediction and Doppler Radar nowcasting. 
                Next assessment deadline is approaching in 14 days.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              onClick={() => navigate('/catalogue')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" /> Browse Course Catalogue
            </button>
            <button
              onClick={() => navigate('/assessments')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4 text-sky-300" /> Pending Assessments
            </button>
          </div>
        </div>
      </div>

      {/* 4 Trainee KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{enrollments.length}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{inProgressCourses.length} active in progress</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Completed Courses</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{completedCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% completion verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Learning Hours</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">56.5 Hrs</p>
          <p className="text-[11px] text-slate-400 mt-0.5">+8.5 hrs logged this month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold text-slate-500">Certificates Earned</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{certificates.length}</p>
          <button
            onClick={() => navigate('/certifications')}
            className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-0.5"
          >
            View credentials →
          </button>
        </div>
      </div>

      {/* Continue Learning Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Continue Learning</h2>
            <p className="text-xs text-slate-500">Resume your interactive lessons and operational tutorials</p>
          </div>
          <button
            onClick={() => navigate('/my-learning')}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            All Courses ({enrollments.length}) <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {inProgressCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.map(({ enrollment, course }) => (
              <div
                key={enrollment.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between bg-slate-50/30"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Trainer: {course.trainerName} • {course.duration}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[11px] text-slate-500 font-medium">Progress</span>
                      <span className="text-xs font-bold text-blue-700">
                        {enrollment.progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Completed: {enrollment.completedLessonIds.length} lessons
                  </span>
                  <button
                    onClick={() => navigate(`/courses/${course.id}/learn`)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-50 rounded-xl">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No active courses in progress</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Browse the catalogue to enroll in your next specialized training module.</p>
          </div>
        )}
      </div>

      {/* Row: Recommended Courses & Upcoming Assessments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Courses */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">Recommended for Your Profile</h2>
            </div>
            <span className="text-xs text-slate-400">Matched to NWP & Remote Sensing</span>
          </div>

          <div className="space-y-3.5">
            {recommendedCourses.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/courses/${c.id}`)}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {c.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors mt-1 truncate">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {c.trainerName} • {c.duration} • ⭐ {c.rating} ({c.ratingCount})
                    </p>
                  </div>
                </div>

                <button className="hidden sm:flex px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white rounded-lg transition-all items-center gap-1 shrink-0 ml-3">
                  Enroll <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Assessments & Deadlines */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-900">Assessments</h2>
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                Required
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Timed evaluation modules required for certification</p>

            <div className="space-y-3">
              {assessments.slice(0, 2).map((asm) => (
                <div key={asm.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {asm.title}
                    </h3>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                      {asm.durationMinutes}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Deadline: {asm.deadline}</span>
                    <span>Pass: {asm.passingScorePercent}%</span>
                  </div>
                  <button
                    onClick={() => navigate(`/assessments/${asm.id}/take`)}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    Start Timed Assessment
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => navigate('/announcements')}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center justify-between w-full"
            >
              <span>View Department Announcements</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
