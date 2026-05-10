import { useState, useEffect } from 'react'
import { Target, Eye, Microscope, ArrowRight, Star, Users, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/axios'

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

function SectionTitle({ label, khmer }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ background: RED }} />
      <div>
        <div className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: RED }}>{khmer}</div>
        <h2 className="text-2xl font-bold" style={{ color: BLUE }}>{label}</h2>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const [team, setTeam]           = useState([])
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
            អំពីពួកយើង
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">About Us</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Learn about Saravoan Medical Laboratory — our history, mission, vision, and team.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-14 space-y-14">

        {/* ── Laboratory History ── */}
        <section>
          <SectionTitle label="Laboratory History" khmer="ប្រវត្តិមន្ទីរពិសោធន៍" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-bold px-4 py-1.5 rounded-full text-white" style={{ background: RED }}>
                Founded 2012
              </span>
              <span className="text-xs text-gray-400">by Dr. Lim Pich</span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              Saravoan Medical Laboratory was founded by <strong>Dr. Lim Pich</strong> in <strong>2012</strong> with
              the mission of elevating medical diagnostic services in Cambodia. The laboratory was established
              to meet the essential needs of healthcare partners — delivering a fully comprehensive, fast,
              modern, and accurate diagnostic experience.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm" style={{ borderLeft: `3px solid ${RED}`, paddingLeft: '1rem' }}>
              <em>"មន្ទីរពីសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្ត ត្រូវបានបង្កើតឡើងដោយ វេជ្ជបណ្ឌិត លឹម ពេជ្រ នៅឆ្នាំ ២០១២ ដើម្បីលើកកម្ពស់សេវា
              វិនិច្ឆ័យវេជ្ជសាស្ត្រ នៅប្រទេសកម្ពុជា"</em>
            </p>
          </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section>
          <SectionTitle label="Mission & Vision" khmer="បេសកកម្ម និងចក្ខុវិស័យ" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: RED }} />
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#fff0f1' }}>
                  <Target size={20} style={{ color: RED }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: RED }}>បេសកកម្ម</div>
                  <h3 className="font-bold" style={{ color: BLUE }}>Mission</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                We strive to provide <strong>accurate, timely, and reliable</strong> laboratory services by utilizing
                modern equipment and advanced technology — supported by a highly skilled team of professionals —
                ensuring every result meets the highest standard of precision.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: BLUE_MID }} />
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#e8f4fd' }}>
                  <Eye size={20} style={{ color: BLUE_MID }} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider" style={{ color: BLUE_MID }}>ចក្ខុវិស័យ</div>
                  <h3 className="font-bold" style={{ color: BLUE }}>Vision</h3>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                To become a laboratory recognized for <strong>quality, precision, and trustworthiness</strong> in
                providing medical laboratory services to the public, guided by professional ethics and
                international standards.
              </p>
            </div>
          </div>
        </section>

        {/* ── Technology & Equipment ── */}
        <section>
          <SectionTitle label="Technology & Equipment" khmer="បច្ចេកទេស និងសម្ភារៈ" />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
            <p className="text-gray-600 leading-relaxed mb-6">
              Our laboratory is equipped with 7 state-of-the-art instruments from globally recognized
              manufacturers, ensuring fast, precise, and reliable diagnostic results.
            </p>
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
              View All Equipment <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* ── Meet Our Team ── */}
        <section>
          <SectionTitle label="Meet Our Team" khmer="អំពីធន់ធានមនុស្ស" />

          {teamLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin" style={{ color: RED }} />
            </div>
          ) : team.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No team members have been added yet.</p>
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
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} fill={BLUE_LIGHT} style={{ color: BLUE_LIGHT }} />
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
