// @ts-nocheck
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { ObjectId } from 'mongodb'
import { env } from './env'
import { dbPromise } from './db'
import { hashPassword, signToken, verifyToken } from './auth'
import type { Assessment, ExecProfile, User } from './types'

const app = new Hono()

app.use('*', async (c, next) => {
  const origin = c.req.header('origin')
  const allowedOrigin = env.CLIENT_ORIGIN ?? origin
  if (allowedOrigin && origin && allowedOrigin === origin) {
    c.header('Access-Control-Allow-Origin', origin)
  }
  c.header('Access-Control-Allow-Credentials', 'true')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  c.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS')
  if (c.req.method === 'OPTIONS') return c.body(null, 204)
  await next()
})

const getAuthCookie = (cookieHeader) => {
  if (!cookieHeader) return null
  const match = cookieHeader.split(';').map((part) => part.trim())
  const cookie = match.find((part) => part.startsWith('auth='))
  return cookie?.split('=')[1] ?? null
}

const setAuthCookie = (token) => {
  return `auth=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`
}

const clearAuthCookie = () => {
  return 'auth=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0'
}

const authMiddleware = async (c) => {
  const token = getAuthCookie(c.req.header('cookie'))
  if (!token) return c.json({ error: 'Unauthorized' }, 401)
  try {
    const payload = await verifyToken(token)
    c.set('userId', payload.sub)
    return undefined
  } catch {
    return c.json({ error: 'Unauthorized' }, 401)
  }
}

app.post('/api/auth/register', async (c) => {
  const body = await c.req.json()
  const email = String(body.email ?? '').toLowerCase().trim()
  const password = String(body.password ?? '')
  if (!email || !password) return c.json({ error: 'Email and password required.' }, 400)

  const db = await dbPromise
  const existing = await db.collection<User>('users').findOne({ email })
  if (existing) return c.json({ error: 'Email already in use.' }, 409)

  const user: User = {
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date(),
  }
  const result = await db.collection<User>('users').insertOne(user)
  const token = await signToken({ sub: result.insertedId.toString() })
  c.header('Set-Cookie', setAuthCookie(token))
  return c.json({ id: result.insertedId.toString(), email })
})

app.post('/api/auth/login', async (c) => {
  const body = await c.req.json()
  const email = String(body.email ?? '').toLowerCase().trim()
  const password = String(body.password ?? '')
  if (!email || !password) return c.json({ error: 'Email and password required.' }, 400)

  const db = await dbPromise
  const existing = await db.collection<User>('users').findOne({ email })
  if (!existing || existing.passwordHash !== hashPassword(password)) {
    return c.json({ error: 'Invalid credentials.' }, 401)
  }

  const token = await signToken({ sub: existing._id?.toString() ?? '' })
  c.header('Set-Cookie', setAuthCookie(token))
  return c.json({ id: existing._id?.toString(), email })
})

app.post('/api/auth/logout', (c) => {
  c.header('Set-Cookie', clearAuthCookie())
  return c.json({ ok: true })
})

app.get('/api/auth/me', async (c) => {
  const token = getAuthCookie(c.req.header('cookie'))
  if (!token) return c.json({ user: null })
  try {
    const payload = await verifyToken(token)
    const db = await dbPromise
    const user = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(String(payload.sub)) })
    if (!user) return c.json({ user: null })
    return c.json({ user: { id: user._id?.toString(), email: user.email } })
  } catch {
    return c.json({ user: null })
  }
})

app.get('/api/assessments', async (c) => {
  const auth = await authMiddleware(c)
  if (auth) return auth

  const db = await dbPromise
  const userId = String(c.get('userId'))
  const assessments = await db
    .collection<Assessment>('assessments')
    .find({ ownerId: userId })
    .sort({ createdAt: -1 })
    .toArray()
  return c.json({ assessments })
})

app.post('/api/assessments', async (c) => {
  const auth = await authMiddleware(c)
  if (auth) return auth

  const body = await c.req.json()
  const companyName = String(body.companyName ?? '').trim()
  const inviteDays = Number(body.inviteDays ?? 30)
  const companyIndustry = String(body.companyIndustry ?? '').trim()
  const companySize = String(body.companySize ?? '').trim()
  if (!companyName) return c.json({ error: 'Company name required.' }, 400)

  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 32)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + inviteDays * 24 * 60 * 60 * 1000)
  const assessment: Assessment = {
    ownerId: String(c.get('userId')),
    companyName,
    companyIndustry,
    companySize,
    inviteToken: token,
    inviteExpiresAt: expiresAt,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  const db = await dbPromise
  const result = await db.collection<Assessment>('assessments').insertOne(assessment)
  return c.json({ id: result.insertedId.toString(), inviteToken: token })
})

app.get('/api/assessments/:id', async (c) => {
  const auth = await authMiddleware(c)
  if (auth) return auth
  const db = await dbPromise
  const assessment = await db
    .collection<Assessment>('assessments')
    .findOne({ _id: new ObjectId(c.req.param('id')) })
  if (!assessment) return c.json({ error: 'Not found.' }, 404)
  if (assessment.ownerId !== String(c.get('userId'))) {
    return c.json({ error: 'Forbidden.' }, 403)
  }
  return c.json({ assessment })
})

app.patch('/api/assessments/:id', async (c) => {
  const auth = await authMiddleware(c)
  if (auth) return auth

  const body = await c.req.json()
  const db = await dbPromise
  const assessment = await db
    .collection<Assessment>('assessments')
    .findOne({ _id: new ObjectId(c.req.param('id')) })
  if (!assessment) return c.json({ error: 'Not found.' }, 404)
  if (assessment.ownerId !== String(c.get('userId'))) {
    return c.json({ error: 'Forbidden.' }, 403)
  }

  const updates: Partial<Assessment> = {}
  if (typeof body.status === 'string') updates.status = body.status
  if (typeof body.inviteDays === 'number') {
    updates.inviteExpiresAt = new Date(
      Date.now() + body.inviteDays * 24 * 60 * 60 * 1000,
    )
  }
  if (typeof body.companyName === 'string') updates.companyName = body.companyName
  if (typeof body.companyIndustry === 'string') updates.companyIndustry = body.companyIndustry
  if (typeof body.companySize === 'string') updates.companySize = body.companySize

  updates.updatedAt = new Date()

  await db
    .collection<Assessment>('assessments')
    .updateOne({ _id: assessment._id }, { $set: updates })
  return c.json({ ok: true })
})

app.get('/api/invite/:token', async (c) => {
  const db = await dbPromise
  const assessment = await db
    .collection<Assessment>('assessments')
    .findOne({ inviteToken: c.req.param('token') })
  if (!assessment) return c.json({ error: 'Not found.' }, 404)
  if (assessment.status !== 'active') return c.json({ error: 'Assessment cancelled.' }, 403)
  if (assessment.inviteExpiresAt < new Date()) {
    return c.json({ error: 'Invite expired.' }, 403)
  }
  return c.json({
    assessment: {
      id: assessment._id?.toString(),
      companyName: assessment.companyName,
      companyIndustry: assessment.companyIndustry,
      companySize: assessment.companySize,
      execProfile: assessment.execProfile,
      selections: assessment.selections,
      scores: assessment.scores,
      responses: assessment.responses,
      progress: assessment.progress,
      status: assessment.status,
    },
  })
})

app.patch('/api/invite/:token', async (c) => {
  const body = await c.req.json()
  const db = await dbPromise
  const assessment = await db
    .collection<Assessment>('assessments')
    .findOne({ inviteToken: c.req.param('token') })
  if (!assessment) return c.json({ error: 'Not found.' }, 404)
  if (assessment.status !== 'active') return c.json({ error: 'Assessment cancelled.' }, 403)
  if (assessment.inviteExpiresAt < new Date()) {
    return c.json({ error: 'Invite expired.' }, 403)
  }

  const updates: Partial<Assessment> = {
    updatedAt: new Date(),
  }

  if (body.status === 'completed') updates.status = 'completed'
  if (body.companyName) updates.companyName = String(body.companyName)
  if (body.companyIndustry) updates.companyIndustry = String(body.companyIndustry)
  if (body.companySize) updates.companySize = String(body.companySize)
  if (body.execProfile) {
    updates.execProfile = {
      name: String(body.execProfile.name ?? ''),
      title: String(body.execProfile.title ?? ''),
      email: String(body.execProfile.email ?? ''),
    } as ExecProfile
  }
  if (body.selections) updates.selections = body.selections
  if (body.scores) updates.scores = body.scores
  if (body.responses) updates.responses = body.responses
  if (body.progress) updates.progress = body.progress

  await db
    .collection<Assessment>('assessments')
    .updateOne({ _id: assessment._id }, { $set: updates })

  return c.json({ ok: true })
})

serve({
  fetch: app.fetch,
  port: Number(env.PORT ?? 8787),
})
