import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'Prompt required' })

  // 1️⃣ Groq — free tier, Llama 3.3 70B (fastest & best quality)
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
      console.warn('Groq failed:', e)
    }
  }

  // 2️⃣ Pollinations AI — completely free, no key needed
  try {
    const r = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai-large',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        private: true,
      }),
    })
    if (r.ok) {
      const data = await r.json()
      const text = data.choices?.[0]?.message?.content
      if (text) return res.json({ text })
    }
  } catch (e) {
    console.warn('Pollinations failed:', e)
  }

  // 3️⃣ Hugging Face free inference — no key needed
  try {
    const r = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: `<s>[INST] ${prompt} [/INST]`,
          parameters: { max_new_tokens: 1024, temperature: 0.7, return_full_text: false },
        }),
      }
    )
    if (r.ok) {
      const data = await r.json()
      const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
      if (text) return res.json({ text })
    }
  } catch (e) {
    console.warn('HuggingFace failed:', e)
  }

  return res.status(500).json({ error: 'All AI providers failed. Please try again.' })
}
