import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    role_id: 3
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Login successful!');
        navigate('/');
      } else {
        await register(formData);
        toast.success('Registration successful!');
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Error is already handled by the API interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      username: '',
      role_id: 3
    });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_top,_rgba(59,130,246,0.18),_transparent_55%),radial-gradient(900px_circle_at_bottom,_rgba(14,165,233,0.16),_transparent_45%)]"></div>
      <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-cyan-400/30 blur-3xl"></div>
      <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/30 blur-3xl"></div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/15 bg-white/90 shadow-2xl backdrop-blur-xl">
            <div className="p-8 sm:p-10">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 via-blue-500 to-indigo-600 shadow-lg shadow-blue-600/40">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
                  Finance Dashboard
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {isLogin ? 'Sign in to your account' : 'Create a new account'}
                </p>
              </div>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                      placeholder="Enter username"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    placeholder="Enter password"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="role_id" className="block text-sm font-medium text-slate-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role_id"
                      name="role_id"
                      value={formData.role_id}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
                    >
                      <option value={3}>Viewer</option>
                      <option value={2}>Analyst</option>
                    </select>
                    <p className="mt-2 text-xs text-slate-500">
                      Note: Admin accounts can only be created by existing admins
                    </p>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-primary-500 hover:via-blue-500 hover:to-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"></div>
                    ) : (
                      isLogin ? 'Sign in' : 'Sign up'
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                  >
                    {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                  </button>
                </div>

                {isLogin && (
                  <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4">
                    <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wider text-slate-500">Demo Accounts</p>
                    <div className="space-y-1 text-xs text-slate-600">
                      <p>📧 Admin: admin@example.com / admin123</p>
                      <p>📧 Analyst: analyst@example.com / analyst123</p>
                      <p>📧 Viewer: viewer@example.com / viewer123</p>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
