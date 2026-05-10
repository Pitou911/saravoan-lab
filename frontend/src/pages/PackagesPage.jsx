import { Activity, Heart, Droplets, Zap, Sparkles, FlaskConical, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const PACKAGES = [
  {
    id: 1,
    name: 'Basic Health Check',
    icon: Activity,
    tag: null,
    desc: 'Essential screening tests suitable for routine annual health check-ups.',
    tests: ['Complete Blood Count (CBC)', 'Blood Glucose (Fasting)', 'Urine Analysis', 'Lipid Profile', 'Liver Function (ALT/AST)', 'Kidney Function (Creatinine/BUN)'],
  },
  {
    id: 2,
    name: 'Comprehensive Package',
    icon: FlaskConical,
    tag: 'Popular',
    desc: 'A thorough panel covering all major organ systems — ideal for a complete health baseline.',
    tests: ['Full Blood Panel (CBC + Diff)', 'Thyroid Function (TSH, FT3, FT4)', 'Liver Function (Full Panel)', 'Kidney Function (Full Panel)', 'Electrolytes (Na, K, Cl, CO2)', 'Blood Glucose & HbA1c', 'Lipid Profile (Full)', 'Urine Analysis & Microalbumin'],
  },
  {
    id: 3,
    name: 'Cardiac Profile',
    icon: Heart,
    tag: null,
    desc: 'Specialized cardiac risk assessment for patients with family history or chest symptoms.',
    tests: ['Total Cholesterol', 'LDL & HDL Cholesterol', 'Triglycerides', 'CK-MB (Cardiac Enzyme)', 'Troponin I & T', 'hs-CRP (Inflammation)', 'BNP / NT-proBNP', 'Homocysteine'],
  },
  {
    id: 4,
    name: 'Diabetes Package',
    icon: Droplets,
    tag: null,
    desc: 'Comprehensive diabetes monitoring and risk assessment panel.',
    tests: ['HbA1c (3-month glucose avg)', 'Fasting Blood Glucose', 'Post-Prandial Glucose', 'Insulin Level', 'C-Peptide', 'Microalbuminuria (UAE)', 'eGFR (Kidney Function)', 'Lipid Profile'],
  },
  {
    id: 5,
    name: 'Thyroid Package',
    icon: Zap,
    tag: null,
    desc: 'Complete thyroid function assessment including autoimmune markers.',
    tests: ['TSH Ultra Sensitive', 'Free T3 (FT3)', 'Free T4 (FT4)', 'Total T3 & T4', 'Anti-TPO Antibodies', 'Anti-Thyroglobulin (TgAb)', 'Thyroglobulin (Tg)', 'Reverse T3 (rT3)'],
  },
  {
    id: 6,
    name: "Women's Health",
    icon: Sparkles,
    tag: 'New',
    desc: "Comprehensive panel addressing women's hormonal and reproductive health.",
    tests: ['FSH & LH (Cycle Day 3)', 'Estradiol (E2)', 'Progesterone', 'Prolactin', 'AMH (Ovarian Reserve)', 'DHEA-S', 'Total & Free Testosterone', 'CA-125 (Tumor Marker)'],
  },
]

export default function PackagesPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e63946' }}>Health Packages</div>
          <h1 className="text-4xl font-bold text-white mb-4">Test Packages</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Bundled test packages designed by our specialists to give you the most complete picture of your health.
          </p>
        </div>
      </div>

      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="h-1" style={{ background: '#e63946' }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#fff0f1' }}>
                      <pkg.icon size={24} style={{ color: '#e63946' }} />
                    </div>
                    {pkg.tag && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: '#e63946' }}
                      >
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-1" style={{ color: '#033c93' }}>{pkg.name}</h3>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">{pkg.desc}</p>
                  <ul className="space-y-2 flex-1">
                    {pkg.tests.map(t => (
                      <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={13} style={{ color: '#e63946', flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full mt-6 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors"
                    style={{ borderColor: '#e63946', color: '#e63946' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e63946'; e.currentTarget.style.color = '#fff' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e63946' }}
                  >
                    Inquire About This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
