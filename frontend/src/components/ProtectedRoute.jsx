import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-3"
            style={{ border: '3px solid #1a3a5c', borderTopColor: 'transparent' }} />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
