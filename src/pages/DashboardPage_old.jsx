import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { MOCK_ITEMS, CATEGORIES } from '../data/mockItems'
import Navbar from '../components/Navbar'
import ItemCard from '../components/ItemCard'
import ItemDetailModal from '../components/ItemDetailModal'
import ReportModal from '../components/ReportModal'

const TABS = [
  { key: 'all', label: 'All items' },
  { key: 'lost', label: 'Lost' },
  { key: 'found', label: 'Found' },
  { key: 'returned', label: 'Returned' },
  { key: 'mine', label: 'My items' },
]

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [items, setItems] = useState(MOCK_ITEMS)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [reportType, setReportType] = useState(null)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === 'lost' && item.status !== 'lost') return false
      if (activeTab === 'found' && item.status !== 'found') return false
      if (activeTab === 'returned' && item.status !== 'returned') return false
      if (activeTab === 'mine' && item.postedBy !== user?.uid) return false
      if (filterCat !== 'all' && item.category !== filterCat) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, activeTab, search, filterCat, user])

  const stats = useMemo(() => ({
    lost: items.filter((i) => i.status === 'lost').length,
    found: items.filter((i) => i.status === 'found').length,
    returned: items.filter((i) => i.status === 'returned').length,
  }), [items])

  const handleSubmitReport = async (formData) => {
    const dateLabel = new Date(formData.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short',
    })
    const newItem = {
      id: String(Date.now()),
      name: formData.name,
      category: formData.category,
      emoji: categoryEmoji(formData.category),
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
    setItems((prev) => [newItem, ...prev])
  }

  const handleMarkReturned = async (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'returned' } : item))
    )
    setSelectedItem(null)
  }

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
              Lost & Found Board
            </h1>
            <p className="text-sm text-[#6b6b6b] mt-0.5">Browse items or report yours</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setReportType('lost')}
              className="px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors
                         bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              + Report Lost
            </button>
            <button
              onClick={() => setReportType('found')}
              className="px-4 py-2 text-sm font-medium rounded-lg border cursor-pointer transition-colors
                         bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              + Report Found
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Active lost items', val: stats.lost, desc: 'Waiting to be found' },
            { label: 'Found items', val: stats.found, desc: 'Claiming in progress' },
            { label: 'Returned', val: stats.returned, desc: 'Successfully reunited' },
          ].map(({ label, val, desc }) => (
            <div key={label} className="bg-[#f5f5f3] rounded-xl px-4 py-3.5">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">{label}</p>
              <p className="text-3xl font-medium text-[#1a1a1a]">{val}</p>
              <p className="text-[11px] text-[#aaa] mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5 mb-5">
          <input
            className="input-base flex-1"
            type="text"
            placeholder="Search items by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-base w-44 flex-shrink-0"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex border-b border-[#e5e5e3] mb-5">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors
                ${activeTab === key
                  ? 'text-[#1a1a1a] border-[#1a1a1a]'
                  : 'text-[#6b6b6b] border-transparent hover:text-[#333]'
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-4xl mb-3">≡ƒöì</div>
            <p className="text-sm">No items found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={item} onClick={setSelectedItem} />
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onMarkReturned={handleMarkReturned}
        />
      )}

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

function categoryEmoji(cat) {
  const map = {
    Electronics: '≡ƒô▒',
    'Books & Notes': '≡ƒôô',
    'ID / Cards': '≡ƒ¬¬',
    Clothing: '≡ƒºÑ',
    Accessories: '≡ƒæ£',
    Keys: '≡ƒöæ',
    Other: '≡ƒôª',
  }
  return map[cat] ?? '≡ƒôª'
}
