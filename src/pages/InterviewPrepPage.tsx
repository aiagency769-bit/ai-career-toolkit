import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Wand2, ChevronDown, ChevronUp, Send, Loader2, Star, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ScoreRing } from '../components/ui/Progress'
import { generateInterviewQuestions, evaluateAnswer } from '../lib/gemini'
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

const CATEGORIES: { id: QuestionCategory; label: string; desc: string; color: string }[] = [
  { id: 'hr',          label: 'HR Questions',        desc: 'Common HR/behavioral questions',  color: 'from-primary-600/20 to-primary-800/10 border-primary-500/20' },
  { id: 'behavioral',  label: 'Behavioral (STAR)',   desc: 'Situation, Task, Action, Result', color: 'from-purple-600/20 to-purple-800/10 border-purple-500/20' },
  { id: 'technical',   label: 'Technical',           desc: 'Role-specific technical questions', color: 'from-cyan-600/20 to-cyan-800/10 border-cyan-500/20' },
  { id: 'situational', label: 'Situational',         desc: 'How would you handle scenarios',  color: 'from-amber-600/20 to-amber-800/10 border-amber-500/20' },
]

export const InterviewPrepPage: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [category, setCategory] = useState<QuestionCategory>('hr')
  const [questions, setQuestions] = useState<QA[]>([])
  const [loading, setLoading] = useState(false)
  const [evaluating, setEvaluating] = useState<string | null>(null)
  const [sessionScore, setSessionScore] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!jobTitle.trim()) { toast.error('Enter a job title first'); return }
    setLoading(true)
    try {
      const generated = await generateInterviewQuestions(jobTitle, category, 8)
      const qs: QA[] = generated.map((q, i) => ({
        id: String(i),
        question: q.question,
        tips: q.tips,
        sampleAnswer: q.sampleAnswer,
        userAnswer: '',
        expanded: i === 0,
      }))
      setQuestions(qs)
      setSessionScore(null)
      toast.success('Questions generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('Failed to generate questions')
    }
    setLoading(false)
  }

  const toggleExpand = (id: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, expanded: !q.expanded } : q))
  }

  const setAnswer = (id: string, answer: string) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, userAnswer: answer } : q))
  }

  const handleEvaluate = async (id: string) => {
    const q = questions.find(x => x.id === id)
    if (!q?.userAnswer?.trim()) { toast.error('Write your answer first'); return }
    setEvaluating(id)
    try {
      const eval_ = await evaluateAnswer(q.question, q.userAnswer, jobTitle)
      setQuestions(qs => qs.map(x => x.id === id ? { ...x, score: eval_.score, feedback: eval_.feedback, improvements: eval_.improvements } : x))

      // Calculate session score
      const scored = questions.filter(x => x.score !== undefined || x.id === id)
      const allScores = scored.map(x => x.id === id ? eval_.score : x.score!)
      setSessionScore(Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length))
      toast.success('Answer evaluated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('Evaluation failed')
    }
    setEvaluating(null)
  }

  return (
    <div className="space-y-6">
      {/* Setup */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <h3 className="section-title mb-4">Setup Interview Session</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input label="Job Role" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Software Engineer, Product Manager..." />
            <Select
              label="Question Type"
              value={category}
              onChange={e => setCategory(e.target.value as QuestionCategory)}
              options={CATEGORIES.map(c => ({ value: c.id, label: c.label }))}
            />
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === cat.id ? 'border-primary-500/60 bg-primary-500/15' : `bg-gradient-to-br ${cat.color} hover:opacity-80`
                }`}
              >
                <div className="text-xs font-bold text-white mb-1">{cat.label}</div>
                <div className="text-xs text-white/50">{cat.desc}</div>
              </button>
            ))}
          </div>

          <Button variant="primary" size="lg" glow loading={loading} icon={<Wand2 size={18} />} onClick={handleGenerate} fullWidth>
            Generate Interview Questions
          </Button>
        </Card>
      </motion.div>

      {/* Session Score */}
      {sessionScore !== null && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary-600/15 to-accent-600/10 border border-primary-500/20">
          <ScoreRing score={sessionScore} size={70} label="Score" />
          <div>
            <h4 className="font-bold text-white">Session Score: {sessionScore}/100</h4>
            <p className="text-white/50 text-sm">
              {sessionScore >= 80 ? '🎉 Excellent! You are ready for interviews.' : sessionScore >= 60 ? '👍 Good performance. Keep practicing!' : '📚 Keep practicing to improve your answers.'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Questions */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 size={40} className="animate-spin text-primary-400 mx-auto mb-4" />
          <p className="text-white/50">Generating questions for {jobTitle}...</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                className="w-full p-5 flex items-start gap-4 text-left hover:bg-white/3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium leading-relaxed">{q.question}</p>
                  {q.score !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} className={s <= Math.round(q.score! / 20) ? 'text-amber-400 fill-amber-400' : 'text-white/20'} />
                        ))}
                      </div>
                      <span className="text-xs text-white/50">Score: {q.score}/100</span>
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 text-white/40">
                  {q.expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {q.expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4">
                      {/* Tips */}
                      {q.tips.length > 0 && (
                        <div className="p-3 rounded-xl bg-primary-500/8 border border-primary-500/15">
                          <p className="text-xs font-bold text-primary-400 mb-2">💡 Tips:</p>
                          <ul className="space-y-1">
                            {q.tips.map((tip, i) => (
                              <li key={i} className="text-xs text-white/60 flex gap-2">
                                <span className="text-primary-400 flex-shrink-0">•</span>
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
                          placeholder="Type your answer here..."
                          rows={4}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          className="mt-2"
                          loading={evaluating === q.id}
                          icon={<Send size={14} />}
                          onClick={() => handleEvaluate(q.id)}
                          disabled={!q.userAnswer?.trim()}
                        >
                          Evaluate with AI
                        </Button>
                      </div>

                      {/* AI Feedback */}
                      {q.feedback && (
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-emerald-400" />
                            <span className="text-sm font-semibold text-white">AI Feedback</span>
                            {q.score !== undefined && (
                              <span className="ml-auto text-sm font-bold text-primary-400">{q.score}/100</span>
                            )}
                          </div>
                          <p className="text-sm text-white/70">{q.feedback}</p>
                          {q.improvements && q.improvements.length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-amber-400 mb-2">Improvements:</p>
                              <ul className="space-y-1">
                                {q.improvements.map((imp, i) => (
                                  <li key={i} className="text-xs text-white/60 flex gap-2">
                                    <span className="text-amber-400">→</span> {imp}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sample Answer */}
                      {q.sampleAnswer && (
                        <details className="group">
                          <summary className="text-xs text-primary-400 cursor-pointer hover:text-primary-300 transition-colors select-none">
                            👁 Show sample answer structure
                          </summary>
                          <div className="mt-2 p-3 rounded-xl bg-white/3 text-xs text-white/50 italic">
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

      {!loading && questions.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎤</div>
          <h3 className="text-xl font-bold text-white mb-2">Practice Makes Perfect</h3>
          <p className="text-white/40 text-sm max-w-sm mx-auto">
            Enter your target job role, select question type, and get AI-generated interview questions with feedback.
          </p>
        </div>
      )}
    </div>
  )
}
