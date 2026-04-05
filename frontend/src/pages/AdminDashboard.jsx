import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  ShieldCheck, LogOut, Plus, Trash2, Edit2, Check,
  X, Users, FlaskConical, ClipboardList, ToggleLeft, ToggleRight
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab]     = useState('other-tests')
  const [otherTests, setOtherTests]   = useState([])
  const [doctors, setDoctors]         = useState([])
  const [stats, setStats]             = useState(null)
  const [loading, setLoading]         = useState(false)

  // Form state
  const [newName, setNewName]         = useState('')
  const [newCat, setNewCat]           = useState('')
  const [adding, setAdding]           = useState(false)
  const [editId, setEditId]           = useState(null)
  const [editName, setEditName]       = useState('')
  const [editCat, setEditCat]         = useState('')
  const [msg, setMsg]                 = useState({ text: '', ok: true })

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: '', ok: true }), 3000)
  }

  // Load data on tab change
  useEffect(() => {
    if (activeTab === 'other-tests') loadOtherTests()
    if (activeTab === 'doctors')     loadDoctors()
    if (activeTab === 'stats')       loadStats()
  }, [activeTab])

  const loadOtherTests = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/other-tests'); setOtherTests(r.data) } catch (_) {}
    finally { setLoading(false) }
  }

  const loadDoctors = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/doctors'); setDoctors(r.data) } catch (_) {}
    finally { setLoading(false) }
  }

  const loadStats = async () => {
    setLoading(true)
    try { const r = await api.get('/admin/stats'); setStats(r.data) } catch (_) {}
    finally { setLoading(false) }
  }

  // Add other test
  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try {
      const r = await api.post('/admin/other-tests', { name: newName.trim(), category: newCat.trim() || null })
      setOtherTests(p => [...p, r.data.data])
      setNewName(''); setNewCat('')
      showMsg('✓ Test option added.')
    } catch (err) {
      showMsg('✗ ' + (err.response?.data?.errors?.name?.[0] || err.response?.data?.message || 'Failed.'), false)
    } finally { setAdding(false) }
  }

  // Toggle active
  const handleToggle = async (test) => {
    try {
      const r = await api.put(`/admin/other-tests/${test.id}`, { is_active: !test.is_active })
      setOtherTests(p => p.map(t => t.id === test.id ? r.data.data : t))
    } catch (_) {}
  }

  // Start edit
  const startEdit = (test) => {
    setEditId(test.id); setEditName(test.name); setEditCat(test.category || '')
  }

  // Save edit
  const saveEdit = async () => {
    try {
      const r = await api.put(`/admin/other-tests/${editId}`, { name: editName.trim(), category: editCat.trim() || null })
      setOtherTests(p => p.map(t => t.id === editId ? r.data.data : t))
      setEditId(null)
      showMsg('✓ Updated.')
    } catch (err) {
      showMsg('✗ ' + (err.response?.data?.message || 'Failed.'), false)
    }
  }

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test option?')) return
    try {
      await api.delete(`/admin/other-tests/${id}`)
      setOtherTests(p => p.filter(t => t.id !== id))
      showMsg('✓ Deleted.')
    } catch (_) {}
  }

  const tabs = [
    { id: 'other-tests', label: 'Other Test Options', icon: <FlaskConical size={14}/> },
    { id: 'doctors',     label: 'Doctors',             icon: <Users size={14}/> },
    { id: 'stats',       label: 'Overview',             icon: <ClipboardList size={14}/> },
  ]

  // Group other tests by category for display
  const grouped = otherTests.reduce((acc, t) => {
    const cat = t.category || 'Uncategorized'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: '#1a3a5c' }}>
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-white" />
            <div>
              <div className="text-white font-bold text-sm leading-tight">Admin Panel</div>
              <div className="text-blue-200 text-xs">Saravoan Medical Laboratory</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/70 text-sm">{user?.name}</span>
            <button onClick={logout} className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition">
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 flex">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id ? 'border-[#1a3a5c] text-[#1a3a5c]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-5 space-y-4">

        {/* ── OTHER TESTS TAB ── */}
        {activeTab === 'other-tests' && (
          <>
            {/* Add form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
                Add New Other Test Option
              </h2>

              {msg.text && (
                <div className={`text-sm font-medium px-3 py-2 rounded-lg mb-4 ${msg.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {msg.text}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <div className="flex-1 min-w-48">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Test Name *</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="e.g. Vitamin C"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>
                <div className="flex-1 min-w-40">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Category (optional)</label>
                  <input type="text" value={newCat} onChange={e => setNewCat(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="e.g. Vitamins"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleAdd} disabled={adding || !newName.trim()}
                    className="flex items-center gap-1.5 px-5 py-1.5 text-sm rounded-lg text-white font-medium disabled:opacity-50 transition"
                    style={{ background: '#1a3a5c' }}>
                    <Plus size={15}/> {adding ? 'Adding…' : 'Add Test'}
                  </button>
                </div>
              </div>
            </div>

            {/* Test list */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a3a5c' }}>
                  All Other Test Options
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {otherTests.length} total · {otherTests.filter(t => t.is_active).length} active
                </span>
              </div>

              {loading ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
              ) : otherTests.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No test options yet. Add some above to make them available for doctors.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([cat, tests]) => (
                    <div key={cat}>
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">{cat}</div>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        {tests.map((test, i) => (
                          <div key={test.id}
                            className={`flex items-center gap-3 px-4 py-2.5 ${i !== tests.length - 1 ? 'border-b border-gray-50' : ''} ${!test.is_active ? 'opacity-50' : ''}`}>

                            {editId === test.id ? (
                              <>
                                <input value={editName} onChange={e => setEditName(e.target.value)}
                                  className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                <input value={editCat} onChange={e => setEditCat(e.target.value)}
                                  placeholder="Category"
                                  className="w-32 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                <button onClick={saveEdit} className="text-green-600 hover:text-green-800 transition"><Check size={15}/></button>
                                <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={15}/></button>
                              </>
                            ) : (
                              <>
                                <span className="flex-1 text-sm font-medium text-gray-800">{test.name}</span>
                                <span className="text-xs text-gray-400">{test.category || ''}</span>
                                <button onClick={() => handleToggle(test)} title={test.is_active ? 'Deactivate' : 'Activate'}
                                  className="transition" style={{ color: test.is_active ? '#1a3a5c' : '#ccc' }}>
                                  {test.is_active ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                                </button>
                                <button onClick={() => startEdit(test)} className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={14}/></button>
                                <button onClick={() => handleDelete(test.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── DOCTORS TAB ── */}
        {activeTab === 'doctors' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
              Registered Doctors
            </h2>
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No doctors registered yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: '#1a3a5c', color: 'white' }}>
                    {['Name','Email','Total Requests','Joined'].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((doc, i) => (
                    <tr key={doc.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-2.5 text-xs font-medium">{doc.name}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-500">{doc.email}</td>
                      <td className="px-4 py-2.5 text-xs">
                        <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-semibold text-xs">
                          {doc.lab_requests_count}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">
                        {new Date(doc.created_at).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── STATS TAB ── */}
        {activeTab === 'stats' && (
          <div>
            {loading ? (
              <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
            ) : stats ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Doctors',     value: stats.total_doctors,  color: '#1a3a5c' },
                  { label: 'Total Requests',    value: stats.total_requests, color: '#2980b9' },
                  { label: "Today's Requests",  value: stats.today_requests, color: '#c0392b' },
                  { label: 'Other Test Options',value: stats.other_tests,    color: '#16a085' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                    <div className="text-3xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}
