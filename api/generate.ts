import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Prompt required' })

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Try Groq first (fastest, best quality - free tier)
  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      })
      const data = await r.json()
      const text = data.choices?.[0]?.message?.content
      if (text) return res.json({ text })
    } catch (e) {
      console.warn('Groq failed, trying fallback:', e)
    }
  }

  // Fallback: Pollinations AI (completely free, no key)
  try {
    const r = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        private: true,
      }),
    })
    const data = await r.json()
    const text = data.choices?.[0]?.message?.content
    if (text) return res.json({ text })
    throw new Error('Empty response')
  } catch (e) {
    console.error('All AI providers failed:', e)
    return res.status(500).json({ error: 'AI generation failed' })
  }
}
