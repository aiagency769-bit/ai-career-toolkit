import React from 'react'

type BadgeVariant = 'primary' | 'purple' | 'success' | 'warning' | 'danger' | 'ghost' | 'premium'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants: Record<BadgeVariant, string> = {
    primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
    purple: 'bg-accent-500/20 text-accent-300 border border-accent-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30',
    ghost: 'bg-white/5 text-white/60 border border-white/10',
    premium: 'bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-300 border border-amber-500/30',
  }
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
  }
  const dotColors: Record<BadgeVariant, string> = {
    primary: 'bg-primary-400',
    purple: 'bg-accent-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    ghost: 'bg-white/40',
    premium: 'bg-amber-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />}
      {children}
    </span>
  )
}
