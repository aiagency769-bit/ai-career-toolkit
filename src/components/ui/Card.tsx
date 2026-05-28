import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  glow?: boolean
  gradient?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  glow = false,
  gradient = false,
  padding = 'md',
}) => {
  const pads = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' }

  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      onClick={onClick}
      className={`
        glass-card ${pads[padding]}
        ${hover ? 'cursor-pointer hover:border-primary-500/30' : ''}
        ${glow ? 'hover:shadow-glow' : ''}
        ${gradient ? 'bg-gradient-to-br from-primary-600/10 to-accent-600/10' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  color?: 'primary' | 'purple' | 'success' | 'warning' | 'danger'
  trend?: { value: number; label: string }
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color = 'primary', trend }) => {
  const colors = {
    primary: 'from-primary-600/20 to-primary-800/10 border-primary-500/20',
    purple: 'from-accent-600/20 to-accent-800/10 border-accent-500/20',
    success: 'from-emerald-600/20 to-emerald-800/10 border-emerald-500/20',
    warning: 'from-amber-600/20 to-amber-800/10 border-amber-500/20',
    danger: 'from-red-600/20 to-red-800/10 border-red-500/20',
  }
  const iconColors = {
    primary: 'bg-primary-600/20 text-primary-400',
    purple: 'bg-accent-600/20 text-accent-400',
    success: 'bg-emerald-600/20 text-emerald-400',
    warning: 'bg-amber-600/20 text-amber-400',
    danger: 'bg-red-600/20 text-red-400',
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colors[color]} backdrop-blur-xl border rounded-2xl p-5`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${iconColors[color]}`}>{icon}</div>
        {trend && (
          <span className={`text-xs font-semibold ${trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-white/70">{title}</div>
      {subtitle && <div className="text-xs text-white/40 mt-1">{subtitle}</div>}
    </motion.div>
  )
}
