import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, Crown, Star, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

const FREE_FEATURES = [
  '3 Resume templates',
  '2 Cover letters/month',
  '3 ATS checks/month',
  '5 Interview questions',
  'Basic job tracker',
  'Watermarked exports',
  '10 AI credits/month',
]

const PRO_FEATURES = [
  'All 20+ premium templates',
  'Unlimited cover letters',
  'Unlimited ATS analysis',
  'Unlimited interview prep',
  'Advanced job tracker',
  'PDF & DOCX export (no watermark)',
  'Unlimited AI credits',
  'LinkedIn optimizer',
  'Career coach',
  'Government job toolkit',
  'Priority support',
  'Early access to new features',
]

const PLANS = [
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$4.99',
    period: '/month',
    pkr: '≈ 1,400 PKR',
    badge: null,
    saving: null,
  },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$39.99',
    period: '/year',
    pkr: '≈ 11,200 PKR',
    badge: 'Best Value',
    saving: 'Save 33%',
  },
]

export const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('yearly')
  const { user, setUser } = useAppStore()

  const handleUpgrade = () => {
    toast.success('Payment integration coming soon! Contact us for early access.')
  }

  const handleDemoUpgrade = () => {
    if (user) {
      setUser({ ...user, plan: 'premium', aiCredits: 999 })
      toast.success('🎉 Pro features unlocked for demo!')
    }
  }

  const isPro = user?.plan !== 'free'

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-500/25 text-amber-400 text-sm font-semibold mb-4">
          <Crown size={16} />
          Upgrade to Pro
        </div>
        <h2 className="text-4xl font-black text-white mb-3">
          Build Your Career with <span className="gradient-text">AI Power</span>
        </h2>
        <p className="text-white/50 text-lg max-w-md mx-auto">
          Unlock unlimited AI, premium templates, and advanced tools to land your dream job faster.
        </p>
      </motion.div>

      {/* Plan toggle */}
      <div className="flex justify-center">
        <div className="flex gap-1 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                selectedPlan === plan.id ? 'bg-primary-600 text-white shadow-glow' : 'text-white/50 hover:text-white'
              }`}
            >
              {plan.label}
              {plan.saving && (
                <span className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                  {plan.saving}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-7 relative"
        >
          <div className="mb-6">
            <div className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Free</div>
            <div className="text-4xl font-black text-white">$0</div>
            <div className="text-white/30 text-sm mt-1">Forever free</div>
          </div>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/60">
                <Check size={14} className="text-white/30 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="lg" fullWidth disabled={!isPro}>
            {!isPro ? 'Current Plan' : 'Downgrade'}
          </Button>
        </motion.div>

        {/* Pro */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative p-7 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(97,114,243,0.15), rgba(192,68,239,0.12))',
            border: '2px solid rgba(97,114,243,0.4)',
            boxShadow: '0 0 60px rgba(97,114,243,0.2)',
          }}
        >
          <div className="absolute top-4 right-4">
            <Badge variant="premium">Most Popular</Badge>
          </div>
          <div className="mb-6">
            <div className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Crown size={14} /> Pro
            </div>
            <div className="text-4xl font-black text-white">
              {PLANS.find(p => p.id === selectedPlan)?.price}
            </div>
            <div className="text-white/50 text-sm mt-1">
              {PLANS.find(p => p.id === selectedPlan)?.period} · {PLANS.find(p => p.id === selectedPlan)?.pkr}
            </div>
          </div>
          <ul className="space-y-3 mb-8">
            {PRO_FEATURES.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                  <Check size={11} className="text-white" />
                </div>
                {f}
              </li>
            ))}
          </ul>

          {isPro ? (
            <Button variant="success" size="lg" fullWidth>
              ✅ You're Pro!
            </Button>
          ) : (
            <div className="space-y-3">
              <Button variant="primary" size="lg" fullWidth glow icon={<Zap size={18} />} onClick={handleUpgrade}>
                Upgrade to Pro
              </Button>
              <Button variant="ghost" size="md" fullWidth onClick={handleDemoUpgrade}>
                🎮 Try Demo Pro Mode
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* FAQ / Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '🔒', title: 'Secure Payment', desc: 'Stripe-secured checkout' },
          { icon: '↩️', title: '7-Day Refund', desc: 'No questions asked' },
          { icon: '🌍', title: 'Pakistan Friendly', desc: 'PKR pricing available' },
        ].map(g => (
          <div key={g.title} className="text-center p-4 rounded-xl bg-white/3 border border-white/8">
            <div className="text-2xl mb-2">{g.icon}</div>
            <div className="text-sm font-bold text-white">{g.title}</div>
            <div className="text-xs text-white/40">{g.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
