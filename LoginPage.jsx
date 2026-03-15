import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { loginWithGoogle, user, profile } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    navigate(profile ? '/dashboard' : '/register', { replace: true })
    return null
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
      navigate('/register', { replace: true })
    } catch (err) {
      setError(err.message ?? 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background-light" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
      {/* Nav */}
      <nav className="w-full py-6 px-8 flex justify-center md:justify-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">VES</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">VES College</span>
        </div>
      </nav>

      {/* Main card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white shadow-2xl rounded-2xl p-10 border border-slate-200/60">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-primary/10 rounded-2xl">
              <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lost & Found Portal</h1>
            <p className="mt-3 text-slate-600">Sign in to report or find lost items within the campus.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-white border-2 border-slate-100 rounded-xl hover:border-primary/30 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50"
            >
              <GoogleIcon />
              <span className="font-semibold text-lg text-slate-700">
                {loading ? 'Signing in...' : 'Sign in with Google'}
              </span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="mx-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Institutional Access Only</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <p className="text-sm text-center text-slate-500 leading-relaxed">
              Use your official <strong>@ves.ac.in</strong> email address to securely access the portal.
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-tight text-slate-900">Authorized Users Only</h4>
                <p className="text-xs text-slate-500 mt-0.5">Protected by Vivekananda Education Society IT policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-8 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-sm text-slate-500">© 2024 Vivekananda Education Society.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">Terms of Use</a>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <a href="https://ves.ac.in" target="_blank" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Main Website ↗
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}