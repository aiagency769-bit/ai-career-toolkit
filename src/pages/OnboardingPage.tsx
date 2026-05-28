import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, BarChart3, Brain, Briefcase, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../store/appStore'

const SLIDES = [
  {
    icon: FileText,
    color: 'from-primary-600 to-primary-800',
    glow: 'shadow-glow',
    title: 'AI-Powered Resume Builder',
    subtitle: 'Create stunning, ATS-friendly resumes in minutes',
    description: 'Choose from 20+ professional templates. Let AI write your summary, achievements, and skills. Export to PDF instantly.',
    features: ['20+ Templates', 'AI Writing', 'ATS Optimized', 'PDF Export'],
  },
  {
    icon: BarChart3,
    color: 'from-emerald-600 to-teal-700',
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.4)]',
    title: 'ATS Score Checker',
    subtitle: 'Know exactly how recruiters see your resume',
    description: 'Upload any resume and get an instant ATS score. Find missing keywords, fix formatting issues, and beat the bots.',
    features: ['ATS Score', 'Keyword Analysis', 'Fix Suggestions', 'Job Matching'],
  },
  {
    icon: Brain,
    color: 'from-accent-600 to-purple-800',
    glow: 'shadow-glow-accent',
    title: 'AI Career Coach',
    subtitle: 'Your personal career advisor, available 24/7',
    description: 'Get personalized career advice, skill gap analysis, learning roadmaps, and interview preparation powered by AI.',
    features: ['Career Paths', 'Skill Gaps', 'Learning Plan', 'Mock Interviews'],
  },
  {
    icon: Briefcase,
    color: 'from-amber-600 to-orange-700',
    glow: 'shadow-[0_0_30px_rgba(245,158,11,0.4)]',
    title: 'Job Application Tracker',
    subtitle: 'Never miss a follow-up again',
    description: 'Track all your job applications in one place. Set interview reminders, track status, and manage your entire job search.',
    features: ['Status Tracking', 'Reminders', 'Interview Dates', 'Notes & Tags'],
  },
]

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(0)
  const { setHasSeenOnboarding } = useAppStore()

  const slide = SLIDES[step]
  const Icon = slide.icon
  const isLast = step === SLIDES.length - 1

  return (
    <div className="fixed inset-0 animated-bg flex flex-col overflow-hidden">
      {/* Background orbs */}
      <div className="glow-orb w-96 h-96 bg-primary-600 top-[-20%] right-[-10%]" />
      <div className="glow-orb w-64 h-64 bg-accent-600 bottom-[-10%] left-[-5%]" />

      {/* Skip */}
      <div className="flex justify-end p-6">
        <button
          onClick={() => setHasSeenOnboarding(true)}
          className="text-white/40 text-sm hover:text-white/70 transition-colors"
        >
          Skip →
        </button>
      </div>

      {/* Slide content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex flex-col items-center text-center max-w-md"
          >
            {/* Icon */}
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.color} flex items-center justify-center mb-8 ${slide.glow}`}>
              <Icon size={56} className="text-white" />
            </div>

            {/* Text */}
            <h2 className="text-3xl font-black text-white mb-3 text-balance">{slide.title}</h2>
            <p className="text-primary-400 font-semibold mb-4">{slide.subtitle}</p>
            <p className="text-white/50 text-sm leading-relaxed mb-8">{slide.description}</p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {slide.features.map((f) => (
                <span key={f} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/8 border border-white/10 text-white/70">
                  ✓ {f}
                </span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="p-6 space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {SLIDES.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setStep(i)}
              animate={{ width: i === step ? 24 : 8 }}
              className={`h-2 rounded-full transition-colors ${i === step ? 'bg-primary-500' : 'bg-white/20'}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="ghost" size="lg" onClick={() => setStep(s => s - 1)} icon={<ChevronLeft size={18} />}>
              Back
            </Button>
          )}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            glow
            onClick={() => isLast ? setHasSeenOnboarding(true) : setStep(s => s + 1)}
            icon={isLast ? <Sparkles size={18} /> : <ArrowRight size={18} />}
            iconPosition="right"
          >
            {isLast ? 'Get Started Free' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}
