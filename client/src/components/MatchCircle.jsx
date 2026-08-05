import { useEffect, useState } from 'react';

export default function MatchCircle({ percentage, dark = false }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(percentage), 120);
    return () => clearTimeout(t);
  }, [percentage]);

  const r = 44, c = 2 * Math.PI * r;
  const offset = c - (animated / 100) * c;

  const label = percentage >= 70 ? 'Strong' : percentage >= 40 ? 'Partial' : 'Low';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-28 h-28">
        <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
          <circle cx="56" cy="56" r={r} fill="none"
            stroke={dark ? 'rgba(255,255,255,0.2)' : '#f3f4f6'} strokeWidth="8" />
          <circle cx="56" cy="56" r={r} fill="none"
            stroke={dark ? 'white' : (percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444')}
            strokeWidth="8"
            strokeDasharray={c} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-bold leading-none ${dark ? 'text-white' : (percentage >= 70 ? 'text-emerald-600' : percentage >= 40 ? 'text-amber-500' : 'text-red-500')}`}>
            {percentage}%
          </span>
          <span className={`text-xs mt-0.5 font-medium ${dark ? 'text-white/70' : 'text-gray-400'}`}>match</span>
        </div>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${dark ? 'bg-white/20 text-white' : (percentage >= 70 ? 'bg-emerald-50 text-emerald-600' : percentage >= 40 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500')}`}>
        {label} match
      </span>
    </div>
  );
}
