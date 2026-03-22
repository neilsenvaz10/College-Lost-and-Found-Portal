import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [profile, setProfile] = useState(null)
  const [userItems, setUserItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch user profile
        const userRes = await fetch(`http://localhost:5000/api/auth/user/${id}`)
        if (userRes.ok) {
          const userData = await userRes.json()
          setProfile(userData)
        }

        // Fetch all items and filter (in a real app, use a dedicated endpoint)
        const itemsRes = await fetch('http://localhost:5000/api/items')
        if (itemsRes.ok) {
          const allItems = await itemsRes.json()
          const msItems = allItems.filter(item => 
             item.userId === id || (item.user && item.user.id === id)
          )
          setUserItems(msItems)
        }
      } catch (err) {
        console.error("Failed to load profile data", err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [id])

  if (loading) {
    return (
       <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
         <Navbar />
         <div className="flex-1 flex items-center justify-center text-[#aaa]">Loading profile...</div>
       </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">👤</div>
            <p className="text-sm text-[#6b6b6b]">Profile not found.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-sm text-blue-600 underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const initials = profile.name
    ? profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi ${profile.name}! I found your contact on the VES Lost & Found portal.`
    )
    window.open(`https://wa.me/91${profile.phone || ''}?text=${msg}`, '_blank')
  }

  const categoryEmoji = (cat) => {
    const map = {
      Electronics: '📱', 'Books & Notes': '📓', 'ID / Cards': '🪪', Clothing: '🧥',
      Accessories: '👜', Keys: '🔑', Other: '📦',
    }
    return map[cat] ?? '📦'
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* User Profile Info Card */}
          <div className="w-full md:w-80 bg-white rounded-2xl shadow-md p-8 sticky top-24 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-3xl font-extrabold text-blue-600 mb-6 shadow-sm">
                {initials}
              </div>
              <h1 className="text-2xl font-extrabold text-[#111827] leading-tight">{profile.name}</h1>
              <p className="text-blue-600 font-bold text-sm mt-1 uppercase tracking-widest">{profile.department || 'Student'}</p>
              
              <div className="w-full h-px bg-[#eee] my-8" />
              
              <div className="w-full space-y-6 text-left">
                <div>
                  <label className="text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-widest block mb-1">Email</label>
                  <p className="text-sm font-semibold text-[#111827] truncate">{profile.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-widest block mb-1">Phone</label>
                  <p className="text-sm font-semibold text-[#111827]">{profile.phone || 'Not provided'}</p>
                </div>
                {profile.rollNumber && (
                  <div>
                    <label className="text-[10px] font-extrabold text-[#9ca3af] uppercase tracking-widest block mb-1">Roll Number</label>
                    <p className="text-sm font-semibold text-[#111827]">{profile.rollNumber}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 w-full space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-3 bg-[#25d366] text-white rounded-2xl text-sm font-bold
                             hover:bg-[#1ebe5d] transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2 active:scale-95"
                >
                  <WhatsAppIcon />
                  Chat on WhatsApp
                </button>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-[11px] text-[#6b7280] leading-relaxed text-left">
                  <span className="font-bold text-[#111827]">Quick Location Clip:</span> You can find {profile.name?.split(' ')[0]} in <span className="font-bold text-blue-600">{profile.classDivision || '-'}</span> ({profile.department || '-'}), batch of {profile.graduationYear || '-'}.
                </div>
              </div>
            </div>
          </div>

          {/* History/Items Section */}
          <div className="flex-1 space-y-8 w-full">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-3xl font-extrabold text-[#111827] tracking-tight">Post <span className="text-blue-600">History</span></h2>
                <p className="text-[#6b7280] mt-1 font-medium">Items reported by this user.</p>
              </div>
              <button
                onClick={() => navigate(-1)}
                className="text-xs font-bold text-[#6b7280] hover:text-[#111827] flex items-center gap-1.5 transition-colors bg-white px-4 py-2 rounded-xl border border-[#eee] shadow-sm"
              >
                ← Back
              </button>
            </header>

            {userItems.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-20 text-center border-dashed border-2 border-gray-100">
                <div className="text-6xl mb-4">📜</div>
                <p className="text-[#6b7280] font-medium">No items found in this user's history.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => navigate('/dashboard')}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#f8f9fa] rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-blue-50 transition-colors overflow-hidden">
                         {item.image ? (
                           <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                         ) : (
                           categoryEmoji(item.category)
                         )}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#111827] group-hover:text-blue-600 transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                             item.type === 'Lost' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'
                           }`}>
                             {item.type}
                           </span>
                           <span className="text-[11px] font-bold text-[#9ca3af]">
                             {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                           </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                        item.status === 'Resolved' 
                          ? 'bg-blue-600 text-white shadow-sm' 
                          : 'bg-gray-100 text-[#6b7280]'
                      }`}>
                        {item.status === 'Resolved' ? '✓ Returned' : 'Active'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.5 3.5A12 12 0 0 0 3.7 18.3L2 22l3.8-1.6A12 12 0 1 0 20.5 3.5zm-8.5 18a10 10 0 0 1-5.4-1.6l-.4-.2-2.4 1 1-2.3-.3-.4A10 10 0 1 1 12 21.5zm5.5-7.5c-.3-.1-1.8-.9-2.1-1s-.5-.1-.7.2-.8 1-1 1.2-.4.1-.7 0a8.3 8.3 0 0 1-2.4-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-.9-2.3c-.3-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.1-1.2 2.7 1.2 3.2 1.4 3.4 2.4 3.6 5.8 5c.8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4s.2-1.3.2-1.4-.2-.2-.5-.4z"
        fill="white"
      />
    </svg>
  )
}