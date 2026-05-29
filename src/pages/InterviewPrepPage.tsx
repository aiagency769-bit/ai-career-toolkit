import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Wand2, ChevronDown, ChevronUp, Send, Loader2, Star, CheckCircle, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/Progress'
import { generateInterviewQuestions, evaluateAnswer } from '../lib/ai'
import toast from 'react-hot-toast'
import type { QuestionCategory } from '../types'

interface QA {
  id: string
  question: string
  tips: string[]
  sampleAnswer: string
  userAnswer?: string
  score?: number
  feedback?: string
  improvements?: string[]
  expanded: boolean
}

const CATEGORIES: { id: QuestionCategory; label: string; desc: string; color: string; icon: string }[] = [
  { id: 'hr',          label: 'HR / General',       desc: 'Common HR & behavioral',      color: 'from-primary-600/20 to-primary-800/10 border-primary-500/20',  icon: '👔' },
  { id: 'behavioral',  label: 'Behavioral (STAR)',  desc: 'Situation, Task, Action, Result', color: 'from-purple-600/20 to-purple-800/10 border-purple-500/20', icon: '🌟' },
  { id: 'technical',   label: 'Technical',          desc: 'Role-specific tech questions',  color: 'from-cyan-600/20 to-cyan-800/10 border-cyan-500/20',          icon: '⚙️' },
  { id: 'situational', label: 'Situational',        desc: 'How you handle scenarios',     color: 'from-amber-600/20 to-amber-800/10 border-amber-500/20',       icon: '🎯' },
]

const SAMPLE_ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Marketing Manager', 'Frontend Developer', 'HR Manager']

export const InterviewPrepPage: React.FC = () => {
  const [jobTitle,      setJobTitle]      = useState('')
  const [category,      setCategory]      = useState<QuestionCategory>('hr')
  const [questions,     setQuestions]     = useState<QA[]>([])
  const [loading,       setLoading]       = useState(false)
  const [evaluating,    setEvaluating]    = useState<string | null>(null)
  const [sessionScore,  setSessionScore]  = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!jobTitle.trim()) { toast.error('Please enter a job role first'); return }
    setLoading(true)
    setQuestions([])
    setSessionScore(null)
    try {
      const generated = await generateInterviewQuestions(jobTitle, category, 8)
      if (!generated || generated.length === 0) throw new Error('No questions returned')
      const qs: QA[] = generated.map((q, i) => ({
        id: String(i),
        question: q.question || `Question ${i + 1}`,
        tips: q.tips || [],
        sampleAnswer: q.sampleAnswer || '',
        userAnswer: '',
        expanded: i === 0,
      }))
      setQuestions(qs)
      toast.success(`${qs.length} questions generated!`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate questions'
      toast.error(msg)
    }
    setLoading(false)
  }

  const toggleExpand = (id: string) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, expanded: !q.expanded } : q))

  const setAnswer = (id: string, answer: string) =>
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, userAnswer: answer } : q))

  const handleEvaluate = async (id: string) => {
    const q = questions.find(x => x.id === id)
    if (!q?.userAnswer?.trim()) { toast.error('Write your answer first'); return }
    setEvaluating(id)
    try {
      const result = await evaluateAnswer(q.question, q.userAnswer, jobTitle)
      setQuestions(qs => qs.map(x =>
        x.id === id ? { ...x, score: result.score, feedback: result.feedback, improvements: result.improvements } : x
      ))
      const allAnswered = questions.filter(x => x.score !== undefined || x.id === id)
      const allScores = allAnswered.map(x => x.id === id ? result.score : x.score!)
      setSessionScore(Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length))
      toast.success('Answer evaluated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation failed'
      toast.error(msg)
    }
    setEvaluating(null)
  }

  const answeredCount = questions.filter(q => q.score !== undefined).length

  return (
    <div className="space-y-6">

      {/* Setup Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <h3 className="section-title mb-4 flex items-center gap-2">
            <MessageSquare size={16} className="text-primary-400" /> Setup Interview Session
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <Input
                label="Job Role / Position"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                placeholder="e.g. Software Engineer, Product Manager..."
              />
              {/* Quick role chips */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SAMPLE_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setJobTitle(role)}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 hover:border-primary-500/40 hover:text-primary-300 transition-all"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
            <Select
              label="Question Type"
              value={category}
              onChange={e => setCategory(e.target.value as QuestionCategory)}
              options={CATEGORIES.map(c => ({ value: c.id, label: `${c.icon} ${c.label}` }))}
            />
          </div>

          {/* Category visual cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === cat.id
                    ? 'border-primary-500/70 bg-primary-500/20 shadow-sm shadow-primary-500/20'
                    : `bg-gradient-to-br ${cat.color} hover:opacity-90`
                }`}
              >
                <div className="text-xl mb-1">{cat.icon}</div>
                <div className="text-xs font-bold text-white leading-tight">{cat.label}</div>
                <div className="text-xs text-white/50 leading-tight mt-0.5">{cat.desc}</div>
              </button>
            ))}
          </div>

          <Button
            variant="primary" size="lg" fullWidth glow
            loading={loading}
            icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            onClick={handleGenerate}
          >
            {loading ? `Generating questions for ${jobTitle || 'your role'}...` : 'Generate Interview Questions'}
          </Button>
        </Card>
      </motion.div>

      {/* Session Score Banner */}
      {sessionScore !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-600/15 to-accent-600/10 border border-primary-500/20"
        >
          <ScoreRing score={sessionScore} size={70} label="Score" />
          <div>
            <h4 className="font-bold text-white">Session Score: {sessionScore}/100</h4>
            <p className="text-white/50 text-sm mt-1">
              {sessionScore >= 80
                ? '🎉 Excellent! You are ready for interviews.'
                : sessionScore >= 60
                ? '👍 Good performance. Keep practicing!'
                : '📚 Keep practicing to improve your answers.'}
            </p>
            <p className="text-white/30 text-xs mt-1">{answeredCount} of {questions.length} questions answered</p>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="text-center py-16">
          <div className="relative inline-block mb-4">
            <Loader2 size={48} className="animate-spin text-primary-400" />
            <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-300" />
          </div>
          <p className="text-white/60 font-medium">Generating {category} questions for <span className="text-primary-400">{jobTitle}</span>...</p>
          <p className="text-white/30 text-xs mt-1">This may take 10–20 seconds</p>
        </div>
      )}

      {/* Questions list */}
      {!loading && questions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white/50">{questions.length} questions generated for <span className="text-white/70 font-semibold">{jobTitle}</span></p>
            <Badge variant="primary" size="sm">{answeredCount}/{questions.length} answered</Badge>
          </div>
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card overflow-hidden"
            >
              {/* Question header */}
              <button
                onClick={() => toggleExpand(q.id)}
                className="w-full p-4 flex items-start gap-3 text-left hover:bg-white/3 transition-colors"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${q.score !== undefined ? 'bg-emerald-500/80' : 'gradient-primary'}`}>
                  {q.score !== undefined ? <CheckCircle size={14} /> : idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 font-medium leading-relaxed text-sm">{q.question}</p>
                  {q.score !== undefined && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={11} className={s <= Math.round(q.score! / 20) ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
                        ))}
                      </div>
                      <span className="text-xs text-white/50">Score: {q.score}/100</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-white/40 mt-0.5">
                  {q.expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Expanded */}
              <AnimatePresence>
                {q.expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">

                      {/* Tips */}
                      {q.tips.length > 0 && (
                        <div className="p-3 rounded-xl bg-primary-500/8 border border-primary-500/15">
                          <p className="text-xs font-bold text-primary-400 mb-2">💡 Tips for answering:</p>
                          <ul className="space-y-1.5">
                            {q.tips.map((tip, i) => (
                              <li key={i} className="text-xs text-white/60 flex gap-2 leading-relaxed">
                                <span className="text-primary-400 flex-shrink-0 mt-0.5">•</span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Your Answer */}
                      <div>
                        <label className="text-sm font-medium text-white/70 block mb-2">Your Answer</label>
                        <Textarea
                          value={q.userAnswer || ''}
                          onChange={e => setAnswer(q.id, e.target.value)}
                          placeholder="Type your answer here using the STAR method (Situation, Task, Action, Result)..."
                          rows={4}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-2"
                          loading={evaluating === q.id}
                          icon={evaluating === q.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                          onClick={() => handleEvaluate(q.id)}
                          disabled={!q.userAnswer?.trim() || evaluating === q.id}
                        >
                          {evaluating === q.id ? 'Evaluating...' : 'Evaluate with AI'}
                        </Button>
                      </div>

                      {/* AI Feedback */}
                      {q.feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 space-y-3"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle size={15} className="text-emerald-400" />
                            <span className="text-sm font-semibold text-white">AI Feedback</span>
                            {q.score !== undefined && (
                              <span className="ml-auto text-sm font-bold text-primary-400 bg-primary-500/15 px-2 py-0.5 rounded-full">
                                {q.score}/100
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/70 leading-relaxed">{q.feedback}</p>
                          {q.improvements && q.improvements.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-amber-400 mb-2">Suggestions to improve:</p>
                              <ul className="space-y-1.5">
                                {q.improvements.map((imp, i) => (
                                  <li key={i} className="text-xs text-white/60 flex gap-2 leading-relaxed">
                                    <span className="text-amber-400 flex-shrink-0 mt-0.5">→</span> {imp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Sample Answer (hidden by default) */}
                      {q.sampleAnswer && (
                        <details className="group">
                          <summary className="text-xs text-primary-400/70 cursor-pointer hover:text-primary-300 transition-colors select-none">
                            👁️ Show sample answer structure
                          </summary>
                          <div className="mt-2 p-3 rounded-xl bg-white/3 border border-white/8 text-xs text-white/50 italic leading-relaxed">
                            {q.sampleAnswer}
                          </div>
                        </details>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && questions.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-bold text-white mb-2">Practice Makes Perfect</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
            Enter your target job role, select question type, and get AI-generated interview questions with instant feedback.
          </p>
        </div>
      )}
    </div>
  )
}
