import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../context/ItemsContext'
import { CATEGORIES } from '../data/mockItems'
import ReportModal from '../components/ReportModal'

const ITEM_IMAGES = {
  '1': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop',
  '2': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  '3': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
  '4': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
  '5': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
  '6': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=300&fit=crop',
  '7': 'https://images.unsplash.com/photo-1544894084-b191cf200d51?w=400&h=300&fit=crop',
  '8': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
}

export default function DashboardPage() {
  const { user, profile, logout } = useAuth()
  const { items, addItem } = useItems()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [reportType, setReportType] = useState(null)

  const firstName = profile?.fullName?.split(' ')[0] ?? 'Student'
  const initials = profile?.fullName
    ? profile.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  const filtered = useMemo(() => {
    if (activeTab === 'lost') return items.filter((i) => i.status === 'lost')
    if (activeTab === 'found') return items.filter((i) => i.status === 'found')
    return items
  }, [items, activeTab])

  const handleSubmitReport = async (formData) => {
    const dateLabel = new Date(formData.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short',
    })
    const newItem = {
      id: String(Date.now()),
      name: formData.name,
      category: formData.category,
      emoji: '📦',
      date: formData.date,
      dateLabel,
      status: formData.type,
      description: formData.description,
      finder: {
        name: profile?.fullName ?? 'You',
        dept: `${profile?.classDivision ?? ''} ${profile?.department ?? ''}`.trim(),
        phone: profile?.phone ?? '',
      },
      postedBy: user?.uid ?? 'me',
    }
    addItem(newItem)
  }

  return (
    <div className="min-h-screen bg-background-light font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold tracking-tight">VES Found</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/dashboard')} className="text-primary font-semibold text-sm flex items-center gap-1">
                🏠 Home
              </button>
              <button onClick={() => navigate('/my-items')} className="text-slate-500 hover:text-primary transition-colors font-medium text-sm flex items-center gap-1">
                📦 My Items
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold">{profile?.fullName ?? user?.email}</p>
                <p className="text-[11px] text-slate-500">{profile?.classDivision ?? 'Student'}</p>
              </div>
              <div
                onClick={() => navigate(`/profile/${user?.uid}`)}
                className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary border border-primary/30 cursor-pointer"
              >
                {initials}
              </div>
              <button
                onClick={() => { logout(); navigate('/login') }}
                className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold mb-2">Welcome back, {firstName}!</h2>
          <p className="text-slate-500 text-lg">Quickly report an item or browse the latest campus activity.</p>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <button
            onClick={() => setReportType('lost')}
            className="group relative overflow-hidden bg-primary p-8 rounded-2xl text-white shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-8 text-left"
          >
            <div className="bg-white/20 p-5 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Report Lost Item</h3>
              <p className="text-white/80">Help others identify something you've misplaced on campus</p>
            </div>
            <span className="absolute top-6 right-6 opacity-20 text-8xl select-none">?</span>
          </button>

          <button
            onClick={() => setReportType('found')}
            className="group relative overflow-hidden bg-white border-2 border-primary p-8 rounded-2xl text-primary shadow-md hover:bg-primary/5 transition-all flex items-center gap-8 text-left"
          >
            <div className="bg-primary/10 p-5 rounded-2xl group-hover:scale-110 transition-transform">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Report Found Item</h3>
              <p className="text-slate-500">Register an item you've discovered to help it find its owner</p>
            </div>
            <span className="absolute top-6 right-6 opacity-10 text-8xl select-none">✓</span>
          </button>
        </div>

        {/* Recent Items */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold">Recent Items</h3>
              <p className="text-sm text-slate-500">Updated every few minutes</p>
            </div>
            <div className="flex bg-slate-200/50 p-1.5 rounded-xl">
              {['all', 'lost', 'found'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-primary'}`}
                >
                  {tab === 'all' ? 'All Items' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
                  {ITEM_IMAGES[item.id] ? (
                    <img
                      src={ITEM_IMAGES[item.id]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center text-5xl">
                      {item.emoji}
                    </div>
                  )}
                  <span className={`absolute top-4 right-4 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg ${item.status === 'lost' ? 'bg-red-500' : item.status === 'found' ? 'bg-green-500' : 'bg-slate-500'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors mb-3">
                    {item.name}
                  </h4>
                  <div className="flex flex-col gap-2 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{item.dateLabel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{item.finder.dept || 'VES Campus'}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-primary bg-primary/10 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {item.category}
                    </span>
                    <button className="text-primary font-bold text-sm hover:underline">View Details</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Browse All */}
            <div
              onClick={() => setActiveTab('all')}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors group h-[400px]"
            >
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all text-2xl font-bold">
                +
              </div>
              <p className="text-xl font-bold mb-2">Browse All Items</p>
              <p className="text-slate-500 max-w-[200px] text-sm leading-relaxed">
                View our full history of reported items across campus.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <span className="text-xl font-bold">VES Found</span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              Connecting students with their misplaced belongings. Our mission is to build a more collaborative and helpful campus environment through technology.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Campus Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Campus Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-primary transition-colors">Student Union</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Campus Security</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Library Information</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
          <p>© 2024 VES Found Portal. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Cookies</a>
          </div>
        </div>
      </footer>

      {reportType && (
        <ReportModal
          type={reportType}
          onClose={() => setReportType(null)}
          onSubmit={handleSubmitReport}
        />
      )}
    </div>
  )
}