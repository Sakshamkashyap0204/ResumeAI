import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { RiBookOpenLine, RiQuillPenLine, RiEmotionLaughLine } from 'react-icons/ri';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../store/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  bio: z.string().max(200, 'Bio cannot exceed 200 characters').optional(),
});

const STAT_ICONS = {
  story: RiBookOpenLine,
  poem: RiQuillPenLine,
  joke: RiEmotionLaughLine,
};

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', bio: user?.bio || '' },
  });

  useEffect(() => {
    userApi.getStats()
      .then(({ data }) => setStats(data.data.stats))
      .catch(() => {})
      .finally(() => setIsLoadingStats(false));
  }, []);

  const onSubmit = async (values) => {
    try {
      const { data } = await userApi.updateProfile(values);
      updateUser(data.data.user);
      reset({ name: data.data.user.name, bio: data.data.user.bio });
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-1">
          Profile
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage your account information
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {isLoadingStats
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-6 w-10 mb-1" />
                <Skeleton className="h-3 w-14" />
              </Card>
            ))
          : stats && Object.entries(stats.byType).map(([type, count]) => {
              const Icon = STAT_ICONS[type];
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="text-[var(--color-text-muted)] text-sm" />
                      <span className="text-xl font-semibold text-[var(--color-text-primary)]">
                        {count}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] capitalize">{type}s</p>
                  </Card>
                </motion.div>
              );
            })
        }
      </div>

      {/* Profile Form */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)] mb-5">
          Account details
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full name"
            error={errors.name?.message}
            {...register('name')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
              Bio
            </label>
            <textarea
              rows={3}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2.5 rounded-[var(--radius-md)] text-sm resize-none bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-accent)] transition-colors"
              {...register('bio')}
            />
            {errors.bio && (
              <p className="text-xs text-[var(--color-error)]">{errors.bio.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              className="opacity-60 cursor-not-allowed"
            />
          </div>
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isDirty}
            className="w-full"
          >
            Save changes
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ProfilePage;
