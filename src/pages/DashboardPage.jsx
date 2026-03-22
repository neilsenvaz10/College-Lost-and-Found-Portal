import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES, LOCATIONS } from '../constants'
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
  const [items, setItems] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterLoc, setFilterLoc] = useState('all')
  const [filterDate, setFilterDate] = useState('all') // 'all', 'today', 'week', 'month'
  const [selectedItem, setSelectedItem] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/items')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error("Failed to fetch items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // Mapping UI tabs to backend data model:
      // item.type is 'Lost' or 'Found'
      // item.status is 'Active' or 'Resolved'
      
      if (activeTab === 'all' && item.status === 'Resolved') return false
      if (activeTab === 'lost' && (item.type !== 'Lost' || item.status === 'Resolved')) return false
      if (activeTab === 'found' && (item.type !== 'Found' || item.status === 'Resolved')) return false
      if (activeTab === 'returned' && item.status !== 'Resolved') return false
      if (activeTab === 'mine' && item.user?.id !== user?.id && item.userId !== user?.id) return false
      
      if (filterCat !== 'all' && item.category !== filterCat) return false
      if (filterLoc !== 'all' && item.location !== filterLoc) return false

      if (filterDate !== 'all') {
        const itemDate = new Date(item.date)
        const now = new Date()
        if (filterDate === 'today') {
          if (itemDate.toDateString() !== now.toDateString()) return false
        } else if (filterDate === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (itemDate < weekAgo) return false
        } else if (filterDate === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          if (itemDate < monthAgo) return false
        }
      }
      
      if (search) {
        const q = search.toLowerCase()
        return (
          item.title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [items, activeTab, search, filterCat, filterLoc, filterDate, user])

  const stats = useMemo(() => ({
    lost: items.filter((i) => i.type === 'Lost' && i.status === 'Active').length,
    found: items.filter((i) => i.type === 'Found' && i.status === 'Active').length,
    returned: items.filter((i) => i.status === 'Resolved').length,
  }), [items])

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve('');
        return;
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmitReport = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      
      let base64Image = '';
      if (formData.image) {
        base64Image = await convertToBase64(formData.image);
      }

      const payload = {
        title: formData.name,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        location: formData.location || 'Campus',
        type: formData.type === 'lost' ? 'Lost' : 'Found',
        image: base64Image
      };

      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchItems(); // Refresh the list
      } else {
        alert("Failed to create item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting report.");
    }
  }

  const handleMarkReturned = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/items/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'Resolved' })
      });

      if (res.ok) {
         setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: 'Resolved' } : item))
        );
        setSelectedItem(null);
      } else {
        alert("Action failed. You might not be authorized.");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Adjust selectedItem fields to match ItemCard and Modal expectations if needed
  // UI expected specific fields that we replaced with MongoDB standard fields
  const mapItemForUI = (item) => ({
    ...item,
    id: item.id,
    name: item.title,
    status: item.status === 'Resolved' ? 'returned' : item.type.toLowerCase(),
    dateLabel: new Date(item.date).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short',
    }),
    emoji: categoryEmoji(item.category),
    finder: {
      name: item.user?.name || 'Unknown User',
      dept: item.user?.department || 'Unknown Dept',
      phone: item.user?.phone || '',
    },
    postedBy: item.user?.id || item.userId,
    imageUrl: item.image || null
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="font-display text-4xl font-extrabold text-[#111827] tracking-tight">
              Lost & Found <span className="text-blue-600">Board</span>
            </h1>
            <p className="text-lg text-[#6b7280] mt-2 font-medium">
              Browse items or report yours to help fellow VESITians.
            </p>
          </div>
          
          {user && (
            <div className="flex gap-2 justify-center md:justify-end">
              <button
                onClick={() => setReportType('lost')}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-sm active:scale-95"
              >
                + Report Lost
              </button>
              <button
                onClick={() => setReportType('found')}
                className="px-5 py-2.5 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-all shadow-sm active:scale-95"
              >
                + Report Found
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border-l-4 border-red-500 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-6xl">
              🔍
            </div>
            <p className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-1">Active Lost Items</p>
            <p className="text-4xl font-extrabold text-[#111827]">{stats.lost}</p>
            <p className="text-[13px] text-[#6b7280] mt-2 font-medium">Waiting to be found</p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 border-l-4 border-green-500 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-6xl">
              🎁
            </div>
            <p className="text-[11px] font-bold text-green-600 uppercase tracking-widest mb-1">Found Items Today</p>
            <p className="text-4xl font-extrabold text-[#111827]">{stats.found}</p>
            <p className="text-[13px] text-[#6b7280] mt-2 font-medium">Claiming in progress</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-l-4 border-blue-500 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-6xl">
              🤝
            </div>
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-1">Items Returned</p>
            <p className="text-4xl font-extrabold text-[#111827]">{stats.returned}</p>
            <p className="text-[13px] text-[#6b7280] mt-2 font-medium">Successfully reunited</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-8">
          <div className="flex-[2] relative group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search items by name, description or location..."
              className="w-full bg-white border border-[#ddd] rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex flex-1 gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar">
            <select
              className="flex-1 min-w-[140px] bg-white border border-[#ddd] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer font-bold text-[#111827]"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="all">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select
              className="flex-1 min-w-[140px] bg-white border border-[#ddd] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer font-bold text-[#111827]"
              value={filterLoc}
              onChange={(e) => setFilterLoc(e.target.value)}
            >
              <option value="all">All locations</option>
              {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>

            <select
              className="flex-1 min-w-[140px] bg-white border border-[#ddd] rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-blue-500 transition-all shadow-sm cursor-pointer font-bold text-[#111827]"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="all">Any time</option>
              <option value="today">Reported Today</option>
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
            </select>
          </div>
        </div>

        <div className="flex border-b border-[#e5e5e3] mb-6">
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

        {loading ? (
          <div className="text-center py-20 text-[#aaa]">Loading items...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No items found matching your filters.</p>
          </div>
        ) : activeTab === 'all' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lost Section */}
            <section className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <h2 className="text-[13px] font-bold text-[#111827] uppercase tracking-wider">Lost Items</h2>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold ml-1">{filtered.filter(i => i.type === 'Lost').length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.filter(i => i.type === 'Lost').map((item) => (
                  <ItemCard key={item.id} item={mapItemForUI(item)} onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            </section>

            {/* Found Section */}
            <section className="bg-gray-100/50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <h2 className="text-[13px] font-bold text-[#111827] uppercase tracking-wider">Found Items</h2>
                <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-md font-bold ml-1">{filtered.filter(i => i.type === 'Found').length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.filter(i => i.type === 'Found').map((item) => (
                  <ItemCard key={item.id} item={mapItemForUI(item)} onClick={() => setSelectedItem(item)} />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {filtered.map((item) => (
              <ItemCard key={item.id} item={mapItemForUI(item)} onClick={() => setSelectedItem(item)} />
            ))}
          </div>
        )}
      </main>

      {selectedItem && (
        <ItemDetailModal
          item={mapItemForUI(selectedItem)}
          onClose={() => setSelectedItem(null)}
          onMarkReturned={handleMarkReturned}
          currentUserId={user?.id}
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
    Electronics: '📱',
    'Books & Notes': '📓',
    'ID / Cards': '🪪',
    Clothing: '🧥',
    Accessories: '👜',
    Keys: '🔑',
    Other: '📦',
  }
  return map[cat] ?? '📦'
}