import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@ves.ac.in')) {
      setError('Access restricted to @ves.ac.in email addresses only.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#eee] px-6 h-16 flex items-center transition-all">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-0.5 shadow-sm border border-[#eee]">
            <img 
              src="https://vesit.ves.ac.in/website_tour/loading/HTMLImage_C28A60A1_CCA4_D9A9_41D4_4451DB51A8F2.png" 
              alt="VES Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="font-display text-lg font-bold text-[#111827] tracking-tight">
            VES <span className="text-blue-600">Found</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-red-100 rounded-full blur-[100px] opacity-20" />

        <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md relative z-10 border border-[#eee]">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-[11px] font-bold text-blue-600 mb-8 uppercase tracking-widest">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Official Campus Portal
          </div>

          <h1 className="font-display text-4xl font-extrabold text-[#111827] leading-tight mb-3 tracking-tight">
            Welcome Back<br />to <span className="text-blue-600">VES Found</span>
          </h1>
          <p className="text-[#6b7280] font-medium leading-relaxed mb-8">
            Please sign in with your college ID to access the dashboard.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600 flex items-center gap-3">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-widest ml-1">College Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50/50 border border-[#eee] rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                placeholder="student@ves.ac.in"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-widest ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50/50 border border-[#eee] rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-[#111827] hover:bg-[#222]
                         rounded-2xl text-sm font-bold text-white transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In & Help Out'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#6b7280] font-medium">
            New to the portal? <Link to="/register" className="text-blue-600 font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}