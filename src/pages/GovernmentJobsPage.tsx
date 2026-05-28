import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, FileText, BookOpen, CheckSquare, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/appStore'
import { useResumeStore } from '../store/resumeStore'
import toast from 'react-hot-toast'

const GOVT_BODIES = [
  { id: 'fpsc', name: 'FPSC',    full: 'Federal Public Service Commission',  level: 'Federal',    color: 'from-green-700 to-green-900',    tests: ['CSS', 'PCS', 'Military', 'Police'] },
  { id: 'ppsc', name: 'PPSC',    full: 'Punjab Public Service Commission',   level: 'Provincial', color: 'from-blue-700 to-blue-900',      tests: ['BPS-17', 'BPS-18', 'Lecturers'] },
  { id: 'spsc', name: 'SPSC',    full: 'Sindh Public Service Commission',    level: 'Provincial', color: 'from-red-700 to-red-900',        tests: ['Grade 16-18', 'CSS'] },
  { id: 'kppsc', name: 'KPPSC',  full: 'KPK Public Service Commission',     level: 'Provincial', color: 'from-emerald-700 to-emerald-900', tests: ['BPS-14+', 'Teaching'] },
  { id: 'bpsc', name: 'BPSC',    full: 'Balochistan Public Service Comm.',  level: 'Provincial', color: 'from-amber-700 to-amber-900',    tests: ['BPS-16+', 'CSS'] },
  { id: 'army', name: 'Pak Army', full: 'Pakistan Army Commission',          level: 'Defense',    color: 'from-olive-700 to-gray-900 from-gray-700 to-gray-900', tests: ['PMA Long Course', 'Short Service'] },
]

const DOCS_CHECKLIST = [
  'CNIC (Computerized National Identity Card)',
  'Domicile Certificate',
  'PRC (Permanent Residence Certificate)',
  'SSC/Matric Certificate',
  'HSC/Intermediate Certificate',
  'Graduation Degree / Transcript',
  'Character Certificate from last institution',
  '2-4 Passport size photographs',
  'Experience certificates (if applicable)',
  'NOC (for government employees)',
  'Medical fitness certificate',
  'Bank Challan / Fee receipt',
]

const EXAM_TIPS = [
  { category: 'General Knowledge', tips: ['Read Dawn News daily', 'Current affairs last 6 months', 'Pakistan studies', 'Islamic studies'] },
  { category: 'English', tips: ['Grammar rules', 'Précis writing', 'Essay practice', 'Comprehension passages'] },
  { category: 'Everyday Science', tips: ['Basic physics & chemistry', 'Biology fundamentals', 'Computer basics', 'Environmental science'] },
  { category: 'Quantitative', tips: ['Basic mathematics', 'Ratios & percentages', 'Data interpretation', 'Mental arithmetic'] },
]

export const GovernmentJobsPage: React.FC = () => {
  const [checkedDocs, setCheckedDocs] = useState<number[]>([])
  const { setPage } = useAppStore()
  const { createResume } = useResumeStore()

  const toggleDoc = (i: number) => {
    setCheckedDocs(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])
  }

  const handleCreateGovtResume = () => {
    createResume('government')
    setPage('resume-builder')
    toast.success('Government resume template created!')
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(180,83,9,0.08))', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building2 size={20} className="text-amber-400" />
              <Badge variant="warning">Pakistan Government Jobs</Badge>
            </div>
            <h2 className="text-2xl font-black text-white mb-1">Government Job Toolkit</h2>
            <p className="text-white/50 text-sm">Official templates, document checklists & exam prep for FPSC, PPSC, PSC and more</p>
          </div>
          <Button variant="primary" size="md" icon={<FileText size={16} />} onClick={handleCreateGovtResume}>
            Create Govt Resume
          </Button>
        </div>
      </motion.div>

      {/* Commission cards */}
      <div>
        <h3 className="section-title mb-4">Select Commission</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {GOVT_BODIES.map((body) => (
            <motion.div
              key={body.id}
              whileHover={{ y: -4 }}
              className={`p-4 rounded-2xl bg-gradient-to-br ${body.color} text-center cursor-pointer border border-white/10 hover:border-white/20 transition-all`}
              onClick={handleCreateGovtResume}
            >
              <div className="text-2xl font-black text-white mb-1">{body.name}</div>
              <div className="text-xs text-white/60 mb-3">{body.level}</div>
              <div className="space-y-1">
                {body.tests.slice(0, 2).map(t => (
                  <div key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{t}</div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Checklist */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title flex items-center gap-2"><CheckSquare size={16} className="text-emerald-400" /> Document Checklist</h3>
            <span className="text-xs text-emerald-400">{checkedDocs.length}/{DOCS_CHECKLIST.length} ready</span>
          </div>
          <div className="space-y-2">
            {DOCS_CHECKLIST.map((doc, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleDoc(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  checkedDocs.includes(i) ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/3 border border-white/8 hover:bg-white/6'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  checkedDocs.includes(i) ? 'bg-emerald-500 border-emerald-500' : 'border-white/30'
                }`}>
                  {checkedDocs.includes(i) && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${checkedDocs.includes(i) ? 'text-emerald-400 line-through opacity-60' : 'text-white/70'}`}>
                  {doc}
                </span>
              </motion.button>
            ))}
          </div>
        </Card>

        {/* Exam Prep */}
        <Card>
          <h3 className="section-title flex items-center gap-2 mb-4"><BookOpen size={16} className="text-blue-400" /> Exam Preparation Tips</h3>
          <div className="space-y-4">
            {EXAM_TIPS.map((cat) => (
              <div key={cat.category} className="p-3 rounded-xl bg-white/5 border border-white/8">
                <h4 className="text-sm font-bold text-white mb-2">{cat.category}</h4>
                <div className="grid grid-cols-2 gap-1">
                  {cat.tips.map((tip, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-white/60">
                      <span className="text-primary-400">•</span> {tip}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Job portals */}
      <Card>
        <h3 className="section-title mb-4">Official Job Portals</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'FPSC.gov.pk', desc: 'Federal positions',    url: '#' },
            { name: 'PPSC.gop.pk', desc: 'Punjab positions',     url: '#' },
            { name: 'NTS.org.pk',  desc: 'Test services',        url: '#' },
            { name: 'Jobs.gov.pk', desc: 'All Govt Jobs',        url: '#' },
          ].map(portal => (
            <a key={portal.name} href={portal.url} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-primary-500/20 transition-all group">
              <div className="flex-1">
                <div className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors">{portal.name}</div>
                <div className="text-xs text-white/40">{portal.desc}</div>
              </div>
              <ExternalLink size={14} className="text-white/20 group-hover:text-primary-400 transition-colors" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  )
}
