import React, { useState } from 'react';
import { 
  Bell, Search, Filter, Plus, Calendar, 
  CheckCircle, AlertCircle, Clock, Eye, X, 
  Check, Megaphone, ShieldAlert, Sparkles 
} from 'lucide-react';
import { getAnnouncements, addAnnouncement, markAnnouncementRead } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Announcement, AnnouncementCategory, AnnouncementPriority } from '../../types';

export const Announcements: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>(getAnnouncements());
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal states
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementCategory>('General Announcements');
  const [priority, setPriority] = useState<AnnouncementPriority>('Normal');
  const [content, setContent] = useState('');

  const canPublish = currentUser?.role === 'admin' || currentUser?.role === 'trainer';

  const handleOpenDetail = (ann: Announcement) => {
    setSelectedAnn(ann);
    if (currentUser) {
      markAnnouncementRead(ann.id, currentUser.id);
      setAnnouncements(getAnnouncements());
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newAnn: Announcement = {
      id: 'ann-' + Date.now(),
      title,
      category,
      priority,
      content,
      publishDate: new Date().toISOString().split('T')[0],
      author: currentUser?.name || 'Administrative Desk',
      authorRole: currentUser?.designation || 'Director (Training)',
      readBy: []
    };

    addAnnouncement(newAnn);
    setAnnouncements(getAnnouncements());
    setShowCreateModal(false);
    setTitle('');
    setContent('');
    success('Announcement Broadcasted', 'The notification has been published across the portal.');
  };

  const categories = [
    'All',
    'Training Schedules',
    'Assessment Deadlines',
    'New Courses',
    'Learning Resources',
    'General Announcements'
  ];

  const filtered = announcements.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase()) ||
      a.author.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || a.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Official Dispatches & Circulars
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Announcements & Operational Bulletins
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Training schedules, assessment deadlines, operational circulars, and course releases.
          </p>
        </div>

        {canPublish && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> Publish Circular
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars, deadline notices, WMO refresher schedules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3.5">
        {filtered.map((ann) => {
          const isRead = currentUser ? ann.readBy.includes(currentUser.id) : true;

          return (
            <div
              key={ann.id}
              onClick={() => handleOpenDetail(ann)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !isRead
                  ? 'bg-blue-50/40 border-blue-200 shadow-soft'
                  : 'bg-white border-slate-200 hover:border-blue-200 shadow-soft'
              }`}
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    ann.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                    ann.priority === 'High' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {ann.priority} Priority
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                    {ann.category}
                  </span>
                  {!isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </div>

                <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {ann.title}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {ann.content}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Published: {ann.publishDate}</span>
                  <span>•</span>
                  <span>Issued by: {ann.author} ({ann.authorRole})</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(ann);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> Read Full Circular
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnn && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  selectedAnn.priority === 'Urgent' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {selectedAnn.category}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                  {selectedAnn.title}
                </h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Published on {selectedAnn.publishDate} by {selectedAnn.author} ({selectedAnn.authorRole})
                </p>
              </div>
              <button onClick={() => setSelectedAnn(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-line">
              {selectedAnn.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedAnn(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Close Circular
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Publish New Official Notice</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Monsoon Forecast Operational Training 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Training Schedules">Training Schedules</option>
                    <option value="Assessment Deadlines">Assessment Deadlines</option>
                    <option value="New Courses">New Courses</option>
                    <option value="Learning Resources">Learning Resources</option>
                    <option value="General Announcements">General Announcements</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Official Circular Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter detailed directives, eligible batches, and operational guidelines..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
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
                  Publish Circular
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
