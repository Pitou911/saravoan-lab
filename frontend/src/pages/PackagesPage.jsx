import { Activity, Heart, Droplets, Zap, Sparkles, FlaskConical, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'

const PACKAGES = [
  {
    id: 1,
    icon: Activity,
    tag: null,
    en: {
      name: 'Basic Health Check',
      desc: 'Essential screening tests suitable for routine annual health check-ups.',
    },
    kh: {
      name: 'ការពិនិត្យសុខភាពមូលដ្ឋាន',
      desc: 'ការតេស្តស្ទង់ចាំបាច់ សម្រាប់ការពិនិត្យសុខភាពប្រចាំឆ្នាំ។',
    },
    tests: ['Complete Blood Count (CBC)', 'Blood Glucose (Fasting)', 'Urine Analysis', 'Lipid Profile', 'Liver Function (ALT/AST)', 'Kidney Function (Creatinine/BUN)'],
  },
  {
    id: 2,
    icon: FlaskConical,
    tagEn: 'Popular',
    tagKh: 'ពេញនិយម',
    en: {
      name: 'Comprehensive Package',
      desc: 'A thorough panel covering all major organ systems — ideal for a complete health baseline.',
    },
    kh: {
      name: 'កញ្ចប់ទូលំទូលាយ',
      desc: 'ការស្ទង់ហ្មត់ចត់ ដែលគ្របដណ្តប់សរីរាង្គសំខាន់ៗទាំងអស់ — ល្អសម្រាប់ baseline សុខភាពពេញលេញ។',
    },
    tests: ['Full Blood Panel (CBC + Diff)', 'Thyroid Function (TSH, FT3, FT4)', 'Liver Function (Full Panel)', 'Kidney Function (Full Panel)', 'Electrolytes (Na, K, Cl, CO2)', 'Blood Glucose & HbA1c', 'Lipid Profile (Full)', 'Urine Analysis & Microalbumin'],
  },
  {
    id: 3,
    icon: Heart,
    tag: null,
    en: {
      name: 'Cardiac Profile',
      desc: 'Specialized cardiac risk assessment for patients with family history or chest symptoms.',
    },
    kh: {
      name: 'កញ្ចប់បេះដូង',
      desc: 'ការវាយតម្លៃហានិភ័យបេះដូងឯកទេស សម្រាប់អ្នកជំងឺដែលមានប្រវត្តិគ្រួសារ ឬរោគសញ្ញាទ្រូង។',
    },
    tests: ['Total Cholesterol', 'LDL & HDL Cholesterol', 'Triglycerides', 'CK-MB (Cardiac Enzyme)', 'Troponin I & T', 'hs-CRP (Inflammation)', 'BNP / NT-proBNP', 'Homocysteine'],
  },
  {
    id: 4,
    icon: Droplets,
    tag: null,
    en: {
      name: 'Diabetes Package',
      desc: 'Comprehensive diabetes monitoring and risk assessment panel.',
    },
    kh: {
      name: 'កញ្ចប់ជំងឺទឹកនោមផ្អែម',
      desc: 'ការតាមដានជំងឺទឹកនោមផ្អែម និងការវាយតម្លៃហានិភ័យដ៏ទូលំទូលាយ។',
    },
    tests: ['HbA1c (3-month glucose avg)', 'Fasting Blood Glucose', 'Post-Prandial Glucose', 'Insulin Level', 'C-Peptide', 'Microalbuminuria (UAE)', 'eGFR (Kidney Function)', 'Lipid Profile'],
  },
  {
    id: 5,
    icon: Zap,
    tag: null,
    en: {
      name: 'Thyroid Package',
      desc: 'Complete thyroid function assessment including autoimmune markers.',
    },
    kh: {
      name: 'កញ្ចប់ក្រពះ Thyroid',
      desc: 'ការវាយតម្លៃមុខងារ thyroid ពេញលេញ រួមទាំងសញ្ញា autoimmune markers។',
    },
    tests: ['TSH Ultra Sensitive', 'Free T3 (FT3)', 'Free T4 (FT4)', 'Total T3 & T4', 'Anti-TPO Antibodies', 'Anti-Thyroglobulin (TgAb)', 'Thyroglobulin (Tg)', 'Reverse T3 (rT3)'],
  },
  {
    id: 6,
    icon: Sparkles,
    tagEn: 'New',
    tagKh: 'ថ្មី',
    en: {
      name: "Women's Health",
      desc: "Comprehensive panel addressing women's hormonal and reproductive health.",
    },
    kh: {
      name: 'សុខភាពស្ត្រី',
      desc: 'ការស្ទង់ទូលំទូលាយ ផ្ដោតលើសុខភាព hormone និងប្រព័ន្ធបន្តពូជស្ត្រី។',
    },
    tests: ['FSH & LH (Cycle Day 3)', 'Estradiol (E2)', 'Progesterone', 'Prolactin', 'AMH (Ovarian Reserve)', 'DHEA-S', 'Total & Free Testosterone', 'CA-125 (Tumor Marker)'],
  },
]

const T = {
  en: {
    heroEyebrow: 'Health Packages',
    heroTitle: 'Test Packages',
    heroDesc: 'Bundled test packages designed by our specialists to give you the most complete picture of your health.',
    inquireBtn: 'Inquire About This Package',
  },
  kh: {
    heroEyebrow: 'កញ្ចប់សុខភាព',
    heroTitle: 'កញ្ចប់ការតេស្ត',
    heroDesc: 'កញ្ចប់ការតេស្តដែលត្រូវបានរចនាឡើងដោយអ្នកជំនាញរបស់យើង ដើម្បីផ្ដល់ភាពច្បាស់លាស់ក្នុងសុខភាពរបស់អ្នក។',
    inquireBtn: 'សាកសួរអំពីកញ្ចប់នេះ',
  },
}

export default function PackagesPage() {
  const { lang } = useLanguage()
  const s = T[lang]

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e63946' }}>{s.heroEyebrow}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{s.heroTitle}</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.heroDesc}</p>
        </div>
      </div>

      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map(pkg => {
              const t = pkg[lang]
              const tag = lang === 'en' ? pkg.tagEn : pkg.tagKh
              return (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="h-1" style={{ background: '#e63946' }} />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#fff0f1' }}>
                        <pkg.icon size={24} style={{ color: '#e63946' }} />
                      </div>
                      {tag && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#e63946' }}>
                          {tag}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-base mb-1" style={{ color: '#033c93' }}>{t.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">{t.desc}</p>
                    <ul className="space-y-2 flex-1">
                      {pkg.tests.map(test => (
                        <li key={test} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={13} style={{ color: '#e63946', flexShrink: 0 }} />
                          {test}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="w-full mt-6 py-2.5 rounded-xl border-2 text-sm font-semibold transition-colors"
                      style={{ borderColor: '#e63946', color: '#e63946' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e63946'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#e63946' }}
                    >
                      {s.inquireBtn}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
