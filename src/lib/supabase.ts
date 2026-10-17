import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { DEFAULT_AUTH_INTENT, safeAppPath } from '@/lib/authPaths'

export { DEFAULT_AUTH_INTENT, safeAppPath } from '@/lib/authPaths'

let client: SupabaseClient | null = null

export function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

export function getSupabaseBrowserClient() {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Add them to your .env for presenter auth.',
    )
  }

  client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      // Explicit exchange in AuthCallbackView — avoids double-exchange races.
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  })
  return client
}

/** Resolve the public app origin for OAuth / magic-link redirects. */
export function resolveAppOrigin(): string {
  const configured = import.meta.env.VITE_APP_URL?.replace(/\/$/, '')?.trim()
  if (import.meta.env.PROD) {
    if (configured) return configured
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin
    }
    throw new Error('VITE_APP_URL must be set for production auth redirects.')
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return configured || 'http://localhost:5173'
}

/**
 * Callback URL passed to Supabase. Must match an allowlisted redirect exactly.
 * Post-login intent stays in local storage (`setAuthIntent`), not this URL.
 */
export function getAuthRedirectUrl() {
  return `${resolveAppOrigin()}/auth/callback`
}

export const AUTH_INTENT_KEY = 'audivoice_auth_intent'
const AUTH_INTENT_KEY_LEGACY = 'pulse_auth_intent'
const AUTH_INTENT_LS_KEY = 'audivoice_auth_intent_ls'
const AUTH_INTENT_LS_KEY_LEGACY = 'pulse_auth_intent_ls'
const AUTH_INTENT_TTL_MS = 60 * 60 * 1000

export function setAuthIntent(path: string) {
  const safe = safeAppPath(path)
  try {
    sessionStorage.setItem(AUTH_INTENT_KEY, safe)
    sessionStorage.removeItem(AUTH_INTENT_KEY_LEGACY)
  } catch {
    /* private mode */
  }
  try {
    localStorage.setItem(
      AUTH_INTENT_LS_KEY,
      JSON.stringify({ path: safe, exp: Date.now() + AUTH_INTENT_TTL_MS }),
    )
    localStorage.removeItem(AUTH_INTENT_LS_KEY_LEGACY)
  } catch {
    /* private mode */
  }
}

function readDurableIntent(): string | null {
  try {
    const raw =
      localStorage.getItem(AUTH_INTENT_LS_KEY) || localStorage.getItem(AUTH_INTENT_LS_KEY_LEGACY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { path?: string; exp?: number }
    if (!parsed?.path || !parsed.exp || Date.now() > parsed.exp) {
      localStorage.removeItem(AUTH_INTENT_LS_KEY)
      localStorage.removeItem(AUTH_INTENT_LS_KEY_LEGACY)
      return null
    }
    return safeAppPath(parsed.path)
  } catch {
    return null
  }
}

export function consumeAuthIntent(preferred?: unknown) {
  let fromSession: string | null = null
  try {
    fromSession =
      sessionStorage.getItem(AUTH_INTENT_KEY) || sessionStorage.getItem(AUTH_INTENT_KEY_LEGACY)
    sessionStorage.removeItem(AUTH_INTENT_KEY)
    sessionStorage.removeItem(AUTH_INTENT_KEY_LEGACY)
  } catch {
    /* ignore */
  }
  const fromDurable = readDurableIntent()
  try {
    localStorage.removeItem(AUTH_INTENT_LS_KEY)
    localStorage.removeItem(AUTH_INTENT_LS_KEY_LEGACY)
  } catch {
    /* ignore */
  }
  return safeAppPath(preferred ?? fromSession ?? fromDurable ?? DEFAULT_AUTH_INTENT)
}

export function peekAuthIntent() {
  try {
    const fromSession =
      sessionStorage.getItem(AUTH_INTENT_KEY) || sessionStorage.getItem(AUTH_INTENT_KEY_LEGACY)
    if (fromSession) return safeAppPath(fromSession)
  } catch {
    /* ignore */
  }
  return readDurableIntent() || DEFAULT_AUTH_INTENT
}
