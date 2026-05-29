import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, Edit3, Download, Eye, Wand2,
  User, Briefcase, GraduationCap, Star, FolderOpen,
  Award as AwardIcon, Globe, Trophy, Users, Loader2, Copy, Layers,
  Sparkles, ExternalLink, X, CheckCircle2, Brain
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input, Textarea, Select } from '../components/ui/Input'
import { Modal } from '../components/ui/Modal'
import { useResumeStore } from '../store/resumeStore'
import { generateSummary, generateAchievements, generateSkills, generateWithAI } from '../lib/ai'
import { exportResumeToPDF } from '../lib/pdfExport'
import { generateId } from '../lib/utils'
import toast from 'react-hot-toast'
import type { ResumeData, Experience, Education, Skill, Project, Certification, Language, Award as AwardType, Reference, ResumeTemplate } from '../types'
import { ResumePreview } from '../components/resume/ResumePreview'
import { TemplateSelector } from '../components/resume/TemplateSelector'

const SECTIONS = [
  { id: 'personal',       label: 'Personal Info',    icon: User },
  { id: 'summary',        label: 'Summary',          icon: Edit3 },
  { id: 'experience',     label: 'Experience',       icon: Briefcase },
  { id: 'education',      label: 'Education',        icon: GraduationCap },
  { id: 'skills',         label: 'Skills',           icon: Star },
  { id: 'projects',       label: 'Projects',         icon: FolderOpen },
  { id: 'certifications', label: 'Certifications',   icon: AwardIcon },
  { id: 'languages',      label: 'Languages',        icon: Globe },
  { id: 'awards',         label: 'Awards',           icon: Trophy },
  { id: 'references',     label: 'References',       icon: Users },
]

// â”€â”€â”€ AI Resume Generator from Prompt â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const generateResumeFromPrompt = async (prompt: string): Promise<Partial<ResumeData>> => {
  const aiPrompt = `
You are an expert resume writer. Generate a complete professional resume based on this description:

"${prompt}"

Return ONLY a valid JSON object with this exact structure:
{
  "personalInfo": {
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "experience": [
    {
      "company": "",
      "position": "",
      "location": "",
      "startDate": "2020-01",
      "endDate": "2023-06",
      "current": false,
      "description": "",
      "achievements": ["", "", ""]
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "2016-09",
      "endDate": "2020-06",
      "current": false,
      "gpa": ""
    }
  ],
  "skills": [
    { "name": "", "level": "Advanced" }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technologies": ["", ""],
      "url": ""
    }
  ],
  "certifications": [],
  "languages": [{ "name": "English", "proficiency": "Fluent" }],
  "awards": []
}

Fill with realistic, professional data based on the description. Generate 2-3 experiences, 1-2 education entries, 8-12 skills, 2-3 projects.
`
  const raw = await generateWithAI(aiPrompt)
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Invalid AI response')
  const parsed = JSON.parse(match[0])
  // Assign IDs
  if (parsed.experience) parsed.experience = parsed.experience.map((e: Experience) => ({ ...e, id: generateId() }))
  if (parsed.education) parsed.education = parsed.education.map((e: Education) => ({ ...e, id: generateId() }))
  if (parsed.skills) parsed.skills = parsed.skills.map((s: Skill) => ({ ...s, id: generateId() }))
  if (parsed.projects) parsed.projects = parsed.projects.map((p: Project) => ({ ...p, id: generateId(), technologies: p.technologies || [] }))
  if (parsed.certifications) parsed.certifications = parsed.certifications.map((c: Certification) => ({ ...c, id: generateId() }))
  if (parsed.languages) parsed.languages = parsed.languages.map((l: Language) => ({ ...l, id: generateId() }))
  if (parsed.awards) parsed.awards = parsed.awards.map((a: AwardType) => ({ ...a, id: generateId() }))
  if (parsed.references) parsed.references = parsed.references.map((r: Reference) => ({ ...r, id: generateId() }))
  return parsed
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const ResumeBuilderPage: React.FC = () => {
  const { resumes, activeResume, createResume, updateResume, setActiveResume, duplicateResume } = useResumeStore()
  const [activeSection, setActiveSection] = useState('personal')
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showAIGen, setShowAIGen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenLoading, setAiGenLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const resume = activeResume

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
    } catch {
      toast.error('AI generation failed. Try again.')
    }
    setAiLoading(null)
  }

  const handleAIAchievements = async (expId: string, position: string, company: string, desc: string) => {
    if (!resume) return
    setAiLoading(`exp-${expId}`)
    try {
      const achievements = await generateAchievements(position, company, desc)
      update({ experience: resume.experience.map(e => e.id === expId ? { ...e, achievements } : e) })
      toast.success('AI achievements generated!')
    } catch {
      toast.error('Failed to generate achievements')
    }
    setAiLoading(null)
  }

  const handleAISkills = async () => {
    if (!resume) return
    setAiLoading('skills')
    try {
      const skillNames = await generateSkills(resume.personalInfo.title || 'Professional', '3 years')
      const skills: Skill[] = skillNames.map((name: string) => ({ id: generateId(), name, level: 'Intermediate' as const }))
      update({ skills: [...resume.skills, ...skills.slice(0, 8)] })
      toast.success('AI skills added!')
    } catch {
      toast.error('Failed to generate skills')
    }
    setAiLoading(null)
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return
    setAiGenLoading(true)
    try {
      const data = await generateResumeFromPrompt(aiPrompt)
      const id = createResume(resume?.template || 'modern')
      // Small delay to ensure store update
      await new Promise(r => setTimeout(r, 100))
      useResumeStore.getState().updateResume(
        useResumeStore.getState().activeResumeId!,
        { ...data, title: (data.personalInfo?.fullName || 'AI Resume') + ' â€” ' + (data.personalInfo?.title || '') }
      )
      setShowAIGen(false)
      setAiPrompt('')
      toast.success('AI resume generated successfully!')
    } catch {
      toast.error('AI generation failed. Try again.')
    }
    setAiGenLoading(false)
  }

  const handleExportPDF = async () => {
    if (!resume) return
    if (!document.getElementById('resume-preview')) {
      setShowPreview(true)
      await new Promise(r => setTimeout(r, 600))
    }
    setExporting(true)
    try {
      await exportResumeToPDF('resume-preview', `${resume.personalInfo.fullName || 'resume'}.pdf`)
      toast.success('PDF exported!')
    } catch {
      toast.error('Export failed. Open Preview first, then export.')
    }
    setExporting(false)
  }

  // â”€â”€â”€ Section Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const addExperience = () => {
    if (!resume) return
    const exp: Experience = { id: generateId(), company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', achievements: [] }
    update({ experience: [...resume.experience, exp] })
  }
  const updateExp = (id: string, field: string, value: unknown) => {
    if (!resume) return
    update({ experience: resume.experience.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }
  const removeExp = (id: string) => { if (resume) update({ experience: resume.experience.filter(e => e.id !== id) }) }

  const addEducation = () => {
    if (!resume) return
    const edu: Education = { id: generateId(), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false }
    update({ education: [...resume.education, edu] })
  }
  const updateEdu = (id: string, field: string, value: unknown) => {
    if (!resume) return
    update({ education: resume.education.map(e => e.id === id ? { ...e, [field]: value } : e) })
  }
  const removeEdu = (id: string) => { if (resume) update({ education: resume.education.filter(e => e.id !== id) }) }

  const addSkill = () => { if (resume) update({ skills: [...resume.skills, { id: generateId(), name: '', level: 'Intermediate' as const }] }) }
  const updateSkill = (id: string, field: string, val: string) => { if (resume) update({ skills: resume.skills.map(s => s.id === id ? { ...s, [field]: val } : s) }) }
  const removeSkill = (id: string) => { if (resume) update({ skills: resume.skills.filter(s => s.id !== id) }) }

  const addProject = () => {
    if (!resume) return
    const proj: Project = { id: generateId(), name: '', description: '', technologies: [], url: '' }
    update({ projects: [...(resume.projects || []), proj] })
  }
  const updateProj = (id: string, field: string, value: unknown) => {
    if (!resume) return
    update({ projects: (resume.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p) })
  }
  const removeProj = (id: string) => { if (resume) update({ projects: (resume.projects || []).filter(p => p.id !== id) }) }

  const addCert = () => {
    if (!resume) return
    update({ certifications: [...resume.certifications, { id: generateId(), name: '', issuer: '', date: '' }] })
  }
  const updateCert = (id: string, field: string, val: string) => {
    if (!resume) return
    update({ certifications: resume.certifications.map(c => c.id === id ? { ...c, [field]: val } : c) })
  }
  const removeCert = (id: string) => { if (resume) update({ certifications: resume.certifications.filter(c => c.id !== id) }) }

  const addLanguage = () => {
    if (!resume) return
    update({ languages: [...resume.languages, { id: generateId(), name: '', proficiency: 'Intermediate' as const }] })
  }
  const updateLang = (id: string, field: string, val: string) => {
    if (!resume) return
    update({ languages: resume.languages.map(l => l.id === id ? { ...l, [field]: val } : l) })
  }
  const removeLang = (id: string) => { if (resume) update({ languages: resume.languages.filter(l => l.id !== id) }) }

  const addAward = () => {
    if (!resume) return
    const award: AwardType = { id: generateId(), title: '', issuer: '', date: '', description: '' }
    update({ awards: [...(resume.awards || []), award] })
  }
  const updateAward = (id: string, field: string, val: string) => {
    if (!resume) return
    update({ awards: (resume.awards || []).map(a => a.id === id ? { ...a, [field]: val } : a) })
  }
  const removeAward = (id: string) => { if (resume) update({ awards: (resume.awards || []).filter(a => a.id !== id) }) }

  const addReference = () => {
    if (!resume) return
    const ref: Reference = { id: generateId(), name: '', title: '', company: '', email: '', phone: '', relationship: '' }
    update({ references: [...(resume.references || []), ref] })
  }
  const updateRef = (id: string, field: string, val: string) => {
    if (!resume) return
    update({ references: (resume.references || []).map(r => r.id === id ? { ...r, [field]: val } : r) })
  }
  const removeRef = (id: string) => { if (resume) update({ references: (resume.references || []).filter(r => r.id !== id) }) }

  // â”€â”€â”€ Empty state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (!resume) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl shadow-glow">ðŸ“„</div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">No Resume Yet</h2>
          <p className="text-white/50 mb-6">Create your first AI-powered resume in minutes</p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button variant="primary" size="lg" glow icon={<Plus size={18} />} onClick={() => setShowTemplates(true)}>
            Choose Template
          </Button>
          <Button variant="glass" size="lg" icon={<Brain size={18} />} onClick={() => setShowAIGen(true)}>
            AI Generate
          </Button>
        </div>

        <TemplateSelector open={showTemplates} onClose={() => setShowTemplates(false)} onSelect={handleSelectTemplate} />
        <AIGenerateModal open={showAIGen} onClose={() => setShowAIGen(false)} prompt={aiPrompt} onPromptChange={setAiPrompt} onGenerate={handleAIGenerate} loading={aiGenLoading} />
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          options={resumes.map(r => ({ value: r.id, label: r.title }))}
          value={resume.id}
          onChange={e => setActiveResume(e.target.value)}
          fullWidth={false}
          className="w-44"
        />
        <Button variant="glass" size="sm" icon={<Plus size={14} />} onClick={() => setShowTemplates(true)}>New</Button>
        <Button variant="glass" size="sm" icon={<Copy size={14} />} onClick={() => { duplicateResume(resume.id); toast.success('Duplicated!') }}>Dupe</Button>
        <Button variant="glass" size="sm" icon={<Layers size={14} />} onClick={() => setShowTemplates(true)}>Template</Button>
        <Button variant="glass" size="sm" icon={<Brain size={14} />} onClick={() => setShowAIGen(true)}>AI Gen</Button>
        <div className="ml-auto flex gap-2">
          <Button variant="glass" size="sm" icon={<Eye size={14} />} onClick={() => setShowPreview(true)}>Preview</Button>
          <Button variant="primary" size="sm" loading={exporting} icon={<Download size={14} />} onClick={handleExportPDF}>PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">
        {/* Section nav */}
        <div className="glass-card p-3 h-fit lg:sticky lg:top-4 space-y-0.5">
          <p className="text-xs font-semibold text-white/30 uppercase tracking-wider px-3 py-2">Sections</p>
          {SECTIONS.map((sec) => {
            const Icon = sec.icon
            const filled = getSectionFilled(resume, sec.id)
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`sidebar-item w-full text-left text-sm flex items-center justify-between ${activeSection === sec.id ? 'active' : ''}`}
              >
                <span className="flex items-center gap-2">
                  <Icon size={14} />
                  {sec.label}
                </span>
                {filled && <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Editor */}
        <div className="glass-card p-5 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }}>

              {/* PERSONAL */}
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

              {/* SUMMARY */}
              {activeSection === 'summary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Professional Summary</h3>
                    <Button variant="glass" size="sm" icon={aiLoading === 'summary' ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />} onClick={handleAISummary} disabled={aiLoading === 'summary'}>
                      AI Generate
                    </Button>
                  </div>
                  <Textarea label="Summary" value={resume.summary} onChange={e => update({ summary: e.target.value })} placeholder="Write a compelling professional summary..." rows={6} hint="Click 'AI Generate' to auto-create from your resume data" />
                </div>
              )}

              {/* EXPERIENCE */}
              {activeSection === 'experience' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Work Experience</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addExperience}>Add</Button>
                  </div>
                  {resume.experience.length === 0 && <EmptyState label="No experience added yet" />}
                  {resume.experience.map((exp, idx) => (
                    <ItemCard key={exp.id} title={`Experience ${idx + 1}`} subtitle={exp.position || 'Untitled'} onRemove={() => removeExp(exp.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Position" value={exp.position} onChange={e => updateExp(exp.id, 'position', e.target.value)} placeholder="Software Engineer" />
                        <Input label="Company" value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                        <Input label="Start Date" type="month" value={exp.startDate} onChange={e => updateExp(exp.id, 'startDate', e.target.value)} />
                        <Input label="End Date" type="month" value={exp.endDate} onChange={e => updateExp(exp.id, 'endDate', e.target.value)} disabled={exp.current} hint={exp.current ? 'Currently here' : ''} />
                        <Input label="Location" value={exp.location} onChange={e => updateExp(exp.id, 'location', e.target.value)} placeholder="City, Country" />
                        <div className="flex items-center gap-2 pt-5">
                          <input type="checkbox" id={`curr-${exp.id}`} checked={exp.current} onChange={e => updateExp(exp.id, 'current', e.target.checked)} className="w-4 h-4 rounded accent-primary-500" />
                          <label htmlFor={`curr-${exp.id}`} className="text-sm text-white/60 cursor-pointer">Current Role</label>
                        </div>
                      </div>
                      <Textarea label="Description" value={exp.description} onChange={e => updateExp(exp.id, 'description', e.target.value)} placeholder="Brief role description..." rows={3} />
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
                              <input value={ach} onChange={e => { const u = [...exp.achievements]; u[i] = e.target.value; updateExp(exp.id, 'achievements', u) }} placeholder={`Achievement ${i + 1}`} className="input-glass flex-1 text-sm" />
                              <button onClick={() => updateExp(exp.id, 'achievements', exp.achievements.filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 p-2 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          ))}
                          <button onClick={() => updateExp(exp.id, 'achievements', [...exp.achievements, ''])} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1 mt-1">
                            <Plus size={12} /> Add achievement
                          </button>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {/* EDUCATION */}
              {activeSection === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Education</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addEducation}>Add</Button>
                  </div>
                  {resume.education.length === 0 && <EmptyState label="No education added yet" />}
                  {resume.education.map((edu, idx) => (
                    <ItemCard key={edu.id} title={`Education ${idx + 1}`} subtitle={edu.institution || 'Untitled'} onRemove={() => removeEdu(edu.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Institution" value={edu.institution} onChange={e => updateEdu(edu.id, 'institution', e.target.value)} placeholder="University Name" />
                        <Input label="Degree" value={edu.degree} onChange={e => updateEdu(edu.id, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                        <Input label="Field of Study" value={edu.field} onChange={e => updateEdu(edu.id, 'field', e.target.value)} placeholder="Computer Science" />
                        <Input label="GPA / Grade" value={edu.gpa || ''} onChange={e => updateEdu(edu.id, 'gpa', e.target.value)} placeholder="3.8 / 4.0" />
                        <Input label="Start Date" type="month" value={edu.startDate} onChange={e => updateEdu(edu.id, 'startDate', e.target.value)} />
                        <Input label="End Date" type="month" value={edu.endDate} onChange={e => updateEdu(edu.id, 'endDate', e.target.value)} disabled={edu.current} />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id={`ecurr-${edu.id}`} checked={edu.current} onChange={e => updateEdu(edu.id, 'current', e.target.checked)} className="w-4 h-4 rounded accent-primary-500" />
                        <label htmlFor={`ecurr-${edu.id}`} className="text-sm text-white/60 cursor-pointer">Currently Studying</label>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {/* SKILLS */}
              {activeSection === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Skills</h3>
                    <div className="flex gap-2">
                      <Button variant="glass" size="sm" icon={aiLoading === 'skills' ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />} onClick={handleAISkills} disabled={aiLoading === 'skills'}>AI Suggest</Button>
                      <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addSkill}>Add</Button>
                    </div>
                  </div>
                  {resume.skills.length === 0 && <EmptyState label='No skills yet. Click "AI Suggest" to auto-fill.' />}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resume.skills.map(skill => (
                      <div key={skill.id} className="flex gap-2 items-start">
                        <Input value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name" />
                        <Select options={['Beginner','Intermediate','Advanced','Expert'].map(v => ({ value: v, label: v }))} value={skill.level} onChange={e => updateSkill(skill.id, 'level', e.target.value)} fullWidth={false} className="w-36" />
                        <button onClick={() => removeSkill(skill.id)} className="text-red-400/60 hover:text-red-400 p-2 mt-0.5 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PROJECTS */}
              {activeSection === 'projects' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Projects</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addProject}>Add</Button>
                  </div>
                  {(resume.projects || []).length === 0 && <EmptyState label="No projects added yet" />}
                  {(resume.projects || []).map((proj, idx) => (
                    <ItemCard key={proj.id} title={`Project ${idx + 1}`} subtitle={proj.name || 'Untitled'} onRemove={() => removeProj(proj.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Project Name" value={proj.name} onChange={e => updateProj(proj.id, 'name', e.target.value)} placeholder="My Awesome Project" />
                        <Input label="URL / GitHub" value={proj.url || ''} onChange={e => updateProj(proj.id, 'url', e.target.value)} placeholder="github.com/user/project" icon={<ExternalLink size={14} />} />
                        <Input label="Start Date" type="month" value={proj.startDate || ''} onChange={e => updateProj(proj.id, 'startDate', e.target.value)} />
                        <Input label="End Date" type="month" value={proj.endDate || ''} onChange={e => updateProj(proj.id, 'endDate', e.target.value)} />
                      </div>
                      <Textarea label="Description" value={proj.description} onChange={e => updateProj(proj.id, 'description', e.target.value)} placeholder="What did this project do? What problem did it solve?" rows={3} />
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Technologies Used</label>
                        <div className="space-y-2">
                          {(proj.technologies || []).map((tech, i) => (
                            <div key={i} className="flex gap-2">
                              <input value={tech} onChange={e => { const u = [...(proj.technologies || [])]; u[i] = e.target.value; updateProj(proj.id, 'technologies', u) }} placeholder={`Technology ${i + 1}`} className="input-glass flex-1 text-sm" />
                              <button onClick={() => updateProj(proj.id, 'technologies', (proj.technologies || []).filter((_, j) => j !== i))} className="text-red-400/60 hover:text-red-400 p-2 transition-colors"><Trash2 size={13} /></button>
                            </div>
                          ))}
                          <button onClick={() => updateProj(proj.id, 'technologies', [...(proj.technologies || []), ''])} className="text-xs text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
                            <Plus size={12} /> Add technology
                          </button>
                        </div>
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {/* CERTIFICATIONS */}
              {activeSection === 'certifications' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Certifications</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addCert}>Add</Button>
                  </div>
                  {resume.certifications.length === 0 && <EmptyState label="No certifications added" />}
                  {resume.certifications.map((cert, idx) => (
                    <ItemCard key={cert.id} title={`Certification ${idx + 1}`} subtitle={cert.name || 'Untitled'} onRemove={() => removeCert(cert.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Certification Name" value={cert.name} onChange={e => updateCert(cert.id, 'name', e.target.value)} placeholder="AWS Certified Developer" />
                        <Input label="Issuing Organization" value={cert.issuer} onChange={e => updateCert(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                        <Input label="Issue Date" type="month" value={cert.date} onChange={e => updateCert(cert.id, 'date', e.target.value)} />
                        <Input label="Expiry Date" type="month" value={cert.expiryDate || ''} onChange={e => updateCert(cert.id, 'expiryDate', e.target.value)} />
                        <Input label="Credential ID" value={cert.credentialId || ''} onChange={e => updateCert(cert.id, 'credentialId', e.target.value)} placeholder="ABC-123-XYZ" className="sm:col-span-2" />
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

              {/* LANGUAGES */}
              {activeSection === 'languages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Languages</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addLanguage}>Add</Button>
                  </div>
                  {resume.languages.length === 0 && <EmptyState label="No languages added" />}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resume.languages.map(lang => (
                      <div key={lang.id} className="flex gap-2">
                        <Input value={lang.name} onChange={e => updateLang(lang.id, 'name', e.target.value)} placeholder="Language (e.g. Urdu)" />
                        <Select
                          options={['Native','Fluent','Advanced','Intermediate','Basic'].map(v => ({ value: v, label: v }))}
                          value={lang.proficiency}
                          onChange={e => updateLang(lang.id, 'proficiency', e.target.value)}
                          fullWidth={false} className="w-36"
                        />
                        <button onClick={() => removeLang(lang.id)} className="text-red-400/60 hover:text-red-400 p-2 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AWARDS */}
              {activeSection === 'awards' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">Awards & Honours</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addAward}>Add</Button>
                  </div>
                  {(resume.awards || []).length === 0 && <EmptyState label="No awards added yet" />}
                  {(resume.awards || []).map((award, idx) => (
                    <ItemCard key={award.id} title={`Award ${idx + 1}`} subtitle={award.title || 'Untitled'} onRemove={() => removeAward(award.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Award Title" value={award.title} onChange={e => updateAward(award.id, 'title', e.target.value)} placeholder="Best Employee Award" />
                        <Input label="Issuing Organization" value={award.issuer} onChange={e => updateAward(award.id, 'issuer', e.target.value)} placeholder="Company / Institution" />
                        <Input label="Date" type="month" value={award.date} onChange={e => updateAward(award.id, 'date', e.target.value)} />
                      </div>
                      <Textarea label="Description (optional)" value={award.description || ''} onChange={e => updateAward(award.id, 'description', e.target.value)} placeholder="Brief description of the award..." rows={2} />
                    </ItemCard>
                  ))}
                </div>
              )}

              {/* REFERENCES */}
              {activeSection === 'references' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="section-title">References</h3>
                    <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={addReference}>Add</Button>
                  </div>
                  {(resume.references || []).length === 0 && <EmptyState label="No references added yet" />}
                  {(resume.references || []).map((ref, idx) => (
                    <ItemCard key={ref.id} title={`Reference ${idx + 1}`} subtitle={ref.name || 'Untitled'} onRemove={() => removeRef(ref.id)}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input label="Full Name" value={ref.name} onChange={e => updateRef(ref.id, 'name', e.target.value)} placeholder="Dr. John Smith" />
                        <Input label="Job Title" value={ref.title} onChange={e => updateRef(ref.id, 'title', e.target.value)} placeholder="Senior Manager" />
                        <Input label="Company / Organization" value={ref.company} onChange={e => updateRef(ref.id, 'company', e.target.value)} placeholder="ABC Corporation" />
                        <Input label="Relationship" value={ref.relationship} onChange={e => updateRef(ref.id, 'relationship', e.target.value)} placeholder="Direct Supervisor" />
                        <Input label="Email" type="email" value={ref.email} onChange={e => updateRef(ref.id, 'email', e.target.value)} placeholder="john@company.com" />
                        <Input label="Phone (optional)" value={ref.phone || ''} onChange={e => updateRef(ref.id, 'phone', e.target.value)} placeholder="+92 300 1234567" />
                      </div>
                    </ItemCard>
                  ))}
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Resume Preview" size="xl">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <Button variant="primary" size="sm" loading={exporting} icon={<Download size={14} />} onClick={handleExportPDF}>Export PDF</Button>
            <Button variant="glass" size="sm" icon={<Layers size={14} />} onClick={() => { setShowPreview(false); setShowTemplates(true) }}>Change Template</Button>
          </div>
          <div className="bg-white rounded-xl overflow-auto max-h-[75vh] shadow-xl">
            <ResumePreview resume={resume} />
          </div>
        </div>
      </Modal>

      <TemplateSelector open={showTemplates} onClose={() => setShowTemplates(false)} onSelect={handleSelectTemplate} current={resume.template} />
      <AIGenerateModal open={showAIGen} onClose={() => setShowAIGen(false)} prompt={aiPrompt} onPromptChange={setAiPrompt} onGenerate={handleAIGenerate} loading={aiGenLoading} />
    </div>
  )
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ItemCard: React.FC<{ title: string; subtitle: string; onRemove: () => void; children: React.ReactNode }> = ({ title, subtitle, onRemove, children }) => (
  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</span>
        {subtitle && <span className="ml-2 text-sm font-medium text-white/70">{subtitle}</span>}
      </div>
      <button onClick={onRemove} className="text-red-400/50 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10">
        <Trash2 size={14} />
      </button>
    </div>
    {children}
  </div>
)

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-center py-10 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
    {label}
  </div>
)

const AIGenerateModal: React.FC<{
  open: boolean; onClose: () => void
  prompt: string; onPromptChange: (v: string) => void
  onGenerate: () => void; loading: boolean
}> = ({ open, onClose, prompt, onPromptChange, onGenerate, loading }) => (
  <Modal open={open} onClose={onClose} title="AI Resume Generator" size="md">
    <div className="p-6 space-y-4">
      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
        <Brain size={20} className="text-primary-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-white/70 leading-relaxed">
          Describe yourself and AI will generate a complete professional resume. Include your job title, years of experience, skills, and any relevant details.
        </div>
      </div>
      <Textarea
        label="Describe your profile"
        value={prompt}
        onChange={e => onPromptChange(e.target.value)}
        placeholder='Example: "Create a resume for a React developer with 3 years experience in JavaScript, TypeScript, Node.js. Worked at two startups in Lahore. Bachelor in Computer Science from LUMS."'
        rows={5}
      />
      <div className="flex flex-wrap gap-2">
        {['React Developer with 3 years exp', 'Senior Data Scientist', 'Fresh Graduate Civil Engineer', 'Marketing Manager 5 years'].map(ex => (
          <button key={ex} onClick={() => onPromptChange(ex)} className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-primary-500/40 text-white/50 hover:text-white transition-all">
            {ex}
          </button>
        ))}
      </div>
      <Button variant="primary" size="lg" fullWidth glow loading={loading} icon={loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} onClick={onGenerate} disabled={!prompt.trim()}>
        {loading ? 'Generating Complete Resume...' : 'Generate Resume with AI'}
      </Button>
    </div>
  </Modal>
)

// â”€â”€â”€ Helper: check if section has data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getSectionFilled(resume: ResumeData, section: string): boolean {
  switch (section) {
    case 'personal': return !!(resume.personalInfo.fullName && resume.personalInfo.email)
    case 'summary': return !!resume.summary
    case 'experience': return resume.experience.length > 0
    case 'education': return resume.education.length > 0
    case 'skills': return resume.skills.length > 0
    case 'projects': return (resume.projects || []).length > 0
    case 'certifications': return resume.certifications.length > 0
    case 'languages': return resume.languages.length > 0
    case 'awards': return (resume.awards || []).length > 0
    case 'references': return (resume.references || []).length > 0
    default: return false
  }
}
