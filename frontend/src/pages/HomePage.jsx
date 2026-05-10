import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  FlaskConical, Clock,
  Award, Users, CheckCircle, Star, ArrowRight, Loader2,
  Activity, Heart, Droplets, Zap, Sparkles,
  Microscope, TestTube2, Cpu, Scan, Image as ImageIcon,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import slideImg1 from '../assets/1.png'
import slideImg2 from '../assets/2.png'
import slideImg3 from '../assets/3.png'
import partner1  from '../assets/partner1.png'
import partner2  from '../assets/partner2.jpg'
import partner3  from '../assets/partner3.png'
import partner4  from '../assets/partner4.png'
import partner5  from '../assets/partner5.jpg'
import partner6  from '../assets/partner6.png'

const SLIDES = [
  {
    headline: 'Your Health is\nOur Priority',
    sub: 'Trusted medical laboratory services with fast, accurate results you can rely on.',
    cta: 'Explore Services',
    to: '/services',
    fromColor: '#033c93',
    toColor: '#096abc',
    img: slideImg1,
  },
  {
    headline: 'Advanced Diagnostic\nTechnology',
    sub: 'State-of-the-art equipment ensuring precise diagnostics every time.',
    cta: 'View Packages',
    to: '/packages',
    fromColor: '#096abc',
    toColor: '#4cb6eb',
    img: slideImg2,
  },
  {
    headline: 'Trusted by\nThousands of Patients',
    sub: '130+ laboratory tests across 26 categories — results within 24 hours.',
    cta: 'Contact Us',
    to: '/contact',
    fromColor: '#022d6e',
    toColor: '#033c93',
    img: slideImg3,
  },
]

const STATS = [
  { icon: Award,        value: '10+',    label: 'Years of Experience' },
  { icon: FlaskConical, value: '130+',   label: 'Tests Available' },
  { icon: Users,        value: '5,000+', label: 'Patients per Year' },
  { icon: Clock,        value: '24h',    label: 'Result Turnaround' },
]

const PACKAGES_PREVIEW = [
  { id: 1, icon: Activity,    name: 'Basic Health Check',     tag: null,      tests: ['Complete Blood Count (CBC)', 'Blood Glucose', 'Urine Analysis'] },
  { id: 2, icon: FlaskConical,name: 'Comprehensive Package',  tag: 'Popular', tests: ['Full Blood Panel', 'Thyroid Function', 'Liver Function'] },
  { id: 3, icon: Heart,       name: 'Cardiac Profile',        tag: null,      tests: ['Total Cholesterol', 'LDL / HDL', 'Troponin'] },
]

const EQUIPMENT_PREVIEW = [
  { id: 1, icon: Activity,   name: 'Sysmex KX-21',          desc: 'Blood cell analyzer — 60 tests/hour, CBC with 3-part WBC differential.' },
  { id: 2, icon: TestTube2,  name: 'BA200 Biochemistry',    desc: 'Biochemistry analyzer — 200 tests/hour for metabolic & organ function panels.' },
  { id: 3, icon: Cpu,        name: 'Cobas e411',            desc: 'Immunology & serology analyzer — 86 tests/hour for hormones & tumor markers.' },
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
  { img: partner1,  name: 'Davyda Clinic',                  desc: 'Clinical partner providing patient referrals and integrated diagnostic services.' },
  { img: partner2,  name: 'Preah Ang Duong Hospital',       desc: 'Government hospital partnership supporting national healthcare and diagnostic quality.' },
  { img: partner3,  name: 'Preah Ket Melea Hospital',       desc: 'Long-standing hospital partnership for shared patient care and diagnostic reporting.' },
  { img: partner4,  name: 'Sing-Specialist Medical Centre', desc: 'Specialist centre collaboration for advanced diagnostics and clinical referrals.' },
  { img: partner5,  name: 'Soriya Hospital',                desc: 'Preferred laboratory partner for patient referrals and integrated diagnostic services.' },
  { img: partner6,  name: 'Wellness Center',                desc: 'Health and wellness partnership promoting preventive diagnostics and patient care.' },
]

const FAQS = [
  {
    q: 'How should I prepare for a blood test?',
    a: "For most blood tests, fasting 8–12 hours beforehand is recommended. Drink plenty of water and avoid strenuous exercise the night before.",
  },
  {
    q: 'How long does it take to receive results?',
    a: 'Most routine tests are available within 24 hours. Specialized tests such as cultures or PCR may take 2–5 business days.',
  },
]


function SectionHeader({ eyebrow, title, light = false, accent = false }) {
  const eyebrowColor = '#e63946'
  return (
    <div className="text-center mb-10">
      <div className="text-xs font-bold uppercase tracking-widest mb-2"
        style={{ color: light ? '#4cb6eb' : eyebrowColor }}>{eyebrow}</div>
      <h2 className="text-3xl font-bold" style={{ color: light ? '#fff' : '#033c93' }}>{title}</h2>
    </div>
  )
}

function ViewAllBtn({ to, label = 'View All', light = false, red = false }) {
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

export default function HomePage() {
  const [slide, setSlide]                       = useState(0)
  const [openFaq, setOpenFaq]                   = useState(null)
  const [testCats, setTestCats]                 = useState([])
  const [testCatsLoading, setTestCatsLoading]   = useState(true)
  const [team, setTeam]                         = useState([])
  const [teamLoading, setTeamLoading]           = useState(true)

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    api.get('/public/tests')
      .then(res => setTestCats(res.data))
      .catch(() => {})
      .finally(() => setTestCatsLoading(false))
    api.get('/public/team')
      .then(res => setTeam(res.data))
      .catch(() => {})
      .finally(() => setTeamLoading(false))
  }, [])

  const slidePrev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)
  const slideNext = () => setSlide(s => (s + 1) % SLIDES.length)

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      {/* ── Hero Slider ─────────────────────────────────────── */}
      <section className="relative overflow-hidden h-[420px] md:h-[540px]">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className="absolute inset-0 flex items-center transition-opacity duration-700"
            style={{
              background: `linear-gradient(135deg, ${s.fromColor} 0%, ${s.toColor} 100%)`,
              opacity: i === slide ? 1 : 0,
              pointerEvents: i === slide ? 'auto' : 'none',
            }}
          >
            <div className="absolute rounded-full" style={{ width: 420, height: 420, background: 'rgba(255,255,255,0.06)', right: -60, top: -80 }} />

            <div className="relative max-w-7xl mx-auto px-8 w-full flex items-center justify-between gap-8">
              {/* Text */}
              <div className="max-w-xl flex-shrink-0">
                <div
                  className="inline-flex items-center gap-2 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider"
                  style={{ background: 'rgba(76,182,235,0.35)', border: '1px solid rgba(76,182,235,0.50)' }}
                >
                  <FlaskConical size={11} />
                  Saravoan Medical Laboratory
                </div>
                <h1 className="text-white font-bold text-4xl md:text-5xl leading-tight mb-5 whitespace-pre-line">
                  {s.headline}
                </h1>
                <p className="mb-8 text-base md:text-lg" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {s.sub}
                </p>
                <Link to={s.to} className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90" style={{ background: '#e63946' }}>
                  {s.cta} <ArrowRight size={16} />
                </Link>
              </div>

              {/* Floating image */}
              <div className="hidden md:flex flex-1 justify-end items-end self-end pointer-events-none">
                <img
                  src={s.img}
                  alt=""
                  className="h-[340px] md:h-[420px] w-auto object-contain select-none"
                  style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.30))' }}
                />
              </div>
            </div>
          </div>
        ))}

        <button onClick={slidePrev} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={slideNext} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 text-white" style={{ background: 'rgba(255,255,255,0.18)' }}>
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className="rounded-full transition-all duration-300"
              style={{ width: i === slide ? 24 : 8, height: 8, background: i === slide ? '#4cb6eb' : 'rgba(255,255,255,0.45)' }} />
          ))}
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff0f1' }}>
                <Icon size={22} style={{ color: '#e63946' }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#033c93' }}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Package Preview ─────────────────────────────────── */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="What We Offer" title="Our Test Packages" />
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
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-4" style={{ color: '#033c93' }}>{pkg.name}</h3>
                  <ul className="space-y-2 flex-1">
                    {pkg.tests.map(t => (
                      <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={13} style={{ color: '#e63946', flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-400 mt-3">+ more tests included</p>
                </div>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/packages" label="View All Packages" />
        </div>
      </section>

      {/* ── Service Preview ─────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Our Technology" title="Laboratory Equipment" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EQUIPMENT_PREVIEW.map(eq => (
              <div key={eq.id} className="rounded-2xl p-6 text-center hover:shadow-md transition-shadow" style={{ background: '#f0f6ff' }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#dceeff' }}>
                  <eq.icon size={28} style={{ color: '#096abc' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#033c93' }}>{eq.name}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{eq.desc}</p>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/services" label="View All Services" />
        </div>
      </section>

      {/* ── Our Test Preview ────────────────────────────────── */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader
            eyebrow={testCatsLoading ? 'Loading…' : `${testCats.reduce((s, c) => s + c.tests.length, 0)}+ Tests Available`}
            title="Our Test Categories"
          />
          {testCatsLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="animate-spin" style={{ color: '#096abc' }} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {testCats.map((cat, i) => {
                const Icon  = catIcon(cat.category)
                const color = ['#e63946','#033c93','#096abc'][i % 3]
                return (
                  <div key={cat.category} className="bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#e8f4fd' }}>
                      <Icon size={22} style={{ color }} />
                    </div>
                    <div className="font-bold text-sm mb-1 leading-snug" style={{ color: '#033c93' }}>{cat.category}</div>
                    <div className="text-xs text-gray-400">{cat.tests.length} tests</div>
                  </div>
                )
              })}
            </div>
          )}
          <ViewAllBtn to="/tests" label="View All Tests" />
        </div>
      </section>

      {/* ── Team Preview ────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Our Professionals" title="Meet Our Team" />

          {teamLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="animate-spin" style={{ color: '#096abc' }} />
            </div>
          ) : team.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-8">Our team will be introduced soon.</p>
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

          <ViewAllBtn to="/about" label="View Full Team" />
        </div>
      </section>

      {/* ── Partners Preview ────────────────────────────────── */}
      <section className="py-16" style={{ background: '#033c93' }}>
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeader eyebrow="Trusted Collaborations" title="Our Partners" light />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERS_PREVIEW.map(p => (
              <div key={p.name} className="rounded-2xl p-5 flex gap-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <div className="bg-white rounded-xl w-20 h-16 flex items-center justify-center flex-shrink-0 overflow-hidden px-2">
                  <img src={p.img} alt={p.name} className="max-h-12 max-w-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-white mb-1 leading-snug">{p.name}</div>
                  <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.60)' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <ViewAllBtn to="/partners" label="View All Partners" light />
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHeader eyebrow="Common Questions" title="Frequently Asked Questions" />
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold transition-colors hover:bg-gray-50"
                  style={{ color: '#033c93' }}
                >
                  <span className="text-sm">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp   size={18} style={{ color: '#e63946', flexShrink: 0 }} />
                    : <ChevronDown size={18} style={{ color: '#e63946', flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed text-gray-500">{faq.a}</div>
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
