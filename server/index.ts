import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import nodemailer from 'nodemailer'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'
import { getGitHubData } from './services/github.js'
import { getLeetCodeData } from './services/leetcode.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 4000)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicDir = path.resolve(__dirname, '../public')

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('CORS origin not allowed'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  next()
})

const rateLimitStore = new Map<string, number[]>()
const isRateLimited = (key: string) => {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const entries = rateLimitStore.get(key) ?? []
  const recent = entries.filter((timestamp) => now - timestamp < windowMs)

  if (recent.length >= 10) {
    return true
  }

  recent.push(now)
  rateLimitStore.set(key, recent)
  return false
}

app.use('/api', (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
  if (isRateLimited(String(ip))) {
    res.status(429).json({ message: 'Too many requests. Please try again later.' })
    return
  }

  next()
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/github', async (_req, res) => {
  try {
    const username = process.env.VITE_GITHUB_USERNAME || 'chiragchhirauliya'
    const data = await getGitHubData(username)
    res.status(200).json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'GitHub API failed.'
    res.status(502).json({ message })
  }
})

app.get('/api/leetcode', async (_req, res) => {
  try {
    const data = await getLeetCodeData()
    if (!data) {
      res.status(200).json({
        success: false,
        message: 'LeetCode service is temporarily unavailable.',
        stats: null,
        lastUpdated: null,
      })
      return
    }

    res.status(200).json(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'LeetCode API failed.'
    res.status(502).json({ message })
  }
})

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  subject: z.string().trim().min(4).max(160),
  message: z.string().trim().min(10).max(2000),
})

app.post('/api/contact', async (req, res) => {
  const parsed = contactSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({
      message: 'Please provide a valid name, email, subject, and message.',
      errors: parsed.error.flatten(),
    })
    return
  }

  const { name, email, subject, message } = parsed.data
  const host = process.env.EMAIL_HOST
  const portNumber = Number(process.env.EMAIL_PORT || 587)
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  const toAddress = process.env.EMAIL_TO || 'chiragchhirauliya000@gmail.com'

  if (!host || !user || !pass) {
    res.status(503).json({
      message: 'The email service is not configured yet. Please set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS or use the mailto fallback.',
    })
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: portNumber,
      secure: portNumber === 465,
      auth: { user, pass },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || user,
      to: toAddress,
      replyTo: email,
      subject: `Portfolio enquiry: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br />')}</p>`,
    })

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully. I will get back to you soon.',
    })
  } catch (error) {
    const messageText = error instanceof Error ? error.message : 'Unexpected email error.'
    res.status(500).json({
      message: `The email service failed to send the message: ${messageText}`,
    })
  }
})

app.use(express.static(publicDir))

app.get(/^(?!\/api).*$/, (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.listen(port, () => {
  console.log(`Portfolio server running on http://localhost:${port}`)
})
