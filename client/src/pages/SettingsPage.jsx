import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, deleteAccount } from '../api';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await updateProfile(profile);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally { setLoadingProfile(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword)
      return toast.error('New passwords do not match');
    if (passwords.newPassword.length < 6)
      return toast.error('Password must be at least 6 characters');
    setLoadingPassword(true);
    try {
      await changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally { setLoadingPassword(false); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This will permanently delete your account and all your analyses. This cannot be undone.')) return;
    setLoadingDelete(true);
    try {
      await deleteAccount();
      logout();
      navigate('/login');
      toast.success('Account deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally { setLoadingDelete(false); }
  };

  const EyeIcon = ({ show, toggle }) => (
    <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
      {show
        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" /></svg>
        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-5 py-8 space-y-5">

        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile and account preferences</p>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 animate-fade-up">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-white text-2xl font-bold">{user?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        {/* Edit Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-fade-up">
          <p className="text-sm font-bold text-gray-700 mb-4">Edit Profile</p>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
              <input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })}
                type="email"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="your@email.com" required />
            </div>
            <button type="submit" disabled={loadingProfile}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all">
              {loadingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm animate-fade-up">
          <p className="text-sm font-bold text-gray-700 mb-4">Change Password</p>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { key: 'current', label: 'Current Password', field: 'currentPassword' },
              { key: 'new',     label: 'New Password',     field: 'newPassword' },
              { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword' },
            ].map(({ key, label, field }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                <div className="relative">
                  <input
                    type={showPasswords[key] ? 'text' : 'password'}
                    value={passwords[field]}
                    onChange={e => setPasswords({ ...passwords, [field]: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                    placeholder="••••••••" required />
                  <EyeIcon show={showPasswords[key]} toggle={() => setShowPasswords(s => ({ ...s, [key]: !s[key] }))} />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loadingPassword}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all">
              {loadingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm animate-fade-up">
          <p className="text-sm font-bold text-red-500 mb-1">Danger Zone</p>
          <p className="text-xs text-gray-400 mb-4">Once you delete your account, all your data and analyses will be permanently removed.</p>
          <button onClick={handleDeleteAccount} disabled={loadingDelete}
            className="bg-red-50 text-red-500 border border-red-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white disabled:opacity-50 transition-all">
            {loadingDelete ? 'Deleting...' : '🗑️ Delete My Account'}
          </button>
        </div>

      </div>
    </div>
  );
}
