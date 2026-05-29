import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Check, Download, RefreshCw, Mail, Loader2, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { generateCoverLetter } from '../lib/ai'
import { exportCoverLetterToPDF } from '../lib/pdfExport'
import { copyToClipboard } from '../lib/utils'
import toast from 'react-hot-toast'
import type { CoverLetterInput, CoverLetterTone } from '../types'

const TONES: { id: CoverLetterTone; label: string; desc: string; emoji: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Formal & polished',      emoji: '💼' },
  { id: 'friendly',     label: 'Friendly',     desc: 'Warm & personable',      emoji: '😊' },
  { id: 'corporate',    label: 'Corporate',    desc: 'Business formal',        emoji: '🏢' },
  { id: 'creative',     label: 'Creative',     desc: 'Bold & memorable',       emoji: '🎨' },
  { id: 'government',   label: 'Government',   desc: 'Official letter format', emoji: '🏛️' },
]

const LEVEL_OPTIONS = [
  { value: 'fresher',   label: 'Fresh Graduate' },
  { value: 'junior',    label: 'Junior (1-2 yrs)' },
  { value: 'mid',       label: 'Mid-Level (3-5 yrs)' },
  { value: 'senior',    label: 'Senior (6+ yrs)' },
  { value: 'executive', label: 'Executive' },
]

const QUICK_SKILLS = ['React', 'Python', 'Leadership', 'Communication', 'SQL', 'Project Management', 'Node.js', 'Marketing']

const defaultInput: CoverLetterInput = {
  jobTitle: '', companyName: '', hiringManager: '',
  jobDescription: '', yourName: '', yourEmail: '',
  experienceLevel: 'mid', keySkills: [], tone: 'professional',
  language: 'english',
}

export const CoverLetterPage: React.FC = () => {
  const [form, setForm]           = useState<CoverLetterInput>(defaultInput)
  const [skillInput, setSkillInput] = useState('')
  const [result, setResult]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [copied, setCopied]       = useState(false)

  const setField = (field: keyof CoverLetterInput, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }))

  const addSkill = (name?: string) => {
    const val = (name || skillInput).trim()
    if (!val || form.keySkills.includes(val)) return
    setField('keySkills', [...form.keySkills, val])
    setSkillInput('')
  }

  const removeSkill = (i: number) =>
    setField('keySkills', form.keySkills.filter((_, idx) => idx !== i))

  const handleGenerate = async () => {
    if (!form.jobTitle.trim() || !form.companyName.trim()) {
      toast.error('Please enter Job Title and Company Name')
      return
    }
    setLoading(true)
    setResult('')
    try {
      const letter = await generateCoverLetter(form)
      setResult(letter)
      toast.success('Cover letter generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      toast.error(msg)
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    await copyToClipboard(result)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = async () => {
    await exportCoverLetterToPDF(result, `cover-letter-${form.companyName}.pdf`)
    toast.success('PDF exported!')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* ── Input Panel ── */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

        {/* Job Details */}
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <Mail size={16} className="text-primary-400" /> Job Details
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Job Title *"
                value={form.jobTitle}
                onChange={e => setField('jobTitle', e.target.value)}
                placeholder="Software Engineer"
                required
              />
              <Input
                label="Company Name *"
                value={form.companyName}
                onChange={e => setField('companyName', e.target.value)}
                placeholder="Google, Meta..."
                required
              />
            </div>
            <Input
              label="Hiring Manager (optional)"
              value={form.hiringManager || ''}
              onChange={e => setField('hiringManager', e.target.value)}
              placeholder="Mr. Ahmed Ali"
            />
            <Textarea
              label="Job Description (optional)"
              value={form.jobDescription || ''}
              onChange={e => setField('jobDescription', e.target.value)}
              placeholder="Paste the job description here for a better-matched letter..."
              rows={4}
            />
          </div>
        </Card>

        {/* Your Info */}
        <Card>
          <h3 className="section-title mb-4">Your Info</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Your Name"
                value={form.yourName}
                onChange={e => setField('yourName', e.target.value)}
                placeholder="John Doe"
              />
              <Input
                label="Your Email"
                value={form.yourEmail}
                onChange={e => setField('yourEmail', e.target.value)}
                placeholder="john@email.com"
              />
            </div>
            <Select
              label="Experience Level"
              options={LEVEL_OPTIONS}
              value={form.experienceLevel}
              onChange={e => setField('experienceLevel', e.target.value)}
            />
          </div>
        </Card>

        {/* Key Skills */}
        <Card>
          <h3 className="section-title mb-3">Key Skills</h3>
          <div className="flex gap-2 mb-3">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Add a skill (press Enter)"
            />
            <Button variant="glass" size="sm" onClick={() => addSkill()}>Add</Button>
          </div>
          {/* Quick-add chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {QUICK_SKILLS.filter(s => !form.keySkills.includes(s)).map(s => (
              <button
                key={s}
                onClick={() => addSkill(s)}
                className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 hover:border-primary-500/50 hover:text-primary-300 transition-all"
              >
                + {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {form.keySkills.map((skill, i) => (
              <button
                key={i}
                onClick={() => removeSkill(i)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition-all"
              >
                {skill} &times;
              </button>
            ))}
            {form.keySkills.length === 0 && (
              <p className="text-xs text-white/30">Add relevant skills for a better letter</p>
            )}
          </div>
        </Card>

        {/* Tone */}
        <Card>
          <h3 className="section-title mb-3">Tone</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TONES.map(t => (
              <button
                key={t.id}
                onClick={() => setField('tone', t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.tone === t.id
                    ? 'border-primary-500/60 bg-primary-500/15 text-white'
                    : 'border-white/10 bg-white/3 text-white/60 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div className="text-lg mb-1">{t.emoji}</div>
                <div className="text-xs font-bold">{t.label}</div>
                <div className="text-xs opacity-60 leading-tight">{t.desc}</div>
              </button>
            ))}
          </div>
        </Card>

        <Button
          variant="primary" size="lg" fullWidth glow
          loading={loading}
          icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
          onClick={handleGenerate}
        >
          {loading ? 'Generating with AI...' : 'Generate Cover Letter'}
        </Button>
      </motion.div>

      {/* ── Output Panel ── */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="section-title mb-0">Generated Letter</h3>
            {result && <Badge variant="success" size="sm" dot>Ready</Badge>}
          </div>
          {result && (
            <div className="flex gap-2">
              <Button variant="glass" size="sm" icon={copied ? <Check size={13} /> : <Copy size={13} />} onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button variant="glass" size="sm" icon={<RefreshCw size={13} />} onClick={handleGenerate} disabled={loading}>
                Redo
              </Button>
              <Button variant="primary" size="sm" icon={<Download size={13} />} onClick={handleExport}>
                PDF
              </Button>
            </div>
          )}
        </div>

        <Card className="min-h-[500px] relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
              <div className="relative">
                <Loader2 size={44} className="animate-spin text-primary-400" />
                <Sparkles size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-300" />
              </div>
              <div className="text-center">
                <p className="text-white/70 font-semibold">AI is crafting your letter...</p>
                <p className="text-white/30 text-xs mt-1">This may take 10-20 seconds</p>
              </div>
            </div>
          ) : result ? (
            <textarea
              value={result}
              onChange={e => setResult(e.target.value)}
              className="w-full bg-transparent text-white/80 text-sm leading-relaxed resize-none focus:outline-none min-h-[480px]"
              style={{ lineHeight: '1.85', fontFamily: 'inherit' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center flex-col gap-4 text-center p-8">
              <div className="text-5xl">✉️</div>
              <div>
                <p className="text-white/60 font-semibold mb-1">Your cover letter will appear here</p>
                <p className="text-white/30 text-sm">Fill in the details on the left and click Generate</p>
              </div>
            </div>
          )}
        </Card>

        {result && (
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Words',        value: result.split(/\s+/).filter(Boolean).length },
              { label: 'Characters',   value: result.length },
              { label: 'Reading Time', value: `${Math.ceil(result.split(/\s+/).length / 200)} min` },
            ].map(stat => (
              <div key={stat.label} className="p-3 rounded-xl bg-white/5 border border-white/8">
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
