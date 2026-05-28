import React from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, FileText, BarChart3, Briefcase, Settings, type LucideIcon } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import type { AppPage } from '../../types'

const BOTTOM_NAV: { id: AppPage; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard',        label: 'Home',     icon: LayoutDashboard },
  { id: 'resume-builder',   label: 'Resume',   icon: FileText },
  { id: 'ats-checker',      label: 'ATS',      icon: BarChart3 },
  { id: 'job-tracker',      label: 'Jobs',     icon: Briefcase },
  { id: 'settings',         label: 'Settings', icon: Settings },
]

export const BottomNav: React.FC = () => {
  const { currentPage, setPage } = useAppStore()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-xl border-t border-white/8 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setPage(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive ? 'text-primary-400' : 'text-white/40'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-primary-500/20' : ''}`}>
                <Icon size={18} />
              </div>
              <span className="text-xs font-medium truncate">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottom-indicator"
                  className="absolute bottom-0 w-8 h-0.5 bg-primary-500 rounded-full"
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
