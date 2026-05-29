/**
 * Local AI — No API calls, no internet needed.
 * Generates interview questions, cover letters, summaries etc.
 * using smart templates + data-driven logic.
 */

import type { ResumeData, CoverLetterInput, ATSResult } from '../types'

// ─── Ollama config (kept here for Settings page) ─────────────────────────────
export const getOllamaUrl   = (): string => localStorage.getItem('ollama_url')   || 'http://localhost:11434'
export const getOllamaModel = (): string => localStorage.getItem('ollama_model') || 'llama3.2'
export const getGroqKey     = (): string => localStorage.getItem('groq_api_key') || ''

export const checkOllamaStatus = async (): Promise<{ running: boolean; models: string[] }> => {
  try {
    const r = await fetch(`${getOllamaUrl()}/api/tags`, { signal: AbortSignal.timeout(3000) })
    if (!r.ok) return { running: false, models: [] }
    const data = await r.json()
    const models: string[] = (data.models || []).map((m: { name: string }) => m.name.replace(/:latest$/, ''))
    return { running: true, models }
  } catch { return { running: false, models: [] } }
}

// ─── Utility ─────────────────────────────────────────────────────────────────

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const picks = <T>(arr: T[], n: number): T[] => {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

// ─── Interview Questions ──────────────────────────────────────────────────────

const HR_QUESTIONS = [
  { q: 'Tell me about yourself.', tips: ['Keep it 2 minutes', 'Focus on professional journey', 'End with why you want this role'], sample: 'Start with current/recent role → key achievements → why you\'re excited about this opportunity.' },
  { q: 'What are your greatest strengths?', tips: ['Give 2-3 specific strengths', 'Back each with an example', 'Align with job requirements'], sample: 'Name strength → give real example → connect to this role.' },
  { q: 'What is your biggest weakness?', tips: ['Be honest but strategic', 'Show self-awareness', 'Explain what you\'re doing to improve'], sample: 'Mention a real weakness → explain steps taken to improve → show progress.' },
  { q: 'Where do you see yourself in 5 years?', tips: ['Show ambition but be realistic', 'Align with company growth', 'Focus on skills and impact'], sample: 'I want to grow into [senior role], deepen expertise in [skill], and contribute to [company goal].' },
  { q: 'Why do you want to leave your current job?', tips: ['Stay positive', 'Focus on growth', 'Never badmouth employer'], sample: 'I\'ve learned a lot but I\'m looking for new challenges and opportunities to grow in [area].' },
  { q: 'Why should we hire you?', tips: ['Summarize top 3 strengths', 'Show specific value', 'Be confident'], sample: 'I bring [skill 1], [skill 2], and [skill 3] — plus a proven track record of [achievement].' },
  { q: 'What motivates you at work?', tips: ['Be genuine', 'Tie to the role', 'Show passion'], sample: 'I\'m motivated by [challenge/impact/learning] — especially when [specific example].' },
  { q: 'How do you handle stress and pressure?', tips: ['Show coping strategies', 'Give a real example', 'Stay positive'], sample: 'I prioritize tasks, break work into steps, and communicate early if timelines are at risk.' },
  { q: 'Describe your ideal work environment.', tips: ['Research company culture', 'Be flexible', 'Show adaptability'], sample: 'I thrive in collaborative environments where feedback is encouraged and goals are clear.' },
  { q: 'What are your salary expectations?', tips: ['Research market rates', 'Give a range', 'Show flexibility'], sample: 'Based on my experience and market research, I\'m looking for [range], but I\'m open to discussing.' },
  { q: 'Do you prefer working alone or in a team?', tips: ['Show versatility', 'Give examples of both', 'Adapt to role'], sample: 'I enjoy both — I collaborate well in teams but can also work independently when needed.' },
  { q: 'What do you know about our company?', tips: ['Research before interview', 'Mention specific products/values', 'Show genuine interest'], sample: 'I know that your company [fact] and I\'m excited about [specific aspect] because...' },
]

const BEHAVIORAL_QUESTIONS = [
  { q: 'Tell me about a time you faced a difficult challenge at work.', tips: ['Use STAR method', 'Choose a real challenge', 'Show what you learned'], sample: 'Situation → Task → Action taken → Result achieved + lesson learned.' },
  { q: 'Describe a situation where you showed leadership.', tips: ['Even without a title', 'Focus on impact', 'Show team results'], sample: 'When [situation], I stepped up by [action] which resulted in [positive outcome].' },
  { q: 'Tell me about a time you failed and what you learned.', tips: ['Be honest', 'Focus on learning', 'Show growth mindset'], sample: 'I made [mistake] → recognized it quickly → took corrective action → learned [lesson].' },
  { q: 'Describe a time you worked with a difficult colleague.', tips: ['Stay professional', 'Focus on resolution', 'Show empathy'], sample: 'I noticed tension with [colleague] → initiated a private conversation → found common ground → improved collaboration.' },
  { q: 'Tell me about a time you exceeded expectations.', tips: ['Quantify the achievement', 'Explain your motivation', 'Show initiative'], sample: 'I was asked to [task] but I went further by [extra action] resulting in [measurable impact].' },
  { q: 'Describe a situation where you had to meet a tight deadline.', tips: ['Show prioritization skills', 'Mention tools/methods used', 'Share the outcome'], sample: 'With [X days] to deliver [project], I prioritized key tasks, worked extra hours, and delivered on time.' },
  { q: 'Tell me about a time you had to adapt to a major change.', tips: ['Show flexibility', 'Demonstrate positive attitude', 'Focus on results'], sample: 'When [change happened], I quickly [action] and adapted by [steps] which led to [outcome].' },
  { q: 'Describe a time you had to persuade someone to your point of view.', tips: ['Show communication skills', 'Use data/facts', 'Respect others\' views'], sample: 'I prepared [data/evidence], listened to concerns, and presented a solution that addressed both sides.' },
]

const TECHNICAL_QUESTIONS: Record<string, { q: string; tips: string[]; sample: string }[]> = {
  default: [
    { q: 'Walk me through your technical background and main skills.', tips: ['Be concise', 'Highlight relevant tech', 'Show depth in 1-2 areas'], sample: 'I have [X] years experience with [core skills], recently worked on [project type], strongest in [area].' },
    { q: 'How do you stay updated with new technologies in your field?', tips: ['Mention specific sources', 'Show curiosity', 'Give recent example'], sample: 'I follow [blogs/communities], take online courses, and recently learned [new skill] by [method].' },
    { q: 'Describe a complex technical problem you solved.', tips: ['Explain clearly to non-tech', 'Show your approach', 'Quantify impact'], sample: 'The problem was [issue] → I analyzed root cause → implemented [solution] → reduced [metric] by X%.' },
    { q: 'How do you approach debugging a difficult issue?', tips: ['Show systematic thinking', 'Mention tools', 'Demonstrate patience'], sample: 'I reproduce the issue → isolate variables → check logs → test hypotheses → document the fix.' },
    { q: 'What is your approach to code/work quality and review?', tips: ['Show best practices', 'Mention testing', 'Value teamwork'], sample: 'I write clean, documented code → run tests → do self-review → welcome peer feedback.' },
  ],
  software: [
    { q: 'Explain the difference between SQL and NoSQL databases.', tips: ['Give real use cases', 'Show when to use each', 'Mention your experience'], sample: 'SQL: structured, ACID compliant, good for relations. NoSQL: flexible schema, great for scale/unstructured data.' },
    { q: 'What is REST API and have you built one?', tips: ['Define clearly', 'Mention HTTP methods', 'Give project example'], sample: 'REST uses HTTP methods (GET/POST/PUT/DELETE) to expose resources. I built [project] API using [framework].' },
    { q: 'How do you handle version control in a team?', tips: ['Mention Git workflow', 'Talk about branching', 'Show collaboration'], sample: 'We use Git with feature branches, PRs with code review, and merge to main after CI passes.' },
  ],
  marketing: [
    { q: 'How do you measure the success of a marketing campaign?', tips: ['Mention KPIs', 'Show data-driven mindset', 'Give real metrics'], sample: 'I track CTR, conversion rate, CPA, and ROI. For [campaign], we achieved [specific metric].' },
    { q: 'What digital marketing channels have you worked with?', tips: ['List relevant channels', 'Mention best results', 'Show strategy'], sample: 'I\'ve worked with SEO, PPC, social media, and email — best ROI was [channel] with [result].' },
  ],
  manager: [
    { q: 'How do you motivate your team?', tips: ['Show different approaches', 'Mention individual needs', 'Give example'], sample: 'I understand what drives each person — recognition, growth, autonomy — and adapt my style accordingly.' },
    { q: 'How do you handle underperforming team members?', tips: ['Show empathy + accountability', 'Mention clear feedback', 'Focus on improvement'], sample: 'I have a private conversation → understand root cause → set clear expectations → provide support → review progress.' },
  ],
}

const SITUATIONAL_QUESTIONS = [
  { q: 'If you were given multiple urgent tasks at once, how would you prioritize?', tips: ['Show decision framework', 'Mention stakeholder communication', 'Be practical'], sample: 'I\'d assess impact and urgency → communicate with stakeholders → tackle highest-priority first → update team on timeline.' },
  { q: 'What would you do if you disagreed with your manager\'s decision?', tips: ['Show respect + assertiveness', 'Mention private discussion', 'Accept final decision gracefully'], sample: 'I\'d share my concerns privately with evidence → listen to reasoning → if overruled, commit fully to execution.' },
  { q: 'How would you handle a situation where a project is going to miss its deadline?', tips: ['Show proactive communication', 'Offer solutions', 'Don\'t wait until last minute'], sample: 'I\'d flag it early → analyze options (cut scope, add resources) → present solutions to stakeholders → revise plan.' },
  { q: 'If a client/customer is very unhappy, how would you handle it?', tips: ['Empathy first', 'Take ownership', 'Offer concrete solution'], sample: 'Listen fully → acknowledge their frustration → apologize → provide a clear solution and timeline → follow up.' },
  { q: 'What would you do if you discovered a major error in a finished deliverable?', tips: ['Show accountability', 'Act quickly', 'Communicate honestly'], sample: 'I\'d immediately inform stakeholders → assess impact → provide a fix timeline → learn to prevent recurrence.' },
  { q: 'How would you approach learning a completely new skill required for this role?', tips: ['Show learning agility', 'Mention specific methods', 'Give timeline'], sample: 'I\'d identify top learning resources → set daily practice goals → build a small project → seek mentorship.' },
  { q: 'If your team is resistant to a new process, how would you get buy-in?', tips: ['Show change management skills', 'Involve the team', 'Demonstrate benefits'], sample: 'I\'d involve team early → address concerns → show a pilot success → celebrate quick wins.' },
  { q: 'What would you do in your first 30 days in this role?', tips: ['Show initiative', 'Focus on learning + relationships', 'Mention quick wins'], sample: 'Learn the product/team/processes → build relationships → identify one quick win → propose 90-day plan.' },
]

export const generateInterviewQuestions = (
  jobTitle: string,
  category: string,
  count = 8
): { question: string; tips: string[]; sampleAnswer: string }[] => {
  const title = jobTitle.toLowerCase()

  let pool: { q: string; tips: string[]; sample: string }[]

  if (category === 'hr') {
    pool = HR_QUESTIONS
  } else if (category === 'behavioral') {
    pool = BEHAVIORAL_QUESTIONS
  } else if (category === 'situational') {
    pool = SITUATIONAL_QUESTIONS
  } else {
    // technical — pick domain-specific if available
    let domain = TECHNICAL_QUESTIONS.default
    if (title.includes('software') || title.includes('developer') || title.includes('engineer') || title.includes('frontend') || title.includes('backend')) {
      domain = [...TECHNICAL_QUESTIONS.default, ...TECHNICAL_QUESTIONS.software]
    } else if (title.includes('market')) {
      domain = [...TECHNICAL_QUESTIONS.default, ...TECHNICAL_QUESTIONS.marketing]
    } else if (title.includes('manager') || title.includes('lead') || title.includes('director')) {
      domain = [...TECHNICAL_QUESTIONS.default, ...TECHNICAL_QUESTIONS.manager]
    }
    pool = domain
  }

  return picks(pool, Math.min(count, pool.length)).map(item => ({
    question: item.q,
    tips: item.tips,
    sampleAnswer: item.sample,
  }))
}

// ─── Cover Letter ─────────────────────────────────────────────────────────────

const OPENINGS: Record<string, string[]> = {
  professional: [
    'I am writing to express my strong interest in the {jobTitle} position at {companyName}.',
    'Please consider this letter as my formal application for the {jobTitle} role at {companyName}.',
    'I am excited to apply for the {jobTitle} position at {companyName}, as advertised.',
  ],
  friendly: [
    'I was thrilled to come across the {jobTitle} opening at {companyName} — it sounds like a perfect fit!',
    'When I saw the {jobTitle} role at {companyName}, I knew I had to apply right away.',
    'I am genuinely excited about the opportunity to join {companyName} as a {jobTitle}.',
  ],
  corporate: [
    'In response to your advertisement for a {jobTitle}, I would like to submit my application to {companyName}.',
    'I wish to apply for the position of {jobTitle} within {companyName}.',
    'I am pleased to apply for the {jobTitle} vacancy at {companyName}.',
  ],
  creative: [
    'What if your next {jobTitle} could bring not just skills, but a fresh perspective? That\'s exactly what I offer {companyName}.',
    'I don\'t just apply for jobs — I apply for missions. The {jobTitle} role at {companyName} is a mission I\'m ready for.',
    'Great companies need great people. I\'m writing because I believe {companyName} and I can build something remarkable together.',
  ],
  government: [
    'I, {yourName}, respectfully submit my application for the post of {jobTitle} at {companyName}.',
    'With reference to the advertisement for the position of {jobTitle}, I am hereby submitting my application to {companyName}.',
  ],
}

const BODY_PARAGRAPHS = {
  skills: [
    'Throughout my career, I have developed strong expertise in {skills}. These skills have enabled me to deliver consistent results and add measurable value to every team I have been part of.',
    'My background includes hands-on experience with {skills}. I have applied these capabilities in real-world projects, consistently meeting and exceeding expectations.',
    'I bring proficiency in {skills}, which I have refined through {experience} of professional experience. This technical foundation, combined with strong communication skills, makes me a well-rounded candidate.',
  ],
  motivation: [
    '{companyName} stands out to me because of its commitment to excellence and innovation. I am eager to contribute to your team\'s goals and grow within your organization.',
    'I have long admired {companyName}\'s reputation in the industry. I am confident that my background aligns well with your team\'s objectives and culture.',
    'The opportunity at {companyName} excites me because it combines my passion for {domain} with the chance to make a real impact. I am ready to bring my full dedication to this role.',
  ],
  value: [
    'I am a proactive professional who thrives in fast-paced environments. I am known for my attention to detail, problem-solving ability, and commitment to delivering quality work on time.',
    'What sets me apart is my ability to combine technical skills with clear communication and teamwork. I take ownership of my responsibilities and always strive for excellence.',
    'I am results-oriented and believe in continuous improvement. I would bring energy, dedication, and a strong work ethic to the {jobTitle} role at {companyName}.',
  ],
}

const CLOSINGS: Record<string, string[]> = {
  professional: [
    'I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.',
    'I look forward to the possibility of contributing to {companyName}. Thank you for your time and consideration.',
  ],
  friendly: [
    'I would love to chat further about how I can contribute to your awesome team! Thanks so much for considering me.',
    'I am excited about the possibility of joining {companyName} and would love to discuss further. Thank you!',
  ],
  corporate: [
    'I am available for an interview at your convenience and can be reached at {email}. I look forward to your favorable response.',
    'I would be grateful for the opportunity to discuss my application further at your earliest convenience.',
  ],
  creative: [
    'Let\'s create something great together. I am just one conversation away — I look forward to hearing from you.',
    'I would love the chance to show you in person what I can bring to {companyName}. Let\'s talk!',
  ],
  government: [
    'I would be grateful if you would consider my application favorably. I assure you of my sincerity and dedication to serving with excellence.',
    'I humbly request that you consider my application and grant me the opportunity to appear for an interview.',
  ],
}

export const generateCoverLetter = (input: CoverLetterInput): string => {
  const tone = (input.tone || 'professional') as keyof typeof OPENINGS
  const skills = input.keySkills.length > 0
    ? input.keySkills.slice(0, 5).join(', ')
    : 'relevant skills and professional expertise'
  const experience = {
    fresher: 'academic training',
    junior: '1-2 years',
    mid: '3-5 years',
    senior: '6+ years',
    executive: 'extensive executive-level',
  }[input.experienceLevel] || '3-5 years'

  const domain = input.jobTitle.toLowerCase().includes('software') || input.jobTitle.toLowerCase().includes('tech')
    ? 'technology'
    : input.jobTitle.toLowerCase().includes('market')
    ? 'marketing'
    : 'my field'

  const replacements = {
    '{jobTitle}': input.jobTitle,
    '{companyName}': input.companyName,
    '{yourName}': input.yourName || 'I',
    '{email}': input.yourEmail || 'the contact details provided',
    '{skills}': skills,
    '{experience}': experience,
    '{domain}': domain,
  }

  const replace = (text: string) =>
    Object.entries(replacements).reduce((t, [k, v]) => t.split(k).join(v), text)

  const openingPool = OPENINGS[tone] || OPENINGS.professional
  const closingPool = CLOSINGS[tone] || CLOSINGS.professional

  const greeting = input.hiringManager
    ? `Dear ${input.hiringManager},`
    : 'Dear Hiring Manager,'

  const opening = replace(pick(openingPool))
  const body1   = replace(pick(BODY_PARAGRAPHS.skills))
  const body2   = replace(pick(BODY_PARAGRAPHS.motivation))
  const body3   = replace(pick(BODY_PARAGRAPHS.value))
  const closing = replace(pick(closingPool))

  const signOff = tone === 'friendly' || tone === 'creative'
    ? 'Warm regards,'
    : tone === 'government'
    ? 'Yours obediently,'
    : 'Sincerely,'

  return [
    greeting,
    '',
    opening,
    '',
    body1,
    '',
    body2,
    '',
    body3,
    '',
    closing,
    '',
    signOff,
    input.yourName || '[Your Name]',
    input.yourEmail ? input.yourEmail : '',
  ].filter(l => l !== null).join('\n').trim()
}

// ─── Resume Summary ───────────────────────────────────────────────────────────

export const generateSummary = (data: Partial<ResumeData>): string => {
  const title   = data.personalInfo?.title || 'professional'
  const skills  = data.skills?.map(s => s.name).slice(0, 4).join(', ') || 'various skills'
  const expCount = data.experience?.length || 0
  const expYears = expCount > 0 ? `${expCount + 1}+ years of` : ''
  const topCompany = data.experience?.[0]?.company || ''
  const degree  = data.education?.[0]?.degree || ''

  const templates = [
    `Results-driven ${title} with ${expYears} professional experience in ${skills}. ${topCompany ? `Previously contributed to ${topCompany},` : 'Proven'} delivering high-quality work and exceeding targets. Passionate about leveraging expertise to drive growth and innovation.`,
    `Dynamic ${title} specializing in ${skills}. ${degree ? `Holds a ${degree} and brings` : 'Brings'} a track record of success in fast-paced environments. Committed to continuous learning and delivering measurable impact.`,
    `Accomplished ${title} with a strong foundation in ${skills}. Known for problem-solving ability, strong communication, and a results-oriented mindset. ${expYears ? `With ${expYears} experience,` : ''} eager to contribute expertise to a forward-thinking organization.`,
  ]

  return pick(templates)
}

// ─── Skills Suggestions ───────────────────────────────────────────────────────

const SKILL_SETS: Record<string, string[]> = {
  developer:  ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Git', 'REST APIs', 'SQL', 'Docker', 'Problem Solving', 'Agile'],
  frontend:   ['React', 'Vue.js', 'HTML/CSS', 'TypeScript', 'TailwindCSS', 'Figma', 'Web Performance', 'Responsive Design', 'Git', 'JavaScript'],
  backend:    ['Node.js', 'Python', 'SQL', 'MongoDB', 'REST APIs', 'Docker', 'AWS', 'Microservices', 'Security', 'System Design'],
  data:       ['Python', 'SQL', 'Machine Learning', 'Pandas', 'TensorFlow', 'Data Visualization', 'Statistics', 'Excel', 'Power BI', 'R'],
  marketing:  ['SEO', 'Google Ads', 'Social Media Marketing', 'Content Writing', 'Email Marketing', 'Analytics', 'Branding', 'Copywriting', 'CRM', 'A/B Testing'],
  manager:    ['Leadership', 'Project Management', 'Strategic Planning', 'Team Building', 'Budgeting', 'Stakeholder Management', 'Communication', 'Agile', 'KPI Tracking', 'Decision Making'],
  designer:   ['Figma', 'Adobe XD', 'UI/UX Design', 'Prototyping', 'User Research', 'Wireframing', 'Adobe Photoshop', 'Typography', 'Design Systems', 'Accessibility'],
  default:    ['Communication', 'Problem Solving', 'Teamwork', 'Time Management', 'Leadership', 'Adaptability', 'Critical Thinking', 'MS Office', 'Project Management', 'Attention to Detail'],
}

export const generateSkills = (jobTitle: string): string[] => {
  const t = jobTitle.toLowerCase()
  if (t.includes('frontend') || t.includes('front-end') || t.includes('ui')) return SKILL_SETS.frontend
  if (t.includes('backend') || t.includes('back-end')) return SKILL_SETS.backend
  if (t.includes('developer') || t.includes('software') || t.includes('engineer')) return SKILL_SETS.developer
  if (t.includes('data') || t.includes('analyst') || t.includes('scientist')) return SKILL_SETS.data
  if (t.includes('market')) return SKILL_SETS.marketing
  if (t.includes('manager') || t.includes('lead') || t.includes('director') || t.includes('head')) return SKILL_SETS.manager
  if (t.includes('design') || t.includes('ux') || t.includes('ui')) return SKILL_SETS.designer
  return SKILL_SETS.default
}

// ─── ATS Analysis (local) ─────────────────────────────────────────────────────

export const analyzeResume = (resumeText: string, jobDescription?: string): ATSResult => {
  const text = resumeText.toLowerCase()

  const STRONG_VERBS = ['led', 'built', 'designed', 'increased', 'reduced', 'managed', 'developed', 'launched', 'achieved', 'implemented', 'improved', 'created', 'delivered', 'optimized', 'spearheaded']
  const WEAK_VERBS   = ['helped', 'assisted', 'worked on', 'responsible for', 'was part of', 'participated']
  const SECTIONS_LIST = ['experience', 'education', 'skills', 'summary', 'projects', 'certifications', 'languages']

  const foundStrong = STRONG_VERBS.filter(v => text.includes(v))
  const foundWeak   = WEAK_VERBS.filter(v => text.includes(v))
  const sectionsFound = SECTIONS_LIST.map(s => ({ name: s.charAt(0).toUpperCase() + s.slice(1), present: text.includes(s), strength: text.includes(s) ? (text.split(s).length > 2 ? 'strong' : 'medium') as 'strong' | 'medium' | 'weak' : 'weak' as 'weak' }))

  // Keyword matching
  const jdKeywords = jobDescription
    ? jobDescription.toLowerCase().match(/\b[a-z]{4,}\b/g)?.filter((w, i, a) => a.indexOf(w) === i).slice(0, 20) || []
    : []
  const foundKeywords = jdKeywords.filter(k => text.includes(k))
  const missingKeywords = jdKeywords.filter(k => !text.includes(k)).slice(0, 8)

  // Scoring
  let score = 60
  if (foundStrong.length >= 5) score += 10
  if (foundWeak.length === 0) score += 5
  const presentSections = sectionsFound.filter(s => s.present).length
  score += presentSections * 3
  if (foundKeywords.length > 5) score += 10
  score = Math.min(score, 98)

  const issues: string[] = []
  const passed: string[] = []
  if (foundWeak.length > 0) issues.push(`Weak action verbs found: ${foundWeak.slice(0,3).join(', ')}`)
  if (foundStrong.length < 3) issues.push('Use more strong action verbs (led, built, achieved)')
  if (!text.includes('@')) issues.push('Email address may be missing')
  if (text.length < 300) issues.push('Resume appears too short — add more detail')
  if (foundStrong.length > 4) passed.push('Strong action verbs used')
  if (presentSections >= 4) passed.push('Key sections present')
  if (text.length > 500) passed.push('Resume has good length')

  const suggestions: string[] = [
    foundWeak.length > 0 ? `Replace weak verbs (${foundWeak.slice(0,2).join(', ')}) with strong ones like "led", "achieved"` : 'Great use of action verbs!',
    missingKeywords.length > 0 ? `Add these keywords from the job description: ${missingKeywords.slice(0,4).join(', ')}` : 'Good keyword coverage',
    'Add quantifiable achievements (%, numbers, $) to make impact clearer',
    'Ensure your resume is saved as a .docx or .pdf for ATS compatibility',
    'Keep formatting simple — avoid tables, columns, and images in ATS submissions',
    'Tailor your summary for each specific job application',
  ]

  const grade = score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F'

  return {
    score,
    grade: grade as ATSResult['grade'],
    keywords: { found: foundKeywords.slice(0, 10), missing: missingKeywords },
    formatting: { issues, passed },
    suggestions,
    sections: sectionsFound,
    actionVerbs: { weak: foundWeak, strong: foundStrong },
    readabilityScore: Math.min(95, score + 10),
    lengthAnalysis: text.length < 300 ? 'too short' : text.length > 3000 ? 'too long' : 'ideal',
  }
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export const generateAchievements = (position: string, company: string): string[] => {
  const pos = position.toLowerCase()

  const TEMPLATES: Record<string, string[]> = {
    developer: [
      `Developed and deployed key features for ${company}'s platform, improving user experience significantly`,
      'Reduced application load time by optimizing code and implementing caching strategies',
      'Collaborated with cross-functional teams to deliver projects on schedule',
      'Wrote clean, maintainable code following best practices and conducted code reviews',
    ],
    manager: [
      `Led a team at ${company} to consistently meet and exceed quarterly targets`,
      'Implemented process improvements that increased team productivity by streamlining workflows',
      'Mentored junior team members, contributing to professional development and retention',
      'Managed project budgets and resources effectively while delivering results on time',
    ],
    marketing: [
      'Developed and executed marketing campaigns that significantly increased brand awareness',
      'Analyzed campaign performance data to optimize strategies and improve ROI',
      `Built and maintained strong relationships with key stakeholders at ${company}`,
      'Created compelling content across multiple channels to drive engagement and conversions',
    ],
    default: [
      `Consistently delivered high-quality work at ${company}, contributing to team and organizational goals`,
      'Collaborated effectively with cross-functional teams to achieve project milestones on time',
      'Identified process inefficiencies and implemented improvements that enhanced productivity',
      'Demonstrated strong problem-solving skills by addressing complex challenges with practical solutions',
    ],
  }

  if (pos.includes('developer') || pos.includes('engineer') || pos.includes('programmer')) return TEMPLATES.developer
  if (pos.includes('manager') || pos.includes('lead') || pos.includes('director')) return TEMPLATES.manager
  if (pos.includes('market') || pos.includes('brand') || pos.includes('content')) return TEMPLATES.marketing
  return TEMPLATES.default
}
