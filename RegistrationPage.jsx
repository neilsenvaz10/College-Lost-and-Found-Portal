import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { db } from '../lib/firebase'
import { DEPARTMENTS, GRAD_YEARS } from '../data/mockItems'

export default function RegistrationPage() {
  const { user, setProfile } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [alternateEmail, setAlternateEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [graduationYear, setGraduationYear] = useState('')
  const [classDivision, setClassDivision] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!fullName.trim()) e.fullName = 'Required'
    if (!phone.trim() || !/^\d{10}$/.test(phone)) e.phone = 'Enter a valid 10-digit number'
    if (!department) e.department = 'Required'
    if (!graduationYear) e.graduationYear = 'Required'
    if (!classDivision.trim()) e.classDivision = 'Required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const profileData = {
        fullName, phone, alternateEmail, department,
        graduationYear, classDivision,
        vesEmail: user.email, uid: user.uid,
        createdAt: new Date().toISOString(),
      }
      await setDoc(doc(db, 'users', user.uid), profileData)
      setProfile(profileData)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      alert('Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-light font-sans">
      <div className="max-w-4xl mx-auto min-h-screen flex flex-col bg-white shadow-xl md:my-8 md:min-h-0 md:rounded-2xl overflow-hidden">

        {/* Header */}
        <header className="flex items-center p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md z-10">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 transition-colors text-slate-700 text-xl"
          >
            ←
          </button>
          <h1 className="text-slate-900 text-lg font-bold flex-1 text-center pr-10">Registration</h1>
        </header>

        {/* Main */}
        <main className="flex-1 p-8 md:p-12">
          <div className="mb-10">
            <h2 className="text-slate-900 text-3xl md:text-4xl font-bold leading-tight mb-3">
              Complete Your Profile
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">
              Join the campus community to start tracking lost items and helping others find theirs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                className={`w-full h-12 rounded-lg border px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.fullName ? 'border-red-400' : 'border-slate-300'}`}
                placeholder="John Doe"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
              <input
                className={`w-full h-12 rounded-lg border px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.phone ? 'border-red-400' : 'border-slate-300'}`}
                placeholder="+91 XXXXX XXXXX"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* VES Email readonly */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">VES Email (Official)</label>
              <div className="relative">
                <input
                  className="w-full h-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed px-4 pr-10"
                  readOnly
                  type="email"
                  value={user?.email ?? ''}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">🔒</span>
              </div>
            </div>

            {/* Alternate Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Alternate Email</label>
              <input
                className="w-full h-12 rounded-lg border border-slate-300 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                placeholder="personal.email@gmail.com"
                type="email"
                value={alternateEmail}
                onChange={(e) => setAlternateEmail(e.target.value)}
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Department</label>
              <select
                className={`w-full h-12 rounded-lg border px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.department ? 'border-red-400' : 'border-slate-300'}`}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">Select Dept</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
              {errors.department && <p className="text-xs text-red-500">{errors.department}</p>}
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Graduation Year</label>
              <select
                className={`w-full h-12 rounded-lg border px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.graduationYear ? 'border-red-400' : 'border-slate-300'}`}
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
              >
                <option value="">Select year</option>
                {GRAD_YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
              {errors.graduationYear && <p className="text-xs text-red-500">{errors.graduationYear}</p>}
            </div>

            {/* Class / Division full width */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700">Class / Division</label>
              <input
                className={`w-full h-12 rounded-lg border px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all ${errors.classDivision ? 'border-red-400' : 'border-slate-300'}`}
                placeholder="e.g. D10-A"
                type="text"
                value={classDivision}
                onChange={(e) => setClassDivision(e.target.value)}
              />
              {errors.classDivision && <p className="text-xs text-red-500">{errors.classDivision}</p>}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Complete Registration ✓'}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 px-4">
              By completing registration, you agree to the Portal Terms of Service and Privacy Policy.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}