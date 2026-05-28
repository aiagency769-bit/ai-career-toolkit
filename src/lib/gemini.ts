import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ResumeData, CoverLetterInput, ATSResult } from '../types'

// Use the API key from environment or let user configure it
const getApiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
}

// Free AI via Pollinations — no API key needed, works for everyone
const generateWithFreeAI = async (prompt: string): Promise<string> => {
  const response = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: 'openai',
      private: true,
    }),
  })
  if (!response.ok) throw new Error('Free AI request failed')
  return response.text()
}

const safeGenerate = async (prompt: string): Promise<string> => {
  const key = getApiKey()

  // If user has their own Gemini key, use it (faster & more powerful)
  if (key) {
    try {
      const genAI = new GoogleGenerativeAI(key)
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent(prompt)
      return result.response.text()
    } catch (err) {
      console.warn('Gemini key failed, falling back to free AI:', err)
    }
  }

  // Default: free AI (no key required) — works for all users automatically
  try {
    return await generateWithFreeAI(prompt)
  } catch (err) {
    console.error('Free AI error:', err)
    throw new Error('AI generation failed. Please check your internet connection and try again.')
  }
}

// ─── Resume AI Functions ──────────────────────────────────────────────────────

export const generateSummary = async (data: Partial<ResumeData>): Promise<string> => {
  const prompt = `
You are a professional resume writer. Write a compelling 3-4 sentence professional summary for a resume.

Job Title: ${data.personalInfo?.title || 'Professional'}
Experience: ${data.experience?.map(e => `${e.position} at ${e.company}`).join(', ') || 'Not provided'}
Skills: ${data.skills?.map(s => s.name).join(', ') || 'Not provided'}
Education: ${data.education?.map(e => `${e.degree} in ${e.field}`).join(', ') || 'Not provided'}

Write ONLY the summary paragraph. No labels, no extra text. Make it ATS-friendly, impactful, and start with a strong action word or title. Keep it under 100 words.
  `.trim()

  return safeGenerate(prompt)
}

export const generateAchievements = async (position: string, company: string, description: string): Promise<string[]> => {
  const prompt = `
Generate 4 powerful resume bullet points for this job experience. Each must:
- Start with a strong action verb
- Include quantifiable metrics where possible (%, $, numbers)
- Be ATS-friendly
- Be one concise sentence

Position: ${position}
Company: ${company}
Context: ${description}

Return ONLY a JSON array of 4 strings, nothing else. Example: ["Led team of 5...", "Increased revenue by 30%..."]
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : [raw]
  } catch {
    return raw.split('\n').filter(Boolean).slice(0, 4)
  }
}

export const generateSkills = async (jobTitle: string, experience: string): Promise<string[]> => {
  const prompt = `
List 12 relevant professional skills for a ${jobTitle} with ${experience} experience.
Mix technical and soft skills. Make them ATS-optimized.
Return ONLY a JSON array of skill name strings. Example: ["JavaScript", "Project Management", ...]
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    return []
  }
}

// ─── Cover Letter AI Functions ────────────────────────────────────────────────

export const generateCoverLetter = async (input: CoverLetterInput): Promise<string> => {
  const toneMap = {
    professional: 'professional and formal',
    friendly: 'warm and friendly while remaining professional',
    corporate: 'corporate and business-formal',
    creative: 'creative, enthusiastic, and memorable',
    government: 'formal government/official letter style',
  }

  const levelMap = {
    fresher: 'a fresh graduate with no work experience',
    junior: 'someone with 1-2 years of experience',
    mid: 'someone with 3-5 years of experience',
    senior: 'a senior professional with 6+ years of experience',
    executive: 'a C-level executive',
  }

  const prompt = `
Write a compelling cover letter with a ${toneMap[input.tone]} tone for:

Applicant: ${input.yourName}
Email: ${input.yourEmail}
Applying for: ${input.jobTitle}
Company: ${input.companyName}
${input.hiringManager ? `Hiring Manager: ${input.hiringManager}` : ''}
Experience Level: ${levelMap[input.experienceLevel]}
Key Skills: ${input.keySkills.join(', ')}
${input.jobDescription ? `Job Description Context: ${input.jobDescription}` : ''}

Write a complete, well-structured cover letter with:
1. Professional greeting
2. Strong opening paragraph
3. 2-3 body paragraphs highlighting relevant skills and achievements
4. Compelling closing paragraph
5. Professional sign-off

The letter should be ATS-optimized and include relevant keywords. Keep it to 350-450 words.
Write ONLY the letter content, no extra labels or explanations.
  `.trim()

  return safeGenerate(prompt)
}

// ─── ATS Checker AI Functions ─────────────────────────────────────────────────

export const analyzeResume = async (resumeText: string, jobDescription?: string): Promise<ATSResult> => {
  const prompt = `
Analyze this resume for ATS (Applicant Tracking System) compatibility.
${jobDescription ? `Compare against this job description: ${jobDescription}` : ''}

Resume:
${resumeText}

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{
  "score": <number 0-100>,
  "grade": <"A"|"B"|"C"|"D"|"F">,
  "keywords": {
    "found": [<array of found keywords>],
    "missing": [<array of important missing keywords>]
  },
  "formatting": {
    "issues": [<array of formatting issues>],
    "passed": [<array of formatting checks passed>]
  },
  "suggestions": [<array of 5-7 actionable improvement suggestions>],
  "sections": [
    {"name": <section name>, "present": <boolean>, "strength": <"weak"|"medium"|"strong">}
  ],
  "actionVerbs": {
    "weak": [<weak verbs found>],
    "strong": [<strong verbs found>]
  },
  "readabilityScore": <number 0-100>,
  "lengthAnalysis": <"too short"|"ideal"|"too long">
}
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : getDefaultATSResult()
  } catch {
    return getDefaultATSResult()
  }
}

const getDefaultATSResult = (): ATSResult => ({
  score: 65,
  grade: 'C',
  keywords: { found: [], missing: [] },
  formatting: { issues: ['Could not fully parse resume'], passed: [] },
  suggestions: ['Please ensure your resume text is properly formatted'],
  sections: [],
  actionVerbs: { weak: [], strong: [] },
  readabilityScore: 70,
  lengthAnalysis: 'ideal',
})

// ─── Interview AI Functions ───────────────────────────────────────────────────

export const generateInterviewQuestions = async (
  jobTitle: string,
  category: string,
  count = 10
): Promise<{ question: string; tips: string[]; sampleAnswer: string }[]> => {
  const prompt = `
Generate ${count} ${category} interview questions for a ${jobTitle} position.

Return ONLY a valid JSON array with this structure:
[
  {
    "question": <interview question>,
    "tips": [<2-3 tips for answering>],
    "sampleAnswer": <brief sample answer structure>
  }
]
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    return []
  }
}

export const evaluateAnswer = async (
  question: string,
  answer: string,
  jobTitle: string
): Promise<{ score: number; feedback: string; improvements: string[] }> => {
  const prompt = `
Evaluate this interview answer for a ${jobTitle} position.

Question: ${question}
Answer: ${answer}

Return ONLY a valid JSON object:
{
  "score": <number 0-100>,
  "feedback": <2-3 sentences of constructive feedback>,
  "improvements": [<3 specific improvement suggestions>]
}
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\{[\s\S]*\}/)
    return match ? JSON.parse(match[0]) : { score: 70, feedback: 'Good answer.', improvements: [] }
  } catch {
    return { score: 70, feedback: 'Good answer.', improvements: [] }
  }
}

// ─── LinkedIn AI Functions ────────────────────────────────────────────────────

export const generateLinkedInHeadline = async (
  currentTitle: string,
  skills: string[],
  industry: string
): Promise<string[]> => {
  const prompt = `
Generate 5 compelling LinkedIn headline options for:
- Current Role: ${currentTitle}
- Industry: ${industry}
- Top Skills: ${skills.join(', ')}

Each headline should be:
- Under 220 characters
- Keyword-rich for LinkedIn SEO
- Value-focused, not just a job title
- Unique and memorable

Return ONLY a JSON array of 5 headline strings.
  `.trim()

  const raw = await safeGenerate(prompt)
  try {
    const match = raw.match(/\[[\s\S]*\]/)
    return match ? JSON.parse(match[0]) : []
  } catch {
    return []
  }
}

export const generateLinkedInSummary = async (
  name: string,
  title: string,
  experience: string,
  skills: string[],
  goals: string
): Promise<string> => {
  const prompt = `
Write a compelling LinkedIn "About" section for:
Name: ${name}
Title: ${title}
Years of Experience: ${experience}
Top Skills: ${skills.join(', ')}
Career Goals: ${goals}

The summary should:
- Start with a hook/strong opening line
- Be 3-4 paragraphs
- Include keywords naturally
- End with a call to action
- Be 250-350 words
- Feel human, not robotic

Return ONLY the summary text.
  `.trim()

  return safeGenerate(prompt)
}

export const generateFreelanceBio = async (
  platform: 'fiverr' | 'upwork' | 'freelancer',
  skills: string[],
  experience: string,
  specialization: string
): Promise<string> => {
  const platformMap = {
    fiverr: 'Fiverr gig description',
    upwork: 'Upwork profile overview',
    freelancer: 'Freelancer.com profile bio',
  }

  const prompt = `
Write a compelling ${platformMap[platform]} for a freelancer:
Specialization: ${specialization}
Key Skills: ${skills.join(', ')}
Experience: ${experience}

Requirements:
- Attention-grabbing opening
- Clear value proposition
- Mention key skills naturally
- Include a call to action
- ${platform === 'fiverr' ? '150-200 words' : '200-300 words'}
- Professional but approachable tone

Return ONLY the bio text.
  `.trim()

  return safeGenerate(prompt)
}

// ─── Career Coach AI Functions ────────────────────────────────────────────────

export const analyzeCareerPath = async (
  currentSkills: string[],
  interests: string[],
  educationLevel: string,
  experienceYears: number
): Promise<string> => {
  const prompt = `
Act as an expert career coach. Analyze this profile and suggest the top 3 career paths:

Current Skills: ${currentSkills.join(', ')}
Interests: ${interests.join(', ')}
Education: ${educationLevel}
Experience: ${experienceYears} years

For each career path provide:
1. Career title and brief description
2. Why it fits this profile
3. Top 3 skills to develop
4. Expected salary range (Pakistan/International)
5. Time to transition
6. Top 2 free learning resources

Format as clean, readable text with clear sections. Be specific and actionable.
  `.trim()

  return safeGenerate(prompt)
}

// ─── Resume Roast (Viral Feature) ────────────────────────────────────────────

export const roastResume = async (resumeText: string): Promise<string> => {
  const prompt = `
You are a brutally honest but funny career coach. "Roast" this resume in a humorous but constructive way.

Resume:
${resumeText}

Write 5-7 funny but insightful critiques. Be witty, use humor, but ensure each criticism has a real point.
End with 3 genuine positive observations and 3 actionable improvements.
Format as bullet points. Keep it fun and shareable!
  `.trim()

  return safeGenerate(prompt)
}

export const hasApiKey = (): boolean => {
  return !!(localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY)
}
