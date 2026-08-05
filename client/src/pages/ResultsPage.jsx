import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResult } from '../api';
import Navbar from '../components/Navbar';
import MatchCircle from '../components/MatchCircle';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const TABS = [
  { label: 'Overview',    icon: '📊' },
  { label: 'Strengths',   icon: '💪' },
  { label: 'Skills',      icon: '🛠️' },
  { label: 'Improve CV',  icon: '✏️' },
  { label: 'Roadmap',     icon: '🗺️' },
  { label: 'Find Jobs',   icon: '💼' },
];

const JOB_PLATFORMS = [
  {
    name: 'LinkedIn',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg',
    color: '#0A66C2',
    bg: '#EBF4FF',
    border: '#BFDBFE',
    tag: 'Best for networking',
    getUrl: (title) => `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(title)}&f_TPR=r604800`,
  },
  {
    name: 'Naukri',
    logo: null,
    emoji: '🇮🇳',
    color: '#E05C00',
    bg: '#FFF7ED',
    border: '#FED7AA',
    tag: 'Top in India',
    getUrl: (title) => `https://www.naukri.com/${encodeURIComponent(title.toLowerCase().replace(/\/| /g, '-'))}-jobs`,
  },
  {
    name: 'Indeed',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/indeed.svg',
    color: '#2164F3',
    bg: '#EFF6FF',
    border: '#BFDBFE',
    tag: 'Global listings',
    getUrl: (title) => `https://www.indeed.com/jobs?q=${encodeURIComponent(title)}&sort=date`,
  },
  {
    name: 'Unstop',
    logo: null,
    emoji: '🚀',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#DDD6FE',
    tag: 'Freshers & campus',
    getUrl: (title) => `https://unstop.com/jobs?search=${encodeURIComponent(title)}`,
  },
  {
    name: 'Glassdoor',
    logo: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/glassdoor.svg',
    color: '#0CAA41',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    tag: 'Salary + reviews',
    getUrl: (title) => `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(title)}&fromAge=7`,
  },
  {
    name: 'Internshala',
    logo: null,
    emoji: '🎓',
    color: '#009B77',
    bg: '#F0FDF4',
    border: '#BBF7D0',
    tag: 'Internships & jobs',
    getUrl: (title) => `https://internshala.com/jobs/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}-jobs`,
  },
  {
    name: 'Wellfound',
    logo: null,
    emoji: '⚡',
    color: '#F97316',
    bg: '#FFF7ED',
    border: '#FED7AA',
    tag: 'Startups & tech',
    getUrl: (title) => `https://wellfound.com/jobs?q=${encodeURIComponent(title)}`,
  },
  {
    name: 'Shine',
    logo: null,
    emoji: '✨',
    color: '#DC2626',
    bg: '#FEF2F2',
    border: '#FECACA',
    tag: 'India jobs',
    getUrl: (title) => `https://www.shine.com/job-search/${encodeURIComponent(title.toLowerCase().replace(/ /g, '-'))}-jobs`,
  },
];

const EXP_LABELS = {
  fresher: 'Fresher · 0 yrs',
  '0-1':   'Entry Level · 0–1 yr',
  '1-3':   'Junior · 1–3 yrs',
  '3-5':   'Mid-Level · 3–5 yrs',
  '5-8':   'Senior · 5–8 yrs',
  '8+':    'Lead / Staff · 8+ yrs',
};

const CHECKLIST = [
  'Professional summary / objective at the top',
  'Quantified achievements (numbers, %, impact)',
  'GitHub / portfolio link',
  'LinkedIn profile URL',
  'Relevant certifications section',
  'Internship or freelance experience',
  'Personal or open-source projects with descriptions',
  'Clean single-page format (for freshers)',
];

function ChecklistCard() {
  const [checked, setChecked] = useState(() =>
    JSON.parse(localStorage.getItem('resume-checklist') || '[]')
  );

  const toggle = (item) => {
    const updated = checked.includes(item) ? checked.filter(i => i !== item) : [...checked, item];
    setChecked(updated);
    localStorage.setItem('resume-checklist', JSON.stringify(updated));
  };

  const done = checked.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resume checklist</p>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          done === CHECKLIST.length ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
        }`}>{done}/{CHECKLIST.length}</span>
      </div>
      <div className="space-y-1">
        {CHECKLIST.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <button key={item} onClick={() => toggle(item)}
              className="w-full flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-gray-50 transition-colors text-left">
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isChecked ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
              }`}>
                {isChecked && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className={`text-sm transition-colors ${
                isChecked ? 'text-gray-400 line-through' : 'text-gray-600'
              }`}>{item}</p>
            </button>
          );
        })}
      </div>
      {done === CHECKLIST.length && (
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
          <p className="text-emerald-600 text-sm font-semibold">🎉 Resume checklist complete!</p>
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const { id } = useParams();
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [tab, setTab]                 = useState(0);
  const reportRef = useRef();

  useEffect(() => {
    getResult(id)
      .then(({ data }) => setResult(data))
      .catch(() => toast.error('Failed to load result'))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, w, (canvas.height * w) / canvas.width);
      pdf.save(`${result.jobTitle || 'analysis'}.pdf`);
      toast.success('Downloaded!');
    } catch { toast.error('Download failed'); }
    finally { setDownloading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-4">
        <div className="h-44 bg-white rounded-3xl skeleton" />
        <div className="h-12 bg-white rounded-2xl skeleton" />
        <div className="h-64 bg-white rounded-2xl skeleton" />
      </div>
    </div>
  );

  if (!result) return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center">
      <div className="text-center">
        <p className="text-3xl mb-3">🔍</p>
        <p className="text-gray-500 font-medium text-sm">Result not found</p>
        <Link to="/dashboard" className="text-indigo-500 text-sm hover:underline mt-1 inline-block">← Dashboard</Link>
      </div>
    </div>
  );

  const pct      = result.matchPercentage;
  const scoreBg  = pct >= 70 ? 'from-emerald-500 to-teal-500' : pct >= 40 ? 'from-amber-400 to-orange-400' : 'from-red-400 to-rose-500';

  const roadmapSteps = result.roadmap
    ? result.roadmap.split('\n').filter(l => l.trim()).map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-4">

        {/* ── Hero ── */}
        <div ref={reportRef} className={`relative bg-gradient-to-br ${scoreBg} rounded-3xl p-7 overflow-hidden animate-fade-up`}>
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-black/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0">
              <MatchCircle percentage={pct} dark />
            </div>

            <div className="flex-1 min-w-0">
              <Link to="/dashboard" className="inline-flex items-center gap-1 text-white/60 text-xs hover:text-white mb-2 transition-colors">
                ← Dashboard
              </Link>
              <h1 className="text-xl font-bold text-white leading-tight">{result.jobTitle || 'Analysis Result'}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-white/70 text-xs">{result.resumeId?.fileName}</p>
                {result.experienceLevel && (
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {EXP_LABELS[result.experienceLevel] || result.experienceLevel}
                  </span>
                )}
                <p className="text-white/50 text-xs">{new Date(result.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {[
                  { val: result.matchedSkills?.length || 0,    label: 'Matched' },
                  { val: result.missingSkills?.length || 0,    label: 'Missing' },
                  { val: result.skills?.length || 0,           label: 'Total Skills' },
                  { val: result.strongPoints?.length || 0,     label: 'Strengths' },
                ].map(s => (
                  <div key={s.label} className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
                    <p className="text-white font-bold text-lg leading-none">{s.val}</p>
                    <p className="text-white/70 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={downloadPDF} disabled={downloading}
              className="flex-shrink-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 self-start">
              {downloading
                ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
              PDF
            </button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm overflow-x-auto animate-fade-up stagger-1">
          {TABS.map((t, i) => (
            <button key={t.label} onClick={() => setTab(i)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${tab === i ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab 0: Overview ── */}
        {tab === 0 && (
          <div className="space-y-4 animate-scale-in">
            {result.matchedSkills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">✓ Skills you already have</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map(s => (
                    <span key={s} className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.missingSkills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">✗ Skills to acquire</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map(s => (
                    <span key={s} className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.projects?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Projects detected</p>
                <div className="space-y-2">
                  {result.projects.map((p, i) => (
                    <div key={i} className="flex items-start gap-3 py-2.5 px-3 bg-gray-50 rounded-xl">
                      <span className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                      <p className="text-sm text-gray-700 leading-snug">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.missingSkills?.length === 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                <p className="text-2xl mb-1">🎉</p>
                <p className="text-emerald-700 font-semibold text-sm">Perfect match — no skill gaps!</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 1: Strengths & Weaknesses ── */}
        {tab === 1 && (
          <div className="space-y-4 animate-scale-in">
            {result.strongPoints?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-4">💪 Strong points in your resume</p>
                <div className="space-y-2.5">
                  {result.strongPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                      <div className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">✓</div>
                      <p className="text-sm text-emerald-800 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.weakPoints?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">⚠️ Weak points to address</p>
                <div className="space-y-2.5">
                  {result.weakPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                      <div className="w-5 h-5 bg-red-400 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">!</div>
                      <p className="text-sm text-red-800 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!result.strongPoints?.length && !result.weakPoints?.length) && (
              <div className="bg-gray-50 rounded-2xl p-8 text-center">
                <p className="text-gray-400 text-sm">No strength/weakness data available. Re-analyze to get this.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Skills ── */}
        {tab === 2 && (
          <div className="space-y-4 animate-scale-in">
            {result.matchedSkills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-3">✓ Skills you have for this role</p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">✓ {s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.missingSkills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">✗ Skills to acquire for this role</p>
                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-red-50 text-red-600 border-red-100">✗ {s}</span>
                  ))}
                </div>
              </div>
            )}
            {result.skills?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">All skills detected in your resume</p>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map(s => (
                    <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-semibold border bg-gray-50 text-gray-500 border-gray-200">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 3: Improve CV ── */}
        {tab === 3 && (
          <div className="space-y-4 animate-scale-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">✏️ What to add or improve in your resume</p>
              <p className="text-xs text-gray-400 mb-4">Specific suggestions to make your resume stronger for this role</p>
              {result.resumeSuggestions?.length > 0 ? (
                <div className="space-y-3">
                  {result.resumeSuggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-indigo-900 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No suggestions available. Re-analyze to get this.</p>
              )}
            </div>

            {/* Interactive checklist */}
            <ChecklistCard />
          </div>
        )}

        {/* ── Tab 5: Find Jobs ── */}
        {tab === 5 && (
          <div className="space-y-4 animate-scale-in">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">💼 Live job listings</p>
              <p className="text-xs text-gray-400 mb-5">Searching for <span className="font-semibold text-gray-600">{result.jobTitle}</span> across top platforms — opens real-time results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {JOB_PLATFORMS.map((p) => (
                  <a key={p.name} href={p.getUrl(result.jobTitle)} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                    style={{ background: p.bg, borderColor: p.border }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm border"
                      style={{ borderColor: p.border }}>
                      {p.logo
                        ? <img src={p.logo} alt={p.name} className="w-5 h-5" style={{ filter: `invert(0)` }} />
                        : <span className="text-xl">{p.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: p.color }}>{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.tag}</p>
                    </div>
                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: p.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
              <span className="text-lg flex-shrink-0">💡</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                These links open live search results filtered for <strong>{result.jobTitle}</strong> on each platform. Results are real-time — no data is stored by this app.
              </p>
            </div>
          </div>
        )}

        {/* ── Tab 4: Roadmap ── */}
        {tab === 4 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-scale-in">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your learning roadmap</p>
            <p className="text-xs text-gray-400 mb-5">Steps to close your skill gaps for this role</p>
            {roadmapSteps.length > 0 ? (
              <div className="relative">
                <div className="absolute left-4 top-4 bottom-4 w-px bg-indigo-100" />
                <div className="space-y-4">
                  {roadmapSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-4 pl-1">
                      <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 shadow-sm shadow-indigo-200">
                        {i + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-xl px-4 py-3 mt-0.5">
                        <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400 whitespace-pre-line">{result.roadmap || 'No roadmap available.'}</p>
            )}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="flex gap-3 pb-4">
          <Link to="/upload" className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-semibold hover:bg-indigo-700 active:scale-95 transition-all text-sm text-center shadow-sm">
            Analyze another resume
          </Link>
          <Link to="/dashboard" className="px-5 py-3 bg-white border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-all text-sm text-center">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
