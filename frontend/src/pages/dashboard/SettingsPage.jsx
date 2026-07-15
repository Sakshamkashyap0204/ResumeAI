import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi } from '../../api/user.api';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function SettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values) => {
    try {
      await userApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage your account security
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">
          Change password
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="Current password"
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />
          <PasswordInput
            label="New password"
            placeholder="Min. 8 characters"
            hint="Must include uppercase, lowercase, and a number"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-full mt-2">
            Update password
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default SettingsPage;
