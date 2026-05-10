import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/saravoan_logo.png'
import { useLanguage } from '../context/LanguageContext'

const NAV_LINKS = [
  { en: 'Home',        kh: 'ទំព័រដើម',           to: '/' },
  { en: 'About Us',    kh: 'អំពីយើង',             to: '/about' },
  { en: 'Our Service', kh: 'សេវាកម្ម',            to: '/services' },
  { en: 'Package',     kh: 'កញ្ចប់',              to: '/packages' },
  { en: 'Our Partner', kh: 'ដៃគូររបស់យើង',       to: '/partners' },
  { en: 'Our Test',    kh: 'តេស្តរបស់យើង',        to: '/tests' },
  { en: 'Contact Us',  kh: 'ទំនាក់ទំនង',          to: '/contact' },
]

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false)
  const { pathname } = useLocation()
  const { lang, toggle } = useLanguage()

  return (
    <nav style={{ background: '#033c93' }} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo + title */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <img src={logo} alt="Saravoan" className="h-10 w-auto object-contain" />
          <div className="hidden sm:block leading-tight">
            <div className="text-white font-bold" style={{ fontSize: '12px' }}>
              មន្ទីរពិសោធន៏វេជ្ជសាស្រ្តសារាវ័ន្ត
            </div>
            <div className="font-medium" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.65)' }}>
              Saravoan Medical Laboratory
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden xl:flex items-center gap-0.5">
          {NAV_LINKS.map(l => {
            const active = pathname === l.to
            return (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium px-2.5 py-2 rounded-md transition-colors"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.80)',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.10)' } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.color = 'rgba(255,255,255,0.80)'; e.currentTarget.style.background = 'transparent' } }}
              >
                {l[lang]}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex items-center rounded-lg overflow-hidden border text-xs font-bold flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.25)' }}
          >
            <span className="px-2.5 py-1.5 transition-colors" style={{ background: lang === 'en' ? 'rgba(255,255,255,0.20)' : 'transparent', color: lang === 'en' ? '#fff' : 'rgba(255,255,255,0.45)' }}>
              EN
            </span>
            <span className="px-2.5 py-1.5 transition-colors" style={{ background: lang === 'kh' ? 'rgba(255,255,255,0.20)' : 'transparent', color: lang === 'kh' ? '#fff' : 'rgba(255,255,255,0.45)' }}>
              KH
            </span>
          </button>

          <Link
            to="/login"
            className="hidden sm:inline-flex items-center text-sm font-semibold px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: '#e63946' }}
          >
            {lang === 'en' ? 'Doctor Login' : 'ចូលសម្រាប់គ្រូពេទ្យ'}
          </Link>

          <button
            onClick={() => setMobileMenu(m => !m)}
            className="xl:hidden p-2 rounded-md text-white hover:bg-white/10"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="xl:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
          {NAV_LINKS.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMobileMenu(false)}
              className="text-sm px-3 py-2 rounded-md"
              style={{ color: 'rgba(255,255,255,0.80)' }}
            >
              {l[lang]}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileMenu(false)}
            className="text-sm font-semibold px-4 py-2 rounded-lg text-white text-center mt-2"
            style={{ background: '#e63946' }}
          >
            {lang === 'en' ? 'Doctor Login' : 'ចូលសម្រាប់គ្រូពេទ្យ'}
          </Link>
        </div>
      )}
    </nav>
  )
}
