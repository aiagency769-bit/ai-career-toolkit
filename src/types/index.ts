// ─── Resume Types ────────────────────────────────────────────────────────────

export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  photo?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  current: boolean
  gpa?: string
  description?: string
}

export interface Skill {
  id: string
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  category?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Language {
  id: string
  name: string
  proficiency: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic'
}

export interface Award {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Reference {
  id: string
  name: string
  title: string
  company: string
  email: string
  phone?: string
  relationship: string
}

export type ResumeTemplate =
  | 'modern'
  | 'corporate'
  | 'creative'
  | 'minimal'
  | 'executive'
  | 'fresher'
  | 'government'
  | 'tech'

export interface ResumeData {
  id: string
  title: string
  template: ResumeTemplate
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  awards: Award[]
  references: Reference[]
  createdAt: string
  updatedAt: string
  atsScore?: number
}

// ─── Cover Letter Types ───────────────────────────────────────────────────────

export type CoverLetterTone = 'professional' | 'friendly' | 'corporate' | 'creative' | 'government'

export interface CoverLetterInput {
  jobTitle: string
  companyName: string
  hiringManager?: string
  jobDescription?: string
  yourName: string
  yourEmail: string
  experienceLevel: 'fresher' | 'junior' | 'mid' | 'senior' | 'executive'
  keySkills: string[]
  tone: CoverLetterTone
  language: 'english' | 'urdu'
}

export interface CoverLetter {
  id: string
  input: CoverLetterInput
  content: string
  createdAt: string
}

// ─── ATS Types ────────────────────────────────────────────────────────────────

export interface ATSResult {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  keywords: { found: string[]; missing: string[] }
  formatting: { issues: string[]; passed: string[] }
  suggestions: string[]
  sections: { name: string; present: boolean; strength: 'weak' | 'medium' | 'strong' }[]
  actionVerbs: { weak: string[]; strong: string[] }
  readabilityScore: number
  lengthAnalysis: string
}

// ─── Interview Types ──────────────────────────────────────────────────────────

export type QuestionCategory = 'hr' | 'technical' | 'behavioral' | 'situational'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface InterviewQuestion {
  id: string
  question: string
  category: QuestionCategory
  difficulty: Difficulty
  tips: string[]
  sampleAnswer?: string
  jobRole?: string
}

export interface MockInterviewSession {
  id: string
  jobTitle: string
  questions: InterviewQuestion[]
  answers: { questionId: string; answer: string; score?: number; feedback?: string }[]
  overallScore?: number
  startedAt: string
  completedAt?: string
}

// ─── Job Tracker Types ────────────────────────────────────────────────────────

export type ApplicationStatus = 'saved' | 'applied' | 'pending' | 'interview' | 'offer' | 'rejected' | 'accepted'

export interface JobApplication {
  id: string
  jobTitle: string
  company: string
  location: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  salary?: string
  jobUrl?: string
  status: ApplicationStatus
  appliedDate?: string
  interviewDate?: string
  notes?: string
  contactName?: string
  contactEmail?: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ─── User Types ───────────────────────────────────────────────────────────────

export type Plan = 'free' | 'premium' | 'pro'

export interface User {
  id: string
  email: string
  fullName: string
  avatar?: string
  plan: Plan
  aiCredits: number
  createdAt: string
}

// ─── App Types ────────────────────────────────────────────────────────────────

export type AppPage =
  | 'dashboard'
  | 'resume-builder'
  | 'cover-letter'
  | 'ats-checker'
  | 'interview-prep'
  | 'job-tracker'
  | 'linkedin-optimizer'
  | 'career-coach'
  | 'govt-jobs'
  | 'viral'
  | 'settings'
  | 'subscription'

export interface NavItem {
  id: AppPage
  label: string
  icon: string
  badge?: string
  isPremium?: boolean
}

// ─── Career Coach Types ───────────────────────────────────────────────────────

export interface CareerPath {
  title: string
  description: string
  skills: string[]
  avgSalary: string
  demand: 'high' | 'medium' | 'low'
  timeToLearn: string
  courses: { name: string; platform: string; url?: string; free: boolean }[]
}

export interface SkillGap {
  skill: string
  currentLevel: number
  requiredLevel: number
  priority: 'high' | 'medium' | 'low'
}
