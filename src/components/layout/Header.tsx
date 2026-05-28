import React from 'react'
import { motion } from 'framer-motion'
import { Menu, Bell, Search, Sparkles, Zap } from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard:          { title: 'Dashboard',             subtitle: 'Welcome back! Your career hub' },
  'resume-builder':   { title: 'Resume Builder',        subtitle: 'Craft your perfect resume with AI' },
  'cover-letter':     { title: 'Cover Letter Generator', subtitle: 'AI-powered personalized letters' },
  'ats-checker':      { title: 'ATS Resume Checker',    subtitle: 'Optimize for Applicant Tracking Systems' },
  'interview-prep':   { title: 'Interview Preparation', subtitle: 'Practice and ace your next interview' },
  'job-tracker':      { title: 'Job Application Tracker', subtitle: 'Stay on top of every opportunity' },
  'linkedin-optimizer': { title: 'LinkedIn & Bio Optimizer', subtitle: 'Stand out on every platform' },
  'career-coach':     { title: 'AI Career Coach',       subtitle: 'Your personalized career roadmap' },
  'govt-jobs':        { title: 'Government Jobs',       subtitle: 'FPSC, PPSC, PSC templates & guides' },
  viral:              { title: 'Roast My Resume 🔥',    subtitle: 'Get brutally honest AI feedback' },
  subscription:       { title: 'Upgrade to Pro',        subtitle: 'Unlock unlimited AI power' },
  settings:           { title: 'Settings',              subtitle: 'Manage your account & preferences' },
}

export const Header: React.FC = () => {
  const { currentPage, toggleSidebar, user, setPage } = useAppStore()
  const pageInfo = PAGE_TITLES[currentPage] || { title: 'AI Career Toolkit', subtitle: '' }

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-dark-950/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 md:px-6 h-16">
        {/* Mobile menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div className="flex-1 min-w-0">
          <motion.h1
            key={currentPage}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base md:text-lg font-bold text-white truncate"
          >
            {pageInfo.title}
          </motion.h1>
          <motion.p
            key={`${currentPage}-sub`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden sm:block text-xs text-white/40 truncate"
          >
            {pageInfo.subtitle}
          </motion.p>
        </div>

        {/* AI Credits badge */}
        {user?.plan === 'free' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage('subscription')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
          >
            <Zap size={13} />
            <span>{user.aiCredits} AI Credits</span>
          </motion.button>
        )}
        {user?.plan !== 'free' && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Pro</span>
          </div>
        )}

        {/* Search */}
        <button className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all hidden sm:flex">
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Avatar */}
        {user && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => setPage('settings')}
            className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-glow"
          >
            {user.fullName.slice(0, 2).toUpperCase()}
          </motion.button>
        )}
      </div>
    </header>
  )
}
