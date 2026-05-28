import React from 'react'
import { motion } from 'framer-motion'

interface ProgressProps {
  value: number
  max?: number
  label?: string
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'auto'
  animated?: boolean
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'primary',
  animated = true,
}) => {
  const pct = Math.min(100, (value / max) * 100)

  const getColor = () => {
    if (color === 'auto') {
      if (pct >= 80) return 'from-emerald-500 to-emerald-400'
      if (pct >= 60) return 'from-primary-600 to-primary-400'
      if (pct >= 40) return 'from-amber-500 to-amber-400'
      return 'from-red-500 to-red-400'
    }
    const colors = {
      primary: 'from-primary-600 to-accent-500',
      success: 'from-emerald-600 to-emerald-400',
      warning: 'from-amber-500 to-amber-400',
      danger: 'from-red-500 to-red-400',
    }
    return colors[color as keyof typeof colors] || colors.primary
  }

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-sm text-white/60">{label}</span>}
          {showValue && <span className="text-sm font-semibold text-white">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`${heights[size]} bg-white/8 rounded-full overflow-hidden`}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${pct}%` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={`h-full rounded-full bg-gradient-to-r ${getColor()}`}
        />
      </div>
    </div>
  )
}

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 100,
  strokeWidth = 8,
  label,
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#6172f3'
    if (score >= 40) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="relative inline-flex items-center justify-center flex-col gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-white">{score}</span>
        {label && <span className="text-xs text-white/50">{label}</span>}
      </div>
    </div>
  )
}
