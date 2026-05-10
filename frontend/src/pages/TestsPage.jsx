import { useState, useEffect } from 'react'
import {
  Activity, Heart, Droplets, Zap, Sparkles, FlaskConical,
  Microscope, Scan, TestTube2, ChevronDown, ChevronUp, Loader2, AlertCircle,
} from 'lucide-react'
import api from '../api/axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'

const ICON_MAP = [
  { keywords: ['hematol', 'blood cell', 'cbc'],           icon: Activity     },
  { keywords: ['biochem', 'chemist', 'metabol'],          icon: Droplets     },
  { keywords: ['cardiol', 'cardiac', 'heart', 'lipid'],   icon: Heart        },
  { keywords: ['endocrin', 'hormon', 'thyroid', 'diabet'],icon: Zap          },
  { keywords: ['microbiol', 'bacteria', 'culture', 'afb'],icon: FlaskConical },
  { keywords: ['immunol', 'serolog', 'antibod', 'hepat'], icon: Sparkles     },
  { keywords: ['urin', 'urology'],                         icon: Microscope   },
  { keywords: ['pcr', 'molecul', 'viral', 'dna', 'rna'],  icon: Scan         },
  { keywords: ['vitamin', 'mineral', 'nutrit'],            icon: Sparkles     },
]

function getCategoryIcon(category) {
  if (!category) return TestTube2
  const lower = category.toLowerCase()
  const match = ICON_MAP.find(({ keywords }) => keywords.some(k => lower.includes(k)))
  return match ? match.icon : TestTube2
}

const BRAND_COLORS = ['#e63946', '#033c93', '#096abc']

const T = {
  en: {
    heroEyebrow: 'Comprehensive Diagnostics',
    heroTitle: 'Our Tests',
    heroDescLoading: 'Loading our test catalogue…',
    heroDesc: (total, cats) => `Browse our full catalogue of ${total} laboratory tests across ${cats} diagnostic categories.`,
    expandHint: 'Click any category to expand the full test list',
    testCount: (n) => `${n} test${n !== 1 ? 's' : ''} available`,
    loadingText: 'Loading test categories…',
    errorText: 'Could not load test data. Please try again later.',
    emptyText: 'No tests have been added yet.',
  },
  kh: {
    heroEyebrow: 'ការវិនិច្ឆ័យទូលំទូលាយ',
    heroTitle: 'ការតេស្តរបស់យើង',
    heroDescLoading: 'កំពុងផ្ទុកបញ្ជីការតេស្ត…',
    heroDesc: (total, cats) => `ស្វែងរកបញ្ជីការតេស្តចំនួន ${total} របស់យើង ក្នុង ${cats} ប្រភេទវិនិច្ឆ័យ។`,
    expandHint: 'ចុចលើប្រភេទណាមួយ ដើម្បីមើលបញ្ជីតេស្តពេញលេញ',
    testCount: (n) => `${n} តេស្ត`,
    loadingText: 'កំពុងផ្ទុកប្រភេទការតេស្ត…',
    errorText: 'មិនអាចផ្ទុកទិន្នន័យការតេស្តបាន។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។',
    emptyText: 'មិនទាន់មានការបន្ថែមការតេស្តណាមួយ។',
  },
}

function CategoryCard({ cat, index, s }) {
  const [open, setOpen] = useState(false)
  const Icon  = getCategoryIcon(cat.category)
  const color = BRAND_COLORS[index % BRAND_COLORS.length]

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1" style={{ background: color }} />
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff0f1' }}>
            <Icon size={22} style={{ color: color }} />
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#033c93' }}>{cat.category}</div>
            <div className="text-xs text-gray-400">{s.testCount(cat.tests.length)}</div>
          </div>
        </div>
        {open
          ? <ChevronUp   size={18} style={{ color: color }} />
          : <ChevronDown size={18} style={{ color: color }} />
        }
      </button>
      {open && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: '#f0f6ff' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-3">
            {cat.tests.map(t => (
              <div key={t.id} className="flex items-start gap-2 py-1">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: color }} />
                <div>
                  <span className="text-xs text-gray-700">{t.name}</span>
                  {t.sample_type && (
                    <span className="ml-2 text-xs text-gray-400">({t.sample_type})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TestsPage() {
  const { lang } = useLanguage()
  const s = T[lang]
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)

  useEffect(() => {
    api.get('/public/tests')
      .then(res => setCategories(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const totalTests = categories.reduce((sum, c) => sum + c.tests.length, 0)

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#e63946' }}>{s.heroEyebrow}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{s.heroTitle}</h1>
          <p className="text-base max-w-xl mx-auto mb-6" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {loading ? s.heroDescLoading : s.heroDesc(totalTests, categories.length)}
          </p>
          {!loading && !error && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              {s.expandHint}
            </div>
          )}
        </div>
      </div>

      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-4xl mx-auto px-4">

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin mb-4" style={{ color: '#e63946' }} />
              <p className="text-sm text-gray-500">{s.loadingText}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-5 max-w-lg mx-auto">
              <AlertCircle size={20} className="flex-shrink-0" />
              <span className="text-sm">{s.errorText}</span>
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <FlaskConical size={40} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">{s.emptyText}</p>
            </div>
          )}

          {!loading && !error && categories.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {categories.map((cat, i) => {
                  const Icon  = getCategoryIcon(cat.category)
                  const color = BRAND_COLORS[i % BRAND_COLORS.length]
                  return (
                    <div key={cat.category} className="flex items-center gap-2 bg-white rounded-full px-4 py-1.5 shadow-sm text-sm font-medium" style={{ color: '#033c93' }}>
                      <Icon size={14} style={{ color }} />
                      {cat.category}
                      <span className="text-xs font-bold rounded-full px-2 py-0.5 text-white" style={{ background: color }}>
                        {cat.tests.length}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="space-y-4">
                {categories.map((cat, i) => (
                  <CategoryCard key={cat.category} cat={cat} index={i} s={s} />
                ))}
              </div>
            </>
          )}

        </div>
      </section>

      <Footer />
    </div>
  )
}
