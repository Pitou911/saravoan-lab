import { forwardRef } from 'react'
import { groupSelectedTests } from '../data/labTests'

const PrintReceipt = forwardRef(({ formData, selectedTests }, ref) => {
  const grouped = groupSelectedTests(selectedTests)
  const categories = Object.entries(grouped)

  return (
    <div ref={ref} className="print-receipt bg-white"
      style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', padding: '12mm', width: '210mm', minHeight: '297mm', color: '#000' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a3a5c', paddingBottom: '8px', marginBottom: '10px' }}>
        <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#1a3a5c' }}>
          មន្ទីរពិសោធន៏វេជ្ជសា្រស្តសារាវ័ន្ត
        </div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1a3a5c' }}>SARAVOAN MEDICAL LABORATORY</div>
        <div style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>
          TEL: +855 12 855 932 , +855 16 855 932
        </div>
        <div style={{ fontSize: '10px', color: '#555' }}>
          Email: info@sml.com.kh | Website: www.sml.com.kh
        </div>
        <div style={{ fontSize: '10px', color: '#555' }}>
          No 133, St 19 Chey Chumneah, Daun Penh, Phnom Penh, CAMBODIA
        </div>
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', fontSize: '13px', fontWeight: 'bold', color: '#c0392b', marginBottom: '10px', letterSpacing: '1px' }}>
        LABORATORY TEST REQUEST FORM
      </div>

      {/* Patient Info */}
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', marginBottom: '10px', background: '#f8fafc' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', fontSize: '10.5px' }}>
          <div><strong>Patient Name:</strong> {formData.patient_name || '—'}</div>
          <div><strong>ID:</strong> {formData.patient_id || '—'}</div>
          <div><strong>Telephone:</strong> {formData.patient_telephone || '—'}</div>
          <div><strong>Weight:</strong> {formData.weight ? `${formData.weight} kg` : '—'}</div>
          <div><strong>Date of Birth:</strong> {formData.date_of_birth || '—'}</div>
          <div><strong>Gender:</strong> {formData.gender ? (formData.gender === 'male' ? 'Male' : 'Female') : '—'}</div>
          <div><strong>Date:</strong> {formData.request_date || '—'}</div>
          <div><strong>Time:</strong> {formData.request_time || '—'}</div>
        </div>
      </div>

      {/* Tests Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '10px' }}>
        <thead>
          <tr style={{ background: '#1a3a5c', color: 'white' }}>
            <th style={{ padding: '5px 8px', textAlign: 'left', width: '40%', fontSize: '10px', fontWeight: 'bold', border: '1px solid #1a3a5c' }}>
              TEST CATEGORY
            </th>
            <th style={{ padding: '5px 8px', textAlign: 'left', width: '60%', fontSize: '10px', fontWeight: 'bold', border: '1px solid #1a3a5c' }}>
              TEST ITEM
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map(([category, tests], ci) =>
            tests.map((test, ti) => (
              <tr key={`${ci}-${ti}`} style={{ background: ti % 2 === 0 ? '#fff' : '#f5f8fc' }}>
                <td style={{ padding: '3px 8px', border: '1px solid #dde4ee', verticalAlign: 'top', fontWeight: ti === 0 ? '600' : 'normal', color: ti === 0 ? '#1a3a5c' : 'transparent', fontSize: '10px' }}>
                  {ti === 0 ? category : ''}
                </td>
                <td style={{ padding: '3px 8px', border: '1px solid #dde4ee', fontSize: '10px' }}>
                  {test}
                </td>
              </tr>
            ))
          )}
          {categories.length === 0 && (
            <tr>
              <td colSpan={2} style={{ padding: '12px', textAlign: 'center', color: '#999', fontSize: '10px' }}>No tests selected</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <div style={{ background: '#1a3a5c', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
          Total Tests: {selectedTests.length}
        </div>
      </div>

      {/* Clinical Info & Signature */}
      <div style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px', marginBottom: '10px', fontSize: '10.5px' }}>
        <div style={{ marginBottom: '4px' }}>
          <strong>Clinical History:</strong> {formData.clinical_history || '—'}
        </div>
        {formData.other_tests && (
          <div><strong>Other Tests:</strong> {formData.other_tests}</div>
        )}
      </div>

      {/* Doctor Signature block */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
        <div>
          <div style={{ borderBottom: '1px solid #aaa', marginBottom: '3px', height: '30px' }}></div>
          <div style={{ fontSize: '10px', color: '#555' }}>Doctor Signature</div>
        </div>
        <div>
          <div style={{ borderBottom: '1px solid #aaa', marginBottom: '3px', height: '30px', paddingTop: '6px', fontSize: '10.5px', fontWeight: '600' }}>
            {formData.doctor_name || ''}
          </div>
          <div style={{ fontSize: '10px', color: '#555' }}>Doctor Name</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '16px', paddingTop: '8px', borderTop: '1px solid #ddd', textAlign: 'center', fontSize: '9px', color: '#888' }}>
        Printed on {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} — Saravoan Medical Laboratory
      </div>
    </div>
  )
})

PrintReceipt.displayName = 'PrintReceipt'
export default PrintReceipt
