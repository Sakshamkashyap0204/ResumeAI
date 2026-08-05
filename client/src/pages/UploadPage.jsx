import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadResume, analyzeResume } from '../api';
import Navbar from '../components/Navbar';
import { JOB_ROLES, CATEGORIES } from '../data/jobRoles';
import toast from 'react-hot-toast';

const steps = ['Upload Resume', 'Select Role', 'Analyzing'];

const EXPERIENCE_LEVELS = [
  { value: 'fresher',  label: 'Fresher',     sub: '0 years',       icon: '🌱' },
  { value: '0-1',      label: 'Entry Level', sub: '0 – 1 year',    icon: '🚀' },
  { value: '1-3',      label: 'Junior',      sub: '1 – 3 years',   icon: '💼' },
  { value: '3-5',      label: 'Mid-Level',   sub: '3 – 5 years',   icon: '⚡' },
  { value: '5-8',      label: 'Senior',      sub: '5 – 8 years',   icon: '🏆' },
  { value: '8+',       label: 'Lead / Staff',sub: '8+ years',      icon: '🎯' },
];

export default function UploadPage() {
  const [file, setFile]                     = useState(null);
  const [resumeId, setResumeId]             = useState('');
  const [step, setStep]                     = useState(0);
  const [loading, setLoading]               = useState(false);
  const [search, setSearch]                 = useState('');
  const [selectedRole, setSelectedRole]     = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');

  const dropdownRef = useRef();
  const navigate    = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filteredRoles = JOB_ROLES.filter(r => {
    const matchCat    = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) return toast.error('Only PDF files are accepted (max 5MB)');
    if (accepted[0]) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1, maxSize: 5 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!file) return toast.error('Please select a PDF file');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await uploadResume(formData);
      setResumeId(data.resumeId);
      setStep(1);
      toast.success('Resume uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedRole) return toast.error('Please select a job role');
    setStep(2);
    setLoading(true);
    try {
      const roleSkillsText = `Required skills for ${selectedRole.title}: ${selectedRole.skills.join(', ')}.`;
      const fullJobDescription = jobDescription.trim()
        ? `${roleSkillsText}\n\nAdditional job details:\n${jobDescription}`
        : roleSkillsText;

      const { data } = await analyzeResume({
        resumeId,
        jobTitle: selectedRole.title,
        jobDescription: fullJobDescription,
        requiredSkills: selectedRole.skills,
        experienceLevel,
      });
      navigate(`/results/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-10">

        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">New Resume Analysis</h1>
          <p className="text-gray-400 text-sm mt-1">Upload your resume and pick a job role to get an accurate AI match</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                  ${step > i ? 'bg-emerald-500 text-white' : step === i ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 'bg-gray-100 text-gray-400'}`}>
                  {step > i ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step === i ? 'text-indigo-600' : step > i ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px mx-3 transition-all ${step > i ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 0: Upload ── */}
        {step === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up">
            <h2 className="font-semibold text-gray-800 mb-4">Upload your resume</h2>
            <div {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                ${isDragActive ? 'border-indigo-400 bg-indigo-50' : file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}>
              <input {...getInputProps()} />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                  <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB · PDF</p>
                  <button onClick={e => { e.stopPropagation(); setFile(null); }}
                    className="text-xs text-red-400 hover:text-red-600 mt-1 underline">Remove</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-1">📄</div>
                  <p className="font-semibold text-gray-700 text-sm">
                    {isDragActive ? 'Drop it here!' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-xs text-gray-400">or <span className="text-indigo-500 font-medium">click to browse</span></p>
                  <p className="text-xs text-gray-300 mt-1">PDF only · Max 5MB</p>
                </div>
              )}
            </div>
            <button onClick={handleUpload} disabled={!file || loading}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                : 'Continue →'}
            </button>
          </div>
        )}

        {/* ── Step 1: Role + Experience ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-fade-up space-y-6">

            {/* Experience level */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-1">Years of experience</h2>
              <p className="text-xs text-gray-400 mb-3">This helps the AI give feedback relevant to your career stage</p>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE_LEVELS.map(lvl => (
                  <button key={lvl.value} onClick={() => setExperienceLevel(lvl.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all
                      ${experienceLevel === lvl.value
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/50'}`}>
                    <span className="text-xl">{lvl.icon}</span>
                    <span className={`text-xs font-bold ${experienceLevel === lvl.value ? 'text-indigo-700' : 'text-gray-700'}`}>{lvl.label}</span>
                    <span className="text-xs text-gray-400">{lvl.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Job role dropdown */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-1">Job role you're applying for</h2>
              <p className="text-xs text-gray-400 mb-3">Select the role to load its required skills automatically</p>

              <div ref={dropdownRef} className="relative">
                <button type="button" onClick={() => setDropdownOpen(o => !o)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all
                    ${selectedRole ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium' : 'border-gray-200 bg-gray-50 text-gray-400'}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
                  <span>{selectedRole ? selectedRole.title : 'Search and select a job role…'}</span>
                  <svg className={`w-4 h-4 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                        <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                          placeholder="Search job roles…"
                          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                    <div className="flex gap-1 px-3 py-2 border-b border-gray-100 overflow-x-auto">
                      {['All', ...CATEGORIES].map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all
                            ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                    <div className="max-h-56 overflow-y-auto">
                      {filteredRoles.length === 0 ? (
                        <p className="text-center text-sm text-gray-400 py-6">No roles found</p>
                      ) : filteredRoles.map(role => (
                        <button key={role.id}
                          onClick={() => { setSelectedRole(role); setDropdownOpen(false); setSearch(''); }}
                          className={`w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors border-b border-gray-50 last:border-0
                            ${selectedRole?.id === role.id ? 'bg-indigo-50' : ''}`}>
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800">{role.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5 truncate">{role.skills.slice(0, 4).join(' · ')}{role.skills.length > 4 ? ` +${role.skills.length - 4}` : ''}</p>
                            </div>
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md flex-shrink-0">{role.category}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected role skills preview */}
              {selectedRole && (
                <div className="mt-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 animate-fade-in">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-2">Required skills for this role</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedRole.skills.map(s => (
                      <span key={s} className="text-xs bg-white text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optional job description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste job posting <span className="text-gray-400 font-normal">(optional — improves accuracy)</span>
              </label>
              <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the actual job description for even more accurate results…"
                rows={4}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
                ← Back
              </button>
              <button onClick={handleAnalyze} disabled={!selectedRole || loading}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2">
                {loading
                  ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing…</>
                  : 'Analyze with AI ✨'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Analyzing ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center animate-fade-up">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">Analyzing your resume</h2>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Comparing your skills against <span className="text-indigo-600 font-medium">{selectedRole?.title}</span> requirements…
            </p>
            <div className="mt-6 flex justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
