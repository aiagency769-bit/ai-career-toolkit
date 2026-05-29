import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Key, User, Bell, Palette, Shield, LogOut, Save, Eye, EyeOff, ExternalLink, CheckCircle, Cpu, Wifi, WifiOff } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { useAppStore } from '../store/appStore'
import { checkOllamaStatus, getOllamaUrl, getOllamaModel } from '../lib/ai'
import toast from 'react-hot-toast'

export const SettingsPage: React.FC = () => {
  const { user, setUser, logout, geminiApiKey, setGeminiApiKey } = useAppStore()
  const [apiKey, setApiKey]       = useState(geminiApiKey || localStorage.getItem('gemini_api_key') || '')
  const [groqKey, setGroqKey]     = useState(localStorage.getItem('groq_api_key') || '')
  const [ollamaUrl, setOllamaUrl] = useState(getOllamaUrl())
  const [ollamaModel, setOllamaModel] = useState(getOllamaModel())
  const [ollamaStatus, setOllamaStatus] = useState<{ checked: boolean; running: boolean; models: string[] }>({ checked: false, running: false, models: [] })
  const [showKey, setShowKey]     = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [name, setName]           = useState(user?.fullName || '')
  const [email, setEmail]         = useState(user?.email || '')
  const [saved, setSaved]         = useState(false)

  const handleSaveProfile = () => {
    if (user) setUser({ ...user, fullName: name, email })
    toast.success('Profile saved!')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKey)
    toast.success('Gemini API key saved!')
  }

  const handleSaveGroqKey = () => {
    localStorage.setItem('groq_api_key', groqKey)
    toast.success('Groq API key saved!')
  }

  const handleSaveOllama = () => {
    localStorage.setItem('ollama_url', ollamaUrl)
    localStorage.setItem('ollama_model', ollamaModel)
    toast.success('Ollama settings saved!')
  }

  const handleCheckOllama = async () => {
    toast.loading('Checking Ollama...', { id: 'ollama-check' })
    const status = await checkOllamaStatus()
    setOllamaStatus({ checked: true, ...status })
    toast.dismiss('ollama-check')
    if (status.running) {
      toast.success(`Ollama running! ${status.models.length} model(s) found`)
    } else {
      toast.error('Ollama not found. Is it running?')
    }
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
      title: 'AI Settings',
      icon: <Cpu size={16} className="text-emerald-400" />,
      content: (
        <div className="space-y-5">

          {/* ── Ollama (PRIMARY) ── */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/25">
              <div className="flex items-center gap-2 mb-2">
                <Cpu size={15} className="text-emerald-400" />
                <p className="text-sm font-bold text-emerald-400">Ollama — Local AI (Free, Private)</p>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">PRIMARY</span>
              </div>
              <p className="text-xs text-white/55 mb-3 leading-relaxed">
                Ollama runs AI models locally on your computer — completely free, private, no internet needed. Install it once and use forever.
              </p>
              <div className="flex flex-wrap gap-2">
                <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  Download Ollama <ExternalLink size={11} />
                </a>
                <span className="text-white/20">•</span>
                <span className="text-xs text-white/40">then run: <code className="bg-white/10 px-1.5 py-0.5 rounded text-emerald-300">ollama pull llama3.2</code></span>
              </div>
            </div>

            {/* Status check */}
            <div className="flex items-center gap-2">
              <Button variant="glass" size="sm" icon={<Wifi size={13} />} onClick={handleCheckOllama}>
                Check Status
              </Button>
              {ollamaStatus.checked && (
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${ollamaStatus.running ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ollamaStatus.running ? <Wifi size={13} /> : <WifiOff size={13} />}
                  {ollamaStatus.running ? `Running — ${ollamaStatus.models.length} model(s)` : 'Not running'}
                </div>
              )}
            </div>

            {/* Models list */}
            {ollamaStatus.running && ollamaStatus.models.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {ollamaStatus.models.map(m => (
                  <button key={m} onClick={() => setOllamaModel(m)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${ollamaModel === m ? 'border-emerald-500/60 bg-emerald-500/15 text-emerald-300' : 'border-white/10 text-white/50 hover:border-emerald-500/40'}`}>
                    {m}
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              <Input label="Ollama URL" value={ollamaUrl} onChange={e => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434" hint="Default: http://localhost:11434" />
              <Input label="Model Name" value={ollamaModel} onChange={e => setOllamaModel(e.target.value)}
                placeholder="llama3.2" hint="Recommended: llama3.2, mistral, llama3.1" />
            </div>
            <Button variant="primary" size="md" icon={<Save size={15} />} onClick={handleSaveOllama}>
              Save Ollama Settings
            </Button>
          </div>

          <div className="border-t border-white/8" />

          {/* ── Groq fallback ── */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-bold text-white/70 mb-1">⚡ Groq API Key (Cloud Fallback)</p>
              <p className="text-xs text-white/40 mb-2">Used automatically when Ollama is offline. Free tier available.</p>
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer"
                className="text-xs text-primary-400 hover:text-primary-300 inline-flex items-center gap-1">
                Get Free Key <ExternalLink size={10} />
              </a>
            </div>
            <Input label="Groq API Key (optional)"
              type={showGroqKey ? 'text' : 'password'}
              value={groqKey} onChange={e => setGroqKey(e.target.value)}
              placeholder="gsk_..."
              iconRight={<button type="button" onClick={() => setShowGroqKey(s => !s)}>{showGroqKey ? <EyeOff size={14} /> : <Eye size={14} />}</button>}
            />
            <Button variant="glass" size="sm" icon={<Save size={13} />} onClick={handleSaveGroqKey} disabled={!groqKey.trim()}>
              Save Groq Key
            </Button>
            {groqKey && <div className="flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle size={12} /> Groq fallback active</div>}
          </div>

          {/* How it works */}
          <div className="p-3 rounded-xl bg-primary-500/8 border border-primary-500/15">
            <p className="text-xs font-semibold text-primary-300 mb-1.5">How AI works in this app:</p>
            <div className="space-y-1 text-xs text-white/50">
              <div>1. 🖥️ <strong className="text-white/70">Ollama</strong> (local) — tried first, fastest, 100% private</div>
              <div>2. ⚡ <strong className="text-white/70">Groq</strong> (cloud) — fallback if Ollama is offline</div>
              <div>3. 🌐 <strong className="text-white/70">Free server</strong> — last resort (Pollinations AI)</div>
            </div>
          </div>
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
