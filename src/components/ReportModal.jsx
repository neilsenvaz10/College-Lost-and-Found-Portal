import { useState } from 'react'
import { CATEGORIES, LOCATIONS } from '../constants'

export default function ReportModal({ type, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    date: '',
    location: '',
    description: '',
    image: null,
  })
  const [loading, setLoading] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.date || !form.description || !form.location) {
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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 animate-in fade-in duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-[#e5e5e3] w-full max-w-lg max-h-[90vh] flex flex-col relative animate-in zoom-in-95 duration-300 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-[#eee]">
          <div>
            <h2 className="font-display text-xl font-bold text-[#111827]">
              {type === 'lost' ? 'What did you lose?' : 'What did you find?'}
            </h2>
            <div className={`mt-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
              type === 'lost' ? 'text-red-600' : 'text-green-600'
            }`}>
              {type === 'lost' ? 'Reporting Missing Item' : 'Reporting Found Item'}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 overflow-y-auto custom-scrollbar flex-1 space-y-5">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className="input-base px-3"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                  {type === 'lost' ? 'Date lost' : 'Date found'} <span className="text-red-500">*</span>
                </label>
                <input
                  className="input-base px-3"
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  onClick={(e) => e.target.showPicker?.()}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                Last Seen Location <span className="text-red-500">*</span>
              </label>
              <select
                className="input-base px-3"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
              >
                <option value="" disabled>Select location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="input-base resize-none"
                rows={3}
                placeholder="Describe the item — color, brand, or any distinguishing marks..."
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-0.5">
                Photo Evidence <span className="text-gray-400 font-medium">(optional)</span>
              </label>
              <label className="group block border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-6 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-100 transition-all">
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">📸</span>
                  <span className="text-sm text-gray-500 font-medium">
                    {form.image ? form.image.name : 'Choose a photo or take one now'}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => set('image', e.target.files[0])}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-4 border-t border-[#eee] bg-gray-50">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`btn-primary flex items-center justify-center gap-2 ${
              type === 'lost' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </span>
            ) : (
              <>
                {type === 'lost' ? 'Publish Lost Report' : 'Publish Found Report'}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}