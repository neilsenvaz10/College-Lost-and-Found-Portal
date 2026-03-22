import { useState } from 'react'
import { CATEGORIES } from '../data/mockItems'

export default function ReportModal({ type, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    date: '',
    description: '',
    image: null,
  })
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.date || !form.description) {
      alert('Please fill in all required fields.')
      return
    }
    setLoading(true)
    await onSubmit({ ...form, type })
    setLoading(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#e5e5e3] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl font-semibold text-[#1a1a1a]">
              {type === 'lost' ? 'Report a lost item' : 'Report a found item'}
            </h2>
            <button
              onClick={onClose}
              className="text-[#aaa] hover:text-[#1a1a1a] text-xl leading-none transition-colors"
            >
              Γ£ò
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
                Item name <span className="text-red-500">*</span>
              </label>
              <input
                className="input-base"
                type="text"
                placeholder="e.g. Blue scientific calculator"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-base"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  <option value="" disabled>Select</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
                  {type === 'lost' ? 'Date lost' : 'Date found'} <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-base"
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-base resize-none"
                rows={3}
                placeholder="Describe the item ΓÇö color, brand, distinguishing features..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#4b4b4b] mb-1.5">
                Image <span className="text-[#aaa]">(optional)</span>
              </label>
              <label className="block border-2 border-dashed border-[#d4d4d2] rounded-xl p-6 text-center cursor-pointer hover:border-[#aaa] transition-colors">
                <span className="text-2xl block mb-1">≡ƒô╖</span>
                <span className="text-sm text-[#6b6b6b]">
                  {form.image ? form.image.name : 'Click to attach an image'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => set('image', e.target.files[0])}
                />
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit report ΓåÆ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
