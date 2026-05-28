export function cn(...inputs: (string | boolean | undefined | null | Record<string, boolean>)[]): string {
  return inputs
    .flatMap(input => {
      if (!input) return []
      if (typeof input === 'string') return [input]
      if (typeof input === 'object') {
        return Object.entries(input)
          .filter(([, v]) => v)
          .map(([k]) => k)
      }
      return []
    })
    .join(' ')
}

export const formatDate = (date: string, format: 'short' | 'long' | 'month-year' = 'short'): string => {
  if (!date) return ''
  const d = new Date(date)
  if (format === 'month-year') {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

export const getATSGradeColor = (grade: string): string => {
  const colors: Record<string, string> = {
    A: 'text-emerald-400',
    B: 'text-blue-400',
    C: 'text-yellow-400',
    D: 'text-orange-400',
    F: 'text-red-400',
  }
  return colors[grade] || 'text-white'
}

export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#6172f3'
  if (score >= 40) return '#f59e0b'
  return '#ef4444'
}

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    saved: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    applied: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    interview: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    offer: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-300 border-red-500/30',
    accepted: 'bg-green-500/20 text-green-300 border-green-500/30',
  }
  return colors[status] || 'bg-gray-500/20 text-gray-300'
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const downloadJSON = (data: unknown, filename: string): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const skillLevelToPercent = (level: string): number => {
  const map: Record<string, number> = {
    Beginner: 25,
    Intermediate: 50,
    Advanced: 75,
    Expert: 95,
  }
  return map[level] || 50
}

export const formatSalary = (salary: string): string => {
  if (!salary) return ''
  const num = parseInt(salary.replace(/\D/g, ''))
  if (isNaN(num)) return salary
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`
  if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
  return salary
}
