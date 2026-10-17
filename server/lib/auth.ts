import type { Context } from 'hono'
import { isAdminEmail } from '../../shared/admin.js'
import { AppError } from './errors.js'
import { isDevAccessToken, verifyDevAccessToken } from './devAuth.js'
import { getSupabaseAuthClient, isSupabaseConfigured } from './supabase.js'
import { ensurePresenterProfile } from '../services/profileService.js'
import type { UserProfileRecord } from '../store/types.js'

export const PARTICIPANT_HEADER = 'x-audivoice-participant'
const PARTICIPANT_HEADER_LEGACY = 'x-pulse-participant'

export function extractBearerToken(c: Context): string | null {
  const header = c.req.header('authorization') || c.req.header('Authorization')
  if (!header) return null
  const match = /^Bearer\s+(.+)$/i.exec(header.trim())
  return match?.[1]?.trim() || null
}

async function profileFromAccessToken(accessToken: string): Promise<UserProfileRecord> {
  if (isDevAccessToken(accessToken)) {
    const dev = verifyDevAccessToken(accessToken)
    if (!dev) {
      throw new AppError('UNAUTHORIZED', 'Your session has expired. Sign in again.', 401)
    }
    return ensurePresenterProfile({
      authUserId: dev.authUserId,
      email: dev.email,
    })
  }

  if (!isSupabaseConfigured()) {
    throw new AppError('UNAUTHORIZED', 'Sign in to continue.', 401)
  }

  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) {
    throw new AppError('UNAUTHORIZED', 'Your session has expired. Sign in again.', 401)
  }

  return ensurePresenterProfile({
    authUserId: data.user.id,
    email: data.user.email ?? null,
  })
}

/** Resolve the authenticated Supabase presenter and ensure an app profile exists. */
export async function resolvePresenter(c: Context): Promise<UserProfileRecord> {
  const accessToken = extractBearerToken(c)
  if (!accessToken) {
    throw new AppError('UNAUTHORIZED', 'Sign in to continue.', 401)
  }
  return profileFromAccessToken(accessToken)
}

/** Soft resolve — returns null when no/invalid presenter credentials are present. */
export async function tryResolvePresenter(
  c: Context,
  options: { accessTokenOverride?: string } = {},
): Promise<UserProfileRecord | null> {
  const accessToken = options.accessTokenOverride || extractBearerToken(c)
  if (!accessToken) return null
  try {
    return await profileFromAccessToken(accessToken)
  } catch {
    return null
  }
}

async function isGoogleAdminToken(accessToken: string, email: string | null): Promise<boolean> {
  if (!isAdminEmail(email)) return false
  if (isDevAccessToken(accessToken)) return false
  if (!isSupabaseConfigured()) return false
  const supabase = getSupabaseAuthClient()
  const { data, error } = await supabase.auth.getUser(accessToken)
  if (error || !data.user) return false
  const provider = String(data.user.app_metadata?.provider || '').toLowerCase()
  return provider === 'google' && isAdminEmail(data.user.email)
}

/** Platform admin — Google sign-in as support@audivoice.com only. */
export async function requireAdmin(c: Context): Promise<UserProfileRecord> {
  const accessToken = extractBearerToken(c)
  if (!accessToken) {
    throw new AppError('UNAUTHORIZED', 'Sign in to continue.', 401)
  }
  const user = await profileFromAccessToken(accessToken)
  if (!(await isGoogleAdminToken(accessToken, user.email))) {
    throw new AppError('FORBIDDEN', 'Admin access required.', 403)
  }
  return user
}

/** Whether the current bearer token is the Google admin account. */
export async function resolveIsAdmin(c: Context, email: string | null): Promise<boolean> {
  const accessToken = extractBearerToken(c)
  if (!accessToken) return false
  return isGoogleAdminToken(accessToken, email)
}

export function clientIp(c: Context): string | null {
  const forwarded = c.req.header('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return c.req.header('x-real-ip')?.trim() || null
}

export function getParticipantToken(c: Context) {
  return c.req.header(PARTICIPANT_HEADER) ?? c.req.header(PARTICIPANT_HEADER_LEGACY) ?? null
}
