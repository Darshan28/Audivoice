/** Map provider / Supabase errors to stable, user-safe copy. Never pass raw messages to the UI. */
export function friendlyAuthError(error: unknown, fallback = 'Sign-in failed. Please try again.'): string {
  const raw =
    (error && typeof error === 'object' && 'message' in error && typeof (error as { message: unknown }).message === 'string'
      ? (error as { message: string }).message
      : error instanceof Error
        ? error.message
        : '') || ''

  const lower = raw.toLowerCase()
  const code =
    error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string'
      ? (error as { code: string }).code.toLowerCase()
      : ''
  const status =
    error && typeof error === 'object' && 'status' in error && typeof (error as { status: unknown }).status === 'number'
      ? (error as { status: number }).status
      : null

  if (
    code.includes('otp_expired') ||
    lower.includes('expired') ||
    lower.includes('otp_expired')
  ) {
    return 'This sign-in link has expired. Request a new one.'
  }
  if (
    code.includes('otp_disabled') ||
    lower.includes('already been used') ||
    lower.includes('invalid') && lower.includes('token')
  ) {
    return 'This sign-in link is invalid or has already been used. Request a new one.'
  }
  if (
    lower.includes('access_denied') ||
    lower.includes('user cancelled') ||
    lower.includes('user_cancelled') ||
    lower.includes('flow_state')
  ) {
    return 'Sign-in was cancelled. You can try again when ready.'
  }
  if (
    status === 429 ||
    code.includes('rate_limit') ||
    lower.includes('rate limit') ||
    lower.includes('too many emails were sent')
  ) {
    return 'Too many emails were sent. Wait about an hour, or continue with Google.'
  }
  if (
    lower.includes('code verifier') ||
    lower.includes('pkce') ||
    lower.includes('both auth code and code verifier')
  ) {
    return 'Open the confirmation link in the same browser you used to sign up, then request a new email if it still fails.'
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Network error while signing in. Check your connection and try again.'
  }
  if (lower.includes('supabase is not configured') || lower.includes('missing vite_supabase')) {
    return 'Authentication is not configured for this environment.'
  }

  return fallback
}

/** Read OAuth / magic-link error params from the callback URL. */
export function authErrorFromUrl(url: URL): string | null {
  const error = url.searchParams.get('error')
  const description = url.searchParams.get('error_description')
  if (!error && !description) return null
  return friendlyAuthError(
    { message: description || error || '', code: error || '' },
    'Sign-in was cancelled or could not be completed.',
  )
}
