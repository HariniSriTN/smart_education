import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, XCircle, Award, RotateCcw, 
  ChevronRight, ArrowLeft, BookOpen, Check, X, Eye 
} from 'lucide-react';
import { AssessmentAttempt, Assessment } from '../../types';
import { getAssessments, getAttempts } from '../../data/storage';

export const AssessmentResult: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const stateAttempt = location.state?.attempt as AssessmentAttempt | undefined;
  const stateAssessment = location.state?.assessment as Assessment | undefined;

  // Fallback to storage if navigated directly
  const attempts = getAttempts();
  const assessments = getAssessments();

  const assessment = stateAssessment || assessments.find(a => a.id === id);
  const attempt = stateAttempt || attempts.find(a => a.assessmentId === id);

  const [reviewMode, setReviewMode] = useState(false);

  if (!attempt || !assessment) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-base font-bold text-slate-800">No Assessment Result Available</h2>
        <Link to="/assessments" className="mt-2 text-xs text-blue-600 underline inline-block">
          Return to assessments
        </Link>
      </div>
    );
  }

  const incorrectCount = attempt.totalQuestions - attempt.score;
  const unansweredCount = attempt.totalQuestions - Object.keys(attempt.answers).length;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/assessments')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Assessments
        </button>
      </div>

      {/* Hero Score Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-soft text-center max-w-2xl mx-auto space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
          attempt.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
        }`}>
          {attempt.passed ? <CheckCircle2 className="w-9 h-9" /> : <XCircle className="w-9 h-9" />}
        </div>

        <div>
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            attempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {attempt.passed ? 'ASSESSMENT PASSED' : 'NEEDS IMPROVEMENT'}
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-2">
            {assessment.title}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submitted by {attempt.userName} on {new Date(attempt.submittedAt).toLocaleDateString()}
          </p>
        </div>

        {/* Big percentage display */}
        <div className="py-4 border-y border-slate-100 flex items-center justify-center gap-8">
          <div>
            <span className="text-3xl md:text-4xl font-extrabold text-slate-900">
              {attempt.percentage}%
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Final Score</span>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div>
            <span className="text-3xl md:text-4xl font-extrabold text-blue-600">
              {attempt.score}/{attempt.totalQuestions}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Correct Answers</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Total Questions</span>
            <span className="font-bold text-slate-800">{attempt.totalQuestions}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-[10px] text-emerald-600 block">Correct</span>
            <span className="font-bold text-emerald-700">{attempt.score}</span>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-100">
            <span className="text-[10px] text-rose-600 block">Incorrect</span>
            <span className="font-bold text-rose-700">{incorrectCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => setReviewMode(!reviewMode)}
            className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> {reviewMode ? 'Hide Review' : 'Review Answers & Explanations'}
          </button>

          {attempt.passed ? (
            <button
              onClick={() => navigate('/certifications')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5" /> View Certificates
            </button>
          ) : (
            <button
              onClick={() => navigate(`/assessments/${assessment.id}/take`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Assessment
            </button>
          )}
        </div>
      </div>

      {/* Topic-Wise Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-2xl mx-auto">
        <h2 className="text-sm font-bold text-slate-900 mb-3">Topic-Wise Competency Breakdown</h2>
        <div className="space-y-3">
          {attempt.topicBreakdown.map((t) => {
            const pct = Math.round((t.correct / t.total) * 100);
            return (
              <div key={t.topic} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{t.topic}</span>
                  <span className="font-bold text-slate-900">{t.correct}/{t.total} ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Answers Mode */}
      {reviewMode && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Question Item Review & Scientific Rationales</h2>
            <span className="text-xs text-slate-400">{assessment.questions.length} Items</span>
          </div>

          <div className="space-y-6">
            {assessment.questions.map((q, qIndex) => {
              const selectedIdx = attempt.answers[q.id];
              const isCorrect = selectedIdx === q.correctOptionIndex;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold text-slate-900">
                      Q{qIndex + 1}. {q.questionText}
                    </p>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? 'CORRECT' : 'INCORRECT'}
                    </span>
                  </div>

                  {/* Options */}
                  <div className="space-y-1.5 pl-2 text-xs">
                    {q.options.map((opt, optIdx) => {
                      const isUserChoice = selectedIdx === optIdx;
                      const isOfficialAnswer = q.correctOptionIndex === optIdx;

                      let optClass = 'text-slate-600';
                      if (isOfficialAnswer) {
                        optClass = 'text-emerald-700 font-bold bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 flex items-center justify-between';
                      } else if (isUserChoice && !isOfficialAnswer) {
                        optClass = 'text-rose-700 font-semibold bg-rose-50/80 p-2 rounded-lg border border-rose-200 flex items-center justify-between';
                      }

                      return (
                        <div key={optIdx} className={optClass}>
                          <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                          {isOfficialAnswer && <span className="text-[10px] uppercase font-bold text-emerald-700">Official Correct</span>}
                          {isUserChoice && !isOfficialAnswer && <span className="text-[10px] uppercase font-bold text-rose-700">Your Selection</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Scientific Rationale */}
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                    <strong className="block mb-0.5 text-blue-950">Scientific Explanation:</strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
