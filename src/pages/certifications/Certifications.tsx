import React, { useState, useRef } from 'react';
import { 
  Award, Download, Eye, CheckCircle2, ShieldCheck, 
  Calendar, Printer, X, Sparkles, Share2, Search 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getCertificates } from '../../data/storage';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { Certificate } from '../../types';

export const Certifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { success, error: toastError, info } = useToast();

  const [certificates] = useState<Certificate[]>(getCertificates());
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // If user is trainee, highlight their certificates; if admin, show all
  const userCerts = currentUser?.role === 'admin'
    ? certificates
    : certificates.filter(c => c.userId === currentUser?.id || c.userName === currentUser?.name);

  const handleDownloadPDF = async () => {
    if (!certRef.current || !selectedCert) return;

    setDownloading(true);
    info('Generating PDF', 'Rendering digital certificate with official MoES seal...');

    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${selectedCert.certificateNumber}_Certificate.pdf`);

      setDownloading(false);
      success('Certificate Downloaded', 'Your verified PDF certificate has been generated.');
    } catch (err) {
      console.error('PDF generation error:', err);
      setDownloading(false);
      toastError('Download Failed', 'Could not render PDF. You can also print the certificate.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Accredited Credentials
          </span>
          <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
            Institutional Certifications & Competency Awards
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Earth Sciences and India Meteorological Department verified credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            {userCerts.length} Verified Certificates
          </span>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {userCerts.length > 0 ? (
          userCerts.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft hover:border-amber-300 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {cert.certificateNumber}
                  </span>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Certificate of Competence
                </span>
                <h2 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                  {cert.courseTitle}
                </h2>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Recipient:</span>
                    <span className="font-semibold text-slate-900">{cert.userName}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Department:</span>
                    <span className="text-slate-800 truncate max-w-[200px]">{cert.department}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Performance Grade:</span>
                    <span className="font-bold text-emerald-700">{cert.grade}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Date Issued:</span>
                    <span className="text-slate-800">{cert.issueDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" /> View Certificate
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200">
            <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No Certificates Earned Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Complete your enrolled training modules and pass the subject MCQ assessment to receive your verified certification.
            </p>
          </div>
        )}
      </div>

      {/* Certificate Modal & PDF Export Preview */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-modal max-w-3xl w-full p-6 animate-scale-up space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">Official Certificate Preview</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rendered Certificate Card (Used for PDF capture) */}
            <div
              ref={certRef}
              className="bg-gradient-to-b from-white via-amber-50/20 to-white border-8 border-double border-[#102A43] p-8 md:p-10 rounded-xl relative shadow-lg text-center select-none"
            >
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#102A43]" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#102A43]" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#102A43]" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#102A43]" />

              {/* Header Crest */}
              <div className="space-y-1 mb-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#102A43] text-sky-300 flex items-center justify-center font-black text-lg shadow-md mb-2">
                  CC
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#102A43]">
                  GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES
                </h3>
                <p className="text-[10px] tracking-wider font-semibold text-slate-500 uppercase">
                  INDIA METEOROLOGICAL DEPARTMENT • CAPACITY CONNECT PORTAL
                </p>
                <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2" />
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#102A43] tracking-tight">
                Certificate of Technical Competency
              </h2>
              <p className="text-xs text-slate-500 mt-1 italic">
                This credential is awarded in recognition of successful completion of training to
              </p>

              {/* Recipient Name */}
              <div className="my-6">
                <span className="text-2xl md:text-3xl font-bold text-blue-900 border-b-2 border-slate-300 pb-1 px-8 inline-block">
                  {selectedCert.userName}
                </span>
                <p className="text-xs font-medium text-slate-600 mt-2">
                  {selectedCert.userDesignation} • {selectedCert.department}
                </p>
              </div>

              {/* Course Title & Details */}
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                having demonstrated operational proficiency, attended all technical lectures, and passed 
                the specialized assessment for:
              </p>
              <h4 className="text-base md:text-lg font-bold text-[#102A43] mt-2 max-w-md mx-auto">
                {selectedCert.courseTitle}
              </h4>

              <div className="my-4 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300 text-amber-900 text-xs font-bold">
                <Award className="w-4 h-4 text-amber-600" />
                Performance: {selectedCert.grade} ({selectedCert.scorePercentage}%)
              </div>

              {/* Signatures & Verification */}
              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-3 items-end text-xs">
                <div>
                  <div className="font-serif italic text-sm text-slate-800 font-bold mb-1">
                    Dr. M. K. Venkataraman
                  </div>
                  <div className="w-28 h-px bg-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Lead Faculty & Trainer</p>
                </div>

                <div className="space-y-1">
                  <div className="w-10 h-10 mx-auto border border-dashed border-slate-400 rounded-md flex items-center justify-center text-[8px] text-slate-400 uppercase">
                    SEAL
                  </div>
                  <p className="text-[9px] font-mono text-slate-400">
                    ID: {selectedCert.certificateNumber}
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Issued: {selectedCert.issueDate}
                  </p>
                </div>

                <div>
                  <div className="font-serif italic text-sm text-slate-800 font-bold mb-1">
                    Shri R. K. Saxena
                  </div>
                  <div className="w-28 h-px bg-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] text-slate-500">Director (Training), IMD</p>
                </div>
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Verification Code: {selectedCert.verificationCode}
              </span>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Rendering PDF...' : 'Download Verified Certificate PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
