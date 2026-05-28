import React from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Modal } from '../ui/Modal'
import type { ResumeTemplate } from '../../types'

const TEMPLATES: { id: ResumeTemplate; name: string; desc: string; color: string; tags: string[] }[] = [
  { id: 'modern',      name: 'Modern',      desc: 'Clean gradient header, bold typography', color: 'from-primary-600 to-primary-800',     tags: ['Popular', 'ATS-Friendly'] },
  { id: 'minimal',     name: 'Minimal',     desc: 'Clean, simple, classic black & white',  color: 'from-gray-600 to-gray-800',             tags: ['Clean', 'ATS-Friendly'] },
  { id: 'creative',    name: 'Creative',    desc: 'Bold colors, creative layout',           color: 'from-accent-600 to-purple-800',         tags: ['Creative', 'Design'] },
  { id: 'corporate',   name: 'Corporate',   desc: 'Professional corporate style',           color: 'from-blue-700 to-blue-900',             tags: ['Corporate', 'Formal'] },
  { id: 'executive',   name: 'Executive',   desc: 'Premium executive level resume',         color: 'from-slate-700 to-slate-900',           tags: ['Executive', 'Senior'] },
  { id: 'fresher',     name: 'Fresher',     desc: 'Perfect for fresh graduates',            color: 'from-emerald-600 to-teal-800',          tags: ['Students', 'Entry-Level'] },
  { id: 'government',  name: 'Government',  desc: 'Official government application format', color: 'from-amber-700 to-amber-900',           tags: ['FPSC', 'PPSC', 'Official'] },
  { id: 'tech',        name: 'Tech',        desc: 'Modern tech industry resume',            color: 'from-cyan-600 to-cyan-800',             tags: ['Tech', 'IT', 'Software'] },
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
        <p className="text-sm text-white/50 mb-5">Select a template that best fits your industry and style</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((tpl) => (
            <motion.button
              key={tpl.id}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(tpl.id)}
              className={`relative rounded-xl overflow-hidden border-2 transition-all text-left group ${
                current === tpl.id ? 'border-primary-500' : 'border-white/10 hover:border-primary-500/40'
              }`}
            >
              {/* Template preview */}
              <div className={`h-28 bg-gradient-to-br ${tpl.color} relative`}>
                <div className="absolute inset-0 p-3 flex flex-col justify-end">
                  <div className="h-2 bg-white/40 rounded w-2/3 mb-1" />
                  <div className="h-1.5 bg-white/20 rounded w-1/2" />
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-black/10">
                  <div className="p-2 space-y-1">
                    <div className="h-1.5 bg-white/30 rounded" />
                    <div className="h-1.5 bg-white/20 rounded w-4/5" />
                    <div className="h-1.5 bg-white/20 rounded w-3/5" />
                    <div className="h-1.5 bg-white/20 rounded" />
                    <div className="h-1.5 bg-white/20 rounded w-4/5" />
                  </div>
                </div>
                {current === tpl.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="p-3 bg-dark-800/80">
                <div className="font-semibold text-white text-sm">{tpl.name}</div>
                <div className="text-xs text-white/40 mt-0.5 mb-2">{tpl.desc}</div>
                <div className="flex flex-wrap gap-1">
                  {tpl.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/8">
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
