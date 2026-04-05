import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('auth_user')
    const token  = localStorage.getItem('auth_token')
    if (stored && token) setUser(JSON.parse(stored))
    setLoading(false)
  }, [])

  const login = async (email, password, role = 'doctor') => {
    const res = await api.post('/login', { email, password, role })
    localStorage.setItem('auth_token', res.data.token)
    localStorage.setItem('auth_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', { name, email, password, password_confirmation })
    localStorage.setItem('auth_token', res.data.token)
    localStorage.setItem('auth_user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data
  }

  const logout = async () => {
    try { await api.post('/logout') } catch (_) {}
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
