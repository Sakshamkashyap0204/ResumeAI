import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserResults } from '../api';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

const score = (pct) => {
  if (pct >= 70) return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', ring: 'stroke-emerald-500', label: 'Strong' };
  if (pct >= 40) return { bar: 'bg-amber-400',   text: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200',   ring: 'stroke-amber-400',   label: 'Partial' };
  return           { bar: 'bg-red-400',    text: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',    ring: 'stroke-red-400',    label: 'Low' };
};

function MiniRing({ pct }) {
  const s = score(pct);
  const r = 18, c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#f3f4f6" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="4"
          className={s.ring}
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${s.text}`}>{pct}%</span>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 skeleton rounded-lg w-3/4" />
          <div className="h-3 skeleton rounded-lg w-1/2" />
        </div>
      </div>
      <div className="h-1.5 skeleton rounded-full mb-3" />
      <div className="flex gap-2">
        <div className="h-5 w-14 skeleton rounded-md" />
        <div className="h-5 w-18 skeleton rounded-md" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    getUserResults()
      .then(({ data }) => setResults(data))
      .catch(() => toast.error('Failed to load results'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Remove this analysis?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/results/${id}`);
      setResults(p => p.filter(r => r._id !== id));
      toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const filtered = results.filter(r => {
    const q = search.toLowerCase();
    const matchQ = !q || r.jobTitle?.toLowerCase().includes(q) || r.resumeId?.fileName?.toLowerCase().includes(q);
    const matchF = filter === 'all'
      || (filter === 'strong'  && r.matchPercentage >= 70)
      || (filter === 'partial' && r.matchPercentage >= 40 && r.matchPercentage < 70)
      || (filter === 'low'     && r.matchPercentage < 40);
    return matchQ && matchF;
  });

  const best = results.length ? Math.max(...results.map(r => r.matchPercentage)) : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-5 py-8 space-y-6">

        {/* ── Hero banner ── */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl px-7 py-8 overflow-hidden animate-fade-up">
          {/* decorative blobs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-indigo-200 text-sm font-medium mb-1">Good {greeting} ☀️</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {user?.name?.split(' ')[0]}'s Resume Hub
              </h1>
              <p className="text-indigo-200 text-sm mt-1.5">
                {results.length === 0
                  ? 'Start by uploading your first resume'
                  : `${results.length} analys${results.length === 1 ? 'is' : 'es'} · Best match ${best}%`}
              </p>
            </div>
            <Link to="/upload"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-5 py-3 rounded-2xl hover:bg-indigo-50 active:scale-95 transition-all shadow-lg text-sm whitespace-nowrap self-start sm:self-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              New Analysis
            </Link>
          </div>
        </div>

        {/* ── Search + Filter ── */}
        {!loading && results.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 animate-fade-up stagger-1">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search job title or file…"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all shadow-sm" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-lg leading-none">×</button>
              )}
            </div>
            <div className="flex gap-1.5 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              {[['all','All'], ['strong','Strong'], ['partial','Partial'], ['low','Low']].map(([k, l]) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === k ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Cards ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>

        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-scale-in">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 text-4xl">📄</div>
            <h3 className="text-base font-bold text-gray-800 mb-1">No analyses yet</h3>
            <p className="text-gray-400 text-sm max-w-xs mb-5">Upload your resume and match it against a job description to get started</p>
            <Link to="/upload" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
              Upload your first resume →
            </Link>
          </div>

        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-gray-500 text-sm font-medium">No results match</p>
            <button onClick={() => { setSearch(''); setFilter('all'); }} className="text-indigo-500 text-xs mt-2 hover:underline">Clear filters</button>
          </div>

        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r, idx) => {
              const s = score(r.matchPercentage);
              return (
                <Link key={r._id} to={`/results/${r._id}`}
                  className={`animate-fade-up stagger-${Math.min(idx + 1, 6)} group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3`}>

                  {/* Delete */}
                  <button onClick={e => handleDelete(e, r._id)} disabled={deletingId === r._id}
                    className="absolute top-3.5 right-3.5 w-6 h-6 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs">
                    {deletingId === r._id
                      ? <span className="w-3 h-3 border border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                  </button>

                  {/* Top row: ring + title */}
                  <div className="flex items-center gap-3 pr-6">
                    <MiniRing pct={r.matchPercentage} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug truncate group-hover:text-indigo-600 transition-colors">
                        {r.jobTitle || 'Untitled Role'}
                      </h3>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{r.resumeId?.fileName}</p>
                      <span className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-md ${s.bg} ${s.text} border ${s.border}`}>
                        {s.label} match
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div className={`h-1 rounded-full ${s.bar} transition-all duration-700`} style={{ width: `${r.matchPercentage}%` }} />
                  </div>

                  {/* Missing skills */}
                  <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                    {r.missingSkills?.length === 0
                      ? <span className="text-xs text-emerald-600 font-medium">✓ No skill gaps</span>
                      : r.missingSkills?.slice(0, 3).map(s => (
                          <span key={s} className="text-xs bg-red-50 text-red-500 border border-red-100 px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                    {(r.missingSkills?.length || 0) > 3 && (
                      <span className="text-xs text-gray-400">+{r.missingSkills.length - 3} more</span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-xs text-gray-300">
                      {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-xs font-semibold text-indigo-400 group-hover:text-indigo-600 transition-colors">
                      View report →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
