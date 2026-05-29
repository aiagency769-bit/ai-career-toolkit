import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, Wand2, Loader2, Plus, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select, Textarea } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { analyzeCareerPath } from '../lib/ai'
import toast from 'react-hot-toast'

export const CareerCoachPage: React.FC = () => {
  const [skills, setSkills] = useState<string[]>([])
  const [interests, setInterests] = useState<string[]>([])
  const [education, setEducation] = useState('bachelor')
  const [experience, setExperience] = useState(2)
  const [skillInput, setSkillInput] = useState('')
  const [interestInput, setInterestInput] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    if (!skillInput.trim()) return
    setSkills(s => [...s, skillInput.trim()])
    setSkillInput('')
  }

  const addInterest = () => {
    if (!interestInput.trim()) return
    setInterests(i => [...i, interestInput.trim()])
    setInterestInput('')
  }

  const handleAnalyze = async () => {
    if (skills.length === 0 && interests.length === 0) {
      toast.error('Add at least one skill or interest')
      return
    }
    setLoading(true)
    try {
      const r = await analyzeCareerPath(skills, interests, education, experience)
      setResult(r)
      toast.success('Career analysis complete!')
    } catch (err: unknown) {
      if (false) {} else toast.error('Analysis failed. Please try again.')
    }
    setLoading(false)
  }

  const CAREERS = ['Web Developer', 'Data Scientist', 'Product Manager', 'UX Designer', 'DevOps Engineer', 'Digital Marketer', 'Content Creator', 'Cybersecurity Analyst']
  const INTERESTS_DEMO = ['Technology', 'Design', 'Data', 'Business', 'Teaching', 'Writing', 'Gaming', 'Finance']

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-5">
          <Card className="space-y-4">
            <h3 className="section-title flex items-center gap-2"><Brain size={18} className="text-pink-400" /> Your Profile</h3>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Education Level"
                value={education}
                onChange={e => setEducation(e.target.value)}
                options={[
                  { value: 'high-school',  label: 'High School' },
                  { value: 'bachelor',     label: "Bachelor's" },
                  { value: 'master',       label: "Master's" },
                  { value: 'phd',          label: 'PhD' },
                  { value: 'self-taught',  label: 'Self-Taught' },
                ]}
              />
              <Select
                label="Years of Experience"
                value={String(experience)}
                onChange={e => setExperience(Number(e.target.value))}
                options={[0,1,2,3,4,5,7,10].map(v => ({ value: String(v), label: v === 0 ? 'Student/Fresher' : `${v} years` }))}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Your Current Skills</label>
              <div className="flex gap-2 mb-2">
                <Input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addSkill()} placeholder="Add a skill..." />
                <Button variant="glass" size="sm" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {skills.map((skill, i) => (
                  <button key={i} onClick={() => setSkills(s => s.filter((_, j) => j !== i))} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-primary-500/20 text-primary-300 border border-primary-500/30 hover:bg-red-500/20 hover:text-red-300 transition-all">
                    {skill} <X size={11} />
                  </button>
                ))}
              </div>
              {skills.length === 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {CAREERS.map(c => (
                    <button key={c} onClick={() => setSkills(s => [...new Set([...s, c])])} className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/40 border border-white/10 hover:bg-primary-500/15 hover:text-primary-300 transition-all">
                      + {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Interests & Passions</label>
              <div className="flex gap-2 mb-2">
                <Input value={interestInput} onChange={e => setInterestInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addInterest()} placeholder="Add an interest..." />
                <Button variant="glass" size="sm" onClick={addInterest}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {interests.map((interest, i) => (
                  <button key={i} onClick={() => setInterests(s => s.filter((_, j) => j !== i))} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-accent-500/20 text-accent-300 border border-accent-500/30 hover:bg-red-500/20 hover:text-red-300 transition-all">
                    {interest} <X size={11} />
                  </button>
                ))}
              </div>
              {interests.length === 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {INTERESTS_DEMO.map(c => (
                    <button key={c} onClick={() => setInterests(s => [...new Set([...s, c])])} className="px-2 py-1 rounded-full text-xs bg-white/5 text-white/40 border border-white/10 hover:bg-accent-500/15 hover:text-accent-300 transition-all">
                      + {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button variant="primary" size="lg" fullWidth glow loading={loading} icon={<Wand2 size={18} />} onClick={handleAnalyze}>
              Analyze Career Paths
            </Button>
          </Card>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <div className="text-2xl font-bold text-white">{skills.length}</div>
              <div className="text-xs text-white/40 mt-1">Skills Added</div>
            </Card>
            <Card className="text-center">
              <div className="text-2xl font-bold text-white">{interests.length}</div>
              <div className="text-xs text-white/40 mt-1">Interests Added</div>
            </Card>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <h3 className="section-title">Career Analysis</h3>

          {loading ? (
            <Card className="min-h-96 flex flex-col items-center justify-center gap-4">
              <Loader2 size={40} className="animate-spin text-pink-400" />
              <div className="text-center">
                <p className="text-white font-semibold">Analyzing your career potential...</p>
                <p className="text-white/40 text-sm mt-1">AI is mapping your skills to career opportunities</p>
              </div>
            </Card>
          ) : result ? (
            <Card className="min-h-96">
              <pre className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                {result}
              </pre>
            </Card>
          ) : (
            <Card className="min-h-96 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center shadow-glow-accent">
                <Brain size={40} className="text-white" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-2">Discover Your Ideal Career Path</h4>
                <p className="text-white/40 text-sm max-w-xs">
                  Add your skills and interests, then let AI suggest the best career paths with learning roadmaps.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
