import { Link2, Globe, Heart, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import partner1  from '../assets/partner1.png'
import partner2  from '../assets/partner2.jpg'
import partner3  from '../assets/partner3.png'
import partner4  from '../assets/partner4.png'
import partner5  from '../assets/partner5.jpg'
import partner6  from '../assets/partner6.png'
import partner7  from '../assets/partner7.jpg'
import partner8  from '../assets/partner8.jpg'
import partner9  from '../assets/partner9.png'
import partner10 from '../assets/partner10.jpg'
import partner11 from '../assets/partner11.jpg'
import partner12 from '../assets/partner12.png'

const PARTNERS = [
  { id: 1,  img: partner1,  name: 'Davyda Clinic',                    type: 'Clinic',     desc: 'Clinical partner providing patient referrals and integrated diagnostic services.' },
  { id: 2,  img: partner2,  name: 'Preah Ang Duong Hospital',          type: 'Hospital',   desc: 'Government hospital partnership supporting national healthcare and diagnostic quality.' },
  { id: 3,  img: partner3,  name: 'Preah Ket Melea Hospital',          type: 'Hospital',   desc: 'Long-standing hospital partnership for shared patient care and diagnostic reporting.' },
  { id: 4,  img: partner4,  name: 'Sing-Specialist Medical Centre',    type: 'Specialist', desc: 'Specialist centre collaboration for advanced diagnostics and clinical referrals.' },
  { id: 5,  img: partner5,  name: 'Soriya Hospital',                   type: 'Hospital',   desc: 'Preferred laboratory partner for patient referrals and integrated diagnostic services.' },
  { id: 6,  img: partner6,  name: 'Wellness Center',                   type: 'Wellness',   desc: 'Health and wellness partnership promoting preventive diagnostics and patient care.' },
  { id: 7,  img: partner7,  name: 'Lem Dara Clinic',                   type: 'Clinic',     desc: 'Clinical partnership for comprehensive diagnostic services and patient referrals.' },
  { id: 8,  img: partner8,  name: 'Boramey Clinic',                    type: 'Clinic',     desc: 'Trusted clinical partner for routine and specialized laboratory testing.' },
  { id: 9,  img: partner9,  name: 'Phnom Penh Skin Clinic',            type: 'Specialist', desc: 'Specialist dermatology clinic partner for skin condition diagnostic support.' },
  { id: 10, img: partner10, name: 'Nesa Clinic & Maternity',           type: 'Maternity',  desc: 'Maternity and clinical partner for prenatal and neonatal diagnostic services.' },
  { id: 11, img: partner11, name: 'Miyora Clinic',                     type: 'Clinic',     desc: 'Clinical collaboration for routine laboratory testing and comprehensive patient care.' },
  { id: 12, img: partner12, name: 'Sing Rithireth Maternity Clinic',   type: 'Maternity',  desc: 'Maternity clinic partner specializing in maternal and newborn screening services.' },
]

const PARTNER_BENEFITS = [
  { icon: Link2,  title: 'Seamless Referrals',   desc: 'Integrated workflows for fast patient referrals and result sharing between facilities.' },
  { icon: Globe,  title: 'Global Standards',      desc: 'Our partnerships ensure alignment with WHO and international diagnostic guidelines.' },
  { icon: Heart,  title: 'Patient First',         desc: 'All partner agreements are built around improving patient outcomes and access.' },
  { icon: Shield, title: 'Data Security',         desc: 'Secure, compliant data exchange with all partner institutions and facilities.' },
]

const TYPE_COLORS = {
  Hospital:   '#033c93',
  Clinic:     '#096abc',
  Specialist: '#e63946',
  Maternity:  '#096abc',
  Wellness:   '#033c93',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4cb6eb' }}>Trusted Collaborations</div>
          <h1 className="text-4xl font-bold text-white mb-4">Our Partners</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            We collaborate with leading healthcare institutions, government bodies, and international organizations to deliver the best diagnostic care.
          </p>
        </div>
      </div>

      {/* Why Partner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PARTNER_BENEFITS.map(b => (
              <div key={b.title} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#fff0f1' }}>
                  <b.icon size={22} style={{ color: '#e63946' }} />
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: '#033c93' }}>{b.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Grid */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>Our Network</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Institutional Partners</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNERS.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="h-1" style={{ background: TYPE_COLORS[p.type] ?? '#e63946' }} />
                <div className="p-5 flex flex-col flex-1">
                  <div className="h-16 flex items-center justify-center mb-4 overflow-hidden px-2">
                    <img src={p.img} alt={p.name} className="max-h-14 max-w-full object-contain" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider mb-1 text-center" style={{ color: TYPE_COLORS[p.type] ?? '#e63946' }}>{p.type}</div>
                  <div className="font-bold text-sm leading-snug text-center mb-3" style={{ color: '#033c93' }}>{p.name}</div>
                  <p className="text-xs text-gray-500 leading-relaxed text-center flex-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: '#033c93' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Become a Partner</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.70)' }}>
            We welcome collaborations with hospitals, clinics, research institutions, and healthcare organizations
            committed to improving diagnostic quality in Cambodia.
          </p>
          <a
            href="mailto:admin@saravoan.com"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ background: '#e63946' }}
          >
            Contact Us to Partner
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
