import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Edit3, Download, Eye, Wand2, ChevronDown,
  ChevronUp, User, Briefcase, GraduationCap, Star, FolderOpen,
  Award, Globe, Trophy, Users, Loader2, Copy, Check, Layers
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { useResumeStore } from '../store/resumeStore'
import { generateSummary, generateAchievements, generateSkills } from '../lib/gemini'
import { exportResumeToPDF } from '../lib/pdfExport'
import { generateId } from '../lib/utils'
import toast from 'react-hot-toast'
import type { ResumeData, Experience, Education, Skill, Project, Certification, Language, ResumeTemplate } from '../types'
import { ResumePreview } from '../components/resume/ResumePreview'
import { TemplateSelector } from '../components/resume/TemplateSelector'

const SECTIONS = [
  { id: 'personal',       label: 'Personal Info',    icon: User },
  { id: 'summary',        label: 'Summary',          icon: Edit3 },
  { id: 'experience',     label: 'Experience',       icon: Briefcase },
  { id: 'education',      label: 'Education',        icon: GraduationCap },
  { id: 'skills',         label: 'Skills',           icon: Star },
  { id: 'projects',       label: 'Projects',         icon: FolderOpen },
  { id: 'certifications', label: 'Certifications',   icon: Award },
  { id: 'languages',      label: 'Languages',        icon: Globe },
  { id: 'awards',         label: 'Awards',           icon: Trophy },
  { id: 'references',     label: 'References',       icon: Users },
]

export const ResumeBuilderPage: React.FC = () => {
  const { resumes, activeResume, createResume, updateResume, setActiveResume, deleteResume, duplicateResume } = useResumeStore()
  const [activeSection, setActiveSection] = useState('personal')
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const resume = activeResume

  const handleCreateNew = () => {
    setShowTemplates(true)
  }

  const handleSelectTemplate = (template: ResumeTemplate) => {
    const id = createResume(template)
    setShowTemplates(false)
    toast.success('New resume created!')
  }

  const update = (data: Partial<ResumeData>) => {
    if (!resume) return
    updateResume(resume.id, data)
  }

  const updatePersonal = (field: string, value: string) => {
    if (!resume) return
    update({ personalInfo: { ...resume.personalInfo, [field]: value } })
  }

  const handleAISummary = async () => {
    if (!resume) return
    setAiLoading('summary')
    try {
      const summary = await generateSummary(resume)
      update({ summary })
      toast.success('AI summary generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed'
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('AI generation failed. Please try again.')
    }
    setAiLoading(null)
  }

  const handleAIAchievements = async (expId: string, position: string, company: string, desc: string) => {
    if (!resume) return
    setAiLoading(`exp-${expId}`)
    try {
      const achievements = await generateAchievements(position, company, desc)
      const updated = resume.experience.map(e =>
        e.id === expId ? { ...e, achievements } : e
      )
      update({ experience: updated })
      toast.success('AI achievements generated!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed'
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('Failed to generate achievements')
    }
    setAiLoading(null)
  }

  const handleAISkills = async () => {
    if (!resume) return
    setAiLoading('skills')
    try {
      const skillNames = await generateSkills(resume.personalInfo.title || 'Professional', '3 years')
      const skills = skillNames.map((name: string) => ({
        id: generateId(), name, level: 'Intermediate' as const
      }))
      update({ skills: [...resume.skills, ...skills.slice(0, 8)] })
      toast.success('AI skills added!')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed'
      if (msg === 'NO_API_KEY') toast.error('Add your Gemini API key in Settings')
      else toast.error('Failed to generate skills')
    }
    setAiLoading(null)
  }

  const handleExportPDF = async () => {
    if (!resume) return
    setExporting(true)
    try {
      await exportResumeToPDF('resume-preview', `${resume.personalInfo.fullName || 'resume'}.pdf`)
      toast.success('PDF exported!')
    } catch {
      toast.error('Export failed. Try again.')
    }
    setExporting(false)
  }

  const addExperience = () => {
    if (!resume) return
    const exp: Experience = {
      id: generateId(), company: '', position: '', location: '',
      startDate: '', endDate: '', current: false, description: '', achievements: []
    }
    update({ experience: [...resume.experience, exp] })
  }

  const updateExperience = (id: string, field: string, value: unknown) => {
    if (!resume) return
    update({ experience: resume.experience.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  const removeExperience = (id: string) => {
    if (!resume) return
    update({ experience: resume.experience.filter(e => e.id !== id) })
  }

  const addEducation = () => {
    if (!resume) return
    const edu: Education = {
      id: generateId(), institution: '', degree: '', field: '',
      startDate: '', endDate: '', current: false
    }
    update({ education: [...resume.education, edu] })
  }

  const updateEducation = (id: string, field: string, value: unknown) => {
    if (!resume) return
    update({ education: resume.education.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }

  const removeEducation = (id: string) => {
    if (!resume) return
    update({ education: resume.education.filter(e => e.id !== id) })
  }

  const addSkill = () => {
    if (!resume) return
    const skill: Skill = { id: generateId(), name: '', level: 'Intermediate' }
    update({ skills: [...resume.skills, skill] })
  }

  const updateSkill = (id: string, field: string, value: string) => {
    if (!resume) return
    update({ skills: resume.skills.map(s => s.id === id ? { ...s, [field]: value } : s) })
  }

  const removeSkill = (id: string) => {
    if (!resume) return
    update({ skills: resume.skills.filter(s => s.id !== id) })
  }

  if (!resume) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
      >
        <div className="text-6xl">📄</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Resume Yet</h2>
          <p className="text-white/50 mb-6">Create your first AI-powered resume in minutes</p>
        </div>
        <Button variant="primary" size="xl" glow icon={<Plus size={20} />} onClick={() => setShowTemplates(true)}>
          Create New Resume
        </Button>

        <TemplateSelector open={showTemplates} onClose={() => setShowTemplates(false)} onSelect={handleSelectTemplate} />
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          options={resumes.map(r => ({ value: r.id, label: r.title }))}
          value={resume.id}
          onChange={e => setActiveResume(e.target.value)}
          fullWidth={false}
          className="w-48"
        />
        <Button variant="glass" size="sm" icon={<Plus size={15} />} onClick={handleCreateNew}>New</Button>
        <Button variant="glass" size="sm" icon={<Copy size={15} />} onClick={() => duplicateResume(resume.id)}>Duplicate</Button>
        <Button variant="glass" size="sm" icon={<Layers size={15} />} onClick={() => setShowTemplates(true)}>Template</Button>
        <div className="ml-auto flex gap-2">
          <Button variant="glass" size="sm" icon={<Eye size={15} />} onClick={() => setShowPreview(true)}>Preview</Button>
          <Button variant="primary" size="sm" loading={exporting} icon={<Download size={15} />} onClick={handleExportPDF}>Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Section nav */}
        <div className="glass-card p-3 h-fit lg:sticky lg:top-4 space-y-1">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2">Sections</p>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`sidebar-item w-full text-left text-sm ${activeSection === sec.id ? 'active' : ''}`}
              >
                <Icon size={15} />
                {sec.label}
              </button>
            )
          })}
        </div>

        {/* Editor */}
        <div className="glass-card p-6 space-y-6">
          {activeSection === 'personal' && (
            <div className="space-y-4">
              <h3 className="section-title">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" value={resume.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="John Doe" required />
                <Input label="Professional Title" value={resume.personalInfo.title} onChange={e => updatePersonal('title', e.target.value)} placeholder="Software Engineer" />
                <Input label="Email" type="email" value={resume.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="john@example.com" />
                <Input label="Phone" value={resume.personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+92 300 1234567" />
                <Input label="Location" value={resume.personalInfo.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="Lahore, Pakistan" />
                <Input label="Website" value={resume.personalInfo.website || ''} onChange={e => updatePersonal('website', e.target.value)} placeholder="portfolio.com" />
                <Input label="LinkedIn" value={resume.personalInfo.linkedin || ''} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                <Input label="GitHub" value={resume.personalInfo.github || ''} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/johndoe" />
              </div>
            </div>
          )}

          {activeSection === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Professional Summary</h3>
                <Button variant="glass" size="sm" icon={aiLoading === 'summary' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} onClick={handleAISummary} disabled={aiLoading === 'summary'}>
                  AI Generate
                </Button>
              </div>
              <Textarea
                label="Summary"
                value={resume.summary}
                onChange={e => update({ summary: e.target.value })}
                placeholder="Write a compelling professional summary..."
                rows={6}
                hint="Tip: Click 'AI Generate' to create a summary from your resume data"
              />
            </div>
          )}

          {activeSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Work Experience</h3>
                <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={addExperience}>Add</Button>
              </div>
              {resume.experience.length === 0 && (
                <div className="text-center py-8 text-white/30 text-sm">No experience added yet</div>
              )}
              {resume.experience.map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/70">Experience {idx + 1}</span>
                    <button onClick={() => removeExperience(exp.id)} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Position" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                    <Input label="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                    <Input label="Start Date" type="month" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} />
                    <Input label="End Date" type="month" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} disabled={exp.current} hint={exp.current ? 'Currently working here' : ''} />
                    <Input label="Location" value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} placeholder="City, Country" />
                    <div className="flex items-center gap-2 pt-6">
                      <input type="checkbox" id={`curr-${exp.id}`} checked={exp.current} onChange={e => updateExperience(exp.id, 'current', e.target.checked)} className="rounded" />
                      <label htmlFor={`curr-${exp.id}`} className="text-sm text-white/60">Current Role</label>
                    </div>
                  </div>
                  <Textarea label="Description" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Brief role description..." rows={3} />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/70">Achievements</label>
                      <Button variant="glass" size="sm" icon={aiLoading === `exp-${exp.id}` ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />} onClick={() => handleAIAchievements(exp.id, exp.position, exp.company, exp.description)} disabled={!!aiLoading}>
                        AI Write
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {exp.achievements.map((ach, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            value={ach}
                            onChange={e => {
                              const updated = [...exp.achievements]
                              updated[i] = e.target.value
                              updateExperience(exp.id, 'achievements', updated)
                            }}
                            placeholder={`Achievement ${i + 1}`}
                            className="input-glass flex-1 text-sm"
                          />
                          <button onClick={() => updateExperience(exp.id, 'achievements', exp.achievements.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 p-2">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                      <button onClick={() => updateExperience(exp.id, 'achievements', [...exp.achievements, ''])} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 mt-1">
                        <Plus size={12} /> Add achievement
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Education</h3>
                <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={addEducation}>Add</Button>
              </div>
              {resume.education.map((edu, idx) => (
                <div key={edu.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/70">Education {idx + 1}</span>
                    <button onClick={() => removeEducation(edu.id)} className="text-red-400/60 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input label="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University Name" />
                    <Input label="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor's, Master's..." />
                    <Input label="Field of Study" value={edu.field} onChange={e => updateEducation(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                    <Input label="GPA" value={edu.gpa || ''} onChange={e => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8/4.0" />
                    <Input label="Start Date" type="month" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} />
                    <Input label="End Date" type="month" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} disabled={edu.current} />
                  </div>
                </div>
              ))}
              {resume.education.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No education added yet</div>}
            </div>
          )}

          {activeSection === 'skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Skills</h3>
                <div className="flex gap-2">
                  <Button variant="glass" size="sm" icon={aiLoading === 'skills' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />} onClick={handleAISkills} disabled={aiLoading === 'skills'}>
                    AI Suggest
                  </Button>
                  <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={addSkill}>Add</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resume.skills.map((skill) => (
                  <div key={skill.id} className="flex gap-2 items-start">
                    <Input value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" />
                    <Select
                      options={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' },
                        { value: 'Expert', label: 'Expert' },
                      ]}
                      value={skill.level}
                      onChange={e => updateSkill(skill.id, 'level', e.target.value)}
                      fullWidth={false}
                      className="w-36"
                    />
                    <button onClick={() => removeSkill(skill.id)} className="text-red-400/60 hover:text-red-400 p-2 mt-0.5"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              {resume.skills.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No skills added yet. Click "AI Suggest" to auto-fill.</div>}
            </div>
          )}

          {activeSection === 'certifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Certifications</h3>
                <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => update({ certifications: [...resume.certifications, { id: generateId(), name: '', issuer: '', date: '' }] })}>Add</Button>
              </div>
              {resume.certifications.map((cert, idx) => (
                <div key={cert.id} className="p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Certification Name" value={cert.name} onChange={e => update({ certifications: resume.certifications.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c) })} />
                  <Input label="Issuer" value={cert.issuer} onChange={e => update({ certifications: resume.certifications.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c) })} />
                  <Input label="Date" type="month" value={cert.date} onChange={e => update({ certifications: resume.certifications.map(c => c.id === cert.id ? { ...c, date: e.target.value } : c) })} />
                  <div className="flex items-end">
                    <button onClick={() => update({ certifications: resume.certifications.filter(c => c.id !== cert.id) })} className="text-red-400/60 hover:text-red-400 p-2 mb-0.5"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
              {resume.certifications.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No certifications added</div>}
            </div>
          )}

          {activeSection === 'languages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="section-title">Languages</h3>
                <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => update({ languages: [...resume.languages, { id: generateId(), name: '', proficiency: 'Intermediate' }] })}>Add</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {resume.languages.map((lang) => (
                  <div key={lang.id} className="flex gap-2">
                    <Input value={lang.name} onChange={e => update({ languages: resume.languages.map(l => l.id === lang.id ? { ...l, name: e.target.value } : l) })} placeholder="Language" />
                    <Select options={['Native','Fluent','Advanced','Intermediate','Basic'].map(v => ({ value: v, label: v }))} value={lang.proficiency} onChange={e => update({ languages: resume.languages.map(l => l.id === lang.id ? { ...l, proficiency: e.target.value as Language['proficiency'] } : l) })} fullWidth={false} className="w-36" />
                    <button onClick={() => update({ languages: resume.languages.filter(l => l.id !== lang.id) })} className="text-red-400/60 hover:text-red-400 p-2"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
              {resume.languages.length === 0 && <div className="text-center py-8 text-white/30 text-sm">No languages added</div>}
            </div>
          )}

          {(activeSection === 'projects' || activeSection === 'awards' || activeSection === 'references') && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🚧</div>
              <h3 className="text-white font-semibold mb-2">Coming Soon</h3>
              <p className="text-white/40 text-sm">This section is under construction</p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Resume Preview" size="xl">
        <div className="p-6">
          <div className="flex gap-3 mb-4">
            <Button variant="primary" size="sm" loading={exporting} icon={<Download size={15} />} onClick={handleExportPDF}>Export PDF</Button>
          </div>
          <div className="bg-white rounded-xl overflow-auto">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </Modal>

      {/* Template Selector */}
      <TemplateSelector open={showTemplates} onClose={() => setShowTemplates(false)} onSelect={handleSelectTemplate} />
    </div>
  )
}
