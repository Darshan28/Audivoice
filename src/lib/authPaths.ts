/** Allowed relative in-app paths after authentication. Blocks open redirects. */
export const DEFAULT_AUTH_INTENT = '/app/sessions'

const AUTH_CALLBACK_PATH = '/auth/callback'

/**
 * Supabase falls back to the Site URL (often `/`) when the email redirect is
 * not on the allowlist. Those visits still carry `?code=` or an auth error.
 * Send them to the callback so the code is exchanged instead of ignored.
 */
export function authCallbackRedirect<T extends Record<string, unknown>>(
  path: string,
  query: T,
  hash = '',
): { path: string; query: T; hash: string } | null {
  if (path === AUTH_CALLBACK_PATH) return null

  const hasCode = typeof query.code === 'string' && query.code.length > 0
  const hasError =
    (typeof query.error === 'string' && query.error.length > 0) ||
    (typeof query.error_description === 'string' && query.error_description.length > 0) ||
    (typeof query.error_code === 'string' && query.error_code.length > 0)

  if (!hasCode && !hasError) return null

  return { path: AUTH_CALLBACK_PATH, query, hash }
}

const ALLOWED_PREFIXES = ['/app', '/onboarding', '/demo', '/auth'] as const

/**
 * Accept only same-origin relative paths.
 * Rejects protocol-relative (`//evil.com`), absolute URLs, and unknown prefixes.
 */
export function safeAppPath(path: unknown, fallback = DEFAULT_AUTH_INTENT): string {
  if (typeof path !== 'string' || !path) return fallback
  const trimmed = path.trim()
  if (!trimmed.startsWith('/')) return fallback
  if (trimmed.startsWith('//')) return fallback
  if (trimmed.includes('://')) return fallback
  if (trimmed.includes('\\')) return fallback
  const pathname = trimmed.split(/[?#]/)[0] || trimmed
  const allowed = ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
  if (!allowed && pathname !== '/') return fallback
  return trimmed
}
