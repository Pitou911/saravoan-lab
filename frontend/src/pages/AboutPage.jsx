import { useState, useEffect } from 'react'
import { Target, Eye, Microscope, ArrowRight, Star, Users, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'
import { useLanguage } from '../context/LanguageContext'

const RED        = '#e63946'
const BLUE       = '#033c93'
const BLUE_MID   = '#096abc'
const BLUE_LIGHT = '#4cb6eb'

const EQUIPMENT_BRIEF = [
  { name: 'Sysmex KX-21',    spec: 'Hematology — 60 tests/hr' },
  { name: 'BA200',           spec: 'Biochemistry — 200 tests/hr' },
  { name: 'Cobas e411',      spec: 'Immunology & Serology — 86 tests/hr' },
  { name: 'Arkray HA-8380V', spec: 'HbA1c HPLC — 160 sec/sample' },
  { name: 'NS 200',          spec: 'Newborn Screening — 80 tests/batch' },
  { name: 'PCR Analyzer',    spec: 'HBV / HCV / HIV / HPV Viral Load' },
  { name: 'Easylyte',        spec: 'Electrolytes Na⁺ K⁺ Cl⁻ — 90 sec/test' },
]

const T = {
  en: {
    heroEyebrow: 'About Us',
    heroTitle: 'About Us',
    heroDesc: 'Learn about Saravoan Medical Laboratory — our history, mission, vision, and team.',
    historyTitle: 'Laboratory History',
    historyEyebrow: 'ប្រវត្តិមន្ទីរពិសោធន៍',
    foundedBadge: 'Founded 2012',
    foundedBy: 'by Dr. Lim Pich',
    historyQuote: '"មន្ទីរពីសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត ត្រូវបានបង្កើតឡើងដោយ វេជ្ជបណ្ឌិត លឹម ពេជ្រ នៅឆ្នាំ ២០១២ ដើម្បីលើកកម្ពស់សេវា វិនិច្ឆ័យវេជ្ជសាស្ត្រ នៅប្រទេសកម្ពុជា"',
    missionTitle: 'Mission & Vision',
    missionEyebrow: 'បេសកកម្ម និងចក្ខុវិស័យ',
    missionLabel: 'Mission',
    missionSub: 'បេសកកម្ម',
    missionText: 'We strive to provide accurate, timely, and reliable laboratory services by utilizing modern equipment and advanced technology — supported by a highly skilled team of professionals — ensuring every result meets the highest standard of precision.',
    visionLabel: 'Vision',
    visionSub: 'ចក្ខុវិស័យ',
    visionText: 'To become a laboratory recognized for quality, precision, and trustworthiness in providing medical laboratory services to the public, guided by professional ethics and international standards.',
    techTitle: 'Technology & Equipment',
    techEyebrow: 'បច្ចេកទេស និងសម្ភារៈ',
    techDesc: 'Our laboratory is equipped with 7 state-of-the-art instruments from globally recognized manufacturers, ensuring fast, precise, and reliable diagnostic results.',
    viewEquipment: 'View All Equipment',
    teamTitle: 'Meet Our Team',
    teamEyebrow: 'អំពីធន់ធានមនុស្ស',
    teamEmpty: 'No team members have been added yet.',
  },
  kh: {
    heroEyebrow: 'អំពីពួកយើង',
    heroTitle: 'អំពីយើង',
    heroDesc: 'ស្វែងយល់អំពីមន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត — ប្រវត្តិ បេសកកម្ម ចក្ខុវិស័យ និងក្រុមការងាររបស់យើង។',
    historyTitle: 'ប្រវត្តិមន្ទីរពិសោធន៍',
    historyEyebrow: 'Laboratory History',
    foundedBadge: 'បង្កើតឆ្នាំ ២០១២',
    foundedBy: 'ដោយ វេជ្ជបណ្ឌិត លឹម ពេជ្រ',
    historyQuote: '"មន្ទីរពីសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត ត្រូវបានបង្កើតឡើងដោយ វេជ្ជបណ្ឌិត លឹម ពេជ្រ នៅឆ្នាំ ២០១២ ដើម្បីលើកកម្ពស់សេវា វិនិច្ឆ័យវេជ្ជសាស្ត្រ នៅប្រទេសកម្ពុជា"',
    missionTitle: 'បេសកកម្ម និងចក្ខុវិស័យ',
    missionEyebrow: 'Mission & Vision',
    missionLabel: 'បេសកកម្ម',
    missionSub: 'Mission',
    missionText: 'យើងខំប្រឹងផ្តល់សេវាមន្ទីរពិសោធន៍ដែលមានភាពត្រឹមត្រូវ ទាន់ពេលវេលា និងអាចទុកចិត្តបាន ដោយប្រើប្រាស់បរិក្ខារទំនើប និងបច្ចេកវិទ្យាកម្រិតខ្ពស់ — ដែលគាំទ្រដោយក្រុមអ្នកជំនាញដែលមានជំនាញខ្ពស់ — ធានាថារាល់លទ្ធផលបំពេញតាមស្តង់ដារនៃភាពជាក់ស្តែងខ្ពស់បំផុត។',
    visionLabel: 'ចក្ខុវិស័យ',
    visionSub: 'Vision',
    visionText: 'ក្លាយជាមន្ទីរពិសោធន៍ដែលត្រូវបានទទួលស្គាល់ចំពោះ គុណភាព ភាពជាក់ស្តែង និងការអាចទុកចិត្តបាន ក្នុងការផ្តល់សេវាមន្ទីរពិសោធន៍វេជ្ជសាស្ត្រដល់សាធារណជន ដោយណែនាំតាមក្រមសីលធម៌វិជ្ជាជីវៈ និងស្តង់ដារអន្តរជាតិ។',
    techTitle: 'បច្ចេកទេស និងសម្ភារៈ',
    techEyebrow: 'Technology & Equipment',
    techDesc: 'មន្ទីរពិសោធន៍របស់យើងត្រូវបានបំពាក់ដោយឧបករណ៍ទំនើប ៧ ពីក្រុមហ៊ុនផ្គត់ផ្គង់ដែលបានទទួលស្គាល់ជាសាកល ធានាឱ្យបាននូវលទ្ធផលវិនិច្ឆ័យដែលលឿន ត្រឹមត្រូវ និងអាចទុកចិត្តបាន។',
    viewEquipment: 'មើលឧបករណ៍ទាំងអស់',
    teamTitle: 'ក្រុមការងាររបស់យើង',
    teamEyebrow: 'Meet Our Team',
    teamEmpty: 'មិនទាន់មានការបន្ថែមសមាជិកក្រុម។',
  },
}

function SectionTitle({ label, eyebrow }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: RED }} />
      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: RED }}>{eyebrow}</div>
        <h2 className="text-2xl font-bold" style={{ color: BLUE }}>{label}</h2>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const { lang } = useLanguage()
  const s = T[lang]
  const [team, setTeam]               = useState([])
  const [teamLoading, setTeamLoading] = useState(true)

  useEffect(() => {
    api.get('/public/team')
      .then(res => setTeam(res.data))
      .catch(() => {})
      .finally(() => setTeamLoading(false))
  }, [])

  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      {/* Hero */}
      <div className="py-14" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_MID} 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4cb6eb' }}>
            {s.heroEyebrow}
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{s.heroTitle}</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {s.heroDesc}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-14 space-y-14">

        {/* Laboratory History */}
        <section>
          <SectionTitle label={s.historyTitle} eyebrow={s.historyEyebrow} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-bold px-4 py-1.5 rounded-full text-white" style={{ background: RED }}>
                {s.foundedBadge}
              </span>
              <span className="text-xs text-gray-400">{s.foundedBy}</span>
            </div>
            {lang === 'en' ? (
              <p className="text-gray-700 leading-relaxed mb-4">
                Saravoan Medical Laboratory was founded by <strong>Dr. Lim Pich</strong> in <strong>2012</strong> with
                the mission of elevating medical diagnostic services in Cambodia. The laboratory was established
                to meet the essential needs of healthcare partners — delivering a fully comprehensive, fast,
                modern, and accurate diagnostic experience.
              </p>
            ) : (
              <p className="text-gray-700 leading-relaxed mb-4">មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត ត្រូវបានបង្កើតឡើងដោយ វេជ្ជបណ្ឌិត លឹម ពេជ្រ នៅឆ្នាំ ២០១២ ដោយមានបេសកកម្មក្នុងការលើកកម្ពស់សេវាវិនិច្ឆ័យវេជ្ជសាស្ត្រនៅប្រទេសកម្ពុជា។ មន្ទីរពិសោធន៍នេះត្រូវបានបង្កើតឡើងដើម្បីបំពេញតម្រូវការចាំបាច់របស់ដៃគូថែទាំសុខភាព — ផ្តល់នូវបទពិសោធន៍វិនិច្ឆ័យដែលទូលំទូលាយ លឿន ទំនើប និងត្រឹមត្រូវ។</p>
            )}
            <p className="text-gray-600 leading-relaxed text-sm" style={{ borderLeft: `3px solid ${RED}`, paddingLeft: '1rem' }}>
              <em>{s.historyQuote}</em>
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section>
          <SectionTitle label={s.missionTitle} eyebrow={s.missionEyebrow} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: RED }} />
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff0f1' }}>
                  <Target size={20} style={{ color: RED }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: RED }}>{s.missionSub}</div>
                  <h3 className="font-bold" style={{ color: BLUE }}>{s.missionLabel}</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{s.missionText}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: BLUE_MID }} />
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#e8f4fd' }}>
                  <Eye size={20} style={{ color: BLUE_MID }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE_MID }}>{s.visionSub}</div>
                  <h3 className="font-bold" style={{ color: BLUE }}>{s.visionLabel}</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{s.visionText}</p>
            </div>
          </div>
        </section>

        {/* Technology & Equipment */}
        <section>
          <SectionTitle label={s.techTitle} eyebrow={s.techEyebrow} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <p className="text-gray-600 leading-relaxed mb-6">{s.techDesc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {EQUIPMENT_BRIEF.map(eq => (
                <div key={eq.name} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#e8f4fd' }}>
                    <Microscope size={14} style={{ color: BLUE_MID }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm" style={{ color: BLUE }}>{eq.name}</div>
                    <div className="text-xs text-gray-500">{eq.spec}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ background: RED }}
            >
              {s.viewEquipment} <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Meet Our Team */}
        <section>
          <SectionTitle label={s.teamTitle} eyebrow={s.teamEyebrow} />

          {teamLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin" style={{ color: RED }} />
            </div>
          ) : team.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">{s.teamEmpty}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {team.map(member => (
                <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-1" style={{ background: RED }} />
                  <div className="p-6 text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${RED}, ${BLUE})` }}
                    >
                      {member.initials}
                    </div>
                    <h3 className="font-bold mb-0.5" style={{ color: BLUE }}>{member.name}</h3>
                    <div className="text-sm font-medium mb-0.5" style={{ color: RED }}>{member.role}</div>
                    {member.specialty && (
                      <div className="text-xs text-gray-400 mb-3">{member.specialty}</div>
                    )}
                    {member.bio && (
                      <p className="text-xs text-gray-500 leading-relaxed mb-3">{member.bio}</p>
                    )}
                    <div className="flex justify-center gap-0.5">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} size={12} fill={BLUE_LIGHT} style={{ color: BLUE_LIGHT }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      <Footer />
    </div>
  )
}
