import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
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
      const data = await login(form.email, form.password, 'admin')
      if (data.user.role !== 'admin') {
        setError('You do not have admin access.')
        return
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.errors?.email?.[0] || err.response?.data?.message || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0f2240 0%, #1a3a5c 50%, #2c3e50 100%)' }}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1a3a5c' }}>
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: '#1a3a5c' }}>Admin Portal</div>
              <div className="text-xs text-gray-400">Saravoan Medical Laboratory</div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: '#1a3a5c' }}>Admin Login</h2>
          <p className="text-sm text-gray-500 mb-7">Restricted access — administrators only</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5 text-sm">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition"
                placeholder="admin@example.com" />
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
              className="w-full py-2.5 rounded-lg text-white font-semibold text-sm transition disabled:opacity-60"
              style={{ background: loading ? '#7a9bb8' : '#1a3a5c' }}>
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            <Link to="/login" className="hover:underline">← Doctor Portal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
