import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook } from 'lucide-react'
import logo from '../assets/saravoan_logo.png'
import { useLanguage } from '../context/LanguageContext'

const NAV_LINKS = [
  { en: 'Home',        kh: 'ទំព័រដើម',      to: '/' },
  { en: 'About Us',    kh: 'អំពីយើង',        to: '/about' },
  { en: 'Our Service', kh: 'សេវាកម្ម',       to: '/services' },
  { en: 'Package',     kh: 'កញ្ចប់',         to: '/packages' },
  { en: 'Our Partner', kh: 'ដៃគូររបស់យើង',  to: '/partners' },
  { en: 'Our Test',    kh: 'តេស្តរបស់យើង',   to: '/tests' },
  { en: 'Contact Us',  kh: 'ទំនាក់ទំនង',     to: '/contact' },
]

const T = {
  en: {
    desc: 'Saravoan Medical Laboratory provides trusted diagnostic services in Cambodia with precision, speed, and care.',
    quickLinks: 'Quick Links',
    contact: 'Contact',
    rights: `© ${new Date().getFullYear()} Saravoan Medical Laboratory. All rights reserved.`,
  },
  kh: {
    desc: 'មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត ផ្តល់សេវារោគវិនិច្ឆ័យដែលអាចទុកចិត្តបាននៅកម្ពុជា ដោយភាពត្រឹមត្រូវ ល្បឿន និងការយកចិត្តទុកដាក់។',
    quickLinks: 'តំណភ្ជាប់រហ័ស',
    contact: 'ទំនាក់ទំនង',
    rights: `© ${new Date().getFullYear()} មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត។ រក្សាសិទ្ធិគ្រប់យ៉ាង។`,
  },
}

const CONTACT_ITEMS = [
  { icon: MapPin,   en: 'House No. 133, Street 19, Sangkat Chey Chumneas, Khan Daun Penh, Phnom Penh', kh: 'ផ្ទះលេខ ១៣៣ ផ្លូវលេខ ១៩ សង្កាត់ជ័យជំនះ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ' },
  { icon: Phone,    en: '012 855 932 / 016 855 932',       kh: '012 855 932 / 016 855 932' },
  { icon: Mail,     en: 'info@sml.com.kh',                 kh: 'info@sml.com.kh' },
  { icon: Facebook, en: 'Saravoan Medical Laboratory',     kh: 'មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត' },
]

export default function Footer() {
  const { lang } = useLanguage()
  const s = T[lang]

  return (
    <footer style={{ background: '#033c93', borderTop: '3px solid #e63946' }}>
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Saravoan" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {s.desc}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4cb6eb' }}>{s.quickLinks}</div>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm transition-colors w-fit"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {l[lang]}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4cb6eb' }}>{s.contact}</div>
            <div className="flex flex-col gap-3">
              {CONTACT_ITEMS.map(({ icon: Icon, en, kh }) => (
                <div key={en} className="flex items-start gap-2">
                  <Icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#4cb6eb' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{lang === 'en' ? en : kh}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t pt-6 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.35)' }}>
          {s.rights}
        </div>
      </div>
    </footer>
  )
}
