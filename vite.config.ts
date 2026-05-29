import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'

// ─── Local AI proxy plugin (dev mode only) ────────────────────────────────────
// Mirrors the Vercel /api/generate function so AI works without deployment.
function localAIProxy(): Plugin {
  return {
    name: 'local-ai-proxy',
    configureServer(server) {
      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
          res.writeHead(200)
          res.end()
          return
        }
        if (req.method !== 'POST') {
          res.writeHead(405)
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        // Read request body
        const body = await new Promise<string>((resolve, reject) => {
          let data = ''
          req.on('data', (chunk: Buffer) => { data += chunk.toString() })
          req.on('end', () => resolve(data))
          req.on('error', reject)
        })

        let prompt = ''
        try { prompt = JSON.parse(body).prompt } catch { /* ignore */ }
        if (!prompt) {
          res.writeHead(400)
          res.end(JSON.stringify({ error: 'Prompt required' }))
          return
        }

        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        // 0. Ollama (local — free, no key needed, PRIMARY)
        try {
          const ollamaModel = process.env.OLLAMA_MODEL || 'llama3.2'
          const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434'
          const r = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: ollamaModel,
              messages: [{ role: 'user', content: prompt }],
              stream: false,
              options: { temperature: 0.7, num_predict: 2048 },
            }),
            signal: AbortSignal.timeout(120_000),
          })
          if (r.ok) {
            const data = await r.json() as { message?: { content?: string }; response?: string }
            const text = data.message?.content || data.response || ''
            if (text.trim()) { res.writeHead(200); res.end(JSON.stringify({ text: text.trim() })); return }
          }
        } catch (e) { console.warn('[AI proxy] Ollama failed (not running?):', (e as Error).message) }

        // 1. Groq (if env key available)
        const groqKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_KEY
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
            const data = await r.json() as { choices?: { message?: { content?: string } }[] }
            const text = data.choices?.[0]?.message?.content
            if (text) { res.writeHead(200); res.end(JSON.stringify({ text })); return }
          } catch (e) { console.warn('[AI proxy] Groq failed:', e) }
        }

        // 2. Pollinations GET API (simple, free, no CORS from Node)
        try {
          const encoded = encodeURIComponent(prompt)
          const url = `https://text.pollinations.ai/${encoded}?model=openai-large&private=true`
          const r = await fetch(url, { signal: AbortSignal.timeout(30000) })
          if (r.ok) {
            const text = await r.text()
            if (text && text.length > 5) {
              res.writeHead(200); res.end(JSON.stringify({ text })); return
            }
          }
        } catch (e) { console.warn('[AI proxy] Pollinations GET failed:', e) }

        // 3. Pollinations POST API
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
            signal: AbortSignal.timeout(30000),
          })
          if (r.ok) {
            const data = await r.json() as { choices?: { message?: { content?: string } }[] }
            const text = data.choices?.[0]?.message?.content
            if (text) { res.writeHead(200); res.end(JSON.stringify({ text })); return }
          }
        } catch (e) { console.warn('[AI proxy] Pollinations POST failed:', e) }

        // 4. HuggingFace Inference
        try {
          const r = await fetch(
            'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                inputs: `<s>[INST] ${prompt} [/INST]`,
                parameters: { max_new_tokens: 1500, temperature: 0.7, return_full_text: false },
              }),
              signal: AbortSignal.timeout(40000),
            }
          )
          if (r.ok) {
            const data = await r.json() as { generated_text?: string }[] | { generated_text?: string }
            const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
            if (text) { res.writeHead(200); res.end(JSON.stringify({ text })); return }
          }
        } catch (e) { console.warn('[AI proxy] HuggingFace failed:', e) }

        res.writeHead(500)
        res.end(JSON.stringify({ error: 'All AI providers failed.' }))
      })
    },
  }
}

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ai-career-toolkit/' : '/',
  plugins: [react(), localAIProxy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          framer: ['framer-motion'],
          ai: ['@google/generative-ai'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
