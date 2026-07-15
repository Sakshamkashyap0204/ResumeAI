import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiQuillPenLine } from 'react-icons/ri';
import toast from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import { registerSchema } from '../../lib/schemas';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';

function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values) => {
    try {
      await registerUser(values);
      toast.success('Check your email for the verification code');
      navigate('/verify-email', { state: { email: values.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
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
          <span className="font-semibold text-lg text-[var(--color-text-primary)] tracking-tight">Muse</span>
        </div>

        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">Create your account</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          We'll send a verification code to your email
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full name" type="text" placeholder="Jane Smith"
            error={errors.name?.message} {...register('name')} />
          <Input label="Email" type="email" placeholder="you@example.com"
            error={errors.email?.message} {...register('email')} />
          <PasswordInput label="Password" placeholder="Min. 8 characters"
            hint="Must include uppercase, lowercase, and a number"
            error={errors.password?.message} {...register('password')} />
          <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-2">
            Create account
          </Button>
        </form>

        <p className="text-sm text-[var(--color-text-secondary)] text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent)] hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default RegisterPage;
