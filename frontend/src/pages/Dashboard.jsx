import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  FlaskConical, LogOut, Printer, RotateCcw, CheckSquare,
  ChevronDown, ChevronUp, ClipboardList, User, Package,
  Plus, Trash2, BookMarked, Receipt,
} from 'lucide-react'

const today   = new Date().toISOString().split('T')[0]
const nowTime = new Date().toTimeString().slice(0, 5)

const EMPTY_FORM = {
  patient_name: '', patient_telephone: '', date_of_birth: '',
  gender: '', patient_id: '', weight: '', request_date: today,
  request_time: nowTime, clinical_history: '', doctor_name: '',
}

// Group array of OtherTestOption objects by category
function groupByCategory(tests) {
  return tests.reduce((acc, t) => {
    const cat = t.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t)
    return acc
  }, {})
}

export default function Dashboard() {
  const { user, logout } = useAuth()

  const [formData, setFormData]     = useState({ ...EMPTY_FORM, doctor_name: user?.name || '' })
  // Each item: { id, name, category, sample_type, collection_container }
  const [selectedTests, setSelected] = useState([])
  const [collapsed, setCollapsed]   = useState({})
  const [activeTab, setActiveTab]   = useState('form')
  const [history, setHistory]       = useState([])
  const [loadingHist, setLoadingHist] = useState(false)
  const [actionMsg, setActionMsg]   = useState({ text: '', type: '' })
  const [saving, setSaving]         = useState(false)

  // All tests from API
  const [allTests, setAllTests]         = useState([])
  const [loadingTests, setLoadingTests] = useState(true)

  // Packages
  const [packages, setPackages]     = useState([])
  const [showSavePkg, setShowSavePkg] = useState(false)
  const [pkgName, setPkgName]       = useState('')
  const [pkgDesc, setPkgDesc]       = useState('')
  const [savingPkg, setSavingPkg]   = useState(false)

  // ── Load all active tests & packages on mount ──────────────────
  useEffect(() => {
    api.get('/other-tests')
      .then(r => setAllTests(r.data))
      .catch(() => {})
      .finally(() => setLoadingTests(false))
    api.get('/packages').then(r => setPackages(r.data)).catch(() => {})
  }, [])

  const showMsg = (text, type = 'success') => {
    setActionMsg({ text, type })
    setTimeout(() => setActionMsg({ text: '', type: '' }), 3000)
  }

  // ── Test toggles ───────────────────────────────────────────────
  const toggleTest = (opt) => {
    setSelected(prev => {
      const exists = prev.find(t => t.id === opt.id)
      if (exists) return prev.filter(t => t.id !== opt.id)
      return [...prev, {
        id: opt.id,
        name: opt.name,
        category: opt.category || 'Other',
        sample_type: opt.sample_type,
        collection_container: opt.collection_container,
        price: opt.price,
      }]
    })
  }

  const toggleCategory = (tests) => {
    const allSel = tests.every(t => selectedTests.find(s => s.id === t.id))
    if (allSel) {
      const ids = tests.map(t => t.id)
      setSelected(prev => prev.filter(t => !ids.includes(t.id)))
    } else {
      const toAdd = tests
        .filter(t => !selectedTests.find(s => s.id === t.id))
        .map(t => ({
          id: t.id,
          name: t.name,
          category: t.category || 'Other',
          sample_type: t.sample_type,
          collection_container: t.collection_container,
          price: t.price,
        }))
      setSelected(prev => [...prev, ...toAdd])
    }
  }

  const isCatAll  = (tests) => tests.length > 0 && tests.every(t => selectedTests.find(s => s.id === t.id))
  const isCatSome = (tests) => tests.some(t => selectedTests.find(s => s.id === t.id))

  // ── Save + Print combined ──────────────────────────────────────
  const handleSaveAndPrint = useCallback(async () => {
    if (!formData.patient_name.trim()) return showMsg('⚠ Patient name is required.', 'warn')
    if (!formData.doctor_name.trim())  return showMsg('⚠ Doctor name is required.', 'warn')
    if (selectedTests.length === 0)    return showMsg('⚠ Please select at least one test.', 'warn')

    setSaving(true)

    try {
      await api.post('/lab-requests', {
        ...formData,
        other_tests: null,
        selected_tests: selectedTests,
      })
    } catch (err) {
      showMsg('✗ Failed to save: ' + (err.response?.data?.message || 'Error'), 'error')
      setSaving(false)
      return
    }
    setSaving(false)

    // Group tests by category for print
    const grouped    = selectedTests.reduce((acc, t) => {
      const cat = t.category || 'Other'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(t.name)
      return acc
    }, {})
    const categories  = Object.entries(grouped)
    const genderLabel = formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : '—'

    // Deduplicated containers from selected tests
    const containers = [...new Set(
      selectedTests.map(t => t.collection_container).filter(Boolean)
    )]

    const labRows = categories.map(([cat, tests]) => {
      const count = tests.length
      const bdr   = 'border:2px solid #1a3a5c;'
      const catCell = `<td rowspan="${count}" style="
        padding:6px 10px;${bdr}font-size:11px;font-weight:700;color:#1a3a5c;
        vertical-align:middle;text-align:center;width:38%;background:#f0f4f8;
      ">${cat}</td>`
      return tests.map((test, ti) => `
        <tr>
          ${ti === 0 ? catCell : ''}
          <td style="padding:4px 10px;${bdr}font-size:11px;color:#222;background:${ti % 2 === 0 ? '#fff' : '#f9fbfd'};">${test}</td>
        </tr>`
      ).join('')
    }).join('')

    const containersHtml = containers.length > 0 ? `
    <div class="container-box">
      <strong>Containers Needed:</strong>&nbsp;${containers.join(', ')}
    </div>` : ''

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
.container-box{border:1.5px solid #e67e22;border-radius:4px;padding:7px 11px;margin-bottom:11px;font-size:10.5px;background:#fffbf5;}
.container-box strong{color:#c0392b;}
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
  <tbody>${labRows || '<tr><td colspan="2" style="text-align:center;padding:12px;color:#999;">No tests selected</td></tr>'}</tbody>
</table>
<div class="summary"><span class="summary-badge">Total Tests: ${selectedTests.length}</span></div>
${containersHtml}
<div class="clinical-box">
  <div><strong>Clinical History:</strong>&nbsp; ${formData.clinical_history || '—'}</div>
</div>
<div class="sig-grid">
  <div><div class="sig-line"></div><div class="sig-label">Doctor Signature</div></div>
  <div><div class="sig-line">${formData.doctor_name || ''}</div><div class="sig-label">Doctor Name</div></div>
</div>
<div class="footer">Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()} &mdash; Saravoan Medical Laboratory</div>
<script>
window.onload=function(){window.focus();window.print();};
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

    api.post('/notify/print', {
      ...formData,
      other_tests: null,
      selected_tests: selectedTests,
      doctor_email: user?.email || '',
    }).catch(() => {})

    showMsg('✓ Saved & printed successfully!', 'success')
  }, [formData, selectedTests, user])

  // ── Print Invoice ──────────────────────────────────────────────
  const handlePrintInvoice = useCallback(() => {
    if (!formData.patient_name.trim()) return showMsg('⚠ Patient name is required.', 'warn')
    if (selectedTests.length === 0)    return showMsg('⚠ Please select at least one test.', 'warn')

    const genderLabel = formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : '—'
    const invoiceDate = new Date().toLocaleDateString('en-GB')
    const invoiceNo   = 'INV-' + Date.now().toString().slice(-8)

    const testsWithPrice = selectedTests.map(t => ({
      ...t,
      price: t.price != null ? parseFloat(t.price) : null,
    }))
    const total = testsWithPrice.reduce((sum, t) => sum + (t.price ?? 0), 0)
    const hasAnyPrice = testsWithPrice.some(t => t.price != null)

    const bdr = 'border:2px solid #1a3a5c;'

    const rows = testsWithPrice.map((t, i) => `
      <tr style="background:${i % 2 === 0 ? '#fff' : '#f5f8fc'}">
        <td style="padding:5px 10px;${bdr}font-size:10.5px;">${t.name}</td>
        ${hasAnyPrice ? `<td style="padding:5px 10px;${bdr}font-size:10.5px;text-align:right;">${t.price != null ? '$' + t.price.toFixed(2) : '—'}</td>` : ''}
      </tr>`
    ).join('')

    const totalRow = hasAnyPrice ? `
      <tr style="background:#1a3a5c;color:#fff;font-weight:bold;">
        <td style="padding:6px 10px;${bdr}font-size:11px;text-align:right;">TOTAL</td>
        <td style="padding:6px 10px;${bdr}font-size:11px;text-align:right;">$${total.toFixed(2)}</td>
      </tr>` : ''

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>
<title>Invoice — ${formData.patient_name || 'Patient'}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#111;background:#fff;padding:14mm 12mm;}
.header{text-align:center;border-bottom:2.5px solid #1a3a5c;padding-bottom:9px;margin-bottom:11px;}
.kh{font-size:15px;font-weight:bold;color:#1a3a5c;}
.en{font-size:13px;font-weight:bold;color:#1a3a5c;margin-top:3px;}
.sub{font-size:9.5px;color:#555;margin-top:2px;}
.invoice-title{text-align:center;font-size:14px;font-weight:bold;color:#c0392b;letter-spacing:2px;margin:10px 0 14px;}
.meta{display:flex;justify-content:space-between;margin-bottom:12px;font-size:10.5px;}
.meta-left,.meta-right{line-height:1.8;}
.meta strong{color:#1a3a5c;}
.info-box{border:2px solid #1a3a5c;border-radius:4px;padding:9px 11px;margin-bottom:12px;background:#f7fafd;}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:5px 24px;}
.info-grid div{font-size:10.5px;line-height:1.5;}
.info-grid strong{color:#1a3a5c;}
table{width:100%;border-collapse:collapse;margin-bottom:12px;}
thead tr{background:#1a3a5c;color:#fff;}
thead th{padding:6px 10px;text-align:left;font-size:10.5px;font-weight:bold;border:2px solid #1a3a5c;}
thead th.right{text-align:right;}
.sig-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;}
.sig-line{border-bottom:2px solid #555;height:34px;padding-top:10px;font-size:10.5px;font-weight:600;color:#1a3a5c;padding-left:4px;}
.sig-label{font-size:9px;color:#777;margin-top:4px;}
.footer{margin-top:18px;padding-top:8px;border-top:2px solid #1a3a5c;text-align:center;font-size:9px;color:#aaa;}
.thank-you{text-align:center;font-size:11px;font-weight:bold;color:#1a3a5c;margin-top:14px;}
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
<div class="invoice-title">INVOICE</div>
<div class="meta">
  <div class="meta-left">
    <div><strong>Invoice No:</strong> ${invoiceNo}</div>
    <div><strong>Date:</strong> ${invoiceDate}</div>
    <div><strong>Doctor:</strong> ${formData.doctor_name || '—'}</div>
  </div>
  <div class="meta-right" style="text-align:right;">
    <div><strong>Saravoan Medical Laboratory</strong></div>
    <div style="font-size:9.5px;color:#555;">No 133, St 19, Daun Penh, Phnom Penh</div>
    <div style="font-size:9.5px;color:#555;">TEL: +855 12 855 932</div>
  </div>
</div>
<div class="info-box">
  <div class="info-grid">
    <div><strong>Patient Name:</strong>&nbsp; ${formData.patient_name || '—'}</div>
    <div><strong>ID:</strong>&nbsp; ${formData.patient_id || '—'}</div>
    <div><strong>Telephone:</strong>&nbsp; ${formData.patient_telephone || '—'}</div>
    <div><strong>Gender:</strong>&nbsp; ${genderLabel}</div>
    <div><strong>Date of Birth:</strong>&nbsp; ${formData.date_of_birth ? formData.date_of_birth + ' years old' : '—'}</div>
    <div><strong>Weight:</strong>&nbsp; ${formData.weight ? formData.weight + ' kg' : '—'}</div>
  </div>
</div>
<table>
  <thead>
    <tr>
      <th>TEST ITEM</th>
      ${hasAnyPrice ? '<th class="right" style="width:24%">PRICE</th>' : ''}
    </tr>
  </thead>
  <tbody>
    ${rows}
    ${totalRow}
  </tbody>
</table>
<div class="thank-you">Thank you for choosing Saravoan Medical Laboratory</div>
<div class="sig-grid">
  <div><div class="sig-line"></div><div class="sig-label">Patient / Guardian Signature</div></div>
  <div><div class="sig-line">${formData.doctor_name || ''}</div><div class="sig-label">Authorized By</div></div>
</div>
<div class="footer">Printed: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()} &mdash; Saravoan Medical Laboratory</div>
<script>
window.onload=function(){window.focus();window.print();};
</script>
</body></html>`

    const w = window.open('', '_blank')
    if (!w) {
      alert('⚠ Pop-ups are blocked! Please allow pop-ups for this site.')
      return
    }
    w.document.write(html)
    w.document.close()

    api.post('/log/invoice', {
      patient_name: formData.patient_name,
      selected_tests: selectedTests,
    }).catch(() => {})
  }, [formData, selectedTests])

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
    })
    setSelected(req.selected_tests || [])
    setActiveTab('form')
  }

  const handleReset = () => {
    setFormData({ ...EMPTY_FORM, doctor_name: user?.name || '' })
    setSelected([])
    setActionMsg({ text: '', type: '' })
  }

  // ── Derived: build category columns from API ───────────────────
  const catMap     = groupByCategory(allTests)
  const catEntries = Object.entries(catMap)
  const quarter    = Math.ceil(catEntries.length / 4)
  const col1 = catEntries.slice(0, quarter)
  const col2 = catEntries.slice(quarter, quarter * 2)
  const col3 = catEntries.slice(quarter * 2, quarter * 3)
  const col4 = catEntries.slice(quarter * 3)

  // Preview: group selected by category
  const previewGrouped = selectedTests.reduce((acc, t) => {
    const cat = t.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(t.name)
    return acc
  }, {})

  const totalPrice = selectedTests.reduce((sum, t) => sum + (t.price != null ? parseFloat(t.price) : 0), 0)
  const hasPrices  = selectedTests.some(t => t.price != null)

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
            { id: 'form',     label: 'New Request',   icon: <ClipboardList size={14}/> },
            { id: 'packages', label: 'Test Packages', icon: <BookMarked size={14}/> },
            { id: 'history',  label: 'History',       icon: <CheckSquare size={14}/> },
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
                  { id: 'date_of_birth',     label: 'Age',             type: 'number'},
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
                    {selectedTests.length} selected
                  </span>
                  {hasPrices && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#16a085' }}>
                      Total: ${totalPrice.toFixed(2)}
                    </span>
                  )}
                  {selectedTests.length > 0 && (
                    <button onClick={() => setSelected([])} className="text-xs text-red-500 hover:text-red-700 transition">
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {loadingTests ? (
                <div className="text-center py-10 text-gray-400 text-sm">Loading tests…</div>
              ) : allTests.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm">
                  No tests available yet. Ask the admin to add tests.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[col1, col2, col3, col4].map((col, ci) => (
                    <div key={ci} className="space-y-2">
                      {col.map(([catName, tests]) => {
                        const allSel  = isCatAll(tests)
                        const someSel = isCatSome(tests)
                        const open    = !collapsed[catName]
                        return (
                          <div key={catName} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="category-header flex items-center justify-between select-none">
                              <div className="flex items-center gap-2 flex-1">
                                <input type="checkbox" checked={allSel}
                                  ref={el => { if (el) el.indeterminate = someSel && !allSel }}
                                  onChange={() => toggleCategory(tests)}
                                  className="test-checkbox" onClick={e => e.stopPropagation()} />
                                <span className="cursor-pointer flex-1"
                                  onClick={() => setCollapsed(p => ({ ...p, [catName]: !p[catName] }))}>
                                  {catName}
                                </span>
                              </div>
                              <span className="text-white/60 cursor-pointer"
                                onClick={() => setCollapsed(p => ({ ...p, [catName]: !p[catName] }))}>
                                {open ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                              </span>
                            </div>
                            {open && (
                              <div className="divide-y divide-gray-50">
                                {tests.map(test => {
                                  const sel = selectedTests.find(t => t.id === test.id)
                                  return (
                                    <label key={test.id}
                                      className={`flex items-center gap-2 px-2.5 py-1.5 cursor-pointer transition text-xs hover:bg-blue-50 ${sel ? 'bg-blue-50/70' : ''}`}>
                                      <input type="checkbox" checked={!!sel} onChange={() => toggleTest(test)} className="test-checkbox flex-shrink-0" />
                                      <span className={`leading-tight ${sel ? 'font-medium text-[#1a3a5c]' : 'text-gray-700'}`}>{test.name}</span>
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
              )}
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

                <button onClick={() => setShowSavePkg(p => !p)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border-2 transition font-medium"
                  style={{ borderColor: '#1a3a5c', color: '#1a3a5c' }}>
                  <Package size={14}/> Save as Package
                </button>

                <button onClick={handlePrintInvoice}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm rounded-lg text-white font-semibold transition hover:opacity-90 shadow-md"
                  style={{ background: '#16a085' }}>
                  <Receipt size={15}/> Print Invoice
                </button>

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
                      {hasPrices && <th className="text-right px-4 py-2 text-xs font-semibold w-24">Price</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(previewGrouped).map(([cat, tests], ci) =>
                      tests.map((test, ti) => {
                        const testObj = selectedTests.find(t => t.name === test && (t.category || 'Other') === cat)
                        return (
                          <tr key={`${ci}-${ti}`} className={ti % 2 === 0 ? 'bg-white' : 'bg-blue-50/40'}>
                            <td className="px-4 py-1.5 border border-gray-100 text-xs font-semibold"
                              style={{ color: ti === 0 ? '#1a3a5c' : 'transparent' }}>
                              {ti === 0 ? cat : ''}
                            </td>
                            <td className="px-4 py-1.5 border border-gray-100 text-xs">{test}</td>
                            {hasPrices && (
                              <td className="px-4 py-1.5 border border-gray-100 text-xs text-right text-gray-600">
                                {testObj?.price != null ? '$' + parseFloat(testObj.price).toFixed(2) : '—'}
                              </td>
                            )}
                          </tr>
                        )
                      })
                    )}
                    {hasPrices && (
                      <tr style={{ background: '#1a3a5c', color: 'white' }}>
                        <td colSpan={2} className="px-4 py-2 text-xs font-bold text-right">TOTAL</td>
                        <td className="px-4 py-2 text-xs font-bold text-right">${totalPrice.toFixed(2)}</td>
                      </tr>
                    )}
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
                        <td className="px-3 py-2 text-xs">
                          <button onClick={() => restoreRequest(req)}
                            className="text-[#1a3a5c] hover:underline font-medium">
                            Restore
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
