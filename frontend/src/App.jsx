import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#f0f4f8' }}>
        <div className="text-center">
          <div className="w-10 h-10 rounded-full animate-spin mx-auto mb-3"
            style={{ border: '3px solid #1a3a5c', borderTopColor: 'transparent' }} />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to={requireRole === 'admin' ? '/admin/login' : '/login'} replace />
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Doctor routes */}
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requireRole="doctor">
          <Dashboard />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireRole="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
