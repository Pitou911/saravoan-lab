import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FlaskConical, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()

  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      navigate('/dashboard')
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) setErrors(data.errors)
      else setErrors({ general: data?.message || 'Registration failed.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2240 60%, #c0392b 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-6">
            <FlaskConical size={22} style={{ color: '#1a3a5c' }} />
            <span className="font-bold text-sm" style={{ color: '#1a3a5c' }}>Saravoan Medical Laboratory</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a3a5c' }}>Create Account</h2>
          <p className="text-sm text-gray-500 mb-7">Register as a doctor</p>

          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
              <AlertCircle size={15} /><span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { id: 'name',                  label: 'Full Name',        type: 'text',     placeholder: 'Dr. John Smith' },
              { id: 'email',                 label: 'Email Address',    type: 'email',    placeholder: 'doctor@example.com' },
              { id: 'password',              label: 'Password',         type: 'password', placeholder: 'Min. 8 characters' },
              { id: 'password_confirmation', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div key={f.id}>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label}</label>
                <div className="relative">
                  <input
                    type={f.type === 'password' ? (showPw ? 'text' : 'password') : f.type}
                    required value={form[f.id]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                  {f.type === 'password' && f.id === 'password' && (
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                {errors[f.id] && <p className="text-red-500 text-xs mt-1">{errors[f.id][0]}</p>}
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition disabled:opacity-60 mt-2"
              style={{ background: loading ? '#7a9bb8' : '#1a3a5c' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:underline" style={{ color: '#c0392b' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
