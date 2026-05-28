import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'

// Layout
import { Layout } from './components/layout/Layout'

// Pages
import { SplashScreen } from './pages/SplashScreen'
import { OnboardingPage } from './pages/OnboardingPage'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ResumeBuilderPage } from './pages/ResumeBuilderPage'
import { CoverLetterPage } from './pages/CoverLetterPage'
import { ATSCheckerPage } from './pages/ATSCheckerPage'
import { InterviewPrepPage } from './pages/InterviewPrepPage'
import { JobTrackerPage } from './pages/JobTrackerPage'
import { LinkedInOptimizerPage } from './pages/LinkedInOptimizerPage'
import { CareerCoachPage } from './pages/CareerCoachPage'
import { GovernmentJobsPage } from './pages/GovernmentJobsPage'
import { ViralFeaturesPage } from './pages/ViralFeaturesPage'
import { SettingsPage } from './pages/SettingsPage'
import { SubscriptionPage } from './pages/SubscriptionPage'

// Store
import { useAppStore } from './store/appStore'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -10 },
}

function PageContent() {
  const { currentPage } = useAppStore()

  const pages: Record<string, React.ReactNode> = {
    dashboard:            <DashboardPage />,
    'resume-builder':     <ResumeBuilderPage />,
    'cover-letter':       <CoverLetterPage />,
    'ats-checker':        <ATSCheckerPage />,
    'interview-prep':     <InterviewPrepPage />,
    'job-tracker':        <JobTrackerPage />,
    'linkedin-optimizer': <LinkedInOptimizerPage />,
    'career-coach':       <CareerCoachPage />,
    'govt-jobs':          <GovernmentJobsPage />,
    viral:                <ViralFeaturesPage />,
    settings:             <SettingsPage />,
    subscription:         <SubscriptionPage />,
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentPage}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.18, ease: 'easeOut' }}
      >
        {pages[currentPage] || <DashboardPage />}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const { hasSeenOnboarding, isAuthenticated } = useAppStore()

  useEffect(() => {
    // Restore API key from localStorage
    const key = localStorage.getItem('gemini_api_key')
    if (key) useAppStore.getState().setGeminiApiKey(key)
  }, [])

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />
  }

  if (!hasSeenOnboarding) {
    return <OnboardingPage />
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <>
      <Layout>
        <PageContent />
      </Layout>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1c2e',
            color: '#fff',
            border: '1px solid rgba(97,114,243,0.3)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </>
  )
}
