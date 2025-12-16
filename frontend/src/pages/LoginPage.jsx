import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = ({ adminMode = false }) => {
  const { login, loading, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const isAdminLogin = adminMode || location.pathname.startsWith('/admin');
      const user = await login({ email: form.email, password: form.password, admin: isAdminLogin });
      
      // Role-based redirect
      if (user.role === 'admin') {
        // Admin always goes to admin dashboard
        navigate('/admin', { replace: true });
      } else {
        // Regular user: go to intended page or home
        // If they were trying to access admin, redirect to home
        if (from.startsWith('/admin')) {
          navigate('/', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      // Error handled by context and displayed
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 p-6 shadow-[0_16px_40px_rgba(244,114,182,0.2)]">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">
            {adminMode || location.pathname.startsWith('/admin') ? 'Admin login' : 'Welcome back'}
          </h1>
          <p className="text-sm text-slate-500">
            {adminMode || location.pathname.startsWith('/admin')
              ? 'Login with your admin account.'
              : 'Login to continue shopping.'}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
            />
          </div>
          <div>
            <label className="text-sm text-slate-700">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[hsl(340,82%,45%)] text-white text-sm font-medium shadow-[0_12px_26px_rgba(244,114,182,0.45)] hover:bg-[hsl(340,82%,40%)] transition disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="text-[hsl(340,82%,45%)] font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


