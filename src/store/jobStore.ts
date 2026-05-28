import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { JobApplication, ApplicationStatus } from '../types'
import { generateId } from '../lib/utils'

interface JobStore {
  applications: JobApplication[]
  addApplication: (app: Partial<JobApplication>) => void
  updateApplication: (id: string, data: Partial<JobApplication>) => void
  deleteApplication: (id: string) => void
  updateStatus: (id: string, status: ApplicationStatus) => void
  getByStatus: (status: ApplicationStatus) => JobApplication[]
}

export const useJobStore = create<JobStore>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (app) => {
        const newApp: JobApplication = {
          id: generateId(),
          jobTitle: '',
          company: '',
          location: '',
          jobType: 'full-time',
          status: 'saved',
          tags: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...app,
        }
        set((s) => ({ applications: [newApp, ...s.applications] }))
      },

      updateApplication: (id, data) => {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, ...data, updatedAt: new Date().toISOString() } : a
          ),
        }))
      },

      deleteApplication: (id) => {
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) }))
      },

      updateStatus: (id, status) => {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
          ),
        }))
      },

      getByStatus: (status) => {
        return get().applications.filter((a) => a.status === status)
      },
    }),
    { name: 'ai-career-toolkit-jobs' }
  )
)
