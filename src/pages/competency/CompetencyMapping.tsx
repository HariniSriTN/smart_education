import React, { useState } from 'react';
import { 
  UserCheck, Search, Filter, Award, BookOpen, 
  CheckCircle, Briefcase, GraduationCap, Star, 
  Sparkles, ChevronRight, Info, Check 
} from 'lucide-react';
import { getCompetencies } from '../../data/storage';
import { TrainerCompetency } from '../../types';

export const CompetencyMapping: React.FC = () => {
  const [competencies] = useState<TrainerCompetency[]>(getCompetencies());
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [minExperience, setMinExperience] = useState(0);

  // Subject Match Selector
  const [matchRequirement, setMatchRequirement] = useState('Satellite Meteorology');

  const domainList = [
    'All',
    'Satellite Meteorology',
    'Radar Meteorology',
    'Weather Forecasting',
    'Climate Science',
    'Python for Scientific Computing',
    'Disaster Risk Reduction',
    'Meteorology'
  ];

  // Filtering trainers
  const filteredTrainers = competencies.filter(t => {
    const matchesSearch = t.trainerName.toLowerCase().includes(search.toLowerCase()) ||
      t.skills.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
      t.department.toLowerCase().includes(search.toLowerCase());
    const matchesDomain = selectedDomain === 'All' || t.domains.includes(selectedDomain);
    const matchesExp = t.experienceYears >= minExperience;
    return matchesSearch && matchesDomain && matchesExp;
  });

  // Rule-based Trainer Matching Logic
  const matchingTrainers = competencies
    .map(t => {
      let matchScore = 0;
      const reasons: string[] = [];

      // Check domain competence
      const matchedDomain = t.competencyLevels.find(c => c.domain.toLowerCase().includes(matchRequirement.toLowerCase()));
      if (matchedDomain) {
        matchScore += matchedDomain.score * 0.6;
        reasons.push(`${matchedDomain.level} competence in ${matchedDomain.domain} (${matchedDomain.score}%)`);
      }

      // Check skills
      const skillMatches = t.skills.filter(s => s.toLowerCase().includes(matchRequirement.toLowerCase().split(' ')[0]));
      if (skillMatches.length > 0) {
        matchScore += 20;
        reasons.push(`Direct skill proficiencies in: ${skillMatches.join(', ')}`);
      }

      // Experience weighting
      if (t.experienceYears >= 15) {
        matchScore += 15;
        reasons.push(`Senior expert with ${t.experienceYears} years of operational MoES field experience`);
      } else if (t.experienceYears >= 8) {
        matchScore += 10;
        reasons.push(`${t.experienceYears} years specialized subject experience`);
      }

      // WMO/Accreditation check
      if (t.certifications.some(c => c.includes('WMO') || c.includes('IPCC') || c.includes('UNESCO'))) {
        matchScore += 10;
        reasons.push(`Holds international accreditation: ${t.certifications[0]}`);
      }

      const finalScore = Math.min(100, Math.round(matchScore));

      return {
        trainer: t,
        score: finalScore,
        reasons
      };
    })
    .filter(item => item.score > 30)
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Faculty Competency Architecture
        </span>
        <h1 className="text-2xl font-extrabold text-[#102A43] mt-1.5 tracking-tight">
          Competency Mapping & Trainer-to-Subject Matching
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Map scientific faculty qualifications, operational field experience, and determine optimal trainers for courses.
        </p>
      </div>

      {/* Trainer Matching Tool (Admin & Planning Interface) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-[#102A43] text-white p-6 rounded-2xl shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Trainer-to-Subject Matching Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Select an upcoming course domain to calculate trainer suitability based on verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-sky-300 font-medium">Target Discipline:</span>
            <select
              value={matchRequirement}
              onChange={(e) => setMatchRequirement(e.target.value)}
              className="px-3 py-1.5 bg-slate-800 text-white border border-slate-700 rounded-xl text-xs font-bold outline-none"
            >
              <option value="Satellite Meteorology">Satellite Meteorology</option>
              <option value="Radar Meteorology">Radar Meteorology</option>
              <option value="Weather Forecasting">Weather Forecasting</option>
              <option value="Climate Science">Climate Science</option>
              <option value="Python for Scientific Computing">Python Scientific Computing</option>
              <option value="Disaster Risk Reduction">Disaster Risk Reduction</option>
              <option value="Meteorology">Numerical Weather Prediction</option>
            </select>
          </div>
        </div>

        {/* Matched Trainers List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {matchingTrainers.slice(0, 2).map(({ trainer, score, reasons }, idx) => (
            <div
              key={trainer.trainerId}
              className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={trainer.avatar}
                    alt={trainer.trainerName}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-400/50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-bold text-white">{trainer.trainerName}</h3>
                      {idx === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400 text-slate-900">
                          TOP MATCH
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-sky-200">{trainer.designation}</p>
                    <p className="text-[10px] text-slate-300">{trainer.department}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-sky-300">{score}%</span>
                  <p className="text-[10px] text-slate-300">Suitability</p>
                </div>
              </div>

              {/* Matching Explanation */}
              <div className="pt-2 border-t border-white/10 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-300 block">
                  Rule-Based Alignment Rationale:
                </span>
                {reasons.map((r, rIdx) => (
                  <p key={rIdx} className="text-[11px] text-slate-200 flex items-start gap-1.5 leading-snug">
                    <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Directory Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty by name, skills (e.g. INSAT, NetCDF, ADCIRC)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:border-blue-600 focus:bg-white outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            {domainList.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={minExperience}
            onChange={(e) => setMinExperience(Number(e.target.value))}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none"
          >
            <option value={0}>Any Experience</option>
            <option value={10}>10+ Years Exp</option>
            <option value={15}>15+ Years Exp</option>
            <option value={20}>20+ Years Exp</option>
          </select>
        </div>
      </div>

      {/* Trainer Competency Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTrainers.map((t) => (
          <div
            key={t.trainerId}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft space-y-4 hover:border-blue-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={t.avatar}
                  alt={t.trainerName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-900 truncate">{t.trainerName}</h2>
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      ★ {t.rating}
                    </span>
                  </div>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{t.designation}</p>
                  <p className="text-[11px] text-slate-500 truncate">{t.department}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{t.experienceYears} Years Experience • {t.assignedCoursesCount} Assigned Courses</span>
                  </div>
                </div>
              </div>

              {/* Bio summary */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {t.bio}
              </p>

              {/* Domain Competency Levels */}
              <div className="mt-4 space-y-2">
                <span className="text-[11px] uppercase font-bold text-slate-400 block">
                  Domain Competency Matrix
                </span>
                <div className="space-y-1.5">
                  {t.competencyLevels.map((lvl) => (
                    <div key={lvl.domain} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-700 font-medium">{lvl.domain}</span>
                        <span className="font-bold text-blue-700">{lvl.level} ({lvl.score}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${lvl.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Tags */}
              <div className="mt-4">
                <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1.5">
                  Operational Skills & Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.skills.map((s, i) => (
                    <span key={i} className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications footer */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                Certifications & Accreditations:
              </span>
              <div className="flex flex-wrap gap-1">
                {t.certifications.map((c, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
