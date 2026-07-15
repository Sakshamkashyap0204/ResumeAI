import { useRef, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiQuillPenLine, RiMailLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import Button from '../../components/ui/Button';

function VerifyEmailPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit code');

    setIsVerifying(true);
    try {
      await authApi.verifyEmail({ email, otp: code });
      toast.success('Email verified! You can now sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid code');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await authApi.resendOtp({ email });
      toast.success('New code sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend');
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">No email found.</p>
          <Link to="/register" className="text-[var(--color-accent)] hover:underline text-sm">
            Go back to register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <RiQuillPenLine className="text-white" />
          </div>
          <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">Muse</span>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-center mb-5">
          <RiMailLine className="text-[var(--color-accent)] text-xl" />
        </div>

        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Check your email</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          We sent a 6-digit code to <span className="text-[var(--color-text-primary)] font-medium">{email}</span>
        </p>

        {/* OTP Input */}
        <div className="flex gap-2 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`
                w-full h-12 text-center text-lg font-semibold rounded-[var(--radius-md)]
                bg-[var(--color-surface-2)] border text-[var(--color-text-primary)]
                outline-none transition-colors duration-150
                ${digit ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'}
              `}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="w-full mb-4"
          isLoading={isVerifying}
          onClick={handleVerify}
          disabled={otp.join('').length !== 6}
        >
          Verify email
        </Button>

        <p className="text-sm text-[var(--color-text-secondary)] text-center">
          Didn't receive it?{' '}
          <button
            onClick={handleResend}
            disabled={isResending}
            className="text-[var(--color-accent)] hover:underline font-medium disabled:opacity-50"
          >
            {isResending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default VerifyEmailPage;
