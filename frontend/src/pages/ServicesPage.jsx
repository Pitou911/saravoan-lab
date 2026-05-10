import { Microscope, TestTube2, Cpu, Scan, Droplets, FlaskConical, CheckCircle, Clock, Shield, Award, Activity, Heart, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const EQUIPMENT = [
  {
    icon: Activity,
    name: 'Sysmex KX-21',
    category: 'Hematology Analyzer',
    desc: 'Automated blood cell analyzer capable of processing 60 tests per hour, delivering complete blood counts with 3-part WBC differential.',
    features: ['60 tests per hour throughput', '3-part WBC differential (Lymph, Mono, Gran)', 'Full CBC: RBC, WBC, PLT, Hgb, Hct', 'Auto-flagging for abnormal results'],
  },
  {
    icon: TestTube2,
    name: 'Automate Biochemistry Analyzer BA200',
    category: 'Biochemistry',
    desc: 'High-throughput biochemistry analyzer capable of processing 200 tests per hour for comprehensive metabolic and organ function panels.',
    features: ['200 tests per hour throughput', 'Liver function: ALT, AST, GGT, ALP, Bilirubin', 'Kidney function: Creatinine, BUN, Uric Acid', 'Glucose, lipid profile & electrolytes'],
  },
  {
    icon: Cpu,
    name: 'Cobas e411',
    category: 'Immunology & Serology Analyzer',
    desc: 'Automated immunology and serology analyzer with a throughput of 86 tests per hour for hormones, tumor markers, and infectious disease screening.',
    features: ['86 tests per hour throughput', 'Thyroid panel: TSH, FT3, FT4', 'Tumor markers: AFP, CEA, PSA, CA-125', 'Infectious: HBsAg, Anti-HCV, HIV Ag/Ab'],
  },
  {
    icon: Microscope,
    name: 'Arkray Adams ALC HA-8380V',
    category: 'HbA1c Analyzer',
    desc: 'Dedicated HbA1c analyzer using HPLC (High Performance Liquid Chromatography) — the gold standard method — delivering results in just 160 seconds per sample.',
    features: ['160 seconds per sample', 'HPLC Gold Standard method', 'High precision for diabetes monitoring', 'No interference from Hgb variants'],
  },
  {
    icon: Heart,
    name: 'Newborn Screening NS 200',
    category: 'Newborn Screening Analyzer',
    desc: 'Automatic immunoassay analyzer designed for newborn screening, capable of processing 80 tests per batch to detect congenital metabolic disorders.',
    features: ['80 tests per batch', 'Congenital hypothyroidism (TSH)', 'Phenylketonuria (PKU)', 'Congenital adrenal hyperplasia (CAH) & G6PD'],
  },
  {
    icon: Scan,
    name: 'PCR Analyzer & RNA/DNA Extraction Instrument',
    category: 'Molecular Diagnostics (PCR)',
    desc: 'Real-time PCR system with integrated RNA/DNA extraction for quantitative viral load testing of hepatitis B, hepatitis C, HIV, and HPV.',
    features: ['HBV DNA Quantitative (Hepatitis B)', 'HCV RNA Quantitative (Hepatitis C)', 'HIV Viral Load Quantitative', 'HPV DNA Quantitative (cervical cancer)'],
  },
  {
    icon: Zap,
    name: 'Electrolyte Analyzer Easylyte',
    category: 'Electrolyte Analyzer',
    desc: 'Dedicated electrolyte analyzer using Ion Selective Electrode (ISE) technology, measuring Na⁺, K⁺, and Cl⁻ with results in 90 seconds per test.',
    features: ['90 seconds per test', 'Measures Na⁺, K⁺, Cl⁻', 'ISE (Ion Selective Electrode) technology', 'Compatible with serum, plasma & whole blood'],
  },
]

const SERVICE_TYPES = [
  {
    id: 1,
    icon: Activity,
    color: '#033c93',
    titleKh: 'វិភាគឈាម ទឹកនោម លាមក',
    title: 'Blood, Urine & Stool Analysis',
    subtitle: 'General Laboratory Testing',
    desc: 'Comprehensive clinical laboratory analysis covering all major diagnostic categories — from routine blood counts to specialized immunological and microbiological testing.',
    categories: [
      'Hematology',
      'Hemostasis',
      'Biochemistry',
      'Lipid Profile',
      'Enzymology',
      'Electrophoresis',
      'Hormonology',
      'Virology',
      'Tumor Markers',
      'Immunology',
      'Urinalysis',
      'Microbiology',
      'Allergy Testing',
      'Newborn Screening',
    ],
  },
  {
    id: 2,
    icon: Scan,
    color: '#096abc',
    titleKh: 'រាប់មេរោគថ្លើម',
    title: 'Hepatitis Viral Load Testing',
    subtitle: 'PCR Molecular Diagnostics',
    desc: 'High-sensitivity real-time PCR quantification for accurate monitoring and clinical management of viral hepatitis and HIV infections.',
    categories: [
      'PCR Hepatitis B (HBV DNA)',
      'PCR Hepatitis C (HCV RNA)',
      'PCR HIV Viral Load',
      'PCR HCV Quantification',
    ],
  },
]

const SERVICE_HIGHLIGHTS = [
  { icon: Clock,   title: '24-Hour Results',     desc: 'Most routine tests available within 24 hours of sample receipt.' },
  { icon: Shield,  title: 'Quality Assured',     desc: 'ISO 15189 accredited processes with daily internal and external QC.' },
  { icon: Award,   title: 'Certified Staff',     desc: 'All laboratory staff hold national and international certifications.' },
  { icon: CheckCircle, title: 'Home Collection', desc: 'Sample collection at home available for mobility-restricted patients.' },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}>
      <Navbar />

      <div className="py-14" style={{ background: 'linear-gradient(135deg, #033c93 0%, #096abc 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#4cb6eb' }}>Our Technology</div>
          <h1 className="text-4xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            State-of-the-art laboratory equipment and services designed to deliver precise diagnostics for every patient.
          </p>
        </div>
      </div>

      {/* Highlights */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SERVICE_HIGHLIGHTS.map(h => (
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
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>What We Offer</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Our Service Types</h2>
            <p className="text-sm text-gray-500 mt-2">មន្ទីរពិសោធន៍វេជ្ជសាស្ត្រសារាវ័ន្តមានផ្តល់សេវាកម្មដូចជា</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {SERVICE_TYPES.map(svc => (
              <div key={svc.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="h-1.5" style={{ background: svc.color }} />
                <div className="p-7">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#e8f4fd' }}>
                      <svc.icon size={28} style={{ color: svc.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#4cb6eb' }}>{svc.subtitle}</div>
                      <h3 className="font-bold text-lg leading-snug" style={{ color: '#033c93' }}>{svc.title}</h3>
                      <div className="text-sm mt-0.5" style={{ color: '#096abc' }}>{svc.titleKh}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{svc.desc}</p>
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
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#e63946' }}>Our Instruments</div>
            <h2 className="text-3xl font-bold" style={{ color: '#033c93' }}>Laboratory Equipment</h2>
            <p className="text-sm text-gray-500 mt-2">7 state-of-the-art instruments for precision diagnostics</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EQUIPMENT.map(eq => (
              <div key={eq.name} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-1" style={{ background: '#e63946' }} />
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#fff0f1' }}>
                      <eq.icon size={24} style={{ color: '#e63946' }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#e63946' }}>{eq.category}</div>
                      <h3 className="font-bold text-sm" style={{ color: '#033c93' }}>{eq.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">{eq.desc}</p>
                  <ul className="space-y-1.5">
                    {eq.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle size={12} style={{ color: '#e63946', flexShrink: 0 }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
