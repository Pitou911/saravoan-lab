import { Link2, Globe, Heart, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'
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
  { id: 1,  img: partner1,  name: 'Davyda Clinic',                  type: { en: 'Clinic',     kh: 'គ្លីនិក' },     desc: { en: 'Clinical partner providing patient referrals and integrated diagnostic services.',                                       kh: 'ដៃគូគ្លីនិកសម្រាប់បញ្ជូនអ្នកជំងឺ និងផ្ដល់សេវាវិនិច្ឆ័យរួមបញ្ចូលគ្នា។' } },
  { id: 2,  img: partner2,  name: 'Preah Ang Duong Hospital',        type: { en: 'Hospital',   kh: 'មន្ទីរពេទ្យ' }, desc: { en: 'Government hospital partnership supporting national healthcare and diagnostic quality.',                                   kh: 'ភាពជាដៃគូមន្ទីរពេទ្យរដ្ឋ គាំទ្រការថែទាំសុខភាពជាតិ និងគុណភាពការវិនិច្ឆ័យ។' } },
  { id: 3,  img: partner3,  name: 'Preah Ket Melea Hospital',        type: { en: 'Hospital',   kh: 'មន្ទីរពេទ្យ' }, desc: { en: 'Long-standing hospital partnership for shared patient care and diagnostic reporting.',                                     kh: 'ភាពជាដៃគូមន្ទីរពេទ្យដ៏យូរអង្វែង សម្រាប់ការចែករំលែកការថែទាំអ្នកជំងឺ និងរបាយការណ៍វិនិច្ឆ័យ។' } },
  { id: 4,  img: partner4,  name: 'Sing-Specialist Medical Centre',  type: { en: 'Specialist', kh: 'ឯកទេស' },       desc: { en: 'Specialist centre collaboration for advanced diagnostics and clinical referrals.',                                         kh: 'ការសហការជាមួយមជ្ឈមណ្ឌលឯកទេស សម្រាប់ការវិនិច្ឆ័យកម្រិតខ្ពស់ និងការបញ្ជូនគ្លីនិក។' } },
  { id: 5,  img: partner5,  name: 'Soriya Hospital',                 type: { en: 'Hospital',   kh: 'មន្ទីរពេទ្យ' }, desc: { en: 'Preferred laboratory partner for patient referrals and integrated diagnostic services.',                                  kh: 'ដៃគូមន្ទីរពិសោធន៍ដែលពេញចិត្ត សម្រាប់ការបញ្ជូនអ្នកជំងឺ និងសេវាវិនិច្ឆ័យរួម។' } },
  { id: 6,  img: partner6,  name: 'Wellness Center',                 type: { en: 'Wellness',   kh: 'សុខភាព' },      desc: { en: 'Health and wellness partnership promoting preventive diagnostics and patient care.',                                      kh: 'ភាពជាដៃគូសុខភាព លើកកម្ពស់ការវិនិច្ឆ័យបង្ការ និងការថែទាំអ្នកជំងឺ។' } },
  { id: 7,  img: partner7,  name: 'Lem Dara Clinic',                 type: { en: 'Clinic',     kh: 'គ្លីនិក' },     desc: { en: 'Clinical partnership for comprehensive diagnostic services and patient referrals.',                                       kh: 'ភាពជាដៃគូគ្លីនិក សម្រាប់សេវាវិនិច្ឆ័យទូលំទូលាយ និងការបញ្ជូនអ្នកជំងឺ។' } },
  { id: 8,  img: partner8,  name: 'Boramey Clinic',                  type: { en: 'Clinic',     kh: 'គ្លីនិក' },     desc: { en: 'Trusted clinical partner for routine and specialized laboratory testing.',                                              kh: 'ដៃគូគ្លីនិកដែលអាចទុកចិត្តបាន សម្រាប់ការតេស្តមន្ទីរពិសោធន៍ធម្មតា និងឯកទេស។' } },
  { id: 9,  img: partner9,  name: 'Phnom Penh Skin Clinic',          type: { en: 'Specialist', kh: 'ឯកទេស' },       desc: { en: 'Specialist dermatology clinic partner for skin condition diagnostic support.',                                           kh: 'ដៃគូគ្លីនិកឯកទេសស្បែក សម្រាប់ការគាំទ្រការវិនិច្ឆ័យជំងឺស្បែក។' } },
  { id: 10, img: partner10, name: 'Nesa Clinic & Maternity',         type: { en: 'Maternity',  kh: 'ម្តាយ​និងទារក' }, desc: { en: 'Maternity and clinical partner for prenatal and neonatal diagnostic services.',                                           kh: 'ដៃគូម្តាយ និងគ្លីនិក សម្រាប់សេវាវិនិច្ឆ័យពេលមានផ្ទៃពោះ និងទារក។' } },
  { id: 11, img: partner11, name: 'Miyora Clinic',                   type: { en: 'Clinic',     kh: 'គ្លីនិក' },     desc: { en: 'Clinical collaboration for routine laboratory testing and comprehensive patient care.',                                  kh: 'ការសហការគ្លីនិក សម្រាប់ការតេស្តមន្ទីរពិសោធន៍ធម្មតា និងការថែទាំអ្នកជំងឺទូលំទូលាយ។' } },
  { id: 12, img: partner12, name: 'Sing Rithireth Maternity Clinic', type: { en: 'Maternity',  kh: 'ម្តាយ​និងទារក' }, desc: { en: 'Maternity clinic partner specializing in maternal and newborn screening services.',                                       kh: 'ដៃគូគ្លីនិកម្តាយ ឯកទេសលើសេវាស្ទង់ម្តាយ និងទារក។' } },
]

const PARTNER_BENEFITS = {
  en: [
    { icon: Link2,  title: 'Seamless Referrals', desc: 'Integrated workflows for fast patient referrals and result sharing between facilities.' },
    { icon: Globe,  title: 'Global Standards',   desc: 'Our partnerships ensure alignment with WHO and international diagnostic guidelines.' },
    { icon: Heart,  title: 'Patient First',      desc: 'All partner agreements are built around improving patient outcomes and access.' },
    { icon: Shield, title: 'Data Security',      desc: 'Secure, compliant data exchange with all partner institutions and facilities.' },
  ],
  kh: [
    { icon: Link2,  title: 'ការបញ្ជូនអ្នកជំងឺរលូន', desc: 'ប្រព័ន្ធការងាររួម សម្រាប់ការបញ្ជូនអ្នកជំងឺ និងការចែករំលែកលទ្ធផលទាន់ពេល។' },
    { icon: Globe,  title: 'ស្តង់ដារសាកល',           desc: 'ភាពជាដៃគូរបស់យើងធានានូវការស្របតាម WHO និងការណែនាំវិនិច្ឆ័យអន្តរជាតិ។' },
    { icon: Heart,  title: 'អ្នកជំងឺជាអាទិភាព',     desc: 'រាល់កិច្ចព្រមព្រៀងដៃគូ ត្រូវបានបង្កើតឡើងដើម្បីបង្កើនសុខភាព និងលទ្ធភាពចូលដំណើរការសម្រាប់អ្នកជំងឺ។' },
    { icon: Shield, title: 'សុវត្ថិភាពទិន្នន័យ',     desc: 'ការផ្លាស់ប្តូរទិន្នន័យដែលមានសុវត្ថិភាព ស្របច្បាប់ ជាមួយស្ថាប័ន និងមូលដ្ឋានដៃគូទាំងអស់។' },
  ],
}

const TYPE_COLORS = { Hospital: '#033c93', Clinic: '#096abc', Specialist: '#e63946', Maternity: '#096abc', Wellness: '#033c93' }

const T = {
  en: {
    heroEyebrow: 'Trusted Collaborations',
    heroTitle: 'Our Partners',
    heroDesc: 'We collaborate with leading healthcare institutions, government bodies, and international organizations to deliver the best diagnostic care.',
    networkEyebrow: 'Our Network',
    networkTitle: 'Institutional Partners',
    ctaTitle: 'Become a Partner',
    ctaDesc: 'We welcome collaborations with hospitals, clinics, research institutions, and healthcare organizations committed to improving diagnostic quality in Cambodia.',
    ctaBtn: 'Contact Us to Partner',
  },
  kh: {
    heroEyebrow: 'ការសហការដ៏ទុកចិត្ត',
    heroTitle: 'ដៃគូររបស់យើង',
    heroDesc: 'យើងសហការជាមួយស្ថាប័នថែទាំសុខភាពឈានមុខ ស្ថាប័នរដ្ឋ និងអង្គការអន្តរជាតិ ដើម្បីផ្ដល់ការថែទាំការវិនិច្ឆ័យដ៏ល្អបំផុត។',
    networkEyebrow: 'បណ្តាញរបស់យើង',
    networkTitle: 'ដៃគូស្ថាប័ន',
    ctaTitle: 'ក្លាយជាដៃគូ',
    ctaDesc: 'យើងស្វាគមន៍ការសហការជាមួយមន្ទីរពេទ្យ គ្លីនិក ស្ថាប័នស្រាវជ្រាវ និងអង្គការថែទាំសុខភាព ដែលប្ដេជ្ញាចិត្តក្នុងការប្រសើរឡើងគុណភាពការវិនិច្ឆ័យនៅប្រទេសកម្ពុជា។',
    ctaBtn: 'ទំនាក់ទំនងយើងដើម្បីក្លាយជាដៃគូ',
  },
}

export default function PartnersPage() {
  const { lang } = useLanguage()
  const s = T[lang]
  const benefits = PARTNER_BENEFITS[lang]

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4cb6eb' }}>{s.heroEyebrow}</div>
          <h1 className="text-4xl font-bold text-white mb-4">{s.heroTitle}</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>{s.heroDesc}</p>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map(b => (
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
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>{s.networkEyebrow}</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>{s.networkTitle}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNERS.map(p => {
              const typeColor = TYPE_COLORS[p.type.en] ?? '#e63946'
              return (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                  <div className="h-1" style={{ background: typeColor }} />
                  <div className="p-5 flex flex-col flex-1">
                    <div className="h-16 flex items-center justify-center mb-4 overflow-hidden px-2">
                      <img src={p.img} alt={p.name} className="max-h-14 max-w-full object-contain" />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider mb-1 text-center" style={{ color: typeColor }}>{p.type[lang]}</div>
                    <div className="font-bold text-sm leading-snug text-center mb-3" style={{ color: '#033c93' }}>{p.name}</div>
                    <p className="text-xs text-gray-500 leading-relaxed text-center flex-1">{p.desc[lang]}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: '#033c93' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{s.ctaTitle}</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.70)' }}>{s.ctaDesc}</p>
          <a
            href="mailto:admin@saravoan.com"
            className="inline-block text-white font-semibold px-8 py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
            style={{ background: '#e63946' }}
          >
            {s.ctaBtn}
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
