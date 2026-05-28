import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Copy, Check, Wand2, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { generateLinkedInHeadline, generateLinkedInSummary, generateFreelanceBio } from '../lib/gemini'
import { copyToClipboard } from '../lib/utils'
import toast from 'react-hot-toast'

type Tab = 'linkedin-headline' | 'linkedin-summary' | 'fiverr' | 'upwork' | 'freelancer'

const TABS: { id: Tab; label: string; emoji: string; desc: string }[] = [
  { id: 'linkedin-headline', label: 'LinkedIn Headline',  emoji: '💼', desc: 'Catchy headline that gets you noticed' },
  { id: 'linkedin-summary',  label: 'LinkedIn Summary',   emoji: '📝', desc: 'About section that wins connections' },
  { id: 'fiverr',            label: 'Fiverr Bio',         emoji: '🟢', desc: 'Gig description that gets orders' },
  { id: 'upwork',            label: 'Upwork Overview',    emoji: '🔵', desc: 'Profile that attracts clients' },
  { id: 'freelancer',        label: 'Freelancer Bio',     emoji: '🟡', desc: 'Profile that wins projects' },
]

export const LinkedInOptimizerPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('linkedin-headline')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | string[]>('')
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [industry, setIndustry] = useState('')
  const [skills, setSkills] = useState('')
  const [name, setName] = useState('')
  const [experience, setExperience] = useState('3')
  const [goals, setGoals] = useState('')
  const [specialization, setSpecialization] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setResult('')
    try {
      const skillArr = skills.split(',').map(s => s.trim()).filter(Boolean)

      if (tab === 'linkedin-headline') {
        const headlines = await generateLinkedInHeadline(title, skillArr, industry)
        setResult(headlines)
      } else if (tab === 'linkedin-summary') {
        const summary = await generateLinkedInSummary(name, title, experience + ' years', skillArr, goals)
        setResult(summary)
      } else {
        const platform = tab as 'fiverr' | 'upwork' | 'freelancer'
        const bio = await generateFreelanceBio(platform, skillArr, experience + ' years', specialization)
        setResult(bio)
      }
      toast.success('Content generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('Generation failed. Please try again.')
    }
    setLoading(false)
  }

  const handleCopy = async (text: string, idx?: number) => {
    await copyToClipboard(text)
    setCopiedIdx(idx ?? 0)
    toast.success('Copied!')
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const isArray = Array.isArray(result) && result.length > 0
  const isString = typeof result === 'string' && result.length > 0

  return (
    <div className="space-y-6">
      {/* Tab selector */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setResult('') }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-primary-600 text-white shadow-glow' : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="space-y-4">
          <div>
            <h3 className="section-title">{TABS.find(t => t.id === tab)?.label}</h3>
            <p className="section-subtitle">{TABS.find(t => t.id === tab)?.desc}</p>
          </div>

          {(tab === 'linkedin-headline' || tab === 'linkedin-summary') && (
            <>
              <Input label="Current Job Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Full Stack Developer" />
              <Input label="Industry" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="Software, Marketing, Finance..." />
              <Input label="Top Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, Leadership..." />
            </>
          )}

          {tab === 'linkedin-summary' && (
            <>
              <Input label="Your Name" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
              <Input label="Years of Experience" type="number" value={experience} onChange={e => setExperience(e.target.value)} placeholder="3" />
              <Textarea label="Career Goals / Value Proposition" value={goals} onChange={e => setGoals(e.target.value)} placeholder="What value do you bring? What are you seeking?" rows={3} />
            </>
          )}

          {(tab === 'fiverr' || tab === 'upwork' || tab === 'freelancer') && (
            <>
              <Input label="Your Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Logo Design, Web Development..." />
              <Input label="Top Skills (comma separated)" value={skills} onChange={e => setSkills(e.target.value)} placeholder="Figma, WordPress, Python..." />
              <Select
                label="Years of Experience"
                value={experience}
                onChange={e => setExperience(e.target.value)}
                options={['1', '2', '3', '4', '5', '6', '7', '8', '10+'].map(v => ({ value: v, label: `${v} year${parseInt(v) > 1 ? 's' : ''}` }))}
              />
            </>
          )}

          <Button variant="primary" size="lg" fullWidth glow loading={loading} icon={<Wand2 size={18} />} onClick={handleGenerate}>
            Generate with AI
          </Button>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Generated Content</h3>
            {(isArray || isString) && (
              <Button variant="glass" size="sm" icon={<RefreshCw size={14} />} onClick={handleGenerate} disabled={loading}>
                Regenerate
              </Button>
            )}
          </div>

          {loading ? (
            <Card className="min-h-64 flex items-center justify-center flex-col gap-4">
              <Loader2 size={36} className="animate-spin text-primary-400" />
              <p className="text-white/50 text-sm">AI is writing for you...</p>
            </Card>
          ) : isArray ? (
            <div className="space-y-3">
              <p className="text-xs text-white/40">Pick your favorite headline:</p>
              {(result as string[]).map((headline, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/8 hover:border-primary-500/20 transition-all group"
                >
                  <span className="text-xs font-bold text-primary-400 mt-0.5 flex-shrink-0">{i + 1}</span>
                  <p className="flex-1 text-white text-sm leading-relaxed">{headline}</p>
                  <button
                    onClick={() => handleCopy(headline, i)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white flex-shrink-0"
                  >
                    {copiedIdx === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                </motion.div>
              ))}
            </div>
          ) : isString ? (
            <Card className="relative space-y-3">
              <div className="absolute top-3 right-3">
                <Button variant="glass" size="sm" icon={copiedIdx === 0 ? <Check size={14} /> : <Copy size={14} />} onClick={() => handleCopy(result as string, 0)}>
                  {copiedIdx === 0 ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="pt-8">
                <textarea
                  value={result as string}
                  onChange={e => setResult(e.target.value)}
                  className="w-full bg-transparent text-white/80 text-sm leading-relaxed resize-none focus:outline-none min-h-60"
                  style={{ lineHeight: '1.8' }}
                />
              </div>
              <div className="flex gap-4 text-xs text-white/30 border-t border-white/8 pt-3">
                <span>{(result as string).split(/\s+/).length} words</span>
                <span>{(result as string).length} characters</span>
              </div>
            </Card>
          ) : (
            <Card className="min-h-64 flex items-center justify-center text-center">
              <div>
                <div className="text-5xl mb-4">{TABS.find(t => t.id === tab)?.emoji}</div>
                <p className="text-white/50 font-semibold mb-1">Your content will appear here</p>
                <p className="text-white/30 text-sm">Fill in the details and click Generate</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
