import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Briefcase, Building2, MapPin, ExternalLink, Trash2, Edit3, Calendar, Tag, Search } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Select, Textarea } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { Card } from '../components/ui/Card'
import { useJobStore } from '../store/jobStore'
import { getStatusColor } from '../lib/utils'
import toast from 'react-hot-toast'
import type { JobApplication, ApplicationStatus } from '../types'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'saved',      label: '🔖 Saved' },
  { value: 'applied',    label: '📤 Applied' },
  { value: 'pending',    label: '⏳ Pending' },
  { value: 'interview',  label: '🎤 Interview' },
  { value: 'offer',      label: '🎉 Offer' },
  { value: 'rejected',   label: '❌ Rejected' },
  { value: 'accepted',   label: '✅ Accepted' },
]

const STATUS_COLUMNS: ApplicationStatus[] = ['saved', 'applied', 'interview', 'offer', 'accepted', 'rejected']

const blankApp = (): Partial<JobApplication> => ({
  jobTitle: '', company: '', location: '', jobType: 'full-time',
  status: 'saved', tags: [], notes: '',
})

export const JobTrackerPage: React.FC = () => {
  const { applications, addApplication, updateApplication, deleteApplication, updateStatus } = useJobStore()
  const [showForm, setShowForm] = useState(false)
  const [editApp, setEditApp] = useState<JobApplication | null>(null)
  const [form, setForm] = useState<Partial<JobApplication>>(blankApp())
  const [tagInput, setTagInput] = useState('')
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'kanban' | 'list'>('kanban')

  const setField = (f: keyof JobApplication, v: unknown) => setForm(prev => ({ ...prev, [f]: v }))

  const handleSave = () => {
    if (!form.jobTitle || !form.company) { toast.error('Job title and company are required'); return }
    if (editApp) {
      updateApplication(editApp.id, form)
      toast.success('Application updated!')
    } else {
      addApplication(form)
      toast.success('Application added!')
    }
    setShowForm(false)
    setEditApp(null)
    setForm(blankApp())
  }

  const handleEdit = (app: JobApplication) => {
    setEditApp(app)
    setForm(app)
    setShowForm(true)
  }

  const addTag = () => {
    if (!tagInput.trim()) return
    setField('tags', [...(form.tags || []), tagInput.trim()])
    setTagInput('')
  }

  const filtered = applications
    .filter(a => filter === 'all' || a.status === filter)
    .filter(a => !search || a.jobTitle.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()))

  const counts = STATUS_COLUMNS.reduce((acc, s) => ({ ...acc, [s]: applications.filter(a => a.status === s).length }), {} as Record<string, number>)

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {STATUS_COLUMNS.map((s) => (
          <motion.button
            key={s}
            whileHover={{ y: -2 }}
            onClick={() => setFilter(filter === s ? 'all' : s)}
            className={`p-3 rounded-xl border text-center transition-all ${
              filter === s ? 'border-primary-500/60 bg-primary-500/15' : 'bg-white/5 border-white/10 hover:bg-white/8'
            }`}
          >
            <div className="text-xl font-bold text-white">{counts[s] || 0}</div>
            <div className="text-xs text-white/50 capitalize mt-0.5">{s}</div>
          </motion.button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="input-glass pl-9 w-full" />
        </div>
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl">
          <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'kanban' ? 'bg-primary-600 text-white' : 'text-white/50 hover:text-white'}`}>Kanban</button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${view === 'list' ? 'bg-primary-600 text-white' : 'text-white/50 hover:text-white'}`}>List</button>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => { setForm(blankApp()); setEditApp(null); setShowForm(true) }}>
          Add Job
        </Button>
      </div>

      {/* Kanban View */}
      {view === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {STATUS_COLUMNS.map((status) => {
              const cols = filtered.filter(a => a.status === status)
              return (
                <div key={status} className="w-64 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-white/60 uppercase tracking-wider capitalize">{status}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/50">{cols.length}</span>
                  </div>
                  <div className="space-y-3">
                    {cols.map((app) => (
                      <motion.div
                        key={app.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-4 cursor-pointer group hover:border-primary-500/30 transition-all"
                        onClick={() => handleEdit(app)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm leading-tight">{app.jobTitle}</h4>
                          <button onClick={(e) => { e.stopPropagation(); deleteApplication(app.id) }} className="opacity-0 group-hover:opacity-100 p-1 text-red-400/60 hover:text-red-400 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-white/50 mb-2">
                          <Building2 size={11} /> {app.company}
                        </div>
                        {app.location && (
                          <div className="flex items-center gap-1 text-xs text-white/40 mb-3">
                            <MapPin size={11} /> {app.location}
                          </div>
                        )}
                        {app.tags && app.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {app.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/8">{tag}</span>
                            ))}
                          </div>
                        )}
                        {app.interviewDate && (
                          <div className="flex items-center gap-1 text-xs text-purple-400 mt-2">
                            <Calendar size={11} /> {app.interviewDate}
                          </div>
                        )}
                        <div className="mt-3">
                          <Select
                            options={STATUS_OPTIONS}
                            value={app.status}
                            onChange={e => { e.stopPropagation(); updateStatus(app.id, e.target.value as ApplicationStatus) }}
                            onClick={e => e.stopPropagation()}
                            fullWidth
                            className="text-xs py-1.5"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-3">
          {filtered.map((app) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 hover:border-white/12 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-800/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <Briefcase size={16} className="text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white text-sm">{app.jobTitle}</div>
                <div className="text-xs text-white/50 flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><Building2 size={10} /> {app.company}</span>
                  {app.location && <span className="flex items-center gap-1"><MapPin size={10} /> {app.location}</span>}
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                {app.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/8">{tag}</span>
                ))}
              </div>
              <span className={`badge text-xs ${getStatusColor(app.status)}`}>{app.status}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(app)} className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10"><Edit3 size={14} /></button>
                <button onClick={() => { deleteApplication(app.id); toast.success('Removed') }} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💼</div>
              <p className="text-white/50 font-semibold">No applications yet</p>
              <p className="text-white/30 text-sm mt-1">Track your job applications and never miss a follow-up</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditApp(null) }} title={editApp ? 'Edit Application' : 'Add Job Application'} size="lg">
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Job Title *" value={form.jobTitle || ''} onChange={e => setField('jobTitle', e.target.value)} placeholder="Software Engineer" />
            <Input label="Company *" value={form.company || ''} onChange={e => setField('company', e.target.value)} placeholder="Google" />
            <Input label="Location" value={form.location || ''} onChange={e => setField('location', e.target.value)} placeholder="Lahore / Remote" />
            <Input label="Salary" value={form.salary || ''} onChange={e => setField('salary', e.target.value)} placeholder="50,000 PKR / $50K" />
            <Input label="Job URL" value={form.jobUrl || ''} onChange={e => setField('jobUrl', e.target.value)} placeholder="https://..." />
            <Input label="Interview Date" type="datetime-local" value={form.interviewDate || ''} onChange={e => setField('interviewDate', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Job Type" options={[
              { value: 'full-time', label: 'Full-time' },
              { value: 'part-time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'freelance', label: 'Freelance' },
              { value: 'internship', label: 'Internship' },
            ]} value={form.jobType || 'full-time'} onChange={e => setField('jobType', e.target.value)} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status || 'saved'} onChange={e => setField('status', e.target.value)} />
          </div>
          <Textarea label="Notes" value={form.notes || ''} onChange={e => setField('notes', e.target.value)} placeholder="Notes, contact info, anything relevant..." rows={3} />
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} placeholder="Add tag..." />
              <Button variant="glass" size="sm" onClick={addTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.tags || []).map((tag, i) => (
                <button key={i} onClick={() => setField('tags', (form.tags || []).filter((_, j) => j !== i))} className="px-2.5 py-1 rounded-full text-xs bg-white/5 text-white/60 border border-white/10 hover:bg-red-500/20 hover:text-red-300 transition-all">
                  {tag} ×
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" size="md" onClick={() => { setShowForm(false); setEditApp(null) }}>Cancel</Button>
            <Button variant="primary" size="md" fullWidth onClick={handleSave}>{editApp ? 'Update' : 'Add Application'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
