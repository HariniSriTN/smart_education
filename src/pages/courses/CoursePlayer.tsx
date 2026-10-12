import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, Pause, SkipBack, SkipForward, CheckCircle2, 
  Circle, ChevronLeft, ChevronRight, FileText, 
  Download, Award, BookOpen, AlertCircle, Share2, 
  Volume2, Maximize, RotateCcw, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  getCourseById, getUserEnrollments, updateLessonProgress, 
  enrollInCourse 
} from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Lesson, CourseModule } from '../../types';

export const CoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const course = getCourseById(id || '');

  // Flatten lessons list for easy previous/next navigation
  const allLessons: { lesson: Lesson; moduleTitle: string; index: number }[] = [];
  course?.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      allLessons.push({
        lesson: les,
        moduleTitle: mod.title,
        index: allLessons.length
      });
    });
  });

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);

  // Enrollments
  const enrollments = currentUser ? getUserEnrollments(currentUser.id) : [];
  let enrollment = enrollments.find(e => e.courseId === course?.id);

  // Auto-enroll if accessing player directly
  useEffect(() => {
    if (currentUser && course && !enrollment) {
      enrollment = enrollInCourse(currentUser.id, course.id);
    }
  }, [currentUser, course]);

  if (!course || allLessons.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">No lessons available</h2>
        <Link to="/catalogue" className="text-xs text-blue-600 underline mt-2 inline-block">
          Return to catalogue
        </Link>
      </div>
    );
  }

  const activeItem = allLessons[currentLessonIndex] || allLessons[0];
  const activeLesson = activeItem.lesson;
  const isLessonCompleted = enrollment?.completedLessonIds.includes(activeLesson.id) || false;

  const handleMarkComplete = () => {
    if (!currentUser) return;
    const updated = updateLessonProgress(currentUser.id, course.id, activeLesson.id);
    
    if (updated?.status === 'completed') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      success('Congratulations!', `You have completed "${course.title}"! Your certificate is now available.`);
    } else {
      success('Lesson Completed', `Progress updated to ${updated?.progressPercentage}%`);
    }

    // Auto move to next lesson if available
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setPlaybackTime(0);
      setIsPlaying(false);
    }
  };

  const progressPercentage = enrollment?.progressPercentage || 0;

  return (
    <div className="space-y-4">
      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate(`/courses/${course.id}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Exit player"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-xs md:text-sm font-bold text-slate-900 truncate">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              {activeItem.moduleTitle} • Lesson {currentLessonIndex + 1} of {allLessons.length}
            </p>
          </div>
        </div>

        {/* Progress Display & Certificate Link */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[11px] text-slate-400">Course Progress:</span>
            <span className="text-xs font-bold text-blue-700 ml-1.5">{progressPercentage}%</span>
            <div className="w-28 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {progressPercentage >= 100 && (
            <button
              onClick={() => navigate('/certifications')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Award className="w-3.5 h-3.5" /> Claim Certificate
            </button>
          )}
        </div>
      </div>

      {/* Main Learning Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Media & Interactive Lesson Viewport */}
        <div className="lg:col-span-2 space-y-4">
          {/* Simulated Video Player / Interactive Frame */}
          <div className="bg-[#0B1A28] rounded-2xl overflow-hidden border border-slate-800 shadow-xl relative aspect-video flex flex-col justify-between p-4 md:p-6 text-white select-none">
            {/* Top Video Bar */}
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="bg-blue-600/80 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                {activeLesson.type.toUpperCase()} LECTURE
              </span>
              <span className="text-[11px] text-slate-400">
                MoES Scientific Broadcast • 1080p Stream
              </span>
            </div>

            {/* Video Canvas Graphic Display */}
            <div className="flex flex-col items-center justify-center text-center my-auto px-4">
              <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-400/40 flex items-center justify-center mb-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
                </button>
              </div>

              <h2 className="text-sm md:text-base font-bold text-white max-w-md">
                {activeLesson.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mt-1">
                Faculty Instructor: {course.trainerName}
              </p>
              {isPlaying && (
                <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
                  Streaming simulated technical lecture feed...
                </div>
              )}
            </div>

            {/* Bottom Controls Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              {/* Progress Scrubber */}
              <div className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-sky-400 rounded-full transition-all duration-300"
                  style={{ width: isPlaying ? '48%' : isLessonCompleted ? '100%' : '15%' }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] font-mono text-slate-400">
                    {isPlaying ? '14:20' : '00:00'} / {activeLesson.durationMinutes}:00
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  <Maximize className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Action Controls */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentLessonIndex === 0}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous Lesson
              </button>
              <button
                onClick={handleNext}
                disabled={currentLessonIndex === allLessons.length - 1}
                className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                Next Lesson <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleMarkComplete}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs ${
                isLessonCompleted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isLessonCompleted ? 'Marked as Completed (Click again to verify)' : 'Mark Lesson as Completed'}
            </button>
          </div>

          {/* Operational Lesson Notes & Reading Content */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">{activeLesson.title}</h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {activeLesson.contentSummary}
              </p>
            </div>

            {/* Simulated Technical Notes / PDF Attachment */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Associated Scientific Monograph & Technical Notes
                </span>
                <span className="text-[10px] text-slate-500">PDF • Verified MoES Note</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {activeLesson.pdfNotes || 'Review the mathematical derivations, boundary conditions, and operational flowchart for this section.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Course Curriculum Navigation Drawer */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4 h-fit">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Curriculum Syllabus</h2>
            <p className="text-[11px] text-slate-400">Select any lesson to navigate directly</p>
          </div>

          <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-2">
                <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {modIdx + 1}
                  </span>
                  <span className="truncate">{mod.title}</span>
                </p>

                <div className="space-y-1 pl-7">
                  {mod.lessons.map((les) => {
                    const globalIdx = allLessons.findIndex(item => item.lesson.id === les.id);
                    const isActive = globalIdx === currentLessonIndex;
                    const isDone = enrollment?.completedLessonIds.includes(les.id);

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          setCurrentLessonIndex(globalIdx);
                          setPlaybackTime(0);
                          setIsPlaying(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                          isActive
                            ? 'bg-blue-50/80 border border-blue-200 font-bold text-blue-900 shadow-2xs'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate leading-snug">{les.title}</p>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {les.durationMinutes} mins • {les.type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
