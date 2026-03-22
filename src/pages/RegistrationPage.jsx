import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS, GRAD_YEARS, CLASS_MAPPING } from '../constants';
import Navbar from '../components/Navbar';

// ... (INITIAL and Field component remain same)
const INITIAL = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  department: '',
  graduationYear: '',
  classDivision: '',
  rollNumber: '',
};

const Field = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-bold text-[#9ca3af] uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-[11px] font-bold text-red-500 mt-1 ml-1">⚠️ {error}</p>}
  </div>
);

export default function RegistrationPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    // Reset class if dept or year changes
    if (key === 'department' || key === 'graduationYear') {
      setForm(f => ({ ...f, [key]: val, classDivision: '' }));
    }
  };

  const availableClasses = useMemo(() => {
    if (!form.department || !form.graduationYear) return [];
    return CLASS_MAPPING[form.department]?.[form.graduationYear] || [];
  }, [form.department, form.graduationYear]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim() || !form.email.endsWith('@ves.ac.in')) e.email = 'Must be a @ves.ac.in email address';
    if (!form.password.trim() || form.password.length < 6) e.password = 'Min 6 characters required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit number';
    if (!form.department) e.department = 'Required';
    if (!form.graduationYear) e.graduationYear = 'Required';
    if (!form.classDivision) e.classDivision = 'Required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) { 
      setErrors(validationErrors); 
      return; 
    }
    
    setLoading(true);
    try {
      await register(form);
      navigate('/login', { replace: true });
    } catch (err) {
      setServerError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-red-100 rounded-full blur-[100px] opacity-20" />

        <div className="w-full max-w-2xl relative z-10">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-10 border border-[#eee]">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-[11px] font-bold text-blue-600 mb-8 uppercase tracking-widest">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Join the VES Community
            </div>

            <h2 className="font-display text-4xl font-extrabold text-[#111827] mb-2 tracking-tight">
              Create <span className="text-blue-600">Account</span>
            </h2>
            <p className="text-[#6b7280] font-medium mb-10">
              Register with your details to start using the VES Lost & Found portal.
            </p>

            {serverError && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-sm font-semibold text-red-600 flex items-center gap-3">
                <span className="text-xl">⚠️</span> {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Field label="Full name" required error={errors.fullName}>
                  <input
                    className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.fullName ? 'border-red-400' : 'border-[#eee]'}`}
                    type="text"
                    placeholder="As per college records"
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                  />
                </Field>
              </div>

              <Field label="VES email" required error={errors.email}>
                <input
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.email ? 'border-red-400' : 'border-[#eee]'}`}
                  type="email"
                  placeholder="student@ves.ac.in"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </Field>

              <Field label="Password" required error={errors.password}>
                <input
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.password ? 'border-red-400' : 'border-[#eee]'}`}
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
              </Field>

              <Field label="Phone number" required error={errors.phone}>
                <input
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all ${errors.phone ? 'border-red-400' : 'border-[#eee]'}`}
                  type="tel"
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                />
              </Field>

              <Field label="Department" required error={errors.department}>
                <select
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem] ${errors.department ? 'border-red-400' : 'border-[#eee]'}`}
                  value={form.department}
                  onChange={(e) => set('department', e.target.value)}
                >
                  <option value="" disabled>Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>

              <Field label="Graduation year" required error={errors.graduationYear}>
                <select
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem] ${errors.graduationYear ? 'border-red-400' : 'border-[#eee]'}`}
                  value={form.graduationYear}
                  onChange={(e) => set('graduationYear', e.target.value)}
                >
                  <option value="" disabled>Select year</option>
                  {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </Field>

              <Field label="Class / Division" required error={errors.classDivision}>
                <select
                  className={`w-full px-5 py-3.5 bg-gray-50/50 border rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none bg-no-repeat bg-[right_1.25rem_center] bg-[length:1rem] ${!form.department || !form.graduationYear ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${errors.classDivision ? 'border-red-400' : 'border-[#eee]'}`}
                  value={form.classDivision}
                  onChange={(e) => set('classDivision', e.target.value)}
                  disabled={!form.department || !form.graduationYear}
                >
                  <option value="" disabled>
                    {!form.department || !form.graduationYear ? 'Select Dept & Year first' : 'Select class'}
                  </option>
                  {availableClasses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Roll number">
                <input
                  className="w-full px-5 py-3.5 bg-gray-50/50 border border-[#eee] rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  type="text"
                  placeholder="e.g. 2021CE001"
                  value={form.rollNumber}
                  onChange={(e) => set('rollNumber', e.target.value)}
                />
              </Field>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 flex items-center justify-center gap-3 py-4 bg-[#111827] hover:bg-[#222]
                         rounded-2xl text-sm font-bold text-white transition-all shadow-xl shadow-gray-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account & Start'
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-[#6b7280] font-medium">
            Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}