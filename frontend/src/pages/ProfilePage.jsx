import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

const ProfilePage = () => {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handlePasswordChange = e => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      setPasswordLoading(false);
      return;
    }

    try {
      // Note: Backend needs a password change endpoint
      // For now, this is a placeholder that shows the UI structure
      await api.post('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-sm text-slate-500">
        Please login to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Account</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-[hsl(340,82%,45%)] font-semibold text-xl">
            {user.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900 text-base">{user.name}</p>
            <p className="text-sm text-slate-500 mt-1">{user.email}</p>
            <p className="text-xs text-slate-400 mt-2">
              Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) : 'recently'}
            </p>
          </div>
        </div>
        <div className="pt-4 border-t border-pink-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Account type:</span>
            <span className="px-2 py-1 rounded-full bg-pink-50 text-[hsl(340,82%,45%)] font-medium capitalize">
              {user.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-700 font-medium">Current Password</label>
            <input
              name="currentPassword"
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700 font-medium">New Password</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
            />
            <p className="mt-1 text-xs text-slate-400">Must be at least 6 characters</p>
          </div>
          <div>
            <label className="text-sm text-slate-700 font-medium">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)] focus:bg-white"
            />
          </div>
          {passwordError && (
            <div className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              Password changed successfully
            </div>
          )}
          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-sm hover:bg-[hsl(340,82%,40%)] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {passwordLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
