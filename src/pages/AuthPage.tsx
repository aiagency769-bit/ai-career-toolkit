import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Chrome } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAppStore, loginAsDemo } from '../store/appStore'
import toast from 'react-hot-toast'

type AuthMode = 'login' | 'signup' | 'forgot'

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { setAuthenticated, setUser } = useAppStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate auth
    await new Promise(r => setTimeout(r, 1200))

    if (mode === 'forgot') {
      toast.success('Password reset email sent!')
      setMode('login')
      setLoading(false)
      return
    }

    setUser({
      id: 'user-' + Date.now(),
      email: form.email,
      fullName: form.name || form.email.split('@')[0],
      plan: 'free',
      aiCredits: 10,
      createdAt: new Date().toISOString(),
    })
    setAuthenticated(true)
    toast.success(mode === 'login' ? 'Welcome back!' : 'Account created! Welcome aboard 🎉')
    setLoading(false)
  }

  const handleDemoLogin = () => {
    loginAsDemo()
    toast.success('Welcome to AI Career Toolkit! 👋')
  }

  return (
    <div className="fixed inset-0 animated-bg flex items-center justify-center p-4 overflow-hidden">
      {/* Orbs */}
      <div className="glow-orb w-96 h-96 bg-primary-600 top-[-15%] right-[-10%]" />
      <div className="glow-orb w-72 h-72 bg-accent-600 bottom-[-10%] left-[-5%]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mx-auto mb-4">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">AI Career Toolkit</h1>
          <p className="text-white/40 text-sm mt-1">Build your dream career with AI</p>
        </div>

        {/* Card */}
        <div className="glass-card p-7">
          {/* Mode tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize ${
                  mode === m
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User size={16} />}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              )}

              <Input
                label={mode === 'forgot' ? 'Your Email' : 'Email'}
                type="email"
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />

              {mode !== 'forgot' && (
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  icon={<Lock size={16} />}
                  iconRight={
                    <button type="button" onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  minLength={6}
                />
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button type="submit" variant="primary" size="lg" fullWidth loading={loading} glow icon={<ArrowRight size={18} />} iconPosition="right">
                {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
              </Button>
            </motion.form>
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social / Demo */}
          <div className="space-y-3">
            <Button variant="glass" size="lg" fullWidth icon={<Chrome size={18} />} onClick={() => toast.error('Google login requires Firebase setup')}>
              Continue with Google
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={handleDemoLogin}>
              🚀 Try Demo (No signup)
            </Button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </motion.div>
    </div>
  )
}
