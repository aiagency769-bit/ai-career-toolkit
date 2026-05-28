import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText, BarChart3, Brain, Briefcase, Mail, MessageSquare,
  Linkedin, Building2, Flame, TrendingUp, Clock, CheckCircle,
  ArrowRight, Sparkles, Zap, Star, type LucideIcon
} from 'lucide-react'
import { Card, StatCard } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Progress } from '../components/ui/Progress'
import { useAppStore } from '../store/appStore'
import { useResumeStore } from '../store/resumeStore'
import { useJobStore } from '../store/jobStore'
import type { AppPage } from '../types'

const QUICK_ACTIONS: {
  id: AppPage; title: string; desc: string; icon: LucideIcon;
  color: string; badge?: string; gradient: string
}[] = [
  { id: 'resume-builder',     title: 'Build Resume',       desc: 'AI-powered templates',    icon: FileText,     color: 'text-primary-400',  gradient: 'from-primary-600/20 to-primary-800/10 border-primary-500/20',  badge: 'Popular' },
  { id: 'ats-checker',        title: 'ATS Checker',         desc: 'Score your resume',        icon: BarChart3,    color: 'text-emerald-400',  gradient: 'from-emerald-600/20 to-teal-800/10 border-emerald-500/20',     badge: 'AI' },
  { id: 'cover-letter',       title: 'Cover Letter',        desc: 'Generate in seconds',      icon: Mail,         color: 'text-blue-400',     gradient: 'from-blue-600/20 to-blue-800/10 border-blue-500/20' },
  { id: 'interview-prep',     title: 'Interview Prep',      desc: 'Practice questions',       icon: MessageSquare, color: 'text-purple-400',  gradient: 'from-purple-600/20 to-purple-800/10 border-purple-500/20' },
  { id: 'linkedin-optimizer', title: 'LinkedIn Bio',        desc: 'Optimize your profile',    icon: Linkedin,     color: 'text-sky-400',      gradient: 'from-sky-600/20 to-sky-800/10 border-sky-500/20' },
  { id: 'career-coach',       title: 'Career Coach',        desc: 'AI career guidance',       icon: Brain,        color: 'text-pink-400',     gradient: 'from-pink-600/20 to-pink-800/10 border-pink-500/20',          badge: 'AI' },
  { id: 'job-tracker',        title: 'Job Tracker',         desc: 'Track applications',       icon: Briefcase,    color: 'text-amber-400',    gradient: 'from-amber-600/20 to-amber-800/10 border-amber-500/20' },
  { id: 'govt-jobs',          title: 'Govt Jobs',           desc: 'FPSC/PPSC templates',      icon: Building2,    color: 'text-teal-400',     gradient: 'from-teal-600/20 to-teal-800/10 border-teal-500/20' },
  { id: 'viral',              title: 'Roast Resume 🔥',     desc: 'Get savage feedback',      icon: Flame,        color: 'text-orange-400',   gradient: 'from-orange-600/20 to-red-800/10 border-orange-500/20',       badge: 'Viral' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
}

export const DashboardPage: React.FC = () => {
  const { setPage, user, geminiApiKey } = useAppStore()
  const { resumes } = useResumeStore()
  const { applications } = useJobStore()
  const hasApiKey = !!(geminiApiKey || localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY)

  const activeJobs = applications.filter(a => ['applied', 'interview', 'pending'].includes(a.status)).length
  const interviews = applications.filter(a => a.status === 'interview').length
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">


      {/* Welcome hero */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{ background: 'linear-gradient(135deg, rgba(97,114,243,0.15) 0%, rgba(192,68,239,0.1) 100%)', border: '1px solid rgba(97,114,243,0.2)' }}
      >
        <div className="glow-orb w-64 h-64 bg-primary-600 right-[-5%] top-[-30%] opacity-20" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👋</span>
              <span className="text-white/50 text-sm">{greeting}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-1">
              {user?.fullName || 'Career Pro'}!
            </h2>
            <p className="text-white/50 text-sm">
              {resumes.length === 0
                ? 'Start building your career today — create your first resume.'
                : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''} and ${activeJobs} active applications.`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="primary" size="md" glow icon={<Sparkles size={16} />} onClick={() => setPage('resume-builder')}>
              Build Resume
            </Button>
            {user?.plan === 'free' && (
              <Button variant="ghost" size="md" icon={<Zap size={16} />} onClick={() => setPage('subscription')}>
                Upgrade
              </Button>
            )}
          </div>
        </div>

        {/* Streak / quick stats */}
        <div className="flex gap-4 mt-6 flex-wrap">
          {[
            { label: 'Resumes', value: resumes.length, icon: '📄' },
            { label: 'Applications', value: applications.length, icon: '📋' },
            { label: 'AI Credits', value: user?.plan === 'free' ? user.aiCredits : '∞', icon: '⚡' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <span className="text-lg">{s.icon}</span>
              <div>
                <div className="text-lg font-bold text-white leading-none">{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Resumes" value={resumes.length} icon={<FileText size={20} />} color="primary" />
        <StatCard title="Active Jobs" value={activeJobs} subtitle="In pipeline" icon={<TrendingUp size={20} />} color="success" />
        <StatCard title="Interviews" value={interviews} subtitle="Scheduled" icon={<Clock size={20} />} color="purple" />
        <StatCard title="AI Credits" value={user?.plan === 'free' ? user.aiCredits ?? 0 : '∞'} icon={<Zap size={20} />} color="warning" />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Quick Actions</h3>
            <p className="section-subtitle">Everything you need for your job search</p>
          </div>
        </div>
        <motion.div
          variants={container}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <motion.div
                key={action.id}
                variants={item}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPage(action.id)}
                className={`relative p-5 rounded-2xl border bg-gradient-to-br ${action.gradient} cursor-pointer group transition-all duration-200 hover:shadow-glow overflow-hidden`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-white/8 ${action.color}`}>
                    <Icon size={22} />
                  </div>
                  {action.badge && (
                    <Badge variant={action.badge === 'AI' ? 'primary' : action.badge === 'Viral' ? 'danger' : 'success'} size="sm">
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <h4 className="font-bold text-white mb-1">{action.title}</h4>
                <p className="text-xs text-white/50">{action.desc}</p>
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={16} className="text-white/60" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </motion.div>

      {/* Resume list + Job tracker preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Resumes */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Recent Resumes</h3>
            <button onClick={() => setPage('resume-builder')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>

          {resumes.length === 0 ? (
            <Card className="text-center py-10">
              <div className="text-4xl mb-3">📄</div>
              <p className="text-white/50 text-sm mb-4">No resumes yet. Create your first one!</p>
              <Button variant="primary" size="sm" onClick={() => setPage('resume-builder')}>
                Build Resume
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 4).map((resume) => (
                <motion.div
                  key={resume.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setPage('resume-builder')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8 cursor-pointer hover:bg-white/8 hover:border-white/12 transition-all group"
                >
                  <div className="w-10 h-12 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
                    <FileText size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{resume.title}</div>
                    <div className="text-xs text-white/40 mt-0.5 flex items-center gap-2">
                      <span className="capitalize">{resume.template} template</span>
                      {resume.atsScore && (
                        <span className="text-emerald-400">ATS: {resume.atsScore}%</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight size={16} className="text-white/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Job Applications */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Job Applications</h3>
            <button onClick={() => setPage('job-tracker')} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>

          {applications.length === 0 ? (
            <Card className="text-center py-10">
              <div className="text-4xl mb-3">💼</div>
              <p className="text-white/50 text-sm mb-4">Track your job applications here</p>
              <Button variant="primary" size="sm" onClick={() => setPage('job-tracker')}>
                Add Application
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 4).map((app) => (
                <motion.div
                  key={app.id}
                  whileHover={{ x: 3 }}
                  onClick={() => setPage('job-tracker')}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8 cursor-pointer hover:bg-white/8 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-800/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={16} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{app.jobTitle}</div>
                    <div className="text-xs text-white/40">{app.company}</div>
                  </div>
                  <Badge
                    variant={
                      app.status === 'accepted' ? 'success' :
                      app.status === 'rejected' ? 'danger' :
                      app.status === 'interview' ? 'purple' :
                      app.status === 'applied' ? 'primary' : 'ghost'
                    }
                    size="sm"
                  >
                    {app.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Pro tips / CTA */}
      {user?.plan === 'free' && (
        <motion.div
          variants={item}
          className="relative overflow-hidden rounded-2xl p-6"
          style={{ background: 'linear-gradient(135deg, rgba(192,68,239,0.15), rgba(97,114,243,0.15))', border: '1px solid rgba(192,68,239,0.2)' }}
        >
          <div className="glow-orb w-48 h-48 bg-accent-600 right-0 top-0 opacity-20" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/20">
                <Star size={24} className="text-amber-400" />
              </div>
              <div>
                <h4 className="font-bold text-white mb-0.5">Upgrade to Pro — Unlock Everything</h4>
                <p className="text-white/50 text-sm">Unlimited AI, all templates, ATS optimization, priority support</p>
              </div>
            </div>
            <Button variant="primary" size="md" glow icon={<Zap size={16} />} onClick={() => setPage('subscription')}>
              Go Pro — $4.99/mo
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
