import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isDashboard = window.location.pathname === '/dashboard'
  const isMyItems = window.location.pathname === '/my-items'

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#eee] px-6 h-16 flex items-center justify-between transition-all">
      <div
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => navigate('/dashboard')}
      >
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

      {user && (
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className={`text-sm font-medium transition-all relative py-1
                ${isDashboard 
                  ? 'text-[#1a1a1a]' 
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a]'}`}
            >
              Dashboard
              {isDashboard && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
            </button>
            <button
              onClick={() => navigate('/my-items')}
              className={`text-sm font-medium transition-all relative py-1
                ${isMyItems 
                  ? 'text-[#1a1a1a]' 
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a]'}`}
            >
              My Items
              {isMyItems && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />}
            </button>
          </div>

          <div className="h-6 w-px bg-[#eee] mx-1 hidden sm:block" />

          <div className="flex items-center gap-3">
            <div
              onClick={() => navigate(`/profile/${user.id}`)}
              className="flex items-center gap-2.5 cursor-pointer hover:bg-[#f7f7f5] px-2 py-1.5 rounded-xl transition-all border border-transparent hover:border-[#eee]"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 select-none shadow-sm">
                {initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] text-[#6b6b6b] font-medium leading-none">Account</p>
                <p className="text-[13px] text-[#1a1a1a] font-semibold mt-0.5 leading-none">Your Profile</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-bold text-white bg-[#1a1a1a] hover:bg-[#333] rounded-xl transition-all shadow-sm active:scale-95"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}