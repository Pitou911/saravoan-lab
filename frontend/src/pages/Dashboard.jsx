import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { LAB_TESTS, groupSelectedTests } from '../data/labTests'
import api from '../api/axios'
import {
  FlaskConical, LogOut, Printer, Save, RotateCcw,
  CheckSquare, ChevronDown, ChevronUp, ClipboardList, User
} from 'lucide-react'
import logo from '../asset/logo.png'
const today   = new Date().toISOString().split('T')[0]
const nowTime = new Date().toTimeString().slice(0, 5)

const EMPTY_FORM = {
  patient_name: '', patient_telephone: '', date_of_birth: '',
  gender: '', patient_id: '', weight: '', request_date: today,
  request_time: nowTime, clinical_history: '', doctor_name: '', other_tests: '',
}

export default function Dashboard() {
  const { user, logout } = useAuth()

  const [formData, setFormData]       = useState({ ...EMPTY_FORM, doctor_name: user?.name || '' })
  const [selectedTests, setSelected]  = useState([])
  const [saving, setSaving]           = useState(false)
  const [saveMsg, setSaveMsg]         = useState('')
  const [collapsed, setCollapsed]     = useState({})
  const [activeTab, setActiveTab]     = useState('form')
  const [history, setHistory]         = useState([])
  const [loadingHist, setLoadingHist] = useState(false)

  // ── Print: opens a new window with full HTML and triggers print dialog ──
  const handlePrint = useCallback(() => {
    const grouped    = groupSelectedTests(selectedTests)
    const categories = Object.entries(grouped)

    const rows = categories.length === 0
      ? `<tr><td colspan="2" style="text-align:center;padding:14px;color:#999;font-size:11px;">No tests selected</td></tr>`
      : categories.flatMap(([cat, tests]) =>
          tests.map((test, ti) => `
            <tr style="background:${ti % 2 === 0 ? '#ffffff' : '#f4f7fb'}">
              <td style="padding:4px 10px;border:1px solid #d0d9e8;font-size:11px;
                         font-weight:${ti === 0 ? '600' : '400'};
                         color:${ti === 0 ? '#1a3a5c' : 'transparent'};vertical-align:top;">
                ${ti === 0 ? cat : '&nbsp;'}
              </td>
              <td style="padding:4px 10px;border:1px solid #d0d9e8;font-size:11px;color:#222;">
                ${test}
              </td>
            </tr>
          `)
        ).join('')

    const genderLabel = formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : '—'

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Lab Request — ${formData.patient_name || 'Patient'}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#111;background:#fff;padding:14mm 12mm;}
    .header{text-align:center;border-bottom:2.5px solid #1a3a5c;padding-bottom:9px;margin-bottom:11px;}
    .kh{font-size:15px;font-weight:bold;color:#1a3a5c;}
    .en{font-size:13px;font-weight:bold;color:#1a3a5c;margin-top:3px;}
    .sub{font-size:9.5px;color:#555;margin-top:2px;}
    .form-title{text-align:center;font-size:12px;font-weight:bold;color:#c0392b;
                letter-spacing:1.5px;text-transform:uppercase;margin:10px 0 12px;}
    .info-box{border:1px solid #c8d5e3;border-radius:4px;padding:9px 11px;
              margin-bottom:11px;background:#f7fafd;}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 24px;}
    .info-grid div{font-size:10.5px;line-height:1.5;}
    .info-grid strong{color:#1a3a5c;}
    table{width:100%;border-collapse:collapse;margin-bottom:9px;}
    thead tr{background:#1a3a5c;color:#fff;}
    thead th{padding:6px 10px;text-align:left;font-size:10.5px;font-weight:bold;border:1px solid #1a3a5c;}
    .summary{text-align:right;margin-bottom:11px;}
    .summary-badge{background:#1a3a5c;color:#fff;padding:3px 14px;
                   border-radius:20px;font-size:10px;font-weight:bold;display:inline-block;}
    .clinical-box{border:1px solid #c8d5e3;border-radius:4px;padding:9px 11px;
                  margin-bottom:16px;font-size:10.5px;line-height:1.7;}
    .clinical-box strong{color:#1a3a5c;}
    .sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:20px;}
    .sig-line{border-bottom:1.5px solid #888;height:34px;padding-top:10px;
              font-size:10.5px;font-weight:600;color:#1a3a5c;padding-left:4px;}
    .sig-label{font-size:9px;color:#777;margin-top:4px;}
    .footer{margin-top:18px;padding-top:8px;border-top:1px solid #ddd;
            text-align:center;font-size:9px;color:#aaa;}
    @page{size:A4;margin:12mm;}
    @media print{
      body{padding:0;}
      .no-print{display:none!important;}
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="kh">មន្ទីរពិេសាធន៍េវជ្ជសា្រស្តសារាវ័ន្ត</div>
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
      <div><strong>Date of Birth:</strong>&nbsp; ${formData.date_of_birth || '—'}</div>
      <div><strong>Gender:</strong>&nbsp; ${genderLabel}</div>
      <div><strong>Date:</strong>&nbsp; ${formData.request_date || '—'}</div>
      <div><strong>Time:</strong>&nbsp; ${formData.request_time || '—'}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:38%">TEST CATEGORY</th>
        <th>TEST ITEM</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="summary">
    <span class="summary-badge">Total Tests Selected: ${selectedTests.length}</span>
  </div>

  <div class="clinical-box">
    <div><strong>Clinical History:</strong>&nbsp; ${formData.clinical_history || '—'}</div>
    ${formData.other_tests ? `<div style="margin-top:4px"><strong>Other Tests:</strong>&nbsp; ${formData.other_tests}</div>` : ''}
  </div>

  <div class="sig-grid">
    <div>
      <div class="sig-line"></div>
      <div class="sig-label">Doctor Signature</div>
    </div>
    <div>
      <div class="sig-line">${formData.doctor_name || ''}</div>
      <div class="sig-label">Doctor Name</div>
    </div>
  </div>

  <div class="footer">
    Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()} &nbsp;&mdash;&nbsp; Saravoan Medical Laboratory
  </div>

  <script>
    // Auto-trigger print once page is fully loaded
    window.onload = function() {
      window.focus();
      window.print();
      // Close the tab after print dialog closes (works in most browsers)
      window.onafterprint = function() { window.close(); };
    };
  </script>
</body>
</html>`

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('⚠ Pop-ups are blocked!\n\nPlease allow pop-ups for this site:\n1. Click the pop-up blocked icon in your browser address bar\n2. Choose "Always allow pop-ups from this site"\n3. Click the Print PDF button again.')
      return
    }
    printWindow.document.write(html)
    printWindow.document.close()

    // Send Telegram notification
    api.post('/notify/print', {
      ...formData,
      selected_tests: selectedTests,
      doctor_email: user?.email || '',
    }).then(res => {
      console.log('Telegram SUCCESS:', res.data)
    }).catch(err => {
      console.error('Telegram FAILED:', err?.response?.status, err?.response?.data, err?.message)
    })

  }, [formData, selectedTests])

  // ── Test toggle ────────────────────────────────────────────────
  const toggleTest = (key) =>
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const toggleCategory = (catKey) => {
    const keys = LAB_TESTS[catKey].tests.map(t => `${catKey}::${t}`)
    const allSelected = keys.every(k => selectedTests.includes(k))
    if (allSelected) setSelected(prev => prev.filter(k => !keys.includes(k)))
    else setSelected(prev => [...new Set([...prev, ...keys])])
  }

  const isCatAll  = (catKey) => LAB_TESTS[catKey].tests.every(t => selectedTests.includes(`${catKey}::${t}`))
  const isCatSome = (catKey) => LAB_TESTS[catKey].tests.some(t => selectedTests.includes(`${catKey}::${t}`))

  // ── Save ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!formData.patient_name.trim()) return setSaveMsg('⚠ Patient name is required.')
    if (!formData.doctor_name.trim())  return setSaveMsg('⚠ Doctor name is required.')
    if (selectedTests.length === 0)    return setSaveMsg('⚠ Please select at least one test.')
    setSaving(true); setSaveMsg('')
    try {
      await api.post('/lab-requests', { ...formData, selected_tests: selectedTests })
      setSaveMsg('✓ Request saved successfully!')
      setTimeout(() => setSaveMsg(''), 3000)
    } catch (err) {
      setSaveMsg('✗ ' + (err.response?.data?.message || 'Failed to save.'))
    } finally { setSaving(false) }
  }

  const handleReset = () => {
    setFormData({ ...EMPTY_FORM, doctor_name: user?.name || '' })
    setSelected([])
    setSaveMsg('')
  }

  // ── History ────────────────────────────────────────────────────
  const loadHistory = async () => {
    setLoadingHist(true)
    try {
      const res = await api.get('/lab-requests')
      setHistory(res.data)
    } catch (_) {}
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
      other_tests:       req.other_tests || '',
    })
    setSelected(req.selected_tests || [])
    setActiveTab('form')
  }

  const catEntries = Object.entries(LAB_TESTS)
  const col1 = catEntries.slice(0, 7)
  const col2 = catEntries.slice(7, 16)
  const col3 = catEntries.slice(16, 22)
  const col4 = catEntries.slice(22)
  const grouped = groupSelectedTests(selectedTests)

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 shadow-md" style={{ background: '#1a3a5c' }}>
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className='flex items-center'><img src={logo} alt="Logo" className="h-8 w-8" /></div>
            <div>
              <div className="text-white font-bold text-sm leading-tight">Saravoan Medical Laboratory</div>
              <div className="text-blue-200 text-xs">Lab Request System</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <User size={14}/><span>Dr. {user?.name}</span>
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs transition">
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 flex">
          {[
            { id: 'form',    label: 'New Request', icon: <ClipboardList size={14}/> },
            { id: 'history', label: 'History',     icon: <CheckSquare size={14}/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-[#1a3a5c] text-[#1a3a5c]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-5">

        {activeTab === 'form' && (
          <div className="space-y-4">

            {/* Patient info card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#1a3a5c' }}>
                Patient Information
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3">
                {[
                  { id: 'patient_name',      label: 'Patient Name *', type: 'text',   colSpan: true },
                  { id: 'patient_telephone', label: 'Telephone',       type: 'tel'   },
                  { id: 'patient_id',        label: 'Patient ID',      type: 'text'  },
                  { id: 'date_of_birth',     label: 'Date of Birth',   type: 'date'  },
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
                        <input type="radio" name="gender" value={g}
                          checked={formData.gender === g}
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
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">Other Tests</label>
                  <input type="text" value={formData.other_tests}
                    onChange={e => setFormData(p => ({ ...p, other_tests: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition" />
                </div>
              </div>
            </div>

            {/* Tests grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a3a5c' }}>
                  Select Laboratory Tests
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                    {selectedTests.length} selected
                  </span>
                  {selectedTests.length > 0 && (
                    <button onClick={() => setSelected([])}
                      className="text-xs text-red-500 hover:text-red-700 transition">Clear all</button>
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
                              <input type="checkbox"
                                checked={allSel}
                                ref={el => { if (el) el.indeterminate = someSel && !allSel }}
                                onChange={() => toggleCategory(catKey)}
                                className="test-checkbox"
                                onClick={e => e.stopPropagation()}
                              />
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
                                    <input type="checkbox" checked={sel}
                                      onChange={() => toggleTest(key)}
                                      className="test-checkbox shrink-0" />
                                    <span className={`leading-tight ${sel ? 'font-medium text-[#1a3a5c]' : 'text-gray-700'}`}>
                                      {test}
                                    </span>
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
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {saveMsg && (
                <span className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                  saveMsg.startsWith('✓') ? 'bg-green-100 text-green-700' :
                  saveMsg.startsWith('✗') ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'}`}>
                  {saveMsg}
                </span>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition">
                  <RotateCcw size={14}/> Reset
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white font-medium transition disabled:opacity-60"
                  style={{ background: '#1a3a5c' }}>
                  <Save size={14}/> {saving ? 'Saving…' : 'Save Request'}
                </button>
                <button onClick={handlePrint}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-semibold transition hover:opacity-90 shadow-md"
                  style={{ background: '#c0392b' }}>
                  <Printer size={15}/> Print PDF
                </button>
              </div>
            </div>

            {/* Selected tests preview */}
            {selectedTests.length > 0 && (
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
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* History tab */}
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
