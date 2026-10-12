import React, { useState } from 'react';
import { 
  MessageSquare, Star, Plus, CheckCircle, 
  Filter, User as UserIcon, BookOpen, Send, X 
} from 'lucide-react';
import { getFeedback, addFeedback, getCourses } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Feedback } from '../../types';

export const FeedbackModule: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [feedbackList, setFeedbackList] = useState<Feedback[]>(getFeedback());
  const courses = getCourses();

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [rating, setRating] = useState(5);
  const [contentQuality, setContentQuality] = useState(5);
  const [instructorDelivery, setInstructorDelivery] = useState(5);
  const [practicalRelevance, setPracticalRelevance] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const matchedCourse = courses.find(c => c.id === selectedCourseId);

    const newFeedback: Feedback = {
      id: 'fb-' + Date.now(),
      courseId: selectedCourseId,
      courseTitle: matchedCourse?.title || 'Operational Course',
      userId: currentUser?.id || 'trainee-1',
      userName: currentUser?.name || 'Trainee Officer',
      userRole: currentUser?.role || 'trainee',
      rating,
      aspects: {
        contentQuality,
        instructorDelivery,
        practicalRelevance
      },
      comment,
      submittedAt: new Date().toISOString()
    };

    addFeedback(newFeedback);
    setFeedbackList(getFeedback());
    setShowSubmitModal(false);
    setComment('');
    success('Feedback Recorded', 'Thank you for contributing to training quality improvement.');
  };

  const avgRating = (feedbackList.reduce((acc, f) => acc + f.rating, 0) / (feedbackList.length || 1)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Course Quality & Evaluation
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Curriculum Feedback & Peer Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate scientific training delivery, practical applicability, and curriculum relevance.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> Submit Course Review
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xl">
            ★
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Overall Rating</span>
            <p className="text-2xl font-extrabold text-slate-900">{avgRating} / 5.0</p>
            <span className="text-[11px] text-slate-500">From {feedbackList.length} verified submissions</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Content Depth</span>
            <p className="text-2xl font-extrabold text-slate-900">4.9 / 5.0</p>
            <span className="text-[11px] text-slate-500">Rated by operational meteorologists</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Duty Relevance</span>
            <p className="text-2xl font-extrabold text-slate-900">98%</p>
            <span className="text-[11px] text-emerald-600 font-medium">Applicable to forecast desk shifts</span>
          </div>
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Verified Personnel Reviews ({feedbackList.length})</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {fb.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{fb.userName}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">{fb.userRole}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-sm">
                    {'★'.repeat(fb.rating)}
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {fb.courseTitle}
                  </span>
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                    "{fb.comment}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Submitted {new Date(fb.submittedAt).toLocaleDateString()}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified Learner
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Feedback Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Submit Course Evaluation</h2>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Overall Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl transition-transform hover:scale-110 ${
                        star <= rating ? 'text-amber-400' : 'text-slate-200'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Operational Comments *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe how the lectures and exercises helped in your daily operational forecast or research duties..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Submit Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
