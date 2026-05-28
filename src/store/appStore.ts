import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppPage, User } from '../types'

interface AppState {
  currentPage: AppPage
  sidebarOpen: boolean
  theme: 'dark' | 'light'
  user: User | null
  isAuthenticated: boolean
  hasSeenOnboarding: boolean
  geminiApiKey: string

  setPage: (page: AppPage) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setUser: (user: User | null) => void
  setAuthenticated: (val: boolean) => void
  setHasSeenOnboarding: (val: boolean) => void
  setGeminiApiKey: (key: string) => void
  logout: () => void
}

const demoUser: User = {
  id: 'demo-user',
  email: 'user@example.com',
  fullName: 'Alex Johnson',
  plan: 'free',
  aiCredits: 10,
  createdAt: new Date().toISOString(),
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentPage: 'dashboard',
      sidebarOpen: false,
      theme: 'dark',
      user: null,
      isAuthenticated: false,
      hasSeenOnboarding: false,
      geminiApiKey: '',

      setPage: (page) => set({ currentPage: page, sidebarOpen: false }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setUser: (user) => set({ user }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      setHasSeenOnboarding: (val) => set({ hasSeenOnboarding: val }),
      setGeminiApiKey: (key) => {
        localStorage.setItem('gemini_api_key', key)
        set({ geminiApiKey: key })
      },
      logout: () => set({ user: null, isAuthenticated: false, currentPage: 'dashboard' }),
    }),
    {
      name: 'ai-career-toolkit-app',
      partialize: (state) => ({
        hasSeenOnboarding: state.hasSeenOnboarding,
        theme: state.theme,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
)

// Quick demo login
export const loginAsDemo = () => {
  useAppStore.getState().setUser(demoUser)
  useAppStore.getState().setAuthenticated(true)
}
