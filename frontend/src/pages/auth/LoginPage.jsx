import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiQuillPenLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import { loginSchema } from '../../lib/schemas';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate('/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

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
          <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">
            Muse
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          Welcome back
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          Sign in to continue writing
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>

          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-2">
            Sign in
          </Button>
        </form>

        <p className="text-sm text-[var(--color-text-secondary)] text-center mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--color-accent)] hover:underline font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default LoginPage;
