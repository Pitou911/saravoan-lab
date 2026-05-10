import { Phone, Mail, MapPin, Facebook } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import mapImg from '../assets/map.png'

const RED      = '#e63946'
const BLUE     = '#033c93'
const BLUE_MID = '#096abc'

const CONTACT_ITEMS = [
  {
    icon: Phone,
    label: 'Phone',
    labelKh: 'ទូរស័ព្ទ',
    lines: ['012 855 932', '016 855 932'],
    color: RED,
  },
  {
    icon: Facebook,
    label: 'Facebook',
    labelKh: 'ហ្វេសប៊ុក',
    lines: ['មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត', 'Saravoan Medical Laboratory'],
    color: '#1877f2',
  },
  {
    icon: Mail,
    label: 'Email',
    labelKh: 'អ៊ីម៉ែល',
    lines: ['info@sml.com.kh'],
    color: RED,
  },
  {
    icon: MapPin,
    label: 'Address',
    labelKh: 'អាសយដ្ឋាន',
    lines: [
      'ផ្ទះលេខ ១៣៣ ផ្លូវលេខ ១៩ សង្កាត់ជ័យជំនះ ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
      'House No. 133, Street 19, Sangkat Chey Chumneas, Khan Daun Penh, Phnom Penh',
    ],
    color: BLUE_MID,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div className="py-14" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4cb6eb' }}>
            ទំនាក់ទំនង
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            We're here to help. Reach out to us by phone, email, or visit us in person.
          </p>
        </div>
      </div>

      {/* Contact cards */}
      <section className="py-14" style={{ background: '#f0f6ff' }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {CONTACT_ITEMS.map(item => (
              <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex gap-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: item.color === '#1877f2' ? '#e7f0fd' : '#fff0f1' }}
                >
                  <item.icon size={22} style={{ color: item.color }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: item.color }}>
                    {item.label}
                  </div>
                  <div className="text-xs mb-1" style={{ color: 'rgba(0,0,0,0.35)' }}>{item.labelKh}</div>
                  {item.lines.map((line, i) => (
                    <div
                      key={i}
                      className="text-sm font-medium leading-snug break-words"
                      style={{ color: i === 0 ? BLUE : 'rgba(0,0,0,0.50)', marginTop: i > 0 ? '2px' : 0 }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-1" style={{ background: RED }} />
            <div className="p-5">
              <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: RED }}>
                Location
              </div>
              <div className="font-bold mb-4" style={{ color: BLUE }}>Find Us on the Map</div>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img
                  src={mapImg}
                  alt="Saravoan Medical Laboratory location map"
                  className="w-full object-cover"
                  style={{ maxHeight: '420px' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
