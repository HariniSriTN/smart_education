import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User as UserIcon, Mail, Lock, Building, Briefcase, 
  CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { UserRole } from '../../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Numerical Weather Prediction (NWP)',
    designation: 'Scientific Assistant',
    role: 'trainee' as UserRole,
    phone: '',
    agreeTerms: false
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const departments = [
    'Numerical Weather Prediction (NWP)',
    'Satellite Meteorology Division',
    'Cyclone Warning Division (IMD HQ)',
    'Doppler Weather Radar Network Operations',
    'National Climate Centre (Pune)',
    'Agro-Meteorological Advisory Services',
    'Hydrometeorology Division',
    'Indian Institute of Tropical Meteorology (IITM)',
    'Ocean Observation & Forecasting (INCOIS)',
    'National Centre for Medium Range Weather Forecasting (NCMRWF)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMsg('Please acknowledge the terms of scientific portal usage');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = register({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        designation: formData.designation,
        phone: formData.phone,
        bio: `Designated ${formData.designation} in ${formData.department}. Registered for capacity building.`,
        qualifications: ['Bachelor/Master of Science'],
        skills: ['Meteorological Analysis']
      });

      setLoading(false);

      if (res.success) {
        setSubmitted(true);
        success('Registration Submitted', res.message);
      } else {
        setErrorMsg(res.message || 'Registration failed');
        toastError('Registration Failed', res.message);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F7FB]">
      {/* Left Panel */}
      <div className="md:w-5/12 bg-[#102A43] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-extrabold text-white text-base shadow-lg">
              CC
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider uppercase text-sky-300">
                CAPACITY CONNECT
              </span>
              <p className="text-[11px] text-slate-300">MoES & IMD Learning Portal</p>
            </div>
          </div>

          <div className="mt-12">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              Join the National Competency Network
            </h1>
            <p className="mt-4 text-xs text-slate-300 leading-relaxed">
              Create your official account to access operational meteorological courses, 
              participate in verified assessments, and earn institutional certificates.
            </p>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-blue-950/60 border border-blue-800/60">
            <h2 className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Administrative Verification Policy
            </h2>
            <p className="mt-1.5 text-[11px] text-slate-300 leading-relaxed">
              In accordance with government security protocols, new accounts enter a 
              <strong className="text-white"> Pending Approval</strong> status until validated by the 
              Training Directorate. You can approve pending users anytime via the Admin Dashboard.
            </p>
          </div>
        </div>

        <div className="relative z-10 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
          Ministry of Earth Sciences • Government of India
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-7/12 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center shadow-md animate-fade-in">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Your profile has been created with status <span className="font-semibold text-amber-600">Pending Approval</span>. 
                The Admin can approve your registration from the User Management module.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personnel Registration</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Register for institutional capacity building modules</p>
                </div>
                <Link to="/login" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                  <ArrowLeft className="w-3.5 h-3.5" /> Sign In
                </Link>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@imd.gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department / Centre *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none text-slate-800"
                    >
                      {departments.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Designation *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Meteorologist-I"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Portal Role
                    </label>
                    <div className="flex gap-2">
                      <label className={`flex-1 flex items-center justify-center p-2 rounded-lg border text-xs cursor-pointer font-medium transition-all ${
                        formData.role === 'trainee' ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'border-slate-200 text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="role"
                          checked={formData.role === 'trainee'}
                          onChange={() => setFormData({ ...formData, role: 'trainee' })}
                          className="sr-only"
                        />
                        Trainee / Officer
                      </label>
                      <label className={`flex-1 flex items-center justify-center p-2 rounded-lg border text-xs cursor-pointer font-medium transition-all ${
                        formData.role === 'trainer' ? 'bg-purple-50 border-purple-600 text-purple-700 font-bold' : 'border-slate-200 text-slate-600'
                      }`}>
                        <input
                          type="radio"
                          name="role"
                          checked={formData.role === 'trainer'}
                          onChange={() => setFormData({ ...formData, role: 'trainer' })}
                          className="sr-only"
                        />
                        Faculty / Trainer
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile / Extension
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <span>
                      I verify that I am an authorized officer or scholar under the Ministry of Earth Sciences, 
                      IMD, or affiliated national research institute.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? 'Submitting Application...' : 'Submit Registration for Approval'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
