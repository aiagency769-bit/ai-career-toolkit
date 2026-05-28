import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface SplashScreenProps {
  onDone: () => void
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="fixed inset-0 animated-bg flex flex-col items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="glow-orb w-96 h-96 bg-primary-600 top-[-10%] left-[-10%]" />
      <div className="glow-orb w-80 h-80 bg-accent-600 bottom-[-5%] right-[-5%]" />
      <div className="glow-orb w-64 h-64 bg-primary-400 top-1/2 right-[10%]" />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-3xl gradient-primary flex items-center justify-center shadow-glow animate-glow">
          <Sparkles size={48} className="text-white" />
        </div>
      </motion.div>

      {/* App name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-black text-white mb-2">
          AI Career
          <span className="gradient-text"> Toolkit</span>
        </h1>
        <p className="text-white/50 text-lg">Build. Apply. Get Hired.</p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-16 w-48"
      >
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.8 }}
            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
          />
        </div>
        <p className="text-center text-white/30 text-xs mt-3">Loading your career toolkit...</p>
      </motion.div>

      {/* Version */}
      <div className="absolute bottom-6 text-white/20 text-xs">v1.0.0</div>
    </div>
  )
}
