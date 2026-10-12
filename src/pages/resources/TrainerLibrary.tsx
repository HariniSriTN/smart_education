import React, { useState } from 'react';
import { 
  Library, Search, Filter, Upload, FileText, 
  Video, Presentation, Download, Eye, X, 
  Check, FileQuestion, BookOpen, Clock 
} from 'lucide-react';
import { getResources, addResource, getCourses } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { LearningResource, ResourceType } from '../../types';

export const TrainerLibrary: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const [resources, setResources] = useState<LearningResource[]>(getResources());
  const courses = getCourses();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Preview Modal
  const [previewResource, setPreviewResource] = useState<LearningResource | null>(null);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    type: 'pdf' as ResourceType,
    subject: 'Meteorology',
    courseId: courses[0]?.id || '',
    description: '',
    fileSize: '8.4 MB'
  });

  const canUpload = currentUser?.role === 'trainer' || currentUser?.role === 'admin';

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title.trim()) return;

    const targetCourse = courses.find(c => c.id === uploadForm.courseId);

    const newRes: LearningResource = {
      id: 'res-' + Date.now(),
      title: uploadForm.title,
      type: uploadForm.type,
      subject: uploadForm.subject,
      courseId: uploadForm.courseId,
      courseTitle: targetCourse?.title || 'General Met Training',
      trainerName: currentUser?.name || 'Faculty Trainer',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: uploadForm.fileSize,
      description: uploadForm.description,
      viewCount: 1,
      downloadUrl: '#',
      isSimulated: true
    };

    addResource(newRes);
    setResources(getResources());
    setShowUploadModal(false);
    success('Material Added', `"${newRes.title}" is now available in the resource repository.`);
  };

  const handleDownload = (res: LearningResource) => {
    info(
      'Demonstration File Access',
      `Simulated retrieval initiated for "${res.title}" (${res.fileSize}). Material is verified in the MoES repository.`
    );
  };

  const filtered = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.trainerName.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'All' || r.type === selectedType;
    const matchesSubject = selectedSubject === 'All' || r.subject === selectedSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'lecture': return <Video className="w-5 h-5 text-blue-600" />;
      case 'pdf': return <FileText className="w-5 h-5 text-rose-600" />;
      case 'presentation': return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'questionnaire': return <FileQuestion className="w-5 h-5 text-purple-600" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Digital Learning Repository
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Trainer Library & Scientific Resources
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access recorded masterclasses, technical manuals, PowerPoint lectures, and operational SOPs.
          </p>
        </div>

        {canUpload && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors shrink-0"
          >
            <Upload className="w-4 h-4" /> Upload Learning Material
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search manuals, Doppler radar presentations, Python workbooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Resource Types</option>
            <option value="pdf">PDF Manuals</option>
            <option value="lecture">Recorded Lectures</option>
            <option value="presentation">Presentations (PPTX)</option>
            <option value="document">Code & Notebooks</option>
            <option value="questionnaire">Practice Questionnaires</option>
          </select>

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value="All">All Subjects</option>
            <option value="Meteorology">Meteorology</option>
            <option value="Weather Forecasting">Weather Forecasting</option>
            <option value="Satellite Meteorology">Satellite Meteorology</option>
            <option value="Python for Scientific Computing">Python Science</option>
            <option value="Disaster Risk Reduction">Disaster Risk</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft hover:border-blue-300 hover:shadow-card transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getTypeIcon(res.type)}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {res.type}
                </span>
              </div>

              <h2 className="text-xs md:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                {res.title}
              </h2>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {res.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-400">
                <p className="truncate">Course: <strong className="text-slate-600">{res.courseTitle}</strong></p>
                <p>Faculty: <span className="text-slate-600">{res.trainerName}</span></p>
                <div className="flex items-center justify-between text-slate-500 pt-1">
                  <span>Size: {res.fileSize}</span>
                  <span>{res.uploadDate}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => setPreviewResource(res)}
                className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button
                onClick={() => handleDownload(res)}
                className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Access
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-xl w-full p-6 animate-scale-up space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  {getTypeIcon(previewResource.type)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {previewResource.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    {previewResource.type} • {previewResource.subject}
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewResource(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <p className="font-semibold text-slate-800 mb-1">Document Synopsis:</p>
              {previewResource.description}
            </div>

            {/* Simulated Content Frame */}
            <div className="h-44 bg-[#102A43] text-white rounded-xl flex flex-col items-center justify-center p-4 text-center">
              <BookOpen className="w-8 h-8 text-sky-400 mb-2" />
              <p className="text-xs font-semibold text-slate-200">
                MoES Digital Watermarked Preview Document
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                Archived under IMD Central Training Division • Verified File Hash SHA-256
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Uploaded by {previewResource.trainerName} ({previewResource.uploadDate})
              </span>
              <button
                onClick={() => {
                  handleDownload(previewResource);
                  setPreviewResource(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Demonstration Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full p-6 animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Upload Educational Resource</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resource Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weather Radar Volume Coverage Pattern 212 Guide"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format Type</label>
                  <select
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({ ...uploadForm, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="pdf">PDF Manual</option>
                    <option value="lecture">Recorded Video (MP4)</option>
                    <option value="presentation">Presentation Slides (PPTX)</option>
                    <option value="document">Jupyter Notebook / Code</option>
                    <option value="questionnaire">Practice Questionnaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Discipline</label>
                  <select
                    value={uploadForm.subject}
                    onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                  >
                    <option value="Meteorology">Meteorology</option>
                    <option value="Weather Forecasting">Weather Forecasting</option>
                    <option value="Satellite Meteorology">Satellite Meteorology</option>
                    <option value="Climate Science">Climate Science</option>
                    <option value="Python for Scientific Computing">Python Science</option>
                    <option value="Disaster Risk Reduction">Disaster Risk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Course</label>
                <select
                  value={uploadForm.courseId}
                  onChange={(e) => setUploadForm({ ...uploadForm, courseId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the scientific relevance, data tables, or exercises contained in this material..."
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <p className="text-xs text-slate-700 font-semibold">Simulated File Attachment</p>
                <p className="text-[10px] text-slate-400">PDF, MP4, PPTX, IPYNB accepted</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                >
                  Confirm Upload to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
