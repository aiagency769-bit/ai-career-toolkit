import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ResumeData, ResumeTemplate } from '../types'
import { generateId } from '../lib/utils'

const createBlankResume = (): ResumeData => ({
  id: generateId(),
  title: 'My Resume',
  template: 'modern',
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  awards: [],
  references: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
})

interface ResumeState {
  resumes: ResumeData[]
  activeResumeId: string | null
  activeResume: ResumeData | null

  createResume: (template?: ResumeTemplate) => string
  updateResume: (id: string, data: Partial<ResumeData>) => void
  deleteResume: (id: string) => void
  setActiveResume: (id: string) => void
  duplicateResume: (id: string) => string
  importResume: (data: ResumeData) => void
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumes: [],
      activeResumeId: null,
      activeResume: null,

      createResume: (template = 'modern') => {
        const resume = { ...createBlankResume(), template }
        set((s) => ({
          resumes: [...s.resumes, resume],
          activeResumeId: resume.id,
          activeResume: resume,
        }))
        return resume.id
      },

      updateResume: (id, data) => {
        set((s) => {
          const updated = s.resumes.map((r) =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          )
          const active = updated.find((r) => r.id === id) || null
          return {
            resumes: updated,
            activeResume: s.activeResumeId === id ? active : s.activeResume,
          }
        })
      },

      deleteResume: (id) => {
        set((s) => {
          const remaining = s.resumes.filter((r) => r.id !== id)
          return {
            resumes: remaining,
            activeResumeId: s.activeResumeId === id ? (remaining[0]?.id || null) : s.activeResumeId,
            activeResume: s.activeResumeId === id ? (remaining[0] || null) : s.activeResume,
          }
        })
      },

      setActiveResume: (id) => {
        const resume = get().resumes.find((r) => r.id === id) || null
        set({ activeResumeId: id, activeResume: resume })
      },

      duplicateResume: (id) => {
        const original = get().resumes.find((r) => r.id === id)
        if (!original) return id
        const copy = {
          ...JSON.parse(JSON.stringify(original)),
          id: generateId(),
          title: `${original.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({
          resumes: [...s.resumes, copy],
          activeResumeId: copy.id,
          activeResume: copy,
        }))
        return copy.id
      },

      importResume: (data) => {
        const resume = { ...data, id: generateId(), updatedAt: new Date().toISOString() }
        set((s) => ({
          resumes: [...s.resumes, resume],
          activeResumeId: resume.id,
          activeResume: resume,
        }))
      },
    }),
    {
      name: 'ai-career-toolkit-resumes',
    }
  )
)
