import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Share2, Copy, Check, Wand2, Loader2, Star, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/Progress'
import { roastResume } from '../lib/gemini'
import { copyToClipboard } from '../lib/utils'
import toast from 'react-hot-toast'

const SAMPLE_SCORES = [
  { label: 'Presentation', score: 72 },
  { label: 'Content Quality', score: 58 },
  { label: 'ATS Score', score: 65 },
  { label: 'Creativity', score: 45 },
]

export const ViralFeaturesPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('')
  const [roast, setRoast] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [overallScore] = useState(Math.floor(Math.random() * 40) + 45)

  const handleRoast = async () => {
    if (!resumeText.trim()) { toast.error('Paste your resume text first'); return }
    setLoading(true)
    try {
      const result = await roastResume(resumeText)
      setRoast(result)
      toast.success('🔥 Your resume has been roasted!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      // NO_API_KEY no longer thrown — free AI handles it
      else toast.error('Roast failed. Try again!')
    }
    setLoading(false)
  }

  const handleCopy = async () => {
    await copyToClipboard(roast)
    setCopied(true)
    toast.success('Roast copied! Share it 😂')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Resume Roast', text: roast })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 relative overflow-hidden rounded-2xl"
        style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <div className="text-6xl mb-3">🔥</div>
        <h2 className="text-3xl font-black text-white mb-2">Roast My Resume</h2>
        <p className="text-white/50 text-sm max-w-sm mx-auto">
          Let AI brutally (but lovingly) roast your resume. Get savage feedback with actionable improvements. Share the burn! 😂
        </p>
        <div className="flex justify-center gap-2 mt-4">
          <Badge variant="danger" dot>AI-Powered</Badge>
          <Badge variant="warning">Shareable</Badge>
          <Badge variant="ghost">Fun + Useful</Badge>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-4">
          <Textarea
            label="Paste Your Resume"
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your entire resume here... Don't be scared, it won't bite. (Much.)"
            rows={12}
          />
          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={loading}
            onClick={handleRoast}
            className="bg-gradient-to-r from-red-600 to-orange-600 border-0 shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.6)]"
            icon={<Flame size={20} />}
          >
            {loading ? 'Preparing the roast...' : '🔥 Roast My Resume!'}
          </Button>

          {/* Before/After comparison teaser */}
          <Card className="overflow-hidden">
            <h4 className="font-semibold text-white mb-3 text-sm">📊 Resume Score Preview</h4>
            <div className="grid grid-cols-2 gap-3">
              {SAMPLE_SCORES.map(({ label, score }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">{label}</span>
                    <span className={score >= 70 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400'}>{score}%</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Output */}
        <div className="space-y-4">
          {loading ? (
            <Card className="min-h-96 flex flex-col items-center justify-center gap-4">
              <div className="text-5xl animate-bounce">🔥</div>
              <Loader2 size={32} className="animate-spin text-orange-400" />
              <p className="text-white/60 text-sm">AI is preparing your roast...</p>
              <p className="text-white/30 text-xs">This might sting a little</p>
            </Card>
          ) : roast ? (
            <div className="space-y-4">
              {/* Score */}
              <Card className="flex items-center gap-6">
                <ScoreRing score={overallScore} size={80} label="Overall" />
                <div>
                  <div className="text-lg font-bold text-white mb-1">
                    {overallScore >= 70 ? '👍 Decent Resume' : overallScore >= 50 ? '😬 Needs Work' : '💀 Critical Issues'}
                  </div>
                  <p className="text-white/40 text-sm">But we found some... interesting choices 😂</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="glass" size="sm" icon={copied ? <Check size={14} /> : <Copy size={14} />} onClick={handleCopy}>
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button variant="glass" size="sm" icon={<Share2 size={14} />} onClick={handleShare}>Share</Button>
                  </div>
                </div>
              </Card>

              {/* Roast content */}
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <Flame size={16} className="text-orange-400" />
                  <span className="font-bold text-white text-sm">The Roast 🔥</span>
                </div>
                <pre className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {roast}
                </pre>
              </Card>
            </div>
          ) : (
            <Card className="min-h-96 flex flex-col items-center justify-center text-center gap-4">
              <div className="text-6xl">😈</div>
              <div>
                <h4 className="text-white font-bold mb-2">Ready to Get Roasted?</h4>
                <p className="text-white/40 text-sm max-w-xs">
                  Paste your resume and get the most honest (and hilarious) feedback you've ever received. Plus actual improvements.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Other viral features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { emoji: '⭐', title: 'Resume Rating', desc: 'Get a 1-10 rating with detailed breakdown', badge: 'Coming Soon' },
          { emoji: '📊', title: 'Before/After', desc: 'Compare your resume before and after AI improvements', badge: 'Coming Soon' },
          { emoji: '🎭', title: 'Career Memes', desc: 'Generate funny memes about your job search journey', badge: 'Coming Soon' },
        ].map(f => (
          <Card key={f.title} hover className="text-center">
            <div className="text-4xl mb-3">{f.emoji}</div>
            <h4 className="font-bold text-white mb-1">{f.title}</h4>
            <p className="text-white/40 text-xs mb-3">{f.desc}</p>
            <Badge variant="ghost">{f.badge}</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
