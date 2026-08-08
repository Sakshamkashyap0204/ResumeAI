import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, signup, verifyOTP, resendOTP } from '../api';
import toast from 'react-hot-toast';

const InputField = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      {...props}
      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
    />
  </div>
);

const PasswordField = ({ label, ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? 'text' : 'password'}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition-all"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        </button>
      </div>
    </div>
  );
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { data } = await login({ email: form.email, password: form.password });
        loginUser(data.token, data.user);
        navigate('/dashboard');
      } else {
        const { data } = await signup(form);
        setUserId(data.userId);
        setMode('otp');
        toast.success('OTP sent to your email!');
      }
    } catch (err) {
      // A 403 here means the password was correct but the account still needs OTP verification.
      // Move the user into the existing verification flow instead of treating it as a dead end.
      if (mode === 'login' && err.response?.status === 403 && err.response.data?.userId) {
        setUserId(err.response.data.userId);
        setOtp('');
        setMode('otp');
        toast('Verify your email to continue. You can resend the code below.');
        return;
      }
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await verifyOTP({ userId, otp });
      loginUser(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOTP({ userId });
      toast.success('New OTP sent!');
    } catch {
      toast.error('Failed to resend OTP');
    }
  };

  const features = [
    { icon: '⚡', text: 'AI-powered skill extraction' },
    { icon: '🎯', text: 'Job description matching' },
    { icon: '📊', text: 'Detailed match percentage' },
    { icon: '🗺️', text: 'Personalized learning roadmap' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-violet-300 rounded-full blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-white font-bold text-xl">ResumeAI</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Land your dream job<br />with AI insights
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-10">
            Upload your resume, paste a job description, and get instant AI analysis with actionable feedback.
          </p>
          <div className="space-y-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center text-sm">{f.icon}</div>
                <span className="text-indigo-100 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-indigo-300 text-xs">© 2024 ResumeAI. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md animate-fade-in">

          {mode === 'otp' ? (
            <>
              <div className="mb-8">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📬</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Check your email</h2>
                <p className="text-gray-500 text-sm mt-1">We sent a 6-digit code to your email address</p>
              </div>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Verification Code</label>
                  <input
                    type="text" maxLength={6} value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    required
                  />
                </div>
                <button type="submit" disabled={loading || otp.length < 6}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </span>
                  ) : 'Verify & Continue'}
                </button>
              </form>
              <p className="text-center text-sm text-gray-500 mt-5">
                Didn't receive it?{' '}
                <button onClick={handleResend} className="text-indigo-600 font-medium hover:underline">Resend code</button>
              </p>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-indigo-600 font-medium hover:underline">
                    {mode === 'login' ? 'Sign up' : 'Log in'}
                  </button>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <InputField label="Full Name" name="name" value={form.name}
                    onChange={handleChange} placeholder="John Doe" required />
                )}
                <InputField label="Email address" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com" required />
                <PasswordField label="Password" name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" required minLength={6} />

                <button type="submit" disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm mt-2">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Please wait...
                    </span>
                  ) : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
