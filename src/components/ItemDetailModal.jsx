import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function ItemDetailModal({ item, onClose, onMarkReturned }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  if (!item) return null

  const isOwner = user?.id === item.postedBy

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I saw your post on the VES Lost & Found portal about "${item.name}". I think it might be mine.`
    )
    window.open(`https://wa.me/91${item.finder?.phone || ''}?text=${msg}`, '_blank')
  }

  const handleViewProfile = () => {
    onClose()
    navigate(`/profile/${item.postedBy}`)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col relative border border-[#e5e5e3] shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-0 flex items-start justify-between mb-6">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 ${
              item.status === 'lost' ? 'bg-red-50 text-red-600 border border-red-100' : 
              item.status === 'found' ? 'bg-green-50 text-green-600 border border-green-100' :
              'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                item.status === 'lost' ? 'bg-red-500' : 
                item.status === 'found' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              {item.status}
            </div>
            <h2 className="font-display text-2xl font-extrabold text-[#111827] leading-tight">
              {item.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Image/Emoji Section */}
          <div className="aspect-video w-full bg-gray-50 rounded-3xl flex items-center justify-center text-7xl mb-8 border border-gray-100 overflow-hidden relative group">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <span className="drop-shadow-xl">{item.emoji}</span>
            )}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-600 shadow-sm">
              {item.category}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <p className="text-sm font-bold text-gray-900 capitalize">{item.status}</p>
            </div>
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                {item.status === 'lost' ? 'Lost on' : 'Found on'}
              </p>
              <p className="text-sm font-bold text-gray-900">{item.dateLabel}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Description</p>
              <p className="text-sm font-medium text-gray-600 leading-relaxed bg-white border border-gray-100 p-4 rounded-2xl">
                {item.description}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Reported By</p>
              <div
                onClick={handleViewProfile}
                className="group flex items-center justify-between p-4 bg-blue-50/30 hover:bg-blue-50/60 border border-blue-100/50 rounded-2xl cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    {item.finder?.name ? item.finder.name.charAt(0) : '?'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none">{item.finder?.name || 'Unknown'}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-1">{item.finder?.dept || 'VESIT'}</p>
                  </div>
                </div>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          {item.status === 'returned' ? (
            <div className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Item reunited with owner
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleWhatsApp}
                className="w-full py-4 bg-[#25d366] hover:bg-[#22c35e] text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-green-100 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.123.554 4.197 1.608 6.037L0 24l6.105-1.602a11.834 11.834 0 005.94 1.6c6.637 0 12.048-5.412 12.051-12.05a11.812 11.812 0 00-3.534-8.415z" />
                </svg>
                Contact Owner via WhatsApp
              </button>

              {isOwner && (
                <button
                  onClick={() => onMarkReturned(item.id)}
                  className="w-full py-4 bg-white hover:bg-gray-50 text-[#1a1a1a] border border-gray-200 rounded-2xl text-sm font-bold transition-all active:scale-95"
                >
                  Mark as successfully returned
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}