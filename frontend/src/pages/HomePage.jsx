import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Phone, Mail, MapPin, Clock, FlaskConical,
  Award, Users, Menu, X, CheckCircle, Star,
  Activity, Heart, Droplets, Zap, Sparkles,
  Microscope, TestTube2, Cpu, Scan,
} from 'lucide-react';

/* ─── Static Data ──────────────────────────────────────────── */

const NAV_LINKS = [
  { label: 'Home',        href: '#home' },
  { label: 'About Us',    href: '#about' },
  { label: 'Our Service', href: '#services' },
  { label: 'Package',     href: '#packages' },
  { label: 'Our Partner', href: '#partner' },
  { label: 'Our Test',    href: '#tests' },
  { label: 'Campaigns',   href: '#campaigns' },
  { label: 'MOH News',    href: '#news' },
];

const SLIDES = [
  {
    headline: 'Your Health is\nOur Priority',
    sub: 'Trusted medical laboratory services with fast, accurate results you can rely on.',
    cta: 'Explore Services',
    href: '#services',
    fromColor: '#033c93',
    toColor: '#096abc',
  },
  {
    headline: 'Advanced Diagnostic\nTechnology',
    sub: 'State-of-the-art equipment ensuring precise diagnostics every time.',
    cta: 'View Packages',
    href: '#packages',
    fromColor: '#096abc',
    toColor: '#4cb6eb',
  },
  {
    headline: 'Trusted by\nThousands of Patients',
    sub: '130+ laboratory tests across 26 categories — results within 24 hours.',
    cta: 'Contact Us',
    href: '#contact',
    fromColor: '#022d6e',
    toColor: '#033c93',
  },
];

const STATS = [
  { icon: Award,        value: '10+',    label: 'Years of Experience' },
  { icon: FlaskConical, value: '130+',   label: 'Tests Available' },
  { icon: Users,        value: '5,000+', label: 'Patients per Year' },
  { icon: Clock,        value: '24h',    label: 'Result Turnaround' },
];

const PACKAGES = [
  {
    id: 1,
    name: 'Basic Health Check',
    icon: Activity,
    tag: null,
    tests: ['Complete Blood Count (CBC)', 'Blood Glucose', 'Urine Analysis', 'Lipid Profile'],
  },
  {
    id: 2,
    name: 'Comprehensive Package',
    icon: FlaskConical,
    tag: 'Popular',
    tests: ['Full Blood Panel', 'Thyroid Function', 'Liver Function', 'Kidney Function', 'Electrolytes'],
  },
  {
    id: 3,
    name: 'Cardiac Profile',
    icon: Heart,
    tag: null,
    tests: ['Total Cholesterol', 'LDL / HDL', 'Triglycerides', 'CK-MB', 'Troponin'],
  },
  {
    id: 4,
    name: 'Diabetes Package',
    icon: Droplets,
    tag: null,
    tests: ['HbA1c', 'Fasting Blood Glucose', 'Insulin Level', 'C-Peptide', 'Microalbuminuria'],
  },
  {
    id: 5,
    name: 'Thyroid Package',
    icon: Zap,
    tag: null,
    tests: ['TSH Ultra Sensitive', 'Free T3 (FT3)', 'Free T4 (FT4)', 'Anti-TPO Antibodies'],
  },
  {
    id: 6,
    name: "Women's Health",
    icon: Sparkles,
    tag: 'New',
    tests: ['Pap Smear', 'FSH / LH', 'Estradiol', 'Progesterone', 'Prolactin'],
  },
];

const EQUIPMENT = [
  { id: 1, icon: Microscope, name: 'Hematology Analyzer',   desc: 'Automated 5-part differential CBC with high accuracy and throughput.' },
  { id: 2, icon: TestTube2,  name: 'Biochemistry Analyzer', desc: 'Fully automated system for metabolic and organ function panels.' },
  { id: 3, icon: Cpu,        name: 'Immunoassay Analyzer',  desc: 'Chemiluminescence technology for hormone and infectious disease testing.' },
  { id: 4, icon: Scan,       name: 'PCR Machine',           desc: 'Real-time PCR for precise molecular diagnostics and viral testing.' },
  { id: 5, icon: Droplets,   name: 'Urine Analyzer',        desc: 'Automated urinalysis with dipstick reading and sediment analysis.' },
];

const FAQS = [
  {
    q: 'How should I prepare for a blood test?',
    a: "For most blood tests, fasting 8–12 hours beforehand is recommended. Drink plenty of water, avoid strenuous exercise the night before, and bring your doctor's request form and ID.",
  },
  {
    q: 'How long does it take to receive results?',
    a: 'Most routine tests are available within 24 hours. Specialized tests such as cultures or PCR may take 2–5 business days. We notify you via phone or email when results are ready.',
  },
  {
    q: 'Do I need an appointment?',
    a: 'Walk-ins are welcome during business hours. Booking an appointment ensures faster service and reduces wait time, especially for specialized or fasting tests.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept cash (USD and KHR), ABA Bank transfer, Wing, KHQR, and other major mobile payment platforms. Corporate and insurance billing is also available upon request.',
  },
];

const DOCTORS = [
  { name: 'Dr. Sokha Chea',  role: 'Laboratory Director',  specialty: 'Clinical Chemistry',        initials: 'SC' },
  { name: 'Dr. Mony Heng',   role: 'Senior Pathologist',   specialty: 'Hematology & Microbiology', initials: 'MH' },
  { name: 'Dr. Ratana Pov',  role: 'Lab Specialist',        specialty: 'Immunology & Serology',    initials: 'RP' },
];

const CONTACT_ITEMS = [
  { icon: MapPin, label: 'Address', value: 'Street 271, Phnom Penh\nCambodia' },
  { icon: Phone,  label: 'Phone',   value: '023 123 456\n012 345 678' },
  { icon: Mail,   label: 'Email',   value: 'admin@saravoan.com' },
  { icon: Clock,  label: 'Hours',   value: 'Mon–Sat: 6:00 AM – 5:00 PM\nSun: 6:00 AM – 12:00 PM' },
];

/* ─── Component ────────────────────────────────────────────── */

export default function HomePage() {
  const [slide, setSlide]           = useState(0);
  const [openFaq, setOpenFaq]       = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const pkgRef = useRef(null);
  const eqRef  = useRef(null);

  // Hero auto-play
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slidePrev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const slideNext = () => setSlide(s => (s + 1) % SLIDES.length);
  const scrollCards = (ref, dir) => ref.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav style={{ background: '#033c93' }} className="sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#4cb6eb' }}>
              <FlaskConical size={18} className="text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-white font-bold text-base">Saravoan</div>
              <div className="text-xs font-medium tracking-wider uppercase" style={{ color: '#4cb6eb' }}>
                Medical Laboratory
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium px-3 py-2 rounded-md transition-colors"
                style={{ color: 'rgba(255,255,255,0.80)' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ background: '#096abc' }}
            >
              Doctor Login
            </Link>
            <button
              onClick={() => setMobileMenu(m => !m)}
              className="lg:hidden p-2 rounded-md text-white hover:bg-white/10"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="lg:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMobileMenu(false)}
                className="text-sm px-3 py-2 rounded-md"
                style={{ color: 'rgba(255,255,255,0.80)' }}
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="text-sm font-semibold px-4 py-2 rounded-lg text-white text-center mt-2"
              style={{ background: '#096abc' }}
            >
              Doctor Login
            </Link>
          </div>
        )}
      </nav>

      {/* ── Hero Slider ─────────────────────────────────────── */}
      <section id="home" className="relative overflow-hidden h-[420px] md:h-[540px]">
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
            <div className="absolute rounded-full" style={{ width: 260, height: 260, background: 'rgba(76,182,235,0.15)', right: 100, bottom: -60 }} />
            <div className="absolute rounded-full" style={{ width: 140, height: 140, background: 'rgba(255,255,255,0.05)', left: '55%', top: 40 }} />

            <div className="relative max-w-7xl mx-auto px-8 w-full">
              <div className="max-w-xl">
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
                <a
                  href={s.href}
                  className="inline-block text-white font-semibold px-8 py-3 rounded-xl text-sm md:text-base transition-opacity hover:opacity-90"
                  style={{ background: '#4cb6eb' }}
                >
                  {s.cta}
                </a>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={slidePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 transition-colors text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.30)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={slideNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 transition-colors text-white"
          style={{ background: 'rgba(255,255,255,0.18)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.30)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === slide ? 24 : 8, height: 8, background: i === slide ? '#4cb6eb' : 'rgba(255,255,255,0.45)' }}
            />
          ))}
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f4fd' }}>
                <Icon size={22} style={{ color: '#096abc' }} />
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: '#033c93' }}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Test Packages Slider ────────────────────────────── */}
      <section id="packages" className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#4cb6eb' }}>What We Offer</div>
              <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Our Test Packages</h2>
            </div>
            <div className="flex gap-2">
              {[ChevronLeft, ChevronRight].map((Icon, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollCards(pkgRef, idx === 0 ? -1 : 1)}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: '#096abc', color: '#096abc' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#096abc'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#096abc'; }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div ref={pkgRef} className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className="flex-shrink-0 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                style={{ width: 272, scrollSnapAlign: 'start' }}
              >
                <div className="h-1" style={{ background: '#096abc' }} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: '#e8f4fd' }}>
                      <pkg.icon size={24} style={{ color: '#096abc' }} />
                    </div>
                    {pkg.tag && (
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                        style={{ background: pkg.tag === 'Popular' ? '#096abc' : '#4cb6eb' }}
                      >
                        {pkg.tag}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-4" style={{ color: '#033c93' }}>{pkg.name}</h3>
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.tests.map(t => (
                      <li key={t} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle size={13} style={{ color: '#096abc', flexShrink: 0 }} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="w-full py-2 rounded-xl border-2 text-sm font-semibold transition-colors"
                    style={{ borderColor: '#096abc', color: '#096abc' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#096abc'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#096abc'; }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Equipment Slider ────────────────────────────────── */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#4cb6eb' }}>Our Technology</div>
              <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Laboratory Equipment</h2>
            </div>
            <div className="flex gap-2">
              {[ChevronLeft, ChevronRight].map((Icon, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollCards(eqRef, idx === 0 ? -1 : 1)}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors"
                  style={{ borderColor: '#096abc', color: '#096abc' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#096abc'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#096abc'; }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          <div ref={eqRef} className="flex gap-5 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
            {EQUIPMENT.map(eq => (
              <div
                key={eq.id}
                className="flex-shrink-0 rounded-2xl p-6 text-center transition-shadow hover:shadow-md cursor-default"
                style={{ width: 220, scrollSnapAlign: 'start', background: '#f0f6ff' }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#dceeff' }}>
                  <eq.icon size={28} style={{ color: '#096abc' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: '#033c93' }}>{eq.name}</h3>
                <p className="text-xs leading-relaxed text-gray-500">{eq.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-16" style={{ background: '#033c93' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cb6eb' }}>Common Questions</div>
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-white transition-colors hover:bg-white/5"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp   size={18} style={{ color: '#4cb6eb', flexShrink: 0 }} />
                    : <ChevronDown size={18} style={{ color: '#4cb6eb', flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet Our Team ───────────────────────────────────── */}
      <section id="about" className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#4cb6eb' }}>Our Professionals</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {DOCTORS.map(doc => (
              <div key={doc.name} className="bg-white rounded-2xl p-6 text-center shadow-sm transition-shadow hover:shadow-md">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #096abc, #033c93)' }}
                >
                  {doc.initials}
                </div>
                <h3 className="font-bold mb-1" style={{ color: '#033c93' }}>{doc.name}</h3>
                <div className="text-sm font-medium mb-0.5" style={{ color: '#096abc' }}>{doc.role}</div>
                <div className="text-xs text-gray-400 mb-3">{doc.specialty}</div>
                <div className="flex justify-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="#4cb6eb" style={{ color: '#4cb6eb' }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────── */}
      <section id="contact" className="py-16" style={{ background: '#096abc' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Visit Us Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.70)' }}>We're here to serve you with care and professionalism</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CONTACT_ITEMS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  <Icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</div>
                  <div className="text-white text-sm font-medium whitespace-pre-line">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer style={{ background: '#033c93', borderTop: '1px solid rgba(255,255,255,0.10)' }} className="py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#4cb6eb' }}>
              <FlaskConical size={18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Saravoan Medical Laboratory</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Trusted Diagnostics Since 2014</div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {NAV_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} Saravoan Lab. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
