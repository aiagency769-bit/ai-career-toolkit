import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Mail, BarChart3, MessageSquare,
  Briefcase, Linkedin, Brain, Building2, Flame, Settings,
  Crown, ChevronRight, X, Sparkles, Zap, type LucideIcon
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import type { AppPage } from '../../types'

const NAV_ITEMS: { id: AppPage; label: string; icon: LucideIcon; badge?: string; isPremium?: boolean; group?: string }[] = [
  { id: 'dashboard',          label: 'Dashboard',        icon: LayoutDashboard, group: 'main' },
  { id: 'resume-builder',     label: 'Resume Builder',   icon: FileText,        group: 'main' },
  { id: 'cover-letter',       label: 'Cover Letter',     icon: Mail,            group: 'main' },
  { id: 'ats-checker',        label: 'ATS Checker',      icon: BarChart3,       group: 'main', badge: 'AI' },
  { id: 'interview-prep',     label: 'Interview Prep',   icon: MessageSquare,   group: 'career' },
  { id: 'job-tracker',        label: 'Job Tracker',      icon: Briefcase,       group: 'career' },
  { id: 'linkedin-optimizer', label: 'LinkedIn & Bio',   icon: Linkedin,        group: 'career', badge: 'AI' },
  { id: 'career-coach',       label: 'Career Coach',     icon: Brain,           group: 'career', badge: 'AI' },
  { id: 'govt-jobs',          label: 'Govt Jobs',        icon: Building2,       group: 'special' },
  { id: 'viral',              label: 'Roast My Resume',  icon: Flame,           group: 'special', badge: '🔥' },
  { id: 'subscription',       label: 'Upgrade Pro',      icon: Crown,           group: 'account', isPremium: true },
  { id: 'settings',           label: 'Settings',         icon: Settings,        group: 'account' },
]

const GROUPS = [
  { id: 'main',    label: 'Tools' },
  { id: 'career',  label: 'Career' },
  { id: 'special', label: 'Special' },
  { id: 'account', label: 'Account' },
]

export const Sidebar: React.FC = () => {
  const { currentPage, setPage, sidebarOpen, setSidebarOpen, user } = useAppStore()

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-none">AI Career</div>
            <div className="text-xs text-white/40 mt-0.5">Toolkit</div>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* User info */}
      {user && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white/5 border border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user.fullName}</div>
            <div className="text-xs text-white/40 truncate">{user.plan === 'free' ? 'Free Plan' : '⭐ Pro Plan'}</div>
          </div>
          {user.plan === 'free' && (
            <div className="ml-auto flex-shrink-0">
              <div className="text-xs text-amber-400 font-semibold">{user.aiCredits} AI</div>
            </div>
          )}
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-4 space-y-5">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group.id)
          return (
            <div key={group.id}>
              <div className="text-xs font-semibold text-white/25 uppercase tracking-wider px-3 mb-2">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = currentPage === item.id
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setPage(item.id); setSidebarOpen(false) }}
                      className={`sidebar-item w-full text-left ${isActive ? 'active' : ''} ${item.isPremium ? 'text-amber-400/80 hover:text-amber-300' : ''}`}
                    >
                      <Icon size={17} className={isActive ? 'text-primary-400' : item.isPremium ? 'text-amber-400' : ''} />
                      <span className="flex-1 text-sm">{item.label}</span>
                      {item.badge && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${
                          item.badge === '🔥' ? '' :
                          item.badge === 'AI' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/10 text-white/60'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight size={14} className="text-primary-400" />}
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Bottom upgrade banner */}
      {user?.plan === 'free' && (
        <div className="p-3 border-t border-white/8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setPage('subscription')}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-primary-600/30 to-accent-600/30 border border-primary-500/20 text-left group hover:border-primary-500/40 transition-all"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-amber-400" />
              <span className="text-xs font-bold text-amber-400">Upgrade to Pro</span>
            </div>
            <div className="text-xs text-white/40">Unlimited AI, templates & exports</div>
          </motion.button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 flex-col h-screen bg-dark-900/80 backdrop-blur-xl border-r border-white/8 sticky top-0 flex-shrink-0">
        {content}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="fixed left-0 top-0 h-full w-72 z-50 bg-dark-900/98 backdrop-blur-xl border-r border-white/10 md:hidden overflow-y-auto"
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
