import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, EyeOff, Lock, Mail, ShieldCheck, ArrowRight, 
  CloudRain, Compass, Award, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('priya.sharma@imd.gov.in');
  const [password, setPassword] = useState('Demopass@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.success) {
        success('Welcome back', 'Successfully authenticated to Capacity Connect');
        navigate('/');
      } else {
        setErrorMsg(res.message || 'Authentication failed');
        toastError('Login Failed', res.message);
      }
    }, 400);
  };

  const handleSelectDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demopass@2026');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F7FB]">
      {/* Left Panel: Scientific & Government Branding */}
      <div className="md:w-1/2 bg-[#102A43] text-white p-8 md:p-14 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle geometric circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/10 pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sky-500/10 pointer-events-none blur-3xl" />

        <div className="relative z-10">
          {/* Organization badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
              CC
            </div>
            <div>
              <span className="text-sm font-bold tracking-wider uppercase text-sky-300">
                CAPACITY CONNECT
              </span>
              <p className="text-[11px] text-slate-300 tracking-wide">
                Ministry of Earth Sciences • India Meteorological Department
              </p>
            </div>
          </div>

          <div className="mt-14 max-w-lg">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-semibold mb-4">
              <Compass className="w-3.5 h-3.5" />
              Organizational Training & Competency Development
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Empowering Learning. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-300">
                Building Scientific Capability.
              </span>
            </h1>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              The centralized digital learning and competency management framework designed for 
              meteorologists, climatologists, technical officers, and operational forecasters across India.
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="relative z-10 my-10 space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <CloudRain className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-semibold text-white">Meteorological & Climate Modules</h2>
              <p className="text-[11px] text-slate-300">Numerical Weather Prediction, Doppler Radars, Satellite Payloads, and CMIP6 climate models.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm">
            <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xs font-semibold text-white">Verified Competency Certifications</h2>
              <p className="text-[11px] text-slate-300">MoES & IMD accredited course credentials with digital verification codes.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Official MoES Training Standard</span>
          <span className="text-sky-400 font-medium">v2.4 Enterprise Portal</span>
        </div>
      </div>

      {/* Right Panel: Sign-in Form */}
      <div className="md:w-1/2 p-8 md:p-14 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Portal Access Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your organizational credentials or choose a quick demo profile below.
            </p>
          </div>

          {/* Quick Demo Credentials Selection Box */}
          <div className="mb-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80">
            <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Quick Demo Account Switcher
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemo('priya.sharma@imd.gov.in')}
                className={`p-2 text-left rounded-lg border text-xs transition-all ${
                  email === 'priya.sharma@imd.gov.in'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="font-bold text-[11px] truncate">Trainee</div>
                <div className="text-[10px] opacity-80 truncate">Priya Sharma</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('mk.venkat@imd.gov.in')}
                className={`p-2 text-left rounded-lg border text-xs transition-all ${
                  email === 'mk.venkat@imd.gov.in'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="font-bold text-[11px] truncate">Trainer</div>
                <div className="text-[10px] opacity-80 truncate">Dr. Venkat</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemo('rk.saxena@moes.gov.in')}
                className={`p-2 text-left rounded-lg border text-xs transition-all ${
                  email === 'rk.saxena@moes.gov.in'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="font-bold text-[11px] truncate">Admin</div>
                <div className="text-[10px] opacity-80 truncate">Shri Saxena</div>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@imd.gov.in or name@moes.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-blue-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-3.5 h-3.5"
                />
                <span>Remember this workstation</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Capacity Connect</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              New MoES/IMD Personnel?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Register for Training Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
