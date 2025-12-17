import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const RegisterPage = () => {
  const { register, loading, error } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const user = await register(form);
      // After register, user is auto-logged in via AuthContext
      // Redirect based on role (should be 'user' for new registrations)
      if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      // Error handled by context and displayed
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-pink-100 p-6 shadow-[0_16px_40px_rgba(244,114,182,0.2)]">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500">Join DecoraBake in a few seconds.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-slate-700">Name</label>
            <input
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-pink-100 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(340,82%,72%)]"
            />
          </div>
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
              minLength={8} // Match backend validation
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[hsl(340,82%,45%)] font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;


