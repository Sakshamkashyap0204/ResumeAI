import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiQuillPenLine, RiLockLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { authApi } from '../../api/auth.api';
import { forgotPasswordSchema, resetPasswordSchema } from '../../lib/schemas';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const emailForm = useForm({ resolver: zodResolver(forgotPasswordSchema) });
  const resetForm = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const handleSendOtp = async (values) => {
    try {
      await authApi.forgotPassword({ email: values.email });
      setEmail(values.email);
      setStep(2);
      toast.success('Reset code sent if account exists');
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleReset = async (values) => {
    const code = otp.join('');
    if (code.length !== 6) return toast.error('Enter the 6-digit code');
    try {
      await authApi.resetPassword({ email, otp: code, newPassword: values.newPassword });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired code');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
            <RiQuillPenLine className="text-white" />
          </div>
          <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">Muse</span>
        </div>

        <div className="w-12 h-12 rounded-xl bg-[var(--color-accent-subtle)] border border-[var(--color-accent)]/20 flex items-center justify-center mb-5">
          <RiLockLine className="text-[var(--color-accent)] text-xl" />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Forgot password?</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-8">
                Enter your email and we'll send a reset code
              </p>
              <form onSubmit={emailForm.handleSubmit(handleSendOtp)} className="space-y-4">
                <Input label="Email" type="email" placeholder="you@example.com"
                  error={emailForm.formState.errors.email?.message}
                  {...emailForm.register('email')} />
                <Button type="submit" size="lg" className="w-full"
                  isLoading={emailForm.formState.isSubmitting}>
                  Send reset code
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Reset password</h1>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                Enter the code sent to <span className="text-[var(--color-text-primary)] font-medium">{email}</span>
              </p>

              {/* OTP */}
              <div className="flex gap-2 mb-6">
                {otp.map((digit, i) => (
                  <input key={i} ref={(el) => (inputRefs.current[i] = el)}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`
                      w-full h-12 text-center text-lg font-semibold rounded-[var(--radius-md)]
                      bg-[var(--color-surface-2)] border text-[var(--color-text-primary)]
                      outline-none transition-colors
                      ${digit ? 'border-[var(--color-accent)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'}
                    `}
                  />
                ))}
              </div>

              <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
                <PasswordInput label="New password" placeholder="Min. 8 characters"
                  hint="Must include uppercase, lowercase, and a number"
                  error={resetForm.formState.errors.newPassword?.message}
                  {...resetForm.register('newPassword')} />
                <PasswordInput label="Confirm password" placeholder="••••••••"
                  error={resetForm.formState.errors.confirmPassword?.message}
                  {...resetForm.register('confirmPassword')} />
                <Button type="submit" size="lg" className="w-full"
                  isLoading={resetForm.formState.isSubmitting}
                  disabled={otp.join('').length !== 6}>
                  Reset password
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-sm text-[var(--color-text-secondary)] text-center mt-6">
          <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordPage;
