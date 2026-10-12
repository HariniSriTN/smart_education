import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, AlertTriangle, CheckCircle2, Bookmark, 
  ChevronLeft, ChevronRight, Send, AlertCircle, X 
} from 'lucide-react';
import { getAssessments, saveAttempt } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { AssessmentAttempt } from '../../types';

export const AssessmentTake: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { success, error: toastError, info } = useToast();

  const assessments = getAssessments();
  const assessment = assessments.find(a => a.id === id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState((assessment?.durationMinutes || 15) * 60);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!assessment) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [assessment]);

  if (!assessment) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">Assessment not found</h2>
        <button onClick={() => navigate('/assessments')} className="mt-2 text-xs text-blue-600 underline">
          Back to assessments
        </button>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIndex];
  const totalQuestions = assessment.questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optIndex: number) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const toggleMarkReview = () => {
    setMarkedForReview(prev => 
      prev.includes(currentQ.id) ? prev.filter(x => x !== currentQ.id) : [...prev, currentQ.id]
    );
  };

  const handleFinalSubmit = (auto = false) => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    const topicStats: Record<string, { total: number; correct: number }> = {};

    assessment.questions.forEach(q => {
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;

      const userAns = answers[q.id];
      if (userAns !== undefined && userAns === q.correctOptionIndex) {
        correctCount += 1;
        topicStats[q.topic].correct += 1;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= assessment.passingScorePercent;

    const topicBreakdown = Object.entries(topicStats).map(([topic, stat]) => ({
      topic,
      total: stat.total,
      correct: stat.correct
    }));

    const attempt: AssessmentAttempt = {
      id: 'att-' + Date.now(),
      assessmentId: assessment.id,
      userId: currentUser?.id || 'trainee-1',
      userName: currentUser?.name || 'Trainee Officer',
      userEmail: currentUser?.email || 'trainee@imd.gov.in',
      startedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      answers,
      markedForReview,
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      topicBreakdown
    };

    saveAttempt(attempt);

    if (auto) {
      info('Time Expired', 'Assessment was automatically submitted.');
    } else {
      success('Assessment Submitted', `Score: ${correctCount}/${totalQuestions} (${percentage}%)`);
    }

    navigate(`/assessments/${assessment.id}/results`, { state: { attempt, assessment } });
  };

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isTimeCritical = timeLeft < 120; // less than 2 minutes

  return (
    <div className="space-y-4">
      {/* Top Test Header */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            {assessment.subject}
          </span>
          <h1 className="text-sm md:text-base font-bold text-slate-900 mt-1">
            {assessment.title}
          </h1>
        </div>

        {/* Timer display */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
          isTimeCritical
            ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <Clock className="w-4 h-4" />
          <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Main Examination Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left 3 Cols: Question & Options */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft space-y-6">
            {/* Question Meta */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-500">
              <span className="font-semibold text-slate-800">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md font-medium text-[11px]">
                Topic: {currentQ.topic}
              </span>
            </div>

            {/* Question Text */}
            <div className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = answers[currentQ.id] === idx;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center gap-3.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {optionLabel}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer */}
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-soft flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentIndex === totalQuestions - 1}
                className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMarkReview}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                  markedForReview.includes(currentQ.id)
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {markedForReview.includes(currentQ.id) ? 'Marked for Review' : 'Mark for Review'}
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Submit Assessment
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Question Palette & Legend */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-4 h-fit">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Question Palette</h2>
            <p className="text-[11px] text-slate-400">
              {answeredCount} of {totalQuestions} answered
            </p>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-4 gap-2">
            {assessment.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isReview = markedForReview.includes(q.id);
              const isCurrent = idx === currentIndex;

              let style = 'bg-slate-100 text-slate-600 border-slate-200';
              if (isReview) {
                style = 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
              } else if (isAnswered) {
                style = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
              }

              if (isCurrent) {
                style += ' ring-2 ring-blue-600';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs flex items-center justify-center transition-all ${style}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" />
              <span>Unanswered ({totalQuestions - answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
              <span>Marked for Review ({markedForReview.length})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog Before Final Submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-md w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Submit Assessment?</h2>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered <strong className="text-slate-900">{answeredCount}</strong> out of{' '}
              <strong className="text-slate-900">{totalQuestions}</strong> questions.
              {totalQuestions - answeredCount > 0 && (
                <span className="block mt-1 text-amber-600 font-semibold">
                  Warning: You have {totalQuestions - answeredCount} unanswered questions remaining.
                </span>
              )}
            </p>

            <div className="mt-6 flex justify-end gap-2.5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Return to Test
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              >
                Yes, Submit Final Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
