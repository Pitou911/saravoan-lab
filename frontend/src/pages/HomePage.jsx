import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  FlaskConical, Clock,
  Award, Users, CheckCircle, Star, ArrowRight, Loader2,
  Activity, Heart, Droplets, Zap, Sparkles,
  Microscope, TestTube2, Cpu, Scan,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { useLanguage } from '../context/LanguageContext'
import slideImg1 from '../assets/1.png'
import slideImg2 from '../assets/2.png'
import slideImg3 from '../assets/3.png'
import partner1  from '../assets/partner1.png'
import partner2  from '../assets/partner2.jpg'
import partner3  from '../assets/partner3.png'
import partner4  from '../assets/partner4.png'
import partner5  from '../assets/partner5.jpg'
import partner6  from '../assets/partner6.png'

/* ─── Static bilingual data ──────────────────────────── */

const SLIDE_CONTENT = {
  en: [
    { headline: 'Your Health is\nOur Priority',        sub: 'Trusted medical laboratory services with fast, accurate results you can rely on.',             cta: 'Explore Services' },
    { headline: 'Advanced Diagnostic\nTechnology',      sub: 'State-of-the-art equipment ensuring precise diagnostics every time.',                          cta: 'View Packages'    },
    { headline: 'Trusted by\nThousands of Patients',   sub: '130+ laboratory tests across 26 categories — results within 24 hours.',                        cta: 'Contact Us'       },
  ],
  kh: [
    { headline: 'សុខភាពរបស់អ្នក\nជាអាទិភាពរបស់យើង',       sub: 'សេវាមន្ទីរពិសោធន៍វេជ្ជសាស្ត្រដែលអាចទុកចិត្តបាន ជាមួយនឹងលទ្ធផលរហ័ស និងត្រឹមត្រូវ',           cta: 'ស្វែងយល់សេវាកម្ម' },
    { headline: 'បច្ចេកវិទ្យាវិនិច្ឆ័យ\nកម្រិតខ្ពស់',          sub: 'ឧបករណ៍ទំនើបថ្មីដែលធានានូវវិនិច្ឆ័យត្រឹមត្រូវ គ្រប់ពេលវេលា',                               cta: 'មើលកញ្ចប់'        },
    { headline: 'ទទួលការទុកចិត្ត\nពីអ្នកជំងឺរាប់ពាន់នាក់',  sub: 'តេស្ត ១៣០+ ក្នុង ២៦ ប្រភេទ — លទ្ធផលក្នុងរយៈពេល ២៤ ម៉ោង',                                cta: 'ទំនាក់ទំនង'       },
  ],
}
const SLIDE_COMMON = [
  { img: slideImg1, to: '/services' },
  { img: slideImg2, to: '/packages' },
  { img: slideImg3, to: '/contact'  },
]

const STATS = [
  { icon: Award,        value: '10+',    en: 'Years of Experience', kh: 'ឆ្នាំនៃបទពិសោធ'         },
  { icon: FlaskConical, value: '130+',   en: 'Tests Available',     kh: 'ប្រភេទតេស្ត'             },
  { icon: Users,        value: '5,000+', en: 'Patients per Year',   kh: 'អ្នកជំងឺក្នុងមួយឆ្នាំ'  },
  { icon: Clock,        value: '24h',    en: 'Result Turnaround',   kh: 'ពេលវេលាលទ្ធផល'           },
]

const PACKAGES_PREVIEW = [
  { id: 1, icon: Activity,     en: 'Basic Health Check',    kh: 'ពិនិត្យសុខភាពមូលដ្ឋាន', tag: null,      tests: ['Complete Blood Count (CBC)', 'Blood Glucose', 'Urine Analysis'] },
  { id: 2, icon: FlaskConical, en: 'Comprehensive Package', kh: 'កញ្ចប់ពេញលេញ',           tag: 'Popular', tests: ['Full Blood Panel', 'Thyroid Function', 'Liver Function'] },
  { id: 3, icon: Heart,        en: 'Cardiac Profile',       kh: 'ប្រវត្តិបេះដូង',          tag: null,      tests: ['Total Cholesterol', 'LDL / HDL', 'Troponin'] },
]

const EQUIPMENT_PREVIEW = [
  { id: 1, icon: Activity,  name: 'Sysmex KX-21',       en: 'Blood cell analyzer — 60 tests/hour, CBC with 3-part WBC differential.',           kh: 'ម៉ាស៊ីនវិភាគកោសិកាឈាម — ៦០ តេស្ត/ម៉ោង, CBC ជាមួយ WBC ត្រីវិភាគ' },
  { id: 2, icon: TestTube2, name: 'BA200 Biochemistry', en: 'Biochemistry analyzer — 200 tests/hour for metabolic & organ function panels.',     kh: 'ម៉ាស៊ីនវិភាគជីវគីមី — ២០០ តេស្ត/ម៉ោង សម្រាប់ការវិភាគមេតាបូលីស និងមុខងារសរីរាង្គ' },
  { id: 3, icon: Cpu,       name: 'Cobas e411',          en: 'Immunology & serology analyzer — 86 tests/hour for hormones & tumor markers.',     kh: 'ម៉ាស៊ីនវិភាគភាពស៊ាំ — ៨៦ តេស្ត/ម៉ោង សម្រាប់ហ័រម៉ូន និងសញ្ញាសម្គាល់ដុំសាច់' },
]

const CAT_ICON_MAP = [
  { kw: ['hematol', 'blood cell'],          Icon: Activity     },
  { kw: ['biochem', 'chemist', 'metabol'],  Icon: Droplets     },
  { kw: ['cardiol', 'cardiac', 'heart'],    Icon: Heart        },
  { kw: ['endocrin', 'hormon', 'thyroid'],  Icon: Zap          },
  { kw: ['microbiol', 'bacteria', 'cultur'],Icon: FlaskConical },
  { kw: ['immunol', 'serolog', 'allerg'],   Icon: Sparkles     },
  { kw: ['urin'],                            Icon: Microscope   },
  { kw: ['pcr', 'molecul', 'viral'],        Icon: Scan         },
]
function catIcon(name) {
  const l = (name ?? '').toLowerCase()
  return CAT_ICON_MAP.find(e => e.kw.some(k => l.includes(k)))?.Icon ?? TestTube2
}

const PARTNERS_PREVIEW = [
  { img: partner1, name: 'Davyda Clinic',                  en: 'Clinical partner providing patient referrals and integrated diagnostic services.',                        kh: 'ដៃគូរគ្លីនិក ផ្តល់ការបញ្ជូនអ្នកជំងឺ និងសេវារោគវិនិច្ឆ័យរួមបញ្ចូល' },
  { img: partner2, name: 'Preah Ang Duong Hospital',       en: 'Government hospital partnership supporting national healthcare and diagnostic quality.',                   kh: 'ដៃគូរមន្ទីរពេទ្យរដ្ឋ គាំទ្រប្រព័ន្ធថែទាំសុខភាពជាតិ និងគុណភាពការវិនិច្ឆ័យ' },
  { img: partner3, name: 'Preah Ket Melea Hospital',       en: 'Long-standing hospital partnership for shared patient care and diagnostic reporting.',                    kh: 'ដៃគូរមន្ទីរពេទ្យរយៈពេលវែង សម្រាប់ការថែទាំអ្នកជំងឺរួម និងរបាយការណ៍វិនិច្ឆ័យ' },
  { img: partner4, name: 'Sing-Specialist Medical Centre', en: 'Specialist centre collaboration for advanced diagnostics and clinical referrals.',                         kh: 'កិច្ចសហប្រតិបត្តិការជាមួយមជ្ឈមណ្ឌលឯកទេស សម្រាប់ការវិនិច្ឆ័យកម្រិតខ្ពស់' },
  { img: partner5, name: 'Soriya Hospital',                en: 'Preferred laboratory partner for patient referrals and integrated diagnostic services.',                   kh: 'ដៃគូរមន្ទីរពិសោធន៍ដែលប្រើជាញឹកញាប់ សម្រាប់ការបញ្ជូនអ្នកជំងឺ និងសេវារោគវិនិច្ឆ័យ' },
  { img: partner6, name: 'Wellness Center',                en: 'Health and wellness partnership promoting preventive diagnostics and patient care.',                       kh: 'ដៃគូរសុខភាព ផ្សព្វផ្សាយការវិនិច្ឆ័យបង្ការ និងការថែទាំអ្នកជំងឺ' },
]

const FAQS = [
  {
    en: { q: 'How should I prepare for a blood test?',          a: 'For most blood tests, fasting 8–12 hours beforehand is recommended. Drink plenty of water and avoid strenuous exercise the night before.' },
    kh: { q: 'តើខ្ញុំត្រូវរៀបចំខ្លួនយ៉ាងណាសម្រាប់ការពិនិត្យឈាម?', a: 'សម្រាប់ការតេស្តឈាមភាគច្រើន ការតមអាហារ ៨-១២ ម៉ោងជាការណែនាំ។ ផឹកទឹកច្រើន និងជៀសវាងការហាត់ប្រាណខ្លាំងមុនពេលចូលគេង។' },
  },
  {
    en: { q: 'How long does it take to receive results?',        a: 'Most routine tests are available within 24 hours. Specialized tests such as cultures or PCR may take 2–5 business days.' },
    kh: { q: 'ត្រូវរងចាំប៉ុន្មានដើម្បីទទួលបានលទ្ធផល?',           a: 'ការតេស្តស្តង់ដារភាគច្រើនមានក្នុងរយៈពេល ២៤ ម៉ោង។ ការតេស្តពិសេស ដូចជា culture ឬ PCR អាចចំណាយពេល ២-៥ ថ្ងៃធ្វើការ។' },
  },
]

const T = {
  en: {
    badge: 'Saravoan Medical Laboratory',
    statsTitle: '',
    pkgEyebrow: 'What We Offer',       pkgTitle: 'Our Test Packages',      pkgMore: '+ more tests included', pkgBtn: 'View All Packages',
    eqEyebrow: 'Our Technology',        eqTitle: 'Laboratory Equipment',    eqBtn: 'View All Services',
    testEyebrow: (n) => `${n}+ Tests Available`, testTitle: 'Our Test Categories',   testUnit: 'tests',     testBtn: 'View All Tests',   testLoading: 'Loading…',
    teamEyebrow: 'Our Professionals',   teamTitle: 'Meet Our Team',         teamEmpty: 'Our team will be introduced soon.', teamBtn: 'View Full Team',
    partnerEyebrow: 'Trusted Collaborations', partnerTitle: 'Our Partners', partnerBtn: 'View All Partners',
    faqEyebrow: 'Common Questions',     faqTitle: 'Frequently Asked Questions',
    tagPopular: 'Popular',
  },
  kh: {
    badge: 'មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត',
    statsTitle: '',
    pkgEyebrow: 'អ្វីដែលយើងផ្តល់',   pkgTitle: 'កញ្ចប់ការតេស្តរបស់យើង',   pkgMore: '+ មានតេស្តបន្ថែម',        pkgBtn: 'មើលកញ្ចប់ទាំងអស់',
    eqEyebrow: 'បច្ចេកវិទ្យារបស់យើង',  eqTitle: 'ឧបករណ៍មន្ទីរពិសោធន៍',     eqBtn: 'មើលសេវាកម្មទាំងអស់',
    testEyebrow: (n) => `${n}+ ប្រភេទតេស្ត`, testTitle: 'ប្រភេទតេស្តរបស់យើង', testUnit: 'តេស្ត', testBtn: 'មើលតេស្តទាំងអស់',    testLoading: 'កំពុងផ្ទុក...',
    teamEyebrow: 'អ្នកជំនាញរបស់យើង',  teamTitle: 'ស្គាល់ក្រុមការងាររបស់យើង', teamEmpty: 'ក្រុមការងាររបស់យើងនឹងត្រូវបានណែនាំឆាប់ៗ', teamBtn: 'មើលក្រុមការងារទាំងអស់',
    partnerEyebrow: 'កិច្ចសហប្រតិបត្តិការដែលទុកចិត្ត', partnerTitle: 'ដៃគូររបស់យើង', partnerBtn: 'មើលដៃគូរទាំងអស់',
    faqEyebrow: 'សំណួរទូទៅ',            faqTitle: 'សំណួរដែលសួរញឹកញាប់',
    tagPopular: 'ពេញនិយម',
  },
}

/* ─── Sub-components ─────────────────────────────────── */

function SectionHeader({ eyebrow, title, light = false }) {
  return (
    <div className="text-center mb-10">
      <div className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: light ? '#4cb6eb' : '#e63946' }}>{eyebrow}</div>
      <h2 className="text-3xl font-bold" style={{ color: light ? '#fff' : '#033c93' }}>{title}</h2>
    </div>
  )
}

function ViewAllBtn({ to, label, light = false }) {
  return (
    <div className="flex justify-center mt-8">
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-opacity hover:opacity-90"
        style={light
          ? { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.30)' }
          : { background: '#e63946', color: '#fff' }
        }
      >
        {label} <ArrowRight size={15} />
      </Link>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */

export default function HomePage() {
  const { lang } = useLanguage()
  const s = T[lang]

  const [slide, setSlide]               = useState(0)
  const [openFaq, setOpenFaq]           = useState(null)
  const [testCats, setTestCats]         = useState([])
  const [testCatsLoading, setTCLoading] = useState(true)
  const [team, setTeam]                 = useState([])
  const [teamLoading, setTeamLoading]   = useState(true)

  const slides = SLIDE_CONTENT[lang].map((c, i) => ({ ...SLIDE_COMMON[i], ...c }))

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  useEffect(() => {
    api.get('/public/tests')
      .then(res => setTestCats(res.data))
      .catch(() => {})
      .finally(() => setTCLoading(false))
    api.get('/public/team')
      .then(res => setTeam(res.data))
      .catch(() => {})
      .finally(() => setTeamLoading(false))
  }, [])

  const slidePrev = () => setSlide(s => (s - 1 + slides.length) % slides.length)
  const slideNext = () => setSlide(s => (s + 1) % slides.length)

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      {/* ── Hero Slider ── */}
      <section className="relative overflow-hidden h-[420px] md:h-[540px]">
        {slides.map((sl, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center transition-opacity duration-700"
            style={{
              background: '#ffffff',
              opacity: i === slide ? 1 : 0,
              pointerEvents: i === slide ? 'auto' : 'none',
            }}
          >
            <div className="absolute rounded-full" style={{ width: 420, height: 420, background: 'rgba(3,60,147,0.04)', right: -60, top: -80 }} />

            <div className="relative max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-8">
              <div className="max-w-xl flex-shrink-0">
                <div
                  className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider"
                  style={{ background: '#e8f4fd', color: '#033c93', border: '1px solid rgba(9,106,188,0.20)' }}
                >
                  <FlaskConical size={11} />
                  {s.badge}
                </div>
                <h1 className="font-bold text-4xl md:text-5xl leading-tight mb-5 whitespace-pre-line" style={{ color: '#033c93' }}>
                  {sl.headline}
                </h1>
                <p className="mb-8 text-base md:text-lg text-gray-500">
                  {sl.sub}
                </p>
                <Link to={sl.to} className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90" style={{ background: '#e63946' }}>
                  {sl.cta} <ArrowRight size={16} />
                </Link>
              </div>

              <div className="hidden md:flex flex-1 justify-end items-end self-end pointer-events-none">
                <img
                  src={sl.img}
                  alt=""
                  className="h-[340px] md:h-[420px] w-auto object-contain select-none"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.15))' }}
                />
              </div>
            </div>
          </div>
        ))}

        <button onClick={slidePrev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10" style={{ background: 'rgba(3,60,147,0.08)', color: '#033c93' }}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={slideNext} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10" style={{ background: 'rgba(3,60,147,0.08)', color: '#033c93' }}>
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === slide ? 24 : 8, height: 8, background: i === slide ? '#e63946' : 'rgba(3,60,147,0.20)' }} />
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, en, kh }) => (
            <div key={en} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff0f1' }}>
                <Icon size={22} style={{ color: '#e63946' }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#033c93' }}>{value}</div>
                <div className="text-sm text-gray-500">{lang === 'en' ? en : kh}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Package Preview ── */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow={s.pkgEyebrow} title={s.pkgTitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES_PREVIEW.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-1" style={{ background: '#e63946' }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#fff0f1' }}>
                      <pkg.icon size={24} style={{ color: '#e63946' }} />
                    </div>
                    {pkg.tag && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: '#e63946' }}>
                        {s.tagPopular}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-4" style={{ color: '#033c93' }}>{pkg[lang]}</h3>
                  <ul className="space-y-2 flex-1">
                    {pkg.tests.map(t => (
                      <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={13} style={{ color: '#e63946', flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-3">{s.pkgMore}</p>
                </div>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/packages" label={s.pkgBtn} />
        </div>
      </section>

      {/* ── Equipment Preview ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow={s.eqEyebrow} title={s.eqTitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EQUIPMENT_PREVIEW.map(eq => (
              <div key={eq.id} className="rounded-2xl p-6 text-center hover:shadow-md transition-shadow" style={{ background: '#f0f6ff' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#dceeff' }}>
                  <eq.icon size={28} style={{ color: '#096abc' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#033c93' }}>{eq.name}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{eq[lang]}</p>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/services" label={s.eqBtn} />
        </div>
      </section>

      {/* ── Test Categories Preview ── */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            eyebrow={testCatsLoading ? s.testLoading : s.testEyebrow(testCats.reduce((a, c) => a + c.tests.length, 0))}
            title={s.testTitle}
          />
          {testCatsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="animate-spin" style={{ color: '#e63946' }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {testCats.map((cat, i) => {
                const Icon  = catIcon(cat.category)
                const color = ['#e63946', '#033c93', '#096abc'][i % 3]
                return (
                  <div key={cat.category} className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#fff0f1' }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div className="font-bold text-sm mb-1 leading-snug" style={{ color: '#033c93' }}>{cat.category}</div>
                    <div className="text-xs text-gray-400">{cat.tests.length} {s.testUnit}</div>
                  </div>
                )
              })}
            </div>
          )}
          <ViewAllBtn to="/tests" label={s.testBtn} />
        </div>
      </section>

      {/* ── Team Preview ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow={s.teamEyebrow} title={s.teamTitle} />
          {teamLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="animate-spin" style={{ color: '#e63946' }} />
            </div>
          ) : team.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">{s.teamEmpty}</p>
          ) : (
            <div className={`grid grid-cols-1 gap-6 mx-auto ${
              team.slice(0,3).length === 1 ? 'max-w-xs' :
              team.slice(0,3).length === 2 ? 'md:grid-cols-2 max-w-2xl' :
              'md:grid-cols-3 max-w-4xl'
            }`}>
              {team.slice(0, 3).map(doc => (
                <div key={doc.id} className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #e63946, #033c93)' }}
                  >
                    {doc.initials}
                  </div>
                  <h3 className="font-bold mb-1" style={{ color: '#033c93' }}>{doc.name}</h3>
                  <div className="text-sm font-medium mb-0.5" style={{ color: '#e63946' }}>{doc.role}</div>
                  {doc.specialty && <div className="text-xs text-gray-400 mb-3">{doc.specialty}</div>}
                  <div className="flex justify-center gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#4cb6eb" style={{ color: '#4cb6eb' }} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <ViewAllBtn to="/about" label={s.teamBtn} />
        </div>
      </section>

      {/* ── Partners Preview ── */}
      <section className="py-16" style={{ background: '#033c93' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow={s.partnerEyebrow} title={s.partnerTitle} light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERS_PREVIEW.map(p => (
              <div key={p.name} className="rounded-2xl p-5 flex gap-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="bg-white rounded-xl w-20 h-16 flex items-center justify-center flex-shrink-0 overflow-hidden px-2">
                  <img src={p.img} alt={p.name} className="max-h-12 max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white mb-1 leading-snug">{p.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>{p[lang]}</div>
                </div>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/partners" label={s.partnerBtn} light />
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader eyebrow={s.faqEyebrow} title={s.faqTitle} />
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold transition-colors hover:bg-gray-50"
                  style={{ color: '#033c93' }}
                >
                  <span className="text-sm">{faq[lang].q}</span>
                  {openFaq === i
                    ? <ChevronUp   size={18} style={{ color: '#e63946', flexShrink: 0 }} />
                    : <ChevronDown size={18} style={{ color: '#e63946', flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{faq[lang].a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
