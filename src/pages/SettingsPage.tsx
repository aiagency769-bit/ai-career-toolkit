import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, User, Bell, Palette, Shield, LogOut, Save, Eye, EyeOff, ExternalLink, CheckCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useAppStore } from '../store/appStore'
import toast from 'react-hot-toast'

export const SettingsPage: React.FC = () => {
  const { user, setUser, logout, geminiApiKey, setGeminiApiKey } = useAppStore()
  const [apiKey, setApiKey] = useState(geminiApiKey || localStorage.getItem('gemini_api_key') || '')
  const [showKey, setShowKey] = useState(false)
  const [name, setName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [saved, setSaved] = useState(false)

  const handleSaveProfile = () => {
    if (user) setUser({ ...user, fullName: name, email })
    toast.success('Profile saved!')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKey)
    toast.success('API key saved!')
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
  }

  const SECTIONS = [
    {
      id: 'profile',
      title: 'Profile',
      icon: <User size={16} className="text-primary-400" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center text-xl font-bold text-white shadow-glow">
              {(name || 'U').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-white">{name || 'User'}</div>
              <div className="text-sm text-white/40">{email}</div>
              <Badge variant={user?.plan === 'free' ? 'ghost' : 'premium'} size="sm" className="mt-1">
                {user?.plan === 'free' ? 'Free Plan' : '⭐ Pro Plan'}
              </Badge>
            </div>
          </div>
          <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Button variant="primary" size="md" icon={saved ? <CheckCircle size={16} /> : <Save size={16} />} onClick={handleSaveProfile}>
            {saved ? 'Saved!' : 'Save Profile'}
          </Button>
        </div>
      ),
    },
    {
      id: 'api',
      title: 'AI API Key',
      icon: <Key size={16} className="text-amber-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/15">
            <p className="text-sm font-semibold text-amber-400 mb-1">🔑 Gemini API Key (Free)</p>
            <p className="text-xs text-white/50 mb-3">
              Get your free Gemini API key from Google AI Studio. The free tier supports 15 requests/min and 1M tokens/day.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Get Free API Key <ExternalLink size={12} />
            </a>
          </div>
          <Input
            label="Gemini API Key"
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            iconRight={
              <button type="button" onClick={() => setShowKey(s => !s)}>
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            hint="Your key is stored locally and never sent to our servers"
          />
          <Button variant="primary" size="md" icon={<Save size={16} />} onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
            Save API Key
          </Button>
          {apiKey && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <CheckCircle size={14} /> API key configured — AI features are enabled
            </div>
          )}
          {!apiKey && (
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-white/50 mb-2">Without an API key, AI features use demo mode with sample responses.</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: <Shield size={16} className="text-emerald-400" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { title: 'Resume Data', desc: 'Stored locally in your browser. Never sent to our servers.', status: 'Local' },
              { title: 'API Key', desc: 'Stored in browser localStorage. Never transmitted.', status: 'Local' },
              { title: 'User Data', desc: 'Basic profile info stored in browser.', status: 'Local' },
            ].map(item => (
              <div key={item.title} className="flex items-start justify-between p-3 rounded-xl bg-white/5 border border-white/8">
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{item.desc}</div>
                </div>
                <Badge variant="success" size="sm">{item.status}</Badge>
              </div>
            ))}
          </div>
          <Button
            variant="danger"
            size="md"
            onClick={() => {
              localStorage.clear()
              toast.success('All data cleared')
              window.location.reload()
            }}
          >
            Clear All Data
          </Button>
        </div>
      ),
    },
    {
      id: 'account',
      title: 'Account',
      icon: <LogOut size={16} className="text-red-400" />,
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/8">
            <div className="text-sm font-semibold text-white mb-1">Logged in as</div>
            <div className="text-sm text-white/50">{user?.email}</div>
          </div>
          <Button variant="danger" size="md" icon={<LogOut size={16} />} onClick={handleLogout} fullWidth>
            Log Out
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="max-w-2xl space-y-4">
      {/* App Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-r from-primary-600/10 to-accent-600/8 border border-primary-500/15"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shadow-glow">AI</div>
          <div>
            <div className="font-bold text-white">AI Career Toolkit</div>
            <div className="text-xs text-white/40">v1.0.0 · Powered by Gemini AI · Free & Open</div>
          </div>
        </div>
      </motion.div>

      {SECTIONS.map((section, idx) => (
        <motion.div
          key={section.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
        >
          <Card>
            <div className="flex items-center gap-2 mb-4">
              {section.icon}
              <h3 className="font-bold text-white">{section.title}</h3>
            </div>
            {section.content}
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
