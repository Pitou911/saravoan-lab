import { Microscope, TestTube2, Cpu, Scan, Droplets, FlaskConical, CheckCircle, Clock, Shield, Award, Activity, Heart, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage } from '../context/LanguageContext'

const EQUIPMENT = [
  {
    icon: Activity,
    name: 'Sysmex KX-21',
    en: { category: 'Hematology Analyzer', desc: 'Automated blood cell analyzer capable of processing 60 tests per hour, delivering complete blood counts with 3-part WBC differential.', features: ['60 tests per hour throughput', '3-part WBC differential (Lymph, Mono, Gran)', 'Full CBC: RBC, WBC, PLT, Hgb, Hct', 'Auto-flagging for abnormal results'] },
    kh: { category: 'ម៉ាស៊ីនវិភាគកោសិកាឈាម', desc: 'ម៉ាស៊ីនវិភាគកោសិកាឈាមស្វ័យប្រវត្តិ អាចដំណើរការ ៦០ តេស្តក្នុងមួយម៉ោង ផ្តល់ការរាប់ CBC ពេញលេញ ជាមួយ WBC differential ៣ ផ្នែក។', features: ['ដំណើរការ ៦០ តេស្ត/ម៉ោង', 'WBC differential ៣ ផ្នែក (Lymph, Mono, Gran)', 'CBC ពេញលេញ: RBC, WBC, PLT, Hgb, Hct', 'សញ្ញាព្រមាន auto-flagging សម្រាប់លទ្ធផលមិនប្រក្រតី'] },
  },
  {
    icon: TestTube2,
    name: 'Automate Biochemistry Analyzer BA200',
    en: { category: 'Biochemistry', desc: 'High-throughput biochemistry analyzer capable of processing 200 tests per hour for comprehensive metabolic and organ function panels.', features: ['200 tests per hour throughput', 'Liver function: ALT, AST, GGT, ALP, Bilirubin', 'Kidney function: Creatinine, BUN, Uric Acid', 'Glucose, lipid profile & electrolytes'] },
    kh: { category: 'ជីវគីមី', desc: 'ម៉ាស៊ីនជីវគីមីដំណើរការខ្ពស់ ២០០ តេស្តក្នុងមួយម៉ោង សម្រាប់ស្ទង់ base ការរំលាយអាហារ និងមុខងារសរីរាង្គ។', features: ['ដំណើរការ ២០០ តេស្ត/ម៉ោង', 'មុខងារថ្លើម: ALT, AST, GGT, ALP, Bilirubin', 'មុខងារតម្រងនោម: Creatinine, BUN, Uric Acid', 'ជាតិស្ករ ខ្លាញ់ & អ៊ីយ៉ុង'] },
  },
  {
    icon: Cpu,
    name: 'Cobas e411',
    en: { category: 'Immunology & Serology Analyzer', desc: 'Automated immunology and serology analyzer with a throughput of 86 tests per hour for hormones, tumor markers, and infectious disease screening.', features: ['86 tests per hour throughput', 'Thyroid panel: TSH, FT3, FT4', 'Tumor markers: AFP, CEA, PSA, CA-125', 'Infectious: HBsAg, Anti-HCV, HIV Ag/Ab'] },
    kh: { category: 'ម៉ាស៊ីន Immunology & Serology', desc: 'ម៉ាស៊ីន immunology និង serology ស្វ័យប្រវត្តិ ៨៦ តេស្ត/ម៉ោង សម្រាប់ hormone សញ្ញា tumor markers និងការច្រោះជំងឺកាន់ឆ្លង។', features: ['ដំណើរការ ៨៦ តេស្ត/ម៉ោង', 'ក្រពះ thyroid: TSH, FT3, FT4', 'Tumor markers: AFP, CEA, PSA, CA-125', 'ជំងឺឆ្លង: HBsAg, Anti-HCV, HIV Ag/Ab'] },
  },
  {
    icon: Microscope,
    name: 'Arkray Adams ALC HA-8380V',
    en: { category: 'HbA1c Analyzer', desc: 'Dedicated HbA1c analyzer using HPLC (High Performance Liquid Chromatography) — the gold standard method — delivering results in just 160 seconds per sample.', features: ['160 seconds per sample', 'HPLC Gold Standard method', 'High precision for diabetes monitoring', 'No interference from Hgb variants'] },
    kh: { category: 'ម៉ាស៊ីន HbA1c', desc: 'ម៉ាស៊ីន HbA1c ប្រើ HPLC (High Performance Liquid Chromatography) — វិធីស្តង់ដារ Gold — ផ្ដល់លទ្ធផលត្រឹមតែ ១៦០ វិនាទី/គំរូ។', features: ['១៦០ វិនាទីក្នុងមួយគំរូ', 'វិធី HPLC Gold Standard', 'ភាពត្រឹមត្រូវខ្ពស់ក្នុងការតាមដានជំងឺទឹកនោមផ្អែម', 'គ្មានការរំខានពី Hgb variants'] },
  },
  {
    icon: Heart,
    name: 'Newborn Screening NS 200',
    en: { category: 'Newborn Screening Analyzer', desc: 'Automatic immunoassay analyzer designed for newborn screening, capable of processing 80 tests per batch to detect congenital metabolic disorders.', features: ['80 tests per batch', 'Congenital hypothyroidism (TSH)', 'Phenylketonuria (PKU)', 'Congenital adrenal hyperplasia (CAH) & G6PD'] },
    kh: { category: 'ម៉ាស៊ីនពិនិត្យទារក', desc: 'ម៉ាស៊ីន immunoassay ស្វ័យប្រវត្តិ ៨០ តេស្ត/ជុំ សម្រាប់ការតំណាញស្ទង់ទារកទើបនឹងកើតដើម្បីរកជំងឺ metabolic កំណើត។', features: ['៨០ តេស្តក្នុងមួយជុំ', 'ជំងឺ hypothyroidism កំណើត (TSH)', 'ជំងឺ Phenylketonuria (PKU)', 'ជំងឺ CAH & G6PD'] },
  },
  {
    icon: Scan,
    name: 'PCR Analyzer & RNA/DNA Extraction Instrument',
    en: { category: 'Molecular Diagnostics (PCR)', desc: 'Real-time PCR system with integrated RNA/DNA extraction for quantitative viral load testing of hepatitis B, hepatitis C, HIV, and HPV.', features: ['HBV DNA Quantitative (Hepatitis B)', 'HCV RNA Quantitative (Hepatitis C)', 'HIV Viral Load Quantitative', 'HPV DNA Quantitative (cervical cancer)'] },
    kh: { category: 'ការវិនិច្ឆ័យម៉ូលេគុល (PCR)', desc: 'ប្រព័ន្ធ PCR real-time ជាមួយការដក RNA/DNA ដើម្បីរាប់ viral load ជំងឺ hepatitis B, C, HIV និង HPV។', features: ['HBV DNA Quantitative (Hepatitis B)', 'HCV RNA Quantitative (Hepatitis C)', 'HIV Viral Load Quantitative', 'HPV DNA Quantitative (មហារីកមាត់ស្បូន)'] },
  },
  {
    icon: Zap,
    name: 'Electrolyte Analyzer Easylyte',
    en: { category: 'Electrolyte Analyzer', desc: 'Dedicated electrolyte analyzer using Ion Selective Electrode (ISE) technology, measuring Na⁺, K⁺, and Cl⁻ with results in 90 seconds per test.', features: ['90 seconds per test', 'Measures Na⁺, K⁺, Cl⁻', 'ISE (Ion Selective Electrode) technology', 'Compatible with serum, plasma & whole blood'] },
    kh: { category: 'ម៉ាស៊ីនអ៊ីយ៉ុង', desc: 'ម៉ាស៊ីនអ៊ីយ៉ុង Easylyte ប្រើបច្ចេកវិទ្យា ISE វាស់ Na⁺, K⁺ និង Cl⁻ ផ្ដល់លទ្ធផលក្នុង ៩០ វិនាទី/តេស្ត។', features: ['៩០ វិនាទីក្នុងមួយតេស្ត', 'វាស់ Na⁺, K⁺, Cl⁻', 'បច្ចេកវិទ្យា ISE (Ion Selective Electrode)', 'ប្រើជាមួយ serum, plasma & ឈាមពេញ'] },
  },
]

const SERVICE_TYPES = [
  {
    id: 1,
    icon: Activity,
    color: '#033c93',
    en: {
      eyebrow: 'General Laboratory Testing',
      title: 'Blood, Urine & Stool Analysis',
      subtitle: 'វិភាគឈាម ទឹកនោម លាមក',
      desc: 'Comprehensive clinical laboratory analysis covering all major diagnostic categories — from routine blood counts to specialized immunological and microbiological testing.',
    },
    kh: {
      eyebrow: 'ការតេស្តមន្ទីរពិសោធន៍ទូទៅ',
      title: 'វិភាគឈាម ទឹកនោម លាមក',
      subtitle: 'Blood, Urine & Stool Analysis',
      desc: 'ការវិភាគក្នុងមន្ទីរពិសោធន៍គ្លីនិកទូលំទូលាយ គ្របដណ្តប់ប្រភេទវិនិច្ឆ័យសំខាន់ៗទាំងអស់ — ចាប់ពីការរាប់ CBC ធម្មតារហូតដល់ការតេស្ត immunology និង microbiology ឯកទេស។',
    },
    categories: ['Hematology','Hemostasis','Biochemistry','Lipid Profile','Enzymology','Electrophoresis','Hormonology','Virology','Tumor Markers','Immunology','Urinalysis','Microbiology','Allergy Testing','Newborn Screening'],
  },
  {
    id: 2,
    icon: Scan,
    color: '#096abc',
    en: {
      eyebrow: 'PCR Molecular Diagnostics',
      title: 'Hepatitis Viral Load Testing',
      subtitle: 'រាប់មេរោគថ្លើម',
      desc: 'High-sensitivity real-time PCR quantification for accurate monitoring and clinical management of viral hepatitis and HIV infections.',
    },
    kh: {
      eyebrow: 'ការវិនិច្ឆ័យម៉ូលេគុល PCR',
      title: 'រាប់មេរោគថ្លើម',
      subtitle: 'Hepatitis Viral Load Testing',
      desc: 'ការរាប់ PCR real-time ដែលមានភាពរសើបខ្ពស់ សម្រាប់ការតាមដានត្រឹមត្រូវ និងការគ្រប់គ្រងគ្លីនិកនៃ hepatitis ដែលបណ្ដាលដោយមេរោគ និងការឆ្លង HIV។',
    },
    categories: ['PCR Hepatitis B (HBV DNA)','PCR Hepatitis C (HCV RNA)','PCR HIV Viral Load','PCR HCV Quantification'],
  },
]

const SERVICE_HIGHLIGHTS = {
  en: [
    { icon: Clock,        title: '24-Hour Results',    desc: 'Most routine tests available within 24 hours of sample receipt.' },
    { icon: Shield,       title: 'Quality Assured',    desc: 'ISO 15189 accredited processes with daily internal and external QC.' },
    { icon: Award,        title: 'Certified Staff',    desc: 'All laboratory staff hold national and international certifications.' },
    { icon: CheckCircle,  title: 'Home Collection',    desc: 'Sample collection at home available for mobility-restricted patients.' },
  ],
  kh: [
    { icon: Clock,        title: 'លទ្ធផលក្នុង ២៤ ម៉ោង',  desc: 'តេស្តធម្មតាភាគច្រើនអាចរៀបចំបានក្នុង ២៤ ម៉ោងបន្ទាប់ពីទទួលគំរូ។' },
    { icon: Shield,       title: 'ធានាគុណភាព',            desc: 'ដំណើរការបានទទួលស្គាល់ ISO 15189 ជាមួយ QC ខាងក្នុង និងខាងក្រៅប្រចាំថ្ងៃ។' },
    { icon: Award,        title: 'បុគ្គលិកមានវិញ្ញាបនប័ត្រ', desc: 'បុគ្គលិកមន្ទីរពិសោធន៍ទាំងអស់មានវិញ្ញាបនប័ត្រជាតិ និងអន្តរជាតិ។' },
    { icon: CheckCircle,  title: 'ប្រមូលគំរូនៅផ្ទះ',       desc: 'ប្រមូលគំរូនៅផ្ទះអាចធ្វើបានសម្រាប់អ្នកជំងឺដែលពិបាកធ្វើដំណើរ។' },
  ],
}

const T = {
  en: {
    heroEyebrow: 'Our Technology',
    heroTitle: 'Our Services',
    heroDesc: 'State-of-the-art laboratory equipment and services designed to deliver precise diagnostics for every patient.',
    serviceEyebrow: 'What We Offer',
    serviceTitle: 'Our Service Types',
    serviceSubtitle: 'មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្តមានផ្តល់សេវាកម្មដូចជា',
    equipmentEyebrow: 'Our Instruments',
    equipmentTitle: 'Laboratory Equipment',
    equipmentSubtitle: '7 state-of-the-art instruments for precision diagnostics',
  },
  kh: {
    heroEyebrow: 'បច្ចេកវិទ្យារបស់យើង',
    heroTitle: 'សេវាកម្មរបស់យើង',
    heroDesc: 'ឧបករណ៍ និងសេវាមន្ទីរពិសោធន៍ទំនើប ដែលត្រូវបានរចនាឡើងដើម្បីផ្តល់ការវិនិច្ឆ័យត្រឹមត្រូវសម្រាប់អ្នកជំងឺគ្រប់រូប។',
    serviceEyebrow: 'អ្វីដែលយើងផ្តល់',
    serviceTitle: 'ប្រភេទសេវាកម្មរបស់យើង',
    serviceSubtitle: 'Saravoan Medical Laboratory provides services such as:',
    equipmentEyebrow: 'ឧបករណ៍របស់យើង',
    equipmentTitle: 'ឧបករណ៍មន្ទីរពិសោធន៍',
    equipmentSubtitle: 'ឧបករណ៍ទំនើប ៧ ដើម្បីការវិនិច្ឆ័យត្រឹមត្រូវ',
  },
}

export default function ServicesPage() {
  const { lang } = useLanguage()
  const s = T[lang]
  const highlights = SERVICE_HIGHLIGHTS[lang]

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

      {/* Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map(h => (
              <div key={h.title} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#fff0f1' }}>
                  <h.icon size={22} style={{ color: '#e63946' }} />
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: '#033c93' }}>{h.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Types */}
      <section className="py-16" style={{ background: '#f0f6ff' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>{s.serviceEyebrow}</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>{s.serviceTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{s.serviceSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SERVICE_TYPES.map(svc => {
              const t = svc[lang]
              return (
                <div key={svc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="h-1.5" style={{ background: svc.color }} />
                  <div className="p-7">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f4fd' }}>
                        <svc.icon size={28} style={{ color: svc.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#4cb6eb' }}>{t.eyebrow}</div>
                        <h3 className="font-bold text-lg leading-snug" style={{ color: '#033c93' }}>{t.title}</h3>
                        <div className="text-sm mt-0.5" style={{ color: '#096abc' }}>{t.subtitle}</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{t.desc}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {svc.categories.map(cat => (
                        <div key={cat} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle size={13} style={{ color: svc.color, flexShrink: 0 }} />
                          {cat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>{s.equipmentEyebrow}</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>{s.equipmentTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">{s.equipmentSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EQUIPMENT.map(eq => {
              const t = eq[lang]
              return (
                <div key={eq.name} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="h-1" style={{ background: '#e63946' }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff0f1' }}>
                        <eq.icon size={24} style={{ color: '#e63946' }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#e63946' }}>{t.category}</div>
                        <h3 className="font-bold text-sm" style={{ color: '#033c93' }}>{eq.name}</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-4">{t.desc}</p>
                    <ul className="space-y-1.5">
                      {t.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle size={12} style={{ color: '#e63946', flexShrink: 0 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
