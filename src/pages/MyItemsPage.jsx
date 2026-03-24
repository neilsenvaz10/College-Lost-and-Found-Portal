import { useState, useEffect, useMemo } from 'react'
import API_URL from '../config'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import ItemDetailModal from '../components/ItemDetailModal'
import ReportModal from '../components/ReportModal'

export default function MyItemsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [reportType, setReportType] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchMyItems = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const res = await fetch(`${API_URL}/api/items/myitems`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (err) {
      console.error("Failed to fetch my items:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyItems()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (activeTab === 'lost') return item.type === 'Lost' && item.status !== 'Resolved'
      if (activeTab === 'found') return item.type === 'Found' && item.status !== 'Resolved'
      if (activeTab === 'returned') return item.status === 'Resolved'
      return true
    })
  }, [items, activeTab])

  const handleMarkReturned = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/items/${id}/status`, {
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

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return resolve('');
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleSubmitReport = async (formData) => {
    try {
      const token = localStorage.getItem('token');
      let base64Image = await convertToBase64(formData.image);
      const payload = {
        title: formData.name,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        location: 'Campus',
        type: formData.type === 'lost' ? 'Lost' : 'Found',
        image: base64Image
      };

      const res = await fetch(`${API_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchMyItems(); 
      } else {
        alert("Failed to create item.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting report.");
    }
  }

  const stats = useMemo(() => ({
    all: items.length,
    lost: items.filter((i) => i.type === 'Lost' && i.status !== 'Resolved').length,
    found: items.filter((i) => i.type === 'Found' && i.status !== 'Resolved').length,
    returned: items.filter((i) => i.status === 'Resolved').length,
  }), [items])

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
      name: user?.name || 'You',
      dept: user?.department || '',
      phone: user?.phone || '',
    },
    postedBy: user?.id,
    imageUrl: item.image || null
  });

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-6"
        >
          ← Back to dashboard
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
              My Items
            </h1>
            <p className="text-sm text-[#6b6b6b] mt-0.5">
              Items you have reported
            </p>
          </div>
          <div className="flex gap-2">
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

        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: 'all', label: 'Total', val: stats.all },
            { key: 'lost', label: 'Lost', val: stats.lost },
            { key: 'found', label: 'Found', val: stats.found },
            { key: 'returned', label: 'Returned', val: stats.returned },
          ].map(({ key, label, val }) => (
            <div
              key={key}
              onClick={() => setActiveTab(key)}
              className={`rounded-xl px-4 py-3.5 cursor-pointer transition-colors
                ${activeTab === key
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-[#f5f5f3] hover:bg-[#efefed]'
                }`}
            >
              <p className={`text-[11px] uppercase tracking-widest mb-0.5
                ${activeTab === key ? 'text-[#aaa]' : 'text-[#6b6b6b]'}`}>
                {label}
              </p>
              <p className={`text-2xl font-medium
                ${activeTab === key ? 'text-white' : 'text-[#1a1a1a]'}`}>
                {val}
              </p>
            </div>
          ))}
        </div>

        {loading ? (
           <div className="text-center py-20 text-[#aaa]">Loading items...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#aaa]">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-sm">You haven't posted any items matching this status.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((rawItem) => {
              const item = mapItemForUI(rawItem);
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="bg-white border border-[#e5e5e3] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#aaa] transition-colors"
                >
                  <div className="w-12 h-12 bg-[#f5f5f3] rounded-lg flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      item.emoji
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-[#1a1a1a]">{item.name}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0
                        ${item.status === 'lost' ? 'bg-red-50 text-red-700 border border-red-200' : ''}
                        ${item.status === 'found' ? 'bg-green-50 text-green-700 border border-green-200' : ''}
                        ${item.status === 'returned' ? 'bg-[#f5f5f3] text-[#6b6b6b] border border-[#d4d4d2]' : ''}
                      `}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </div>

                    <p className="text-xs text-[#6b6b6b] truncate">{item.description}</p>
                    <p className="text-[11px] text-[#aaa] mt-0.5">{item.category} · {item.dateLabel}</p>
                  </div>
                  {item.status !== 'returned' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkReturned(item.id)
                      }}
                      className="flex-shrink-0 px-3 py-1.5 text-xs font-medium border border-[#d4d4d2]
                                 rounded-lg hover:bg-[#f5f5f3] transition-colors text-[#1a1a1a]"
                    >
                      Mark returned
                    </button>
                  )}
                </div>
              )
            })}
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