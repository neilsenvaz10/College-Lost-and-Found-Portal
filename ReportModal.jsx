import { useState } from 'react'
import { CATEGORIES } from '../data/mockItems'

export default function ReportModal({ type, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name || !category || !date || !description) {
      alert('Please fill in all required fields.')
      return
    }
    setLoading(true)
    await onSubmit({ name, category, date, description, image, type })
    setLoading(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-background-light w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl font-sans shadow-2xl">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 rounded-t-2xl">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-700"
              >
                ←
              </button>
              <h2 className="text-xl font-bold">
                {type === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
              </h2>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
          </div>
        </header>

        <main className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

              {/* Progress */}
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex gap-6 justify-between items-center mb-4">
                  <div>
                    <p className="text-slate-900 text-xs font-bold uppercase tracking-widest">Step 1 of 2</p>
                    <h3 className="text-lg font-semibold mt-1">Item Information</h3>
                  </div>
                  <p className="text-primary text-sm font-semibold">50% Complete</p>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: '50%' }}></div>
                </div>
                <p className="text-slate-500 text-sm mt-4">
                  Please provide accurate details to help us find your item. Fields marked with * are required.
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                <div className="space-y-6">

                  {/* Item Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-bold">Item Name *</label>
                    <input
                      className="block w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12 px-4 text-base transition-all outline-none placeholder-slate-400"
                      placeholder={type === 'lost' ? 'e.g. Silver iPhone 15 Pro' : 'e.g. Blue Nike Backpack'}
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {/* Category + Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-900 text-sm font-bold">Category *</label>
                      <select
                        className="block w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12 px-4 text-base transition-all outline-none"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="" disabled>Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-slate-900 text-sm font-bold">
                        {type === 'lost' ? 'Date Lost *' : 'Date Found *'}
                      </label>
                      <input
                        className="block w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 h-12 px-4 text-base transition-all outline-none"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-bold">Detailed Description</label>
                    <textarea
                      className="block w-full rounded-xl border border-slate-200 bg-white text-slate-900 focus:border-primary focus:ring-2 focus:ring-primary/20 p-4 text-base transition-all resize-none outline-none placeholder-slate-400"
                      placeholder="Describe specific features, stickers, scratches, or contents..."
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 text-sm font-bold">Upload Image (Optional)</label>
                    <label className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                      <div className="text-5xl text-slate-400 group-hover:text-primary transition-colors mb-4">☁️</div>
                      <p className="text-base font-semibold text-slate-700">
                        {image ? image.name : 'Drop files here or click to upload'}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">JPG, PNG up to 5MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={onClose}
                      className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-[2] bg-primary hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Report →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-8 text-slate-500 text-sm">
              Having trouble?{' '}
              <a href="#" className="text-primary hover:underline font-medium">Contact our support team</a>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 border-t border-slate-200 bg-white rounded-b-2xl">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-xs">© 2024 VES Found. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-slate-600 text-xs">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}