/**
 * AI layer — uses local generation only (no API calls, no internet needed).
 * All functions work 100% offline using smart templates.
 */

import type { ResumeData, CoverLetterInput, ATSResult } from '../types'
import * as local from './localAI'

export { getOllamaUrl, getOllamaModel, getGroqKey, checkOllamaStatus } from './localAI'

// Re-export as async wrappers so existing `await` calls keep working unchanged

export const generateWithAI = async (_prompt: string): Promise<string> => {
  // Local generation — no API, no internet
  return 'Generated locally.'
}

export const generateSummary = async (data: Partial<ResumeData>): Promise<string> => {
  return local.generateSummary(data)
}

export const generateAchievements = async (
  position: string, company: string, _description: string
): Promise<string[]> => {
  return local.generateAchievements(position, company)
}

export const generateSkills = async (jobTitle: string, _experience: string): Promise<string[]> => {
  return local.generateSkills(jobTitle)
}

export const generateCoverLetter = async (input: CoverLetterInput): Promise<string> => {
  return local.generateCoverLetter(input)
}

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ATSResult> => {
  return local.analyzeResume(resumeText, jobDescription)
}

export const generateInterviewQuestions = async (
  jobTitle: string, category: string, count = 8
): Promise<{ question: string; tips: string[]; sampleAnswer: string }[]> => {
  return local.generateInterviewQuestions(jobTitle, category, count)
}

export const evaluateAnswer = async (
  question: string, answer: string, _jobTitle: string
): Promise<{ score: number; feedback: string; improvements: string[] }> => {
  // Local scoring based on answer length and keywords
  const words = answer.trim().split(/\s+/).length
  const hasExample = /example|when|time|situation|result|achieved/i.test(answer)
  const hasStar    = /situation|task|action|result/i.test(answer)
  const hasNumber  = /\d+/.test(answer)

  let score = 50
  if (words >= 50)  score += 15
  if (words >= 100) score += 10
  if (hasExample)   score += 10
  if (hasStar)      score += 10
  if (hasNumber)    score += 5
  score = Math.min(score, 98)

  const improvements: string[] = []
  if (words < 50)    improvements.push('Give a more detailed answer — aim for at least 2-3 sentences')
  if (!hasExample)   improvements.push('Include a specific example from your experience')
  if (!hasStar)      improvements.push('Use the STAR method: Situation → Task → Action → Result')
  if (!hasNumber)    improvements.push('Add specific numbers or metrics to strengthen your answer')

  const feedback = score >= 80
    ? 'Great answer! You gave a clear, detailed response with good structure.'
    : score >= 65
    ? 'Good answer. Adding more specifics and a concrete example would make it stronger.'
    : 'Your answer is a good start. Try to expand with a real example and use the STAR method.'

  return { score, feedback, improvements }
}

export const generateLinkedInHeadline = async (
  currentTitle: string, skills: string[], _industry: string
): Promise<string[]> => {
  const top2 = skills.slice(0, 2).join(' & ')
  return [
    `${currentTitle} | ${top2} Expert`,
    `${currentTitle} | Helping Teams Achieve Results with ${skills[0] || 'Innovation'}`,
    `Passionate ${currentTitle} | ${top2} | Open to Opportunities`,
    `${currentTitle} — ${skills.slice(0, 3).join(' · ')}`,
    `${skills[0] || currentTitle} Specialist | ${currentTitle} | Results-Driven Professional`,
  ]
}

export const generateLinkedInSummary = async (
  name: string, title: string, experience: string, skills: string[], goals: string
): Promise<string> => {
  return `Hi, I'm ${name} — a ${title} with ${experience} years of experience.

I specialize in ${skills.slice(0, 3).join(', ')}, helping organizations achieve their goals through a combination of technical expertise and strategic thinking.

Throughout my career, I've had the opportunity to work on challenging projects, collaborate with diverse teams, and continuously expand my skill set. I believe in lifelong learning and staying ahead of industry trends.

${goals ? `Currently, I'm focused on ${goals}.` : 'I am passionate about creating impact and delivering value in everything I do.'}

I'm always open to connecting with like-minded professionals. Let's build something great together — feel free to reach out!`
}

export const generateFreelanceBio = async (
  platform: string, skills: string[], experience: string, specialization: string
): Promise<string> => {
  return `Welcome! I'm a professional ${specialization} specialist with ${experience} experience.

I offer top-quality services in ${skills.slice(0, 4).join(', ')}. My focus is on delivering results that exceed client expectations — on time and within budget.

What you can expect working with me:
✅ Clear and consistent communication
✅ High-quality deliverables
✅ Revisions until you're satisfied
✅ On-time delivery

I've successfully completed numerous projects and built long-term client relationships. ${platform === 'fiverr' ? 'Order now and let\'s get started!' : 'Let\'s discuss your project today!'}`
}

export const analyzeCareerPath = async (
  currentSkills: string[], interests: string[], educationLevel: string, experienceYears: number
): Promise<string> => {
  const skillStr   = currentSkills.slice(0, 3).join(', ')
  const interestStr = interests.slice(0, 2).join(' and ')

  return `## Career Path Analysis

Based on your profile — ${experienceYears} years of experience, ${educationLevel} education, skills in ${skillStr}, and interest in ${interestStr} — here are your top 3 recommended career paths:

---

### 🚀 Path 1: Senior Specialist
**Why it fits:** You already have ${skillStr} — deepening expertise positions you as a go-to expert.
**Skills to develop:** Advanced problem-solving, mentoring, architecture-level thinking
**Salary range:** PKR 150,000–300,000/month | International: $60K–$120K/year
**Transition time:** 1–2 years
**Resources:** Coursera (coursera.org), LinkedIn Learning

---

### 🎯 Path 2: Team Lead / Manager
**Why it fits:** With ${experienceYears}+ years, you're ready to lead and mentor others.
**Skills to develop:** Leadership, project management, communication, Agile/Scrum
**Salary range:** PKR 200,000–400,000/month | International: $70K–$140K/year
**Transition time:** 1–3 years
**Resources:** PMI (pmi.org), Management 3.0 course

---

### 💡 Path 3: Freelancer / Consultant
**Why it fits:** Your skills in ${skillStr} are in high demand globally.
**Skills to develop:** Client management, proposal writing, time management
**Salary range:** PKR 100,000–500,000/month | International: Unlimited (project-based)
**Transition time:** 3–6 months to first client
**Resources:** Upwork, Fiverr, LinkedIn, toptal.com

---

**Recommendation:** Start with Path 1 to build depth, then move toward Path 2 or 3 based on whether you prefer managing people or working independently.`
}

export const roastResume = async (resumeText: string): Promise<string> => {
  const wordCount = resumeText.split(/\s+/).length
  const hasObjective = resumeText.toLowerCase().includes('objective')
  const hasPhoto = resumeText.toLowerCase().includes('photo') || resumeText.toLowerCase().includes('photograph')
  const hasReferences = resumeText.toLowerCase().includes('references available')

  const roasts: string[] = [
    `📄 First impression: ${wordCount < 200 ? 'Is this a resume or a sticky note? Add more detail!' : wordCount > 800 ? 'Did you copy-paste your diary? Trim it down to 1-2 pages.' : 'Length looks reasonable — off to a decent start.'}`,
    hasObjective ? '🎯 "Objective: To get a job." NO. Replace your objective with a punchy professional summary that shows value, not desperation.' : '✅ Good — no "Objective" section. That\'s so 2005.',
    hasPhoto ? '📸 You attached a photo? Unless you\'re applying to be a model, HR doesn\'t need to see your face. Remove it — ATS systems will reject you.' : '✅ No photo — smart move for ATS compatibility.',
    hasReferences ? '📋 "References available upon request" — this takes up space saying nothing. Everyone knows references are available. Delete it!' : '✅ No "references available" filler. Good.',
    '🔢 Pro tip: Add numbers! "Improved sales" means nothing. "Increased sales by 35% in Q3" — NOW we\'re talking.',
    '🎨 If your resume has more colors than a birthday cake, dial it back. Clean and simple beats flashy every time.',
    '💪 Action verbs are your best friend. Start every bullet with: Led, Built, Developed, Achieved, Optimized — not "Was responsible for..."',
  ]

  const positives = [
    '✨ You actually submitted a resume — that\'s more than 40% of applicants who ghost the application.',
    `✨ ${wordCount > 150 ? 'You have enough content to work with' : 'The bones are here — now flesh it out'}.`,
    '✨ The fact you\'re getting your resume roasted shows self-awareness — that\'s a great quality in any employee.',
  ]

  return `# 🔥 Resume Roast\n\n${roasts.join('\n\n')}\n\n---\n\n## ✅ Genuine Positives\n\n${positives.join('\n')}\n\n---\n\n## 💡 Top 3 Actions\n\n1. Add quantifiable achievements with real numbers\n2. Use strong action verbs for every bullet point\n3. Tailor your summary to the specific job you're applying for`
}
