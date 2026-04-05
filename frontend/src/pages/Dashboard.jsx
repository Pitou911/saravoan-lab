import { useState, useCallback, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { LAB_TESTS, groupSelectedTests } from '../data/labTests'
import api from '../api/axios'
import {
  FlaskConical, LogOut, Printer, RotateCcw, CheckSquare,
  ChevronDown, ChevronUp, ClipboardList, User, Package,
  Plus, Trash2, Search, X, BookMarked
} from 'lucide-react'

const today   = new Date().toISOString().split('T')[0]
const nowTime = new Date().toTimeString().slice(0, 5)

const EMPTY_FORM = {
  patient_name: '', patient_telephone: '', date_of_birth: '',
  gender: '', patient_id: '', weight: '', request_date: today,
  request_time: nowTime, clinical_history: '', doctor_name: '', other_tests: [],
}

export default function Dashboard() {
  const { user, logout } = useAuth()

  const [formData, setFormData]           = useState({ ...EMPTY_FORM, doctor_name: user?.name || '' })
  const [selectedTests, setSelected]      = useState([])
  const [collapsed, setCollapsed]         = useState({})
  const [activeTab, setActiveTab]         = useState('form')
  const [history, setHistory]             = useState([])
  const [loadingHist, setLoadingHist]     = useState(false)
  const [actionMsg, setActionMsg]         = useState({ text: '', type: '' })
  const [saving, setSaving]               = useState(false)

  // Packages
  const [packages, setPackages]           = useState([])
  const [showSavePkg, setShowSavePkg]     = useState(false)
  const [pkgName, setPkgName]             = useState('')
  const [pkgDesc, setPkgDesc]             = useState('')
  const [savingPkg, setSavingPkg]         = useState(false)

  // Other tests
  const [otherTestOptions, setOtherOpts]  = useState([])
  const [otherSearch, setOtherSearch]     = useState('')
  const [showOtherDrop, setShowOtherDrop] = useState(false)
  const otherRef                          = useRef(null)

  // ── Load other test options & packages on mount ────────────────
  useEffect(() => {
    api.get('/other-tests').then(r => setOtherOpts(r.data)).catch(() => {})
    api.get('/packages').then(r => setPackages(r.data)).catch(() => {})
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (otherRef.current && !otherRef.current.contains(e.target)) setShowOtherDrop(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const showMsg = (text, type = 'success') => {
    setActionMsg({ text, type })
    setTimeout(() => setActionMsg({ text: '', type: '' }), 3000)
  }

  // ── Other tests multi-select ───────────────────────────────────
  const filteredOther = otherTestOptions.filter(o =>
    o.name.toLowerCase().includes(otherSearch.toLowerCase()) ||
    (o.category || '').toLowerCase().includes(otherSearch.toLowerCase())
  )

  const toggleOtherTest = (opt) => {
    const exists = formData.other_tests.find(o => o.id === opt.id)
    if (exists) {
      setFormData(p => ({ ...p, other_tests: p.other_tests.filter(o => o.id !== opt.id) }))
    } else {
      setFormData(p => ({ ...p, other_tests: [...p.other_tests, { id: opt.id, name: opt.name, category: opt.category }] }))
    }
  }

  const removeOtherTest = (id) =>
    setFormData(p => ({ ...p, other_tests: p.other_tests.filter(o => o.id !== id) }))

  // ── Save + Print combined ──────────────────────────────────────
  const handleSaveAndPrint = useCallback(async () => {
    if (!formData.patient_name.trim()) return showMsg('⚠ Patient name is required.', 'warn')
    if (!formData.doctor_name.trim())  return showMsg('⚠ Doctor name is required.', 'warn')
    if (selectedTests.length === 0 && formData.other_tests.length === 0)
      return showMsg('⚠ Please select at least one test.', 'warn')

    setSaving(true)
    const otherTestNames = formData.other_tests.map(o => o.name).join(', ')

    // Save to DB
    try {
      await api.post('/lab-requests', {
        ...formData,
        other_tests: otherTestNames,
        selected_tests: selectedTests,
      })
    } catch (err) {
      showMsg('✗ Failed to save: ' + (err.response?.data?.message || 'Error'), 'error')
      setSaving(false)
      return
    }
    setSaving(false)

    // Build print HTML
    const grouped    = groupSelectedTests(selectedTests)
    const categories = Object.entries(grouped)
    const genderLabel = formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : '—'

    const labRows = categories.length === 0 ? '' : categories.map(([cat, tests]) => {
      const count = tests.length
      const borderStyle = 'border:2px solid #1a3a5c;'
      const catCell = `<td rowspan="${count}" style="
        padding:6px 10px;
        ${borderStyle}
        font-size:11px;
        font-weight:700;
        color:#1a3a5c;
        vertical-align:middle;
        text-align:center;
        width:38%;
        background:#f0f4f8;
      ">${cat}</td>`

      return tests.map((test, ti) => `
        <tr>
          ${ti === 0 ? catCell : ''}
          <td style="
            padding:4px 10px;
            ${borderStyle}
            font-size:11px;
            color:#222;
            background:${ti % 2 === 0 ? '#fff' : '#f9fbfd'};
          ">${test}</td>
        </tr>`
      ).join('')
    }).join('')

    const otherRows = formData.other_tests.length === 0 ? '' : (() => {
      const count = formData.other_tests.length
      const borderStyle = 'border:2px solid #c0392b;'
      const catCell = `<td rowspan="${count}" style="
        padding:6px 10px;
        ${borderStyle}
        font-size:11px;
        font-weight:700;
        color:#c0392b;
        vertical-align:middle;
        text-align:center;
        width:38%;
        background:#fff5f5;
      ">Other Tests</td>`

      return formData.other_tests.map((o, i) => `
        <tr>
          ${i === 0 ? catCell : ''}
          <td style="
            padding:4px 10px;
            ${borderStyle}
            font-size:11px;
            color:#222;
            background:${i % 2 === 0 ? '#fff' : '#fff9f9'};
          ">${o.name}</td>
        </tr>`
      ).join('')
    })()

    const totalTests = selectedTests.length + formData.other_tests.length

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Lab Request — ${formData.patient_name || 'Patient'}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#111;background:#fff;padding:14mm 12mm;}
.header{text-align:center;border-bottom:2.5px solid #1a3a5c;padding-bottom:9px;margin-bottom:11px;}
.kh{font-size:15px;font-weight:bold;color:#1a3a5c;}
.en{font-size:13px;font-weight:bold;color:#1a3a5c;margin-top:3px;}
.sub{font-size:9.5px;color:#555;margin-top:2px;}
.form-title{text-align:center;font-size:12px;font-weight:bold;color:#c0392b;letter-spacing:1.5px;text-transform:uppercase;margin:10px 0 12px;}
.info-box{border:1px solid #c8d5e3;border-radius:4px;padding:9px 11px;margin-bottom:11px;background:#f7fafd;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 24px;}
.info-grid div{font-size:10.5px;line-height:1.5;}
.info-grid strong{color:#1a3a5c;}
table{width:100%;border-collapse:collapse;margin-bottom:9px;}
thead tr{background:#1a3a5c;color:#fff;}
thead th{padding:6px 10px;text-align:left;font-size:10.5px;font-weight:bold;border:2px solid #1a3a5c;}
.summary{text-align:right;margin-bottom:11px;}
.summary-badge{background:#1a3a5c;color:#fff;padding:3px 14px;border-radius:20px;font-size:10px;font-weight:bold;display:inline-block;}
.clinical-box{border:1px solid #c8d5e3;border-radius:4px;padding:9px 11px;margin-bottom:16px;font-size:10.5px;line-height:1.7;}
.sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;}
.sig-line{border-bottom:1.5px solid #888;height:34px;padding-top:10px;font-size:10.5px;font-weight:600;color:#1a3a5c;padding-left:4px;}
.sig-label{font-size:9px;color:#777;margin-top:4px;}
.footer{margin-top:18px;padding-top:8px;border-top:1px solid #ddd;text-align:center;font-size:9px;color:#aaa;}
@page{size:A4;margin:12mm;}
@media print{body{padding:0;}}
</style></head><body>
<div class="header">
  <div class="kh">មន្ទីរពិសោធន៍េវជ្ជសា្រស្តសារាវ័ន្ត</div>
  <div class="en">SARAVOAN MEDICAL LABORATORY</div>
  <div class="sub">TEL: +855 12 855 932 &nbsp;|&nbsp; +855 16 855 932</div>
  <div class="sub">Email: info@sml.com.kh &nbsp;|&nbsp; Website: www.sml.com.kh</div>
  <div class="sub">No 133, St 19, Chey Chumneah, Daun Penh, Phnom Penh, CAMBODIA</div>
</div>
<div class="form-title">Laboratory Test Request Form</div>
<div class="info-box">
  <div class="info-grid">
    <div><strong>Patient Name:</strong>&nbsp; ${formData.patient_name || '—'}</div>
    <div><strong>ID:</strong>&nbsp; ${formData.patient_id || '—'}</div>
    <div><strong>Telephone:</strong>&nbsp; ${formData.patient_telephone || '—'}</div>
    <div><strong>Weight:</strong>&nbsp; ${formData.weight ? formData.weight + ' kg' : '—'}</div>
    <div><strong>Age:</strong>&nbsp; ${formData.date_of_birth ? formData.date_of_birth + ' years old' : '—'}</div>
    <div><strong>Gender:</strong>&nbsp; ${genderLabel}</div>
    <div><strong>Date:</strong>&nbsp; ${formData.request_date || '—'}</div>
    <div><strong>Time:</strong>&nbsp; ${formData.request_time || '—'}</div>
  </div>
</div>
<table>
  <thead><tr><th style="width:38%">TEST CATEGORY</th><th>TEST ITEM</th></tr></thead>
  <tbody>${labRows}${otherRows}${!labRows && !otherRows ? '<tr><td colspan="2" style="text-align:center;padding:12px;color:#999;">No tests selected</td></tr>' : ''}</tbody>
</table>
<div class="summary"><span class="summary-badge">Total Tests: ${totalTests}</span></div>
<div class="clinical-box">
  <div><strong>Clinical History:</strong>&nbsp; ${formData.clinical_history || '—'}</div>
</div>
<div class="sig-grid">
  <div><div class="sig-line"></div><div class="sig-label">Doctor Signature</div></div>
  <div><div class="sig-line">${formData.doctor_name || ''}</div><div class="sig-label">Doctor Name</div></div>
</div>
<div class="footer">Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()} &mdash; Saravoan Medical Laboratory</div>
<script>
window.onload=function(){window.focus();window.print();window.onafterprint=function(){window.close();};};
</script>
</body></html>`

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('⚠ Pop-ups are blocked! Please allow pop-ups for this site.')
      showMsg('✓ Saved! But pop-ups blocked — allow them to print.', 'warn')
      return
    }
    printWindow.document.write(html)
    printWindow.document.close()

    // Telegram notification
    api.post('/notify/print', {
      ...formData,
      other_tests: otherTestNames,
      selected_tests: selectedTests,
      doctor_email: user?.email || '',
    }).catch(() => {})

    showMsg('✓ Saved & printed successfully!', 'success')
  }, [formData, selectedTests, user])

  // ── Save Package ───────────────────────────────────────────────
  const handleSavePackage = async () => {
    if (!pkgName.trim()) return
    if (selectedTests.length === 0) return showMsg('⚠ Select tests first.', 'warn')
    setSavingPkg(true)
    try {
      const res = await api.post('/packages', {
        name: pkgName, description: pkgDesc, selected_tests: selectedTests,
      })
      setPackages(p => [...p, res.data.data])
      setPkgName(''); setPkgDesc(''); setShowSavePkg(false)
      showMsg('✓ Package saved!', 'success')
    } catch (err) {
      showMsg('✗ ' + (err.response?.data?.message || 'Failed.'), 'error')
    } finally { setSavingPkg(false) }
  }

  const loadPackage = (pkg) => {
    setSelected(pkg.selected_tests || [])
    showMsg(`✓ Package "${pkg.name}" loaded.`, 'success')
  }

  const deletePackage = async (id) => {
    try {
      await api.delete(`/packages/${id}`)
      setPackages(p => p.filter(pkg => pkg.id !== id))
      showMsg('Package deleted.', 'success')
    } catch (_) {}
  }

  // ── Test toggles ───────────────────────────────────────────────
  const toggleTest = (key) =>
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const toggleCategory = (catKey) => {
    const keys = LAB_TESTS[catKey].tests.map(t => `${catKey}::${t}`)
    const all  = keys.every(k => selectedTests.includes(k))
    if (all) setSelected(prev => prev.filter(k => !keys.includes(k)))
    else     setSelected(prev => [...new Set([...prev, ...keys])])
  }

  const isCatAll  = (catKey) => LAB_TESTS[catKey].tests.every(t => selectedTests.includes(`${catKey}::${t}`))
  const isCatSome = (catKey) => LAB_TESTS[catKey].tests.some(t => selectedTests.includes(`${catKey}::${t}`))

  // ── History ────────────────────────────────────────────────────
  const loadHistory = async () => {
    setLoadingHist(true)
    try { const r = await api.get('/lab-requests'); setHistory(r.data) } catch (_) {}
    finally { setLoadingHist(false) }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'history') loadHistory()
  }

  const restoreRequest = (req) => {
    setFormData({
      patient_name:      req.patient_name,
      patient_telephone: req.patient_telephone || '',
      date_of_birth:     req.date_of_birth ? req.date_of_birth.split('T')[0] : '',
      gender:            req.gender || '',
      patient_id:        req.patient_id || '',
      weight:            req.weight || '',
      request_date:      req.request_date ? req.request_date.split('T')[0] : today,
      request_time:      req.request_time || nowTime,
      clinical_history:  req.clinical_history || '',
      doctor_name:       req.doctor_name,
      other_tests:       [],
    })
    setSelected(req.selected_tests || [])
    setActiveTab('form')
  }

  const handleReset = () => {
    setFormData({ ...EMPTY_FORM, doctor_name: user?.name || '' })
    setSelected([])
    setActionMsg({ text: '', type: '' })
  }

  const catEntries = Object.entries(LAB_TESTS)
  const col1 = catEntries.slice(0, 7)
  const col2 = catEntries.slice(7, 16)
  const col3 = catEntries.slice(16, 22)
  const col4 = catEntries.slice(22)
  const grouped = groupSelectedTests(selectedTests)
  const totalSelected = selectedTests.length + formData.other_tests.length

  const msgColors = {
    success: 'bg-green-100 text-green-700',
    error:   'bg-red-100 text-red-700',
    warn:    'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: '#1a3a5c' }}>
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FlaskConical size={20} className="text-white" />
            <div>
              <div className="text-white font-bold text-sm leading-tight">Saravoan Medical Laboratory</div>
              <div className="text-blue-200 text-xs">Lab Request System</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User size={14}/><span>Dr. {user?.name}</span>
            </div>
            <button onClick={logout} className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition">
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 flex">
          {[
            { id: 'form',     label: 'New Request', icon: <ClipboardList size={14}/> },
            { id: 'packages', label: 'Test Packages', icon: <BookMarked size={14}/> },
            { id: 'history',  label: 'History',     icon: <CheckSquare size={14}/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id ? 'border-[#1a3a5c] text-[#1a3a5c]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-5">

        {/* ── FORM TAB ── */}
        {activeTab === 'form' && (
          <div className="space-y-4">

            {/* Patient Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
                Patient Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3">
                {[
                  { id: 'patient_name',      label: 'Patient Name *', type: 'text',   colSpan: true },
                  { id: 'patient_telephone', label: 'Telephone',       type: 'tel'   },
                  { id: 'patient_id',        label: 'Patient ID',      type: 'text'  },
                  { id: 'date_of_birth', label: 'Age', type: 'number' },
                  { id: 'weight',            label: 'Weight (kg)',      type: 'number'},
                  { id: 'request_date',      label: 'Date *',           type: 'date'  },
                  { id: 'request_time',      label: 'Time',             type: 'time'  },
                ].map(f => (
                  <div key={f.id} className={f.colSpan ? 'col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">{f.label}</label>
                    <input type={f.type} value={formData[f.id]}
                      onChange={e => setFormData(p => ({ ...p, [f.id]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Gender</label>
                  <div className="flex gap-4 mt-2">
                    {['male','female'].map(g => (
                      <label key={g} className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <input type="radio" name="gender" value={g} checked={formData.gender === g}
                          onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                          className="accent-[#1a3a5c]" />
                        <span className="capitalize">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 mt-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Doctor Name *</label>
                  <input type="text" value={formData.doctor_name}
                    onChange={e => setFormData(p => ({ ...p, doctor_name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Clinical History</label>
                  <input type="text" value={formData.clinical_history}
                    onChange={e => setFormData(p => ({ ...p, clinical_history: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>
              </div>
            </div>

            {/* Test Packages quick-load */}
            {packages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Package size={14} style={{ color: '#1a3a5c' }} />
                  <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a3a5c' }}>Quick Load Package</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {packages.map(pkg => (
                    <button key={pkg.id} onClick={() => loadPackage(pkg)}
                      className="text-xs px-3 py-1.5 rounded-lg border-2 border-[#1a3a5c]/20 hover:border-[#1a3a5c] hover:bg-blue-50 transition font-medium text-[#1a3a5c]">
                      {pkg.name} <span className="text-gray-400">({pkg.selected_tests?.length || 0})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tests grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a3a5c' }}>
                  Select Laboratory Tests
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                    {totalSelected} selected
                  </span>
                  {selectedTests.length > 0 && (
                    <button onClick={() => setSelected([])} className="text-xs text-red-500 hover:text-red-700 transition">
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {[col1, col2, col3, col4].map((col, ci) => (
                  <div key={ci} className="space-y-2">
                    {col.map(([catKey, cat]) => {
                      const allSel  = isCatAll(catKey)
                      const someSel = isCatSome(catKey)
                      const open    = !collapsed[catKey]
                      return (
                        <div key={catKey} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="category-header flex items-center justify-between select-none">
                            <div className="flex items-center gap-2 flex-1">
                              <input type="checkbox" checked={allSel}
                                ref={el => { if (el) el.indeterminate = someSel && !allSel }}
                                onChange={() => toggleCategory(catKey)}
                                className="test-checkbox" onClick={e => e.stopPropagation()} />
                              <span className="cursor-pointer flex-1"
                                onClick={() => setCollapsed(p => ({ ...p, [catKey]: !p[catKey] }))}>
                                {cat.label}
                              </span>
                            </div>
                            <span className="text-white/60 cursor-pointer"
                              onClick={() => setCollapsed(p => ({ ...p, [catKey]: !p[catKey] }))}>
                              {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                            </span>
                          </div>
                          {open && (
                            <div className="divide-y divide-gray-50">
                              {cat.tests.map(test => {
                                const key = `${catKey}::${test}`
                                const sel = selectedTests.includes(key)
                                return (
                                  <label key={key}
                                    className={`flex items-center gap-2 px-2.5 py-1.5 cursor-pointer transition text-xs hover:bg-blue-50 ${sel ? 'bg-blue-50/70' : ''}`}>
                                    <input type="checkbox" checked={sel} onChange={() => toggleTest(key)} className="test-checkbox flex-shrink-0" />
                                    <span className={`leading-tight ${sel ? 'font-medium text-[#1a3a5c]' : 'text-gray-700'}`}>{test}</span>
                                  </label>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* ── Other Tests searchable dropdown ── */}
              <div className="mt-4 border-t border-gray-100 pt-4" ref={otherRef}>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c0392b' }}>
                  Other Tests {otherTestOptions.length === 0 && <span className="text-gray-400 normal-case font-normal">(None added by admin yet)</span>}
                </label>

                {/* Selected tags */}
                {formData.other_tests.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.other_tests.map(o => (
                      <span key={o.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium text-white"
                        style={{ background: '#c0392b' }}>
                        {o.name}
                        <button onClick={() => removeOtherTest(o.id)} className="hover:opacity-70 transition">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Search input */}
                {otherTestOptions.length > 0 && (
                  <div className="relative">
                    <div className="flex items-center border border-gray-200 rounded-lg px-3 py-1.5 gap-2 bg-white focus-within:ring-2 focus-within:ring-red-200">
                      <Search size={13} className="text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={otherSearch}
                        onChange={e => { setOtherSearch(e.target.value); setShowOtherDrop(true) }}
                        onFocus={() => setShowOtherDrop(true)}
                        placeholder="Search other tests…"
                        className="flex-1 text-xs bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      />
                      {otherSearch && (
                        <button onClick={() => { setOtherSearch(''); setShowOtherDrop(false) }}>
                          <X size={13} className="text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>

                    {showOtherDrop && filteredOther.length > 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl max-h-52 overflow-y-auto">
                        {filteredOther.map(opt => {
                          const selected = formData.other_tests.find(o => o.id === opt.id)
                          return (
                            <button key={opt.id} onClick={() => toggleOtherTest(opt)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-red-50 transition flex items-center justify-between ${selected ? 'bg-red-50' : ''}`}>
                              <div>
                                <span className={`font-medium ${selected ? 'text-red-700' : 'text-gray-800'}`}>{opt.name}</span>
                                {opt.category && <span className="ml-2 text-gray-400">{opt.category}</span>}
                              </div>
                              {selected && <span className="text-red-500 font-bold">✓</span>}
                            </button>
                          )
                        })}
                      </div>
                    )}

                    {showOtherDrop && otherSearch && filteredOther.length === 0 && (
                      <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-xs text-gray-400 text-center">
                        No matches found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {actionMsg.text && (
                <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${msgColors[actionMsg.type] || msgColors.success}`}>
                  {actionMsg.text}
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                  <RotateCcw size={14}/> Reset
                </button>

                {/* Save package button */}
                <button onClick={() => setShowSavePkg(p => !p)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border-2 transition font-medium"
                  style={{ borderColor: '#1a3a5c', color: '#1a3a5c' }}>
                  <Package size={14}/> Save as Package
                </button>

                {/* Save + Print — single button */}
                <button onClick={handleSaveAndPrint} disabled={saving}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-semibold transition hover:opacity-90 shadow-md disabled:opacity-60"
                  style={{ background: '#c0392b' }}>
                  <Printer size={15}/> {saving ? 'Saving…' : 'Save & Print'}
                </button>
              </div>
            </div>

            {/* Save Package modal */}
            {showSavePkg && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold mb-3" style={{ color: '#1a3a5c' }}>
                  Save Current Selection as Package
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Package Name *</label>
                    <input type="text" value={pkgName} onChange={e => setPkgName(e.target.value)}
                      placeholder="e.g. Full Blood Panel"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Description</label>
                    <input type="text" value={pkgDesc} onChange={e => setPkgDesc(e.target.value)}
                      placeholder="Optional note"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30" />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={handleSavePackage} disabled={savingPkg || !pkgName.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white font-medium disabled:opacity-50"
                    style={{ background: '#1a3a5c' }}>
                    <Plus size={14}/> {savingPkg ? 'Saving…' : 'Save Package'}
                  </button>
                  <button onClick={() => setShowSavePkg(false)}
                    className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {selectedTests.length} test{selectedTests.length !== 1 ? 's' : ''} will be saved in this package.
                </p>
              </div>
            )}

            {/* Preview */}
            {totalSelected > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
                  Selected Tests Preview
                </h2>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr style={{ background: '#1a3a5c', color: 'white' }}>
                      <th className="text-left px-4 py-2 text-xs font-semibold w-2/5">Test Category</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold">Test Item</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(grouped).map(([cat, tests], ci) =>
                      tests.map((test, ti) => (
                        <tr key={`${ci}-${ti}`} className={ti % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}>
                          <td className="px-4 py-1.5 border border-gray-100 text-xs font-semibold"
                            style={{ color: ti === 0 ? '#1a3a5c' : 'transparent' }}>
                            {ti === 0 ? cat : ''}
                          </td>
                          <td className="px-4 py-1.5 border border-gray-100 text-xs">{test}</td>
                        </tr>
                      ))
                    )}
                    {formData.other_tests.map((o, i) => (
                      <tr key={`other-${i}`} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50/30'}>
                        <td className="px-4 py-1.5 border border-gray-100 text-xs font-semibold"
                          style={{ color: i === 0 ? '#c0392b' : 'transparent' }}>
                          {i === 0 ? 'Other Tests' : ''}
                        </td>
                        <td className="px-4 py-1.5 border border-gray-100 text-xs">{o.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── PACKAGES TAB ── */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
              Saved Test Packages
            </h2>
            {packages.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Package size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No packages yet.</p>
                <p className="text-xs mt-1">Select tests on the form and click "Save as Package".</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {packages.map(pkg => (
                  <div key={pkg.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: '#1a3a5c' }}>{pkg.name}</h3>
                        {pkg.description && <p className="text-xs text-gray-400 mt-0.5">{pkg.description}</p>}
                      </div>
                      <button onClick={() => deletePackage(pkg.id)}
                        className="text-gray-300 hover:text-red-500 transition ml-2 flex-shrink-0">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">
                      {pkg.selected_tests?.length || 0} tests
                    </p>
                    <button onClick={() => { loadPackage(pkg); setActiveTab('form') }}
                      className="w-full text-xs py-1.5 rounded-lg text-white font-medium transition"
                      style={{ background: '#1a3a5c' }}>
                      Load Package
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── HISTORY TAB ── */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
              Past Lab Requests
            </h2>
            {loadingHist ? (
              <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
            ) : history.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No requests yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: '#1a3a5c', color: 'white' }}>
                      {['Date','Patient','Phone','Tests','Doctor','Action'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 text-xs font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((req, i) => (
                      <tr key={req.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-2 text-xs">{req.request_date?.split('T')[0] || req.request_date}</td>
                        <td className="px-3 py-2 text-xs font-medium">{req.patient_name}</td>
                        <td className="px-3 py-2 text-xs">{req.patient_telephone || '—'}</td>
                        <td className="px-3 py-2 text-xs">
                          <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-semibold text-xs">
                            {req.selected_tests?.length || 0}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs">{req.doctor_name}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => restoreRequest(req)}
                            className="text-xs px-2.5 py-1 rounded text-white font-medium"
                            style={{ background: '#1a3a5c' }}>
                            Load & Print
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
