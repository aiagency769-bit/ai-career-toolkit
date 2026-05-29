import React from 'react'
import { motion } from 'framer-motion'
import { Check, Crown } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { ResumeTemplate } from '../../types'

interface TemplateConfig {
  id: ResumeTemplate
  name: string
  desc: string
  tags: string[]
  premium?: boolean
  headerBg: string
  headerText: string
  accent: string
  bodyLines: { width: string; opacity: number }[]
  twoCol?: boolean
  sidebarBg?: string
}

const TEMPLATES: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Gradient header, bold typography',
    tags: ['Popular', 'ATS-Friendly'],
    headerBg: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    headerText: '#fff',
    accent: '#4f46e5',
    bodyLines: [
      { width: '80%', opacity: 0.7 }, { width: '60%', opacity: 0.4 },
      { width: '90%', opacity: 0.5 }, { width: '70%', opacity: 0.4 },
      { width: '55%', opacity: 0.3 },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Clean black & white, classic',
    tags: ['Clean', 'ATS-Safe'],
    headerBg: '#fff',
    headerText: '#000',
    accent: '#111',
    bodyLines: [
      { width: '85%', opacity: 0.6 }, { width: '55%', opacity: 0.4 },
      { width: '90%', opacity: 0.5 }, { width: '75%', opacity: 0.35 },
      { width: '60%', opacity: 0.25 },
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    desc: 'Sidebar layout, gradient accents',
    tags: ['Creative', 'Design'],
    twoCol: true,
    sidebarBg: '#1e1b4b',
    headerBg: '#1e1b4b',
    headerText: '#fff',
    accent: '#7c3aed',
    bodyLines: [
      { width: '90%', opacity: 0.6 }, { width: '70%', opacity: 0.4 },
      { width: '85%', opacity: 0.5 }, { width: '65%', opacity: 0.4 },
      { width: '50%', opacity: 0.3 },
    ],
  },
  {
    id: 'corporate',
    name: 'Corporate',
    desc: 'Professional two-column layout',
    tags: ['Corporate', 'Formal'],
    headerBg: '#fff',
    headerText: '#1e40af',
    accent: '#1e40af',
    bodyLines: [
      { width: '80%', opacity: 0.5 }, { width: '65%', opacity: 0.4 },
      { width: '90%', opacity: 0.5 }, { width: '70%', opacity: 0.35 },
      { width: '55%', opacity: 0.3 },
    ],
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Dark luxury header, gold accents',
    tags: ['Executive', 'Senior'],
    premium: true,
    headerBg: '#0f172a',
    headerText: '#b45309',
    accent: '#b45309',
    bodyLines: [
      { width: '80%', opacity: 0.6 }, { width: '55%', opacity: 0.4 },
      { width: '88%', opacity: 0.5 }, { width: '70%', opacity: 0.4 },
      { width: '60%', opacity: 0.3 },
    ],
  },
  {
    id: 'fresher',
    name: 'Fresher',
    desc: 'Fresh graduate, project-focused',
    tags: ['Students', 'Entry-Level'],
    headerBg: 'linear-gradient(135deg, #059669, #0d9488)',
    headerText: '#fff',
    accent: '#059669',
    bodyLines: [
      { width: '85%', opacity: 0.6 }, { width: '65%', opacity: 0.5 },
      { width: '90%', opacity: 0.5 }, { width: '70%', opacity: 0.4 },
      { width: '55%', opacity: 0.3 },
    ],
  },
  {
    id: 'tech',
    name: 'Tech / Dev',
    desc: 'Dark mode terminal-inspired',
    tags: ['Tech', 'IT', 'Dev'],
    premium: true,
    headerBg: '#0f172a',
    headerText: '#06b6d4',
    accent: '#06b6d4',
    bodyLines: [
      { width: '80%', opacity: 0.5 }, { width: '60%', opacity: 0.4 },
      { width: '85%', opacity: 0.45 }, { width: '70%', opacity: 0.35 },
      { width: '50%', opacity: 0.3 },
    ],
  },
  {
    id: 'government',
    name: 'Government',
    desc: 'Official FPSC/PPSC format',
    tags: ['FPSC', 'PPSC', 'Official'],
    headerBg: '#fff',
    headerText: '#000',
    accent: '#000',
    bodyLines: [
      { width: '90%', opacity: 0.5 }, { width: '70%', opacity: 0.4 },
      { width: '85%', opacity: 0.5 }, { width: '75%', opacity: 0.4 },
      { width: '60%', opacity: 0.3 },
    ],
  },
]

interface Props {
  open: boolean
  onClose: () => void
  onSelect: (template: ResumeTemplate) => void
  current?: ResumeTemplate
}

export const TemplateSelector: React.FC<Props> = ({ open, onClose, onSelect, current }) => {
  return (
    <Modal open={open} onClose={onClose} title="Choose a Template" size="lg">
      <div className="p-6">
        <p className="text-sm text-white/50 mb-5">Pick a template. You can switch anytime without losing data.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {TEMPLATES.map((tpl) => (
            <motion.button
              key={tpl.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(tpl.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all text-left group ${
                current === tpl.id
                  ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                  : 'border-white/10 hover:border-primary-500/50'
              }`}
            >
              {/* Template visual preview */}
              <div className="h-32 relative overflow-hidden" style={{ background: tpl.headerBg }}>
                {tpl.twoCol ? (
                  <div className="absolute inset-0 flex">
                    <div style={{ width: '36%', background: tpl.sidebarBg }} className="p-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2" />
                      {[70, 50, 80, 60].map((w, i) => (
                        <div key={i} style={{ width: `${w}%`, opacity: 0.3 }} className="h-1.5 bg-white rounded mb-1.5 mx-auto" />
                      ))}
                    </div>
                    <div className="flex-1 bg-white p-2">
                      <div style={{ width: '70%', background: tpl.accent, opacity: 0.7 }} className="h-2 rounded mb-1" />
                      <div style={{ width: '45%', background: tpl.accent, opacity: 0.4 }} className="h-1.5 rounded mb-2" />
                      {tpl.bodyLines.map((l, i) => (
                        <div key={i} style={{ width: l.width, background: '#333', opacity: l.opacity * 0.5 }} className="h-1 rounded mb-1.5" />
                      ))}
                    </div>
                  </div>
                ) : tpl.id === 'minimal' || tpl.id === 'corporate' ? (
                  <div className="absolute inset-0 bg-white p-3">
                    <div style={{ borderBottom: `2px solid ${tpl.accent}`, paddingBottom: 6, marginBottom: 8 }}>
                      <div style={{ width: '55%', background: tpl.accent, opacity: 0.8 }} className="h-2.5 rounded mb-1" />
                      <div style={{ width: '40%', background: tpl.accent, opacity: 0.4 }} className="h-1.5 rounded" />
                    </div>
                    {tpl.bodyLines.map((l, i) => (
                      <div key={i} style={{ width: l.width, background: tpl.accent, opacity: l.opacity }} className="h-1 rounded mb-1.5" />
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="p-3 pb-2">
                      <div className="h-2.5 rounded mb-1" style={{ width: '55%', background: tpl.headerText === '#fff' ? 'rgba(255,255,255,0.9)' : tpl.accent, opacity: 0.9 }} />
                      <div className="h-1.5 rounded" style={{ width: '38%', background: tpl.headerText === '#fff' ? 'rgba(255,255,255,0.5)' : '#666', opacity: 0.6 }} />
                    </div>
                    {/* Body */}
                    <div className="bg-white mx-2 mb-2 rounded-lg p-2 flex-1" style={{ marginTop: 4 }}>
                      {tpl.bodyLines.map((l, i) => (
                        <div key={i} style={{ width: l.width, background: tpl.accent, opacity: l.opacity }} className="h-1 rounded mb-1.5" />
                      ))}
                    </div>
                  </>
                )}

                {current === tpl.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                    <Check size={11} className="text-white" />
                  </div>
                )}
                {tpl.premium && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/90 text-white">
                    <Crown size={9} />
                    <span className="text-[9px] font-bold">PRO</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5 bg-dark-800">
                <div className="font-semibold text-white text-sm leading-tight">{tpl.name}</div>
                <div className="text-[11px] text-white/40 mt-0.5 mb-1.5 leading-tight">{tpl.desc}</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-white/40 border border-white/8">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
