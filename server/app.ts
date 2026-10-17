import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamSSE } from 'hono/streaming'
import { z } from 'zod'
import { toErrorBody, AppError } from './lib/errors.js'
import {
  clientIp,
  getParticipantToken,
  requireAdmin,
  resolveIsAdmin,
  resolvePresenter,
} from './lib/auth.js'
import { getPublicAppUrl, resolveCorsOrigin } from './lib/cors.js'
import {
  assertDevLoginRequest,
  DEV_AUTH_EMAIL,
  DEV_AUTH_USER_ID,
  mintDevAccessToken,
} from './lib/devAuth.js'
import { sanitizeRealtimeEventForParticipant } from './lib/participantSafe.js'
import { resolveSessionViewer } from './lib/sessionAccess.js'
import { getRealtimeBus } from './realtime/bus.js'
import {
  createSession,
  endSession,
  getSessionForPresenter,
  listSessions,
  openLobby,
} from './services/sessionService.js'
import {
  completeOnboarding,
  ensurePresenterProfile,
  toProfileDTO,
  updatePresenterProfile,
} from './services/profileService.js'
import {
  clearResponses,
  closeQuestion,
  createQuestion,
  deleteQuestion,
  getResults,
  reopenQuestion,
  reorderQuestions,
  startQuestion,
  updateQuestion,
} from './services/questionService.js'
import {
  exportCsv,
  getLiveState,
  joinSession,
  submitResponse,
} from './services/participantService.js'
import type { QuestionType } from '../shared/types.js'
import QRCode from 'qrcode'
import { rateLimit } from './lib/rateLimit.js'
import {
  listAdminUsers,
  listContacts,
  listLoginAudits,
  normalizeLoginMethod,
  recordLoginAudit,
  submitContact,
} from './services/adminService.js'

export type AppEnv = {
  Variables: {
    requestId: string
  }
}

export function createApp() {
  const app = new Hono<AppEnv>()

  app.use(
    '*',
    cors({
      origin: (origin) => resolveCorsOrigin(origin) || '',
      credentials: true,
    }),
  )

  app.onError((err, c) => {
    const { status, body } = toErrorBody(err)
    return c.json(body, status as 400)
  })

  app.get('/api/health', (c) => c.json({ ok: true, service: 'audivoice' }))

  /** Localhost-only test presenter login (never available in production / Vercel). */
  app.post('/api/auth/dev-login', async (c) => {
    assertDevLoginRequest(c)
    const profile = await ensurePresenterProfile({
      authUserId: DEV_AUTH_USER_ID,
      email: DEV_AUTH_EMAIL,
    })
    const accessToken = mintDevAccessToken()
    return c.json({ accessToken, profile: toProfileDTO(profile) })
  })

  app.get('/api/me', async (c) => {
    const user = await resolvePresenter(c)
    const isAdmin = await resolveIsAdmin(c, user.email)
    return c.json({ profile: toProfileDTO(user, { isAdmin }) })
  })

  app.patch('/api/me', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        role: z.string().min(1).max(80).nullable().optional(),
        useCases: z.array(z.string().min(1).max(80)).max(12).optional(),
        audienceSize: z.string().min(1).max(80).nullable().optional(),
      })
      .parse(await c.req.json())
    const profile = await updatePresenterProfile(user.id, body)
    const isAdmin = await resolveIsAdmin(c, profile.email)
    return c.json({ profile: toProfileDTO(profile, { isAdmin }) })
  })

  app.post('/api/me/onboarding', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        useCases: z.array(z.string().min(1).max(80)).min(1).max(12),
        audienceSize: z.string().min(1).max(80),
        role: z.string().min(1).max(80),
      })
      .parse(await c.req.json())
    const profile = await completeOnboarding(user.id, body)
    const isAdmin = await resolveIsAdmin(c, profile.email)
    return c.json({ profile: toProfileDTO(profile, { isAdmin }) })
  })

  app.post('/api/contact', async (c) => {
    const ip = clientIp(c) || 'local'
    if (!rateLimit(`contact:${ip}`, 8, 60_000)) {
      throw new AppError('RATE_LIMITED', 'Too many messages. Please wait a moment.', 429)
    }
    const body = z
      .object({
        fullName: z.string().trim().min(1).max(120),
        email: z.string().trim().email().max(200),
        enquiryType: z.string().trim().min(1).max(80),
        subject: z.string().trim().min(1).max(200),
        message: z.string().trim().min(1).max(5000),
      })
      .parse(await c.req.json())
    await submitContact({
      ...body,
      userAgent: c.req.header('user-agent')?.slice(0, 500) ?? null,
      ip,
    })
    return c.json({ ok: true }, 201)
  })

  app.post('/api/auth/login-audit', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        method: z.enum(['google', 'magic_link', 'dev']).optional(),
      })
      .parse(await c.req.json().catch(() => ({})))
    const audit = await recordLoginAudit({
      authUserId: user.authUserId,
      email: user.email,
      method: body.method ?? normalizeLoginMethod(null),
      userAgent: c.req.header('user-agent')?.slice(0, 500) ?? null,
      ip: clientIp(c),
    })
    return c.json({ audit }, 201)
  })

  app.get('/api/admin/contacts', async (c) => {
    await requireAdmin(c)
    const limit = Number(c.req.query('limit') || 100)
    const offset = Number(c.req.query('offset') || 0)
    const contacts = await listContacts(limit, offset)
    return c.json({ contacts })
  })

  app.get('/api/admin/login-audits', async (c) => {
    await requireAdmin(c)
    const limit = Number(c.req.query('limit') || 100)
    const offset = Number(c.req.query('offset') || 0)
    const authUserId = c.req.query('authUserId') || undefined
    const audits = await listLoginAudits({ limit, offset, authUserId })
    return c.json({ audits })
  })

  app.get('/api/admin/users', async (c) => {
    await requireAdmin(c)
    const limit = Number(c.req.query('limit') || 100)
    const offset = Number(c.req.query('offset') || 0)
    const users = await listAdminUsers(limit, offset)
    return c.json({ users })
  })

  app.post('/api/sessions', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000).optional(),
      })
      .parse(await c.req.json())
    const session = await createSession(user.id, body.title, body.description)
    return c.json({ session }, 201)
  })

  app.get('/api/sessions', async (c) => {
    const user = await resolvePresenter(c)
    const sessions = await listSessions(user.id)
    return c.json({ sessions })
  })

  app.get('/api/sessions/:id', async (c) => {
    const user = await resolvePresenter(c)
    const session = await getSessionForPresenter(c.req.param('id'), user.id)
    return c.json({ session })
  })

  app.get('/api/sessions/:id/public', async (c) => {
    // Authenticated viewers only — never an unauthenticated session dump by ID.
    const viewer = await resolveSessionViewer(c, c.req.param('id'))
    if (viewer.role === 'presenter') {
      const session = await getSessionForPresenter(c.req.param('id'), viewer.user.id)
      return c.json({ session })
    }
    const state = await getLiveState(c.req.param('id'), 'participant')
    return c.json({ session: state.session })
  })

  app.post('/api/sessions/:id/lobby', async (c) => {
    const user = await resolvePresenter(c)
    const session = await openLobby(c.req.param('id'), user.id)
    return c.json({ session })
  })

  app.post('/api/sessions/:id/end', async (c) => {
    const user = await resolvePresenter(c)
    const session = await endSession(c.req.param('id'), user.id)
    return c.json({ session })
  })

  app.post('/api/sessions/:id/questions', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        type: z.enum([
          'MULTIPLE_CHOICE',
          'RATING',
          'SCALE',
          'OPEN_TEXT',
          'WORD_CLOUD',
          'RANKING',
          'YES_NO',
          'CONTENT_TEXT',
          'CONTENT_IMAGE',
          'CONTENT_VIDEO',
          'CONTENT_INSTRUCTIONS',
          'CONTENT_COMPARE',
        ]),
        prompt: z.string().max(500).optional(),
        options: z.array(z.string().max(200)).optional(),
        config: z.record(z.unknown()).optional(),
      })
      .parse(await c.req.json())
    const question = await createQuestion(c.req.param('id'), user.id, {
      type: body.type as QuestionType,
      prompt: body.prompt,
      options: body.options,
      config: body.config as never,
    })
    return c.json({ question }, 201)
  })

  app.put('/api/sessions/:id/questions/reorder', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        orderedIds: z.array(z.string().min(1)).min(1),
      })
      .parse(await c.req.json())
    const questions = await reorderQuestions(c.req.param('id'), user.id, body.orderedIds)
    return c.json({ questions })
  })

  app.patch('/api/sessions/:id/questions/:qid', async (c) => {
    const user = await resolvePresenter(c)
    const body = z
      .object({
        prompt: z.string().max(500).optional(),
        options: z.array(z.string().max(200)).optional(),
        config: z.record(z.unknown()).optional(),
        type: z
          .enum([
            'MULTIPLE_CHOICE',
            'RATING',
            'SCALE',
            'OPEN_TEXT',
            'WORD_CLOUD',
            'RANKING',
            'YES_NO',
            'CONTENT_TEXT',
            'CONTENT_IMAGE',
            'CONTENT_VIDEO',
            'CONTENT_INSTRUCTIONS',
            'CONTENT_COMPARE',
          ])
          .optional(),
      })
      .parse(await c.req.json())
    const question = await updateQuestion(c.req.param('id'), c.req.param('qid'), user.id, {
      prompt: body.prompt,
      options: body.options,
      config: body.config as never,
      type: body.type as QuestionType | undefined,
    })
    return c.json({ question })
  })

  app.delete('/api/sessions/:id/questions/:qid', async (c) => {
    const user = await resolvePresenter(c)
    await deleteQuestion(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json({ ok: true })
  })

  app.post('/api/sessions/:id/questions/:qid/start', async (c) => {
    const user = await resolvePresenter(c)
    const result = await startQuestion(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json(result)
  })

  app.post('/api/sessions/:id/questions/:qid/close', async (c) => {
    const user = await resolvePresenter(c)
    const question = await closeQuestion(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json({ question })
  })

  app.post('/api/sessions/:id/questions/:qid/reopen', async (c) => {
    const user = await resolvePresenter(c)
    const question = await reopenQuestion(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json({ question })
  })

  app.post('/api/sessions/:id/questions/:qid/clear', async (c) => {
    const user = await resolvePresenter(c)
    const results = await clearResponses(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json({ results })
  })

  app.get('/api/sessions/:id/questions/:qid/results', async (c) => {
    const user = await resolvePresenter(c)
    const results = await getResults(c.req.param('id'), c.req.param('qid'), user.id)
    return c.json({ results })
  })

  app.get('/api/sessions/:id/live-state', async (c) => {
    const viewer = await resolveSessionViewer(c, c.req.param('id'))
    const state = await getLiveState(c.req.param('id'), viewer.role)
    return c.json({ state })
  })

  app.get('/api/sessions/:id/export.csv', async (c) => {
    const user = await resolvePresenter(c)
    const csv = await exportCsv(c.req.param('id'), user.id)
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="audivoice-${c.req.param('id')}.csv"`,
      },
    })
  })

  app.get('/api/sessions/:id/qr', async (c) => {
    const user = await resolvePresenter(c)
    const session = await getSessionForPresenter(c.req.param('id'), user.id)
    const appUrl = getPublicAppUrl()
    const joinUrl = `${appUrl}/join/${session.joinCode}`
    const svg = await QRCode.toString(joinUrl, { type: 'svg', margin: 1, width: 256 })
    return c.json({ joinUrl, svg, code: session.joinCode })
  })

  app.post('/api/join', async (c) => {
    const ip = c.req.header('x-forwarded-for') || 'local'
    if (!rateLimit(`join:${ip}`, 30, 60_000)) {
      throw new AppError('RATE_LIMITED', 'Too many join attempts. Please wait a moment.', 429)
    }
    const body = z
      .object({
        code: z.string().min(3).max(12),
        displayName: z.string().max(60).optional(),
      })
      .parse(await c.req.json())
    const result = await joinSession(body.code, body.displayName)
    return c.json(result, 201)
  })

  app.post('/api/responses', async (c) => {
    const token = getParticipantToken(c)
    if (!token) throw new AppError('UNAUTHORIZED', 'Join the session again.', 401)
    if (!rateLimit(`resp:${token}`, 60, 60_000)) {
      throw new AppError('RATE_LIMITED', 'Too many submissions. Please wait a moment.', 429)
    }
    const body = z
      .object({
        questionId: z.string().min(1),
        value: z.unknown(),
      })
      .parse(await c.req.json())
    const result = await submitResponse(token, body.questionId, body.value)
    return c.json(result, 201)
  })

  app.get('/api/realtime/subscribe', async (c) => {
    const sessionId = c.req.query('sessionId')
    if (!sessionId) throw new AppError('VALIDATION_ERROR', 'sessionId is required.')

    // EventSource cannot send Authorization headers — query tokens are validated here.
    const viewer = await resolveSessionViewer(c, sessionId, { allowQueryTokens: true })

    return streamSSE(c, async (stream) => {
      const bus = getRealtimeBus()
      let closed = false

      await stream.writeSSE({ event: 'connected', data: JSON.stringify({ sessionId }) })

      const unsub = bus.subscribe(sessionId, (event) => {
        if (closed) return
        const outbound =
          viewer.role === 'participant' ? sanitizeRealtimeEventForParticipant(event) : event
        void stream.writeSSE({
          event: outbound.type,
          data: JSON.stringify(outbound),
        })
      })

      const heartbeat = setInterval(() => {
        if (closed) return
        void stream.writeSSE({ event: 'ping', data: '{}' })
      }, 15000)

      try {
        await new Promise<void>((resolve) => {
          c.req.raw.signal.addEventListener('abort', () => resolve())
        })
      } finally {
        closed = true
        clearInterval(heartbeat)
        unsub()
      }
    })
  })

  return app
}

export const app = createApp()
