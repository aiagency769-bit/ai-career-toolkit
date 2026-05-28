import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, BarChart3, CheckCircle, XCircle, AlertCircle, Wand2, FileText, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { ScoreRing, Progress } from '../components/ui/Progress'
import { analyzeResume } from '../lib/gemini'
import { extractTextFromFile } from '../lib/pdfExport'
import toast from 'react-hot-toast'
import type { ATSResult } from '../types'
import { getATSGradeColor } from '../lib/utils'

export const ATSCheckerPage: React.FC = () => {
  const [resumeText, setResumeText] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ATSResult | null>(null)
  const [dragging, setDragging] = useState(false)

  const handleFile = async (file: File) => {
    if (!file) return
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      toast.error('PDF text extraction requires server-side processing. Please paste text directly.')
      return
    }
    try {
      const text = await extractTextFromFile(file)
      setResumeText(text)
      toast.success('File loaded! Click "Analyze" to check ATS score.')
    } catch {
      toast.error('Failed to read file')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [])

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text first')
      return
    }
    setLoading(true)
    try {
      const r = await analyzeResume(resumeText, jobDesc || undefined)
      setResult(r)
      toast.success('ATS analysis complete!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      // NO_API_KEY no longer thrown — free AI handles it
      else toast.error('Analysis failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Input area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <h3 className="section-title">Resume Text</h3>
            <p className="section-subtitle">Paste your resume content or upload a .txt file</p>
          </div>

          {/* Upload zone */}
          <div
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              dragging ? 'border-primary-500 bg-primary-500/10' : 'border-white/20 hover:border-primary-500/50 hover:bg-white/3'
            }`}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input id="file-input" type="file" accept=".txt,.doc,.docx" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
            <Upload size={24} className="text-white/30 mx-auto mb-2" />
            <p className="text-sm text-white/50">Drop file here or click to upload</p>
            <p className="text-xs text-white/30 mt-1">.txt, .doc, .docx supported</p>
          </div>

          <Textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Or paste your entire resume text here..."
            rows={10}
          />
        </motion.div>

        {/* Job description */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div>
            <h3 className="section-title">Job Description <span className="text-white/30 text-sm font-normal">(Optional)</span></h3>
            <p className="section-subtitle">Add job description for keyword matching analysis</p>
          </div>
          <Textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the job description to match keywords and requirements..."
            rows={12}
          />
          <Button variant="primary" size="lg" fullWidth glow loading={loading} icon={<Wand2 size={18} />} onClick={handleAnalyze}>
            {loading ? 'Analyzing...' : 'Analyze ATS Score'}
          </Button>
        </motion.div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12">
            <div className="inline-flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-primary-500" />
                </div>
              </div>
              <div>
                <p className="text-white font-semibold">Analyzing your resume...</p>
                <p className="text-white/40 text-sm mt-1">Checking ATS compatibility, keywords & formatting</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Score overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="text-center" padding="lg">
                <ScoreRing score={result.score} size={100} label="ATS Score" />
                <div className={`text-3xl font-black mt-3 ${getATSGradeColor(result.grade)}`}>Grade: {result.grade}</div>
                <p className="text-white/40 text-xs mt-1">
                  {result.score >= 80 ? 'Excellent! Passes most ATS' : result.score >= 60 ? 'Good. Some improvements needed' : result.score >= 40 ? 'Needs significant work' : 'Major issues found'}
                </p>
              </Card>

              <Card>
                <p className="text-sm text-white/50 mb-2">Readability</p>
                <Progress value={result.readabilityScore} showValue animated color="auto" />
                <p className="text-xs text-white/40 mt-3">Length: <span className="text-white capitalize">{result.lengthAnalysis}</span></p>
                <div className="mt-4 space-y-1">
                  {result.sections.slice(0, 4).map((sec) => (
                    <div key={sec.name} className="flex items-center justify-between text-xs">
                      <span className="text-white/60">{sec.name}</span>
                      {sec.present
                        ? <Badge variant={sec.strength === 'strong' ? 'success' : sec.strength === 'medium' ? 'primary' : 'warning'} size="sm">{sec.strength}</Badge>
                        : <Badge variant="danger" size="sm">Missing</Badge>
                      }
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><CheckCircle size={14} className="text-emerald-400" /> Keywords Found</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.found.slice(0, 10).map(kw => (
                    <span key={kw} className="px-2 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{kw}</span>
                  ))}
                  {result.keywords.found.length === 0 && <span className="text-white/30 text-xs">None found</span>}
                </div>
              </Card>

              <Card>
                <p className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><XCircle size={14} className="text-red-400" /> Missing Keywords</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.keywords.missing.slice(0, 10).map(kw => (
                    <span key={kw} className="px-2 py-1 rounded-full text-xs bg-red-500/15 text-red-300 border border-red-500/20">{kw}</span>
                  ))}
                  {result.keywords.missing.length === 0 && <span className="text-emerald-400 text-xs">All keywords present! ✓</span>}
                </div>
              </Card>
            </div>

            {/* Suggestions + Formatting */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <h3 className="section-title flex items-center gap-2 mb-4">
                  <AlertCircle size={16} className="text-amber-400" /> Improvement Suggestions
                </h3>
                <div className="space-y-3">
                  {result.suggestions.map((sug, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/15">
                      <span className="text-amber-400 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                      <p className="text-white/70 text-sm">{sug}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <h3 className="section-title mb-4">Formatting Analysis</h3>
                <div className="space-y-2">
                  {result.formatting.passed.map(p => (
                    <div key={p} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-white/70">{p}</span>
                    </div>
                  ))}
                  {result.formatting.issues.map(issue => (
                    <div key={issue} className="flex items-center gap-2 text-sm">
                      <XCircle size={14} className="text-red-400 flex-shrink-0" />
                      <span className="text-white/70">{issue}</span>
                    </div>
                  ))}
                </div>

                {result.actionVerbs.weak.length > 0 && (
                  <div className="mt-4 p-3 rounded-xl bg-orange-500/8 border border-orange-500/15">
                    <p className="text-xs font-semibold text-orange-400 mb-2">Weak action verbs found:</p>
                    <p className="text-xs text-white/50">{result.actionVerbs.weak.join(', ')}</p>
                    <p className="text-xs text-emerald-400 mt-2">Try: Led, Drove, Spearheaded, Optimized, Achieved, Implemented</p>
                  </div>
                )}
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!result && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-white mb-2">Beat the ATS System</h3>
          <p className="text-white/40 text-sm max-w-md mx-auto">
            90% of resumes are rejected by ATS before a human ever sees them. Paste your resume above to find out how yours performs.
          </p>
        </div>
      )}
    </div>
  )
}
