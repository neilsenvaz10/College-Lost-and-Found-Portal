import { useParams, useNavigate } from 'react-router-dom'
import { useItems } from '../context/ItemsContext'
import { useAuth } from '../context/AuthContext'

const ITEM_IMAGES = {
  '1': 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=800&fit=crop',
  '2': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop',
  '3': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop',
  '4': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop',
  '5': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
  '6': 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&h=800&fit=crop',
  '7': 'https://images.unsplash.com/photo-1544894084-b191cf200d51?w=800&h=800&fit=crop',
  '8': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=800&fit=crop',
}

export default function ItemDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { getItem, markReturned } = useItems()
  const navigate = useNavigate()

  const item = getItem(id)

  if (!item) {
    return (
      <div className="min-h-screen bg-background-light flex flex-col font-sans">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">←</button>
            <h1 className="text-xl font-bold">Lost & Found</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm text-slate-500">Item not found.</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-sm text-primary underline">
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isOwner = user?.uid === item.postedBy

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I saw your post on the VES Lost & Found portal about "${item.name}". I think it might be mine.`
    )
    window.open(`https://wa.me/91${item.finder.phone}?text=${msg}`, '_blank')
  }

  const handleMarkReturned = () => {
    markReturned(item.id)
    navigate('/item-returned')
  }

  return (
    <div className="min-h-screen bg-background-light flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              ←
            </button>
            <h1 className="text-xl font-bold">Lost & Found</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate('/dashboard')} className="text-primary font-semibold">Home</button>
            <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900">Search</button>
            <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-slate-900">Report Item</button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left — Image */}
          <div className="space-y-4">
            <div className="sticky top-24">
              <div className="aspect-square w-full bg-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
                {ITEM_IMAGES[item.id] ? (
                  <img
                    src={ITEM_IMAGES[item.id]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center text-9xl">
                    {item.emoji}
                  </div>
                )}
                <div className={`absolute top-6 right-6 text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider shadow-lg ${item.status === 'lost' ? 'bg-red-500' : item.status === 'found' ? 'bg-primary' : 'bg-slate-500'}`}>
                  {item.status}
                </div>
              </div>
              <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                <div className="w-24 h-24 rounded-lg bg-slate-100 border-2 border-primary overflow-hidden flex-shrink-0">
                  {ITEM_IMAGES[item.id] ? (
                    <img src={ITEM_IMAGES[item.id]} alt="thumb" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{item.emoji}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Details */}
          <div className="space-y-8">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-slate-500 gap-2">
              <button onClick={() => navigate('/dashboard')} className="hover:text-primary">Home</button>
              <span>/</span>
              <span className="hover:text-primary cursor-pointer">{item.category}</span>
              <span>/</span>
              <span className="text-slate-900 font-medium">Item Details</span>
            </nav>

            {/* Title + Tags */}
            <div className="space-y-2">
              <h2 className="text-slate-900 text-4xl font-extrabold tracking-tight">{item.name}</h2>
              <div className="flex flex-wrap gap-3 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  📂 {item.category}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-semibold">
                  📅 {item.status === 'lost' ? 'Lost' : 'Found'} {item.dateLabel}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200">
              <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider opacity-60">Description</h3>
              <p className="text-slate-700 text-lg leading-relaxed">{item.description}</p>
            </div>

            {/* Finder */}
            <div className="space-y-4">
              <h3 className="text-slate-900 text-sm font-bold uppercase tracking-wider opacity-60">About the Finder</h3>
              <div
                onClick={() => navigate(`/profile/${item.postedBy}`)}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center gap-6 cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary border-2 border-white shadow-sm flex-shrink-0">
                  {item.finder.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-slate-900 text-xl font-bold">{item.finder.name}</h4>
                    <span className="text-primary">✓</span>
                  </div>
                  <p className="text-slate-500">{item.finder.dept}</p>
                  <p className="text-primary text-sm mt-1 font-medium">View Profile →</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4">
              {item.status === 'returned' ? (
                <div className="w-full bg-slate-100 text-slate-500 flex items-center justify-center py-5 rounded-2xl font-bold">
                  This item has been returned ✓
                </div>
              ) : (
                <>
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-bold transition-all shadow-xl hover:shadow-2xl active:scale-[0.98]"
                  >
                    <WhatsAppIcon />
                    <span className="text-lg">Chat on WhatsApp with Finder</span>
                  </button>

                  <p className="text-sm text-center text-slate-400 italic bg-slate-50 p-4 rounded-xl">
                    Please verify your ownership by describing the item details when meeting in person.
                  </p>

                  {isOwner && (
                    <button
                      onClick={handleMarkReturned}
                      className="w-full bg-white text-slate-700 border-2 border-slate-200 hover:border-primary hover:text-primary flex items-center justify-center py-4 rounded-2xl font-bold transition-all"
                    >
                      Mark as Returned
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-bold mb-4">Lost & Found Portal</h2>
            <p className="text-slate-500 max-w-sm">Connecting people with their lost items in our community. Safe, verified, and efficient.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Report Found Item</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Report Lost Item</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Safety Tips</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
          © 2024 VES Lost & Found Portal. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg fill="currentColor" height="28" viewBox="0 0 24 24" width="28">
      <path d="M12.004 2C6.48 2 2.004 6.48 2.004 12C2.004 13.76 2.464 15.42 3.274 16.86L2.004 22L7.294 20.71C8.684 21.54 10.294 22 12.004 22C17.524 22 22.004 17.52 22.004 12C22.004 6.48 17.524 2 12.004 2ZM17.154 17.34C16.944 17.93 16.144 18.43 15.544 18.57C15.134 18.67 14.594 18.75 12.804 18.01C10.514 17.06 9.034 14.73 8.924 14.58C8.814 14.43 7.994 13.34 7.994 12.21C7.994 11.08 8.574 10.53 8.804 10.29C8.984 10.11 9.284 10.03 9.564 10.03C9.654 10.03 9.744 10.03 9.824 10.04C10.054 10.05 10.174 10.06 10.334 10.45C10.534 10.93 11.014 12.11 11.074 12.23C11.134 12.35 11.194 12.51 11.114 12.67C11.034 12.83 10.964 12.92 10.844 13.06C10.724 13.2 10.614 13.31 10.494 13.46C10.384 13.58 10.254 13.71 10.404 13.97C10.554 14.22 11.074 15.07 11.844 15.76C12.844 16.65 13.664 16.93 13.954 17.05C14.164 17.14 14.414 17.12 14.574 16.95C14.774 16.74 15.024 16.39 15.274 16.03C15.454 15.78 15.684 15.75 15.924 15.84C16.174 15.93 17.494 16.58 17.764 16.72C18.034 16.86 18.214 16.93 18.274 17.04C18.344 17.15 18.344 17.66 18.124 18.27L17.154 17.34Z" />
    </svg>
  )
}