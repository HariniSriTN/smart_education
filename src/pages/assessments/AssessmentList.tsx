import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckSquare, Clock, Award, Plus, Calendar, 
  CheckCircle2, AlertCircle, ArrowRight, X, FileText 
} from 'lucide-react';
import { getAssessments, getAttempts, addAssessment, getCourses } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Assessment, AssessmentQuestion } from '../../types';

export const AssessmentList: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [assessments, setAssessments] = useState(getAssessments());
  const attempts = getAttempts();
  const courses = getCourses();

  // Create assessment modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [subject, setSubject] = useState('Meteorology');
  const [duration, setDuration] = useState(15);
  const [passingScore, setPassingScore] = useState(70);
  const [deadline, setDeadline] = useState('2026-06-30');

  const canCreate = currentUser?.role === 'trainer' || currentUser?.role === 'admin';

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedCourse = courses.find(c => c.id === courseId);

    // Provide 4 realistic seed questions for new assessment
    const sampleQuestions: AssessmentQuestion[] = [
      {
        id: 'q-new-1',
        assessmentId: 'asm-' + Date.now(),
        questionText: 'What thermodynamic variable remains conserved during reversible adiabatic ascent of an unsaturated air parcel?',
        topic: 'Atmospheric Thermodynamics',
        options: ['Potential Temperature (Theta)', 'Equivalent Potential Temperature', 'Dewpoint Temperature', 'Relative Humidity'],
        correctOptionIndex: 0,
        explanation: 'Potential temperature remains constant in dry adiabatic processes as governed by Poisson’s equation.'
      },
      {
        id: 'q-new-2',
        assessmentId: 'asm-' + Date.now(),
        questionText: 'Which meteorological satellite payload provides multi-spectral infrared radiances at 15-minute intervals over the Indian Ocean?',
        topic: 'Satellite Payloads',
        options: ['INSAT-3DR Imager', 'MODIS Aqua', 'GPM Microwave Imager', 'Sentinel-2 MSI'],
        correctOptionIndex: 0,
        explanation: 'INSAT-3DR geostationary imager provides operational multi-spectral observations over the subcontinent every 15 minutes.'
      }
    ];

    const newAssessment: Assessment = {
      id: 'asm-' + Date.now(),
      title,
      courseId,
      courseTitle: matchedCourse?.title || 'Operational Meteorology',
      subject,
      durationMinutes: Number(duration),
      passingScorePercent: Number(passingScore),
      totalQuestions: sampleQuestions.length,
      deadline,
      createdBy: currentUser?.name || 'Lead Trainer',
      status: 'active',
      questions: sampleQuestions
    };

    addAssessment(newAssessment);
    setAssessments(getAssessments());
    setShowCreateModal(false);
    success('Assessment Created', `"${title}" has been published with ${sampleQuestions.length} questions.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
            Competency Evaluation Suite
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Subject-Wise Assessments & MCQ Tests
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Timed operational evaluations required for certification and shift deployment verification.
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Create MCQ Assessment
          </button>
        )}
      </div>

      {/* Assessment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assessments.map((asm) => {
          const userAttempt = attempts.find(
            a => a.assessmentId === asm.id && a.userId === currentUser?.id
          );

          return (
            <div
              key={asm.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {asm.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{asm.durationMinutes} Minutes</span>
                  </div>
                </div>

                <h2 className="text-base font-bold text-slate-900 mt-1">
                  {asm.title}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Course: <strong className="text-slate-700">{asm.courseTitle}</strong>
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Questions</span>
                    <span className="font-bold text-slate-800">{asm.questions.length} MCQs</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Passing Mark</span>
                    <span className="font-bold text-slate-800">{asm.passingScorePercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Deadline</span>
                    <span className="font-bold text-slate-800">{asm.deadline}</span>
                  </div>
                </div>

                {userAttempt && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500">Previous Attempt:</span>
                      <span className="font-bold text-slate-900 ml-1.5">
                        {userAttempt.score}/{userAttempt.totalQuestions} ({userAttempt.percentage}%)
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      userAttempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {userAttempt.passed ? 'PASSED' : 'NEEDS RETAKE'}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Created by {asm.createdBy}</span>
                <button
                  onClick={() => navigate(`/assessments/${asm.id}/take`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {userAttempt ? 'Retake Assessment' : 'Start Assessment'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create MCQ Assessment */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Create Subject MCQ Assessment</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssessment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyclone Intensity Estimation & Dvorak Technique Exam"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Discipline</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pass Score (%)</label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 text-blue-900 text-xs">
                Includes automated initialization of operational meteorological question items from the question bank.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Save & Publish Assessment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
