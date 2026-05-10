import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook } from 'lucide-react'
import logo from '../assets/saravoan_logo.png'

const NAV_LINKS = [
  { label: 'Home',        to: '/' },
  { label: 'About Us',    to: '/about' },
  { label: 'Our Service', to: '/services' },
  { label: 'Package',     to: '/packages' },
  { label: 'Our Partner', to: '/partners' },
  { label: 'Our Test',    to: '/tests' },
  { label: 'Contact Us',  to: '/contact' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#033c93', borderTop: '3px solid #e63946' }}>
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Saravoan" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Saravoan Medical Laboratory provides trusted diagnostic services in Cambodia with
              precision, speed, and care.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4cb6eb' }}>Quick Links</div>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="text-sm transition-colors w-fit"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4cb6eb' }}>Contact</div>
            <div className="flex flex-col gap-3">
              {[
                { icon: MapPin,    text: 'House No. 133, Street 19, Sangkat Chey Chumneas, Khan Daun Penh, Phnom Penh' },
                { icon: Phone,     text: '012 855 932 / 016 855 932' },
                { icon: Mail,      text: 'info@sml.com.kh' },
                { icon: Facebook,  text: 'Saravoan Medical Laboratory' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2">
                  <Icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#4cb6eb' }} />
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="border-t pt-6 text-center text-xs" style={{ borderColor: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.35)' }}>
          © {new Date().getFullYear()} Saravoan Medical Laboratory. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
