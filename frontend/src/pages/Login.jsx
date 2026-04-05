import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FlaskConical, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password, 'doctor')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #1a3a5c 0%, #0f2240 60%, #c0392b 100%)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
            <FlaskConical size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-center">Saravoan Medical</h1>
        <h2 className="text-xl font-light text-white/80 mb-6 text-center">Laboratory Management System</h2>
        <p className="text-white/60 text-center max-w-sm text-sm leading-relaxed">
          A comprehensive platform for doctors to submit and manage laboratory test requests efficiently.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
          {['Patient Records','Test Requests','Print Reports','Test Packages'].map(f => (
            <div key={f} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
              <p className="text-xs text-white/80 font-medium">{f}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/admin/login" className="text-white/50 hover:text-white/80 text-xs transition underline underline-offset-2">
            Admin Portal →
          </Link>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <FlaskConical size={22} style={{ color: '#1a3a5c' }} />
              <span className="font-bold text-sm" style={{ color: '#1a3a5c' }}>Saravoan Medical Laboratory</span>
            </div>

            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a3a5c' }}>Doctor Login</h2>
            <p className="text-sm text-gray-500 mb-7">Sign in to your doctor account</p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition"
                  placeholder="doctor@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} required value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition pr-10"
                    placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition disabled:opacity-60 mt-2"
                style={{ background: loading ? '#7a9bb8' : '#1a3a5c' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: '#c0392b' }}>
                Create account
              </Link>
            </p>
            <p className="text-center text-xs text-gray-400 mt-3">
              <Link to="/admin/login" className="hover:underline">Admin Portal</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
