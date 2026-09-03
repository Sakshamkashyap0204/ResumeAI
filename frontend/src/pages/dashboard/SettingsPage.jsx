import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { userApi } from '../../api/user.api';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { memoryApi } from '../../api/memory.api';

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
  const [memories, setMemories] = useState([]);
  const [memoryLoading, setMemoryLoading] = useState(true);

  const loadMemories = async () => {
    try {
      const { data } = await memoryApi.list();
      setMemories(data.data.memories);
    } catch {
      toast.error('Unable to load memories');
    } finally {
      setMemoryLoading(false);
    }
  };

  useEffect(() => { loadMemories(); }, []);

  const removeMemory = async (id) => {
    try { await memoryApi.remove(id); setMemories((current) => current.filter((memory) => memory._id !== id)); toast.success('Memory deleted'); }
    catch { toast.error('Unable to delete memory'); }
  };

  const clearMemories = async () => {
    try { await memoryApi.clear(); setMemories([]); toast.success('Memories cleared'); }
    catch { toast.error('Unable to clear memories'); }
  };

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

      <Card className="p-6 mt-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">AI memory</h2>
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">Muse only saves details you explicitly ask it to remember.</p>
          </div>
          {memories.length > 0 && <Button type="button" variant="danger" size="sm" onClick={clearMemories}>Clear all</Button>}
        </div>
        {memoryLoading ? <p className="text-sm text-[var(--color-text-muted)]">Loading memories...</p> : memories.length === 0 ? <p className="text-sm text-[var(--color-text-muted)]">No saved memories.</p> : (
          <div className="space-y-2">
            {memories.map((memory) => (
              <div key={memory._id} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-2">
                <span className="text-sm text-[var(--color-text-secondary)]">{memory.content}</span>
                <button type="button" onClick={() => removeMemory(memory._id)} className="shrink-0 text-xs text-[var(--color-error)] hover:underline">Delete</button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default SettingsPage;
