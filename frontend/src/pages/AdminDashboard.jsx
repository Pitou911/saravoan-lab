import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  ShieldCheck, LogOut, Plus, Trash2, Edit2, Check,
  X, Users, FlaskConical, ClipboardList, ToggleLeft,
  ToggleRight, ChevronDown, Search
} from 'lucide-react'

// ── Searchable creatable dropdown ──────────────────────────────
function SearchableSelect({ value, onChange, options, placeholder }) {
  const [search, setSearch]   = useState('')
  const [open, setOpen]       = useState(false)
  const ref                   = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
  const showAdd  = search.trim() && !options.find(o => o.toLowerCase() === search.toLowerCase())

  const select = (val) => {
    onChange(val)
    setSearch('')
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <div
        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-900/30 bg-white"
        onClick={() => setOpen(p => !p)}>
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button onClick={e => { e.stopPropagation(); onChange('') }}
              className="text-gray-400 hover:text-gray-600">
              <X size={12}/>
            </button>
          )}
          <ChevronDown size={13} className="text-gray-400"/>
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2">
              <Search size={13} className="text-gray-400"/>
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search or type new..."
                className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="max-h-44 overflow-y-auto">
            {showAdd && (
              <button onClick={() => select(search.trim())}
                className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 transition flex items-center gap-2 text-blue-600 font-medium border-b border-gray-50">
                <Plus size={12}/> Add "{search.trim()}"
              </button>
            )}
            {filtered.length === 0 && !showAdd && (
              <div className="px-3 py-3 text-xs text-gray-400 text-center">No options found</div>
            )}
            {filtered.map(opt => (
              <button key={opt} onClick={() => select(opt)}
                className={`w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition ${value === opt ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}>
                {value === opt && <span className="mr-1">✓</span>}
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Predefined options ─────────────────────────────────────────
const SAMPLE_TYPES = [
  'Blood', 'Serum', 'Plasma', 'Urine', 'Stool', 'Sputum',
  'Swab', 'CSF', 'Saliva', 'Tissue', 'Bone Marrow', 'Other',
]

const COLLECTION_CONTAINERS = [
  'EDTA Tube (Purple)', 'SST Tube (Gold)', 'Heparin Tube (Green)',
  'Citrate Tube (Blue)', 'Fluoride Tube (Grey)', 'Plain Tube (Red)',
  'Urine Cup', 'Stool Container', 'Sputum Container',
  'Blood Culture Bottle', 'Swab', 'Other',
]

// ── Main AdminDashboard ────────────────────────────────────────
export default function AdminDashboard() {
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab]   = useState('other-tests')
  const [otherTests, setOtherTests] = useState([])
  const [doctors, setDoctors]       = useState([])
  const [stats, setStats]           = useState(null)
  const [loading, setLoading]       = useState(false)
  const [msg, setMsg]               = useState({ text: '', ok: true })

  // New test form
  const [newName, setNewName]   = useState('')
  const [newCat, setNewCat]     = useState('')
  const [newSample, setNewSample]     = useState('')
  const [newContainer, setNewContainer] = useState('')
  const [adding, setAdding]     = useState(false)

  // Edit state
  const [editId, setEditId]           = useState(null)
  const [editName, setEditName]       = useState('')
  const [editCat, setEditCat]         = useState('')
  const [editSample, setEditSample]   = useState('')
  const [editContainer, setEditContainer] = useState('')

  const showMsg = (text, ok = true) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg({ text: '', ok: true }), 3000)
  }

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

  // ── Collect unique existing values for dropdown suggestions ───
  const existingCategories  = [...new Set(['Other', ...otherTests.map(t => t.category).filter(Boolean)])]
  const existingSamples     = [...new Set([...SAMPLE_TYPES, ...otherTests.map(t => t.sample_type).filter(Boolean)])]
  const existingContainers  = [...new Set([...COLLECTION_CONTAINERS, ...otherTests.map(t => t.collection_container).filter(Boolean)])]

  // ── Add ───────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!newName.trim()) return
    setAdding(true)
    try {
      const r = await api.post('/admin/other-tests', {
        name:                 newName.trim(),
        category:             newCat.trim() || 'Other',
        sample_type:          newSample || null,
        collection_container: newContainer || null,
      })
      setOtherTests(p => [...p, r.data.data])
      setNewName(''); setNewCat(''); setNewSample(''); setNewContainer('')
      showMsg('✓ Test option added.')
    } catch (err) {
      showMsg('✗ ' + (err.response?.data?.errors?.name?.[0] || err.response?.data?.message || 'Failed.'), false)
    } finally { setAdding(false) }
  }

  // ── Toggle active ─────────────────────────────────────────────
  const handleToggle = async (test) => {
    try {
      const r = await api.put(`/admin/other-tests/${test.id}`, { is_active: !test.is_active })
      setOtherTests(p => p.map(t => t.id === test.id ? r.data.data : t))
    } catch (_) {}
  }

  // ── Start edit ────────────────────────────────────────────────
  const startEdit = (test) => {
    setEditId(test.id)
    setEditName(test.name)
    setEditCat(test.category || '')
    setEditSample(test.sample_type || '')
    setEditContainer(test.collection_container || '')
  }

  // ── Save edit ─────────────────────────────────────────────────
  const saveEdit = async () => {
    try {
      const r = await api.put(`/admin/other-tests/${editId}`, {
        name:                 editName.trim(),
        category:             editCat.trim() || 'Other',
        sample_type:          editSample || null,
        collection_container: editContainer || null,
      })
      setOtherTests(p => p.map(t => t.id === editId ? r.data.data : t))
      setEditId(null)
      showMsg('✓ Updated.')
    } catch (err) {
      showMsg('✗ ' + (err.response?.data?.message || 'Failed.'), false)
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this test option?')) return
    try {
      await api.delete(`/admin/other-tests/${id}`)
      setOtherTests(p => p.filter(t => t.id !== id))
      showMsg('✓ Deleted.')
    } catch (_) {}
  }

  // ── Group by category ─────────────────────────────────────────
  const grouped = otherTests.reduce((acc, t) => {
    const cat = t.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})

  const tabs = [
    { id: 'other-tests', label: 'Other Test Options', icon: <FlaskConical size={14}/> },
    { id: 'doctors',     label: 'Doctors',             icon: <Users size={14}/> },
    { id: 'stats',       label: 'Overview',             icon: <ClipboardList size={14}/> },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: '#1a3a5c' }}>
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-white"/>
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Test Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Test Name *</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdd()}
                    placeholder="e.g. Vitamin C"
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Category</label>
                  <SearchableSelect
                    value={newCat}
                    onChange={setNewCat}
                    options={existingCategories}
                    placeholder="Select or type..."
                  />
                </div>

                {/* Sample Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Sample Type</label>
                  <SearchableSelect
                    value={newSample}
                    onChange={setNewSample}
                    options={existingSamples}
                    placeholder="Select or type..."
                  />
                </div>

                {/* Collection Container */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Collection Container</label>
                  <SearchableSelect
                    value={newContainer}
                    onChange={setNewContainer}
                    options={existingContainers}
                    placeholder="Select or type..."
                  />
                </div>
              </div>

              <button onClick={handleAdd} disabled={adding || !newName.trim()}
                className="mt-4 flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-50 transition"
                style={{ background: '#1a3a5c' }}>
                <Plus size={15}/> {adding ? 'Adding…' : 'Add Test Option'}
              </button>
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
                  No test options yet. Add some above.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(grouped).map(([cat, tests]) => (
                    <div key={cat}>
                      <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 px-1">{cat}</div>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        {/* Table header */}
                        <div className="grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                          <div className="col-span-3">Test Name</div>
                          <div className="col-span-2">Category</div>
                          <div className="col-span-2">Sample Type</div>
                          <div className="col-span-3">Collection Container</div>
                          <div className="col-span-2 text-right">Actions</div>
                        </div>

                        {tests.map((test, i) => (
                          <div key={test.id}
                            className={`grid grid-cols-12 gap-2 px-4 py-2.5 items-center ${i !== tests.length - 1 ? 'border-b border-gray-50' : ''} ${!test.is_active ? 'opacity-50' : ''}`}>

                            {editId === test.id ? (
                              // ── Edit mode ──
                              <>
                                <div className="col-span-3">
                                  <input value={editName} onChange={e => setEditName(e.target.value)}
                                    className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="col-span-2">
                                  <SearchableSelect value={editCat} onChange={setEditCat}
                                    options={existingCategories} placeholder="Category..." />
                                </div>
                                <div className="col-span-2">
                                  <SearchableSelect value={editSample} onChange={setEditSample}
                                    options={existingSamples} placeholder="Sample..." />
                                </div>
                                <div className="col-span-3">
                                  <SearchableSelect value={editContainer} onChange={setEditContainer}
                                    options={existingContainers} placeholder="Container..." />
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                  <button onClick={saveEdit} className="text-green-600 hover:text-green-800 transition"><Check size={15}/></button>
                                  <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-600 transition"><X size={15}/></button>
                                </div>
                              </>
                            ) : (
                              // ── View mode ──
                              <>
                                <div className="col-span-3 text-sm font-medium text-gray-800">{test.name}</div>
                                <div className="col-span-2">
                                  {test.category ? (
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{test.category}</span>
                                  ) : <span className="text-xs text-gray-300">—</span>}
                                </div>
                                <div className="col-span-2">
                                  {test.sample_type ? (
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{test.sample_type}</span>
                                  ) : <span className="text-xs text-gray-300">—</span>}
                                </div>
                                <div className="col-span-3">
                                  {test.collection_container ? (
                                    <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">{test.collection_container}</span>
                                  ) : <span className="text-xs text-gray-300">—</span>}
                                </div>
                                <div className="col-span-2 flex items-center justify-end gap-2">
                                  <button onClick={() => handleToggle(test)} title={test.is_active ? 'Deactivate' : 'Activate'}
                                    style={{ color: test.is_active ? '#1a3a5c' : '#ccc' }}>
                                    {test.is_active ? <ToggleRight size={18}/> : <ToggleLeft size={18}/>}
                                  </button>
                                  <button onClick={() => startEdit(test)} className="text-gray-400 hover:text-blue-600 transition"><Edit2 size={14}/></button>
                                  <button onClick={() => handleDelete(test.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 size={14}/></button>
                                </div>
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
                  { label: 'Total Doctors',      value: stats.total_doctors,  color: '#1a3a5c' },
                  { label: 'Total Requests',     value: stats.total_requests, color: '#2980b9' },
                  { label: "Today's Requests",   value: stats.today_requests, color: '#c0392b' },
                  { label: 'Other Test Options', value: stats.other_tests,    color: '#16a085' },
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
