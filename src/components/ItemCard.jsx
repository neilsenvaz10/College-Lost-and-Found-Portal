const statusStyles = {
  lost: 'bg-red-50 text-red-600 border-red-100',
  found: 'bg-green-50 text-green-600 border-green-100',
  returned: 'bg-blue-50 text-blue-600 border-blue-100',
}

export default function ItemCard({ item, onClick }) {
  return (
    <div
      onClick={onClick}
      className="glass-card premium-shadow rounded-2xl p-4 cursor-pointer card-hover border border-transparent hover:border-blue-200 group relative"
    >
      <div className={`h-40 rounded-xl flex items-center justify-center text-5xl mb-4 overflow-hidden relative transition-colors
        ${item.status === 'lost' ? 'bg-red-50/50' : item.status === 'found' ? 'bg-green-50/50' : 'bg-blue-50/50'}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="group-hover:scale-125 transition-transform duration-500 delay-75">{item.emoji}</span>
        )}
        
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border shadow-sm ${statusStyles[item.status]}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-[#111827] text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
          {item.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#6b7280]">{item.category}</span>
          <span className="text-[11px] font-bold text-[#9ca3af]">{item.dateLabel}</span>
        </div>
      </div>
    </div>
  )
}