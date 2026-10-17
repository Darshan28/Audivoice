import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Session, User } from '@supabase/supabase-js'
import type { LoginAuditMethod } from '@shared/admin'
import type { UserProfileDTO } from '@shared/onboarding'
import {
  api,
  ApiClientError,
  clearDevAccessToken,
  getDevAccessToken,
  setDevAccessToken,
} from '@/services/api'
import { friendlyAuthError, authErrorFromUrl } from '@/lib/authErrors'
import {
  getAuthRedirectUrl,
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from '@/lib/supabase'

const LOGIN_AUDIT_KEY = 'audivoice_login_audit_session'

export type ProfileStatus = 'idle' | 'loading' | 'ready' | 'error'

function isLocalhostHost() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

export function isDevLoginEnabled() {
  return Boolean(import.meta.env.DEV && isLocalhostHost())
}

function syntheticDevSession(accessToken: string, profile: UserProfileDTO): {
  session: Session
  user: User
} {
  const now = Math.floor(Date.now() / 1000)
  const user = {
    id: profile.authUserId,
    email: profile.email ?? 'dev@localhost',
    app_metadata: { provider: 'dev' },
    user_metadata: {},
    aud: 'authenticated',
    created_at: profile.createdAt,
  } as User

  const session = {
    access_token: accessToken,
    refresh_token: '',
    expires_in: 60 * 60 * 24 * 365,
    expires_at: now + 60 * 60 * 24 * 365,
    token_type: 'bearer',
    user,
  } as Session

  return { session, user }
}

export const useAuthStore = defineStore('auth', () => {
  const ready = ref(false)
  const session = ref<Session | null>(null)
  const user = ref<User | null>(null)
  const profile = ref<UserProfileDTO | null>(null)
  const profileStatus = ref<ProfileStatus>('idle')
  const loadingProfile = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(session.value?.access_token && user.value))
  const onboardingCompleted = computed(() => Boolean(profile.value?.onboardingCompleted))
  const isAdmin = computed(() => Boolean(profile.value?.isAdmin))
  const accessToken = computed(() => session.value?.access_token ?? null)
  const devLoginEnabled = computed(() => isDevLoginEnabled())

  function loginMethodFromUser(u: User | null | undefined, fallback: LoginAuditMethod = 'magic_link'): LoginAuditMethod {
    const provider = String(u?.app_metadata?.provider || '').toLowerCase()
    if (provider === 'google') return 'google'
    if (provider === 'dev') return 'dev'
    if (provider === 'email') return 'magic_link'
    return fallback
  }

  async function recordSuccessfulLogin(method: LoginAuditMethod) {
    const token = session.value?.access_token
    if (!token) return
    try {
      const already = sessionStorage.getItem(LOGIN_AUDIT_KEY)
      if (already === token) return
      sessionStorage.setItem(LOGIN_AUDIT_KEY, token)
    } catch {
      /* private mode — still attempt once per call site */
    }
    try {
      await api.recordLoginAudit(method)
    } catch {
      /* non-blocking */
    }
  }

  async function refreshProfile() {
    if (!session.value?.access_token) {
      profile.value = null
      profileStatus.value = 'idle'
      return null
    }
    loadingProfile.value = true
    profileStatus.value = 'loading'
    error.value = null
    try {
      const res = await api.me()
      profile.value = res.profile
      profileStatus.value = 'ready'
      return res.profile
    } catch (e) {
      if (e instanceof ApiClientError && e.status === 401) {
        profile.value = null
        session.value = null
        user.value = null
        profileStatus.value = 'idle'
        clearDevAccessToken()
      } else {
        profileStatus.value = 'error'
      }
      throw e
    } finally {
      loadingProfile.value = false
    }
  }

  async function restoreDevSession() {
    const token = getDevAccessToken()
    if (!token || !isDevLoginEnabled()) return false

    session.value = {
      access_token: token,
      refresh_token: '',
      expires_in: 60 * 60 * 24 * 365,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
      token_type: 'bearer',
      user: {
        id: 'dev-local-user',
        email: 'dev@localhost',
        app_metadata: { provider: 'dev' },
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as User,
    } as Session
    user.value = session.value.user

    try {
      await refreshProfile()
      return true
    } catch {
      clearDevAccessToken()
      session.value = null
      user.value = null
      return false
    }
  }

  async function init() {
    if (ready.value) return

    if (await restoreDevSession()) {
      ready.value = true
      return
    }

    if (!isSupabaseConfigured()) {
      ready.value = true
      return
    }

    const supabase = getSupabaseBrowserClient()

    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null
    if (data.session) {
      try {
        await refreshProfile()
      } catch {
        // Keep session; profileStatus === 'error' so guards do not treat as incomplete onboarding.
      }
    }

    supabase.auth.onAuthStateChange((_event, next) => {
      if (getDevAccessToken()) return
      session.value = next
      user.value = next?.user ?? null
      if (next) {
        void refreshProfile().catch(() => {
          /* ignore background refresh errors */
        })
      } else {
        profile.value = null
        profileStatus.value = 'idle'
      }
    })

    ready.value = true
  }

  async function signInAsTestUser() {
    if (!isDevLoginEnabled()) {
      throw new Error('Test login is only available on localhost in development.')
    }
    error.value = null
    const res = await api.devLogin()
    setDevAccessToken(res.accessToken)
    const synthetic = syntheticDevSession(res.accessToken, res.profile)
    session.value = synthetic.session
    user.value = synthetic.user
    profile.value = res.profile
    profileStatus.value = 'ready'
    ready.value = true
    await recordSuccessfulLogin('dev')
  }

  async function signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }
    error.value = null
    const supabase = getSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: getAuthRedirectUrl(),
      },
    })
    if (authError) {
      error.value = friendlyAuthError(authError, 'Google sign-in failed. Please try again.')
      throw authError
    }
  }

  async function signInWithMagicLink(email: string) {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
    }
    error.value = null
    const supabase = getSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
      },
    })
    if (authError) {
      error.value = friendlyAuthError(authError, 'Could not send magic link. Please try again.')
      throw authError
    }
  }

  async function handleAuthCallback() {
    const supabase = getSupabaseBrowserClient()
    const url = new URL(window.location.href)

    const urlError = authErrorFromUrl(url)
    if (urlError) {
      throw new Error(urlError)
    }

    const code = url.searchParams.get('code')
    if (code) {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      if (exchangeError) {
        throw new Error(friendlyAuthError(exchangeError))
      }
      // Remove sensitive query params without a full reload.
      url.searchParams.delete('code')
      window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`)
    }

    const { data, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      throw new Error(friendlyAuthError(sessionError))
    }
    session.value = data.session
    user.value = data.session?.user ?? null
    if (!data.session) {
      throw new Error('Could not complete sign-in. Try again.')
    }
    try {
      await refreshProfile()
    } catch {
      throw new Error('Signed in, but your profile could not be loaded. Refresh and try again.')
    }
    await recordSuccessfulLogin(loginMethodFromUser(data.session.user))
  }

  async function completeOnboarding(input: {
    useCases: string[]
    audienceSize: string
    role: string
  }) {
    const res = await api.completeOnboarding(input)
    profile.value = res.profile
    profileStatus.value = 'ready'
    return res.profile
  }

  async function updatePreferences(input: {
    useCases?: string[]
    audienceSize?: string | null
    role?: string | null
  }) {
    const res = await api.updateMe(input)
    profile.value = res.profile
    profileStatus.value = 'ready'
    return res.profile
  }

  async function signOut() {
    clearDevAccessToken()
    try {
      sessionStorage.removeItem(LOGIN_AUDIT_KEY)
    } catch {
      /* private mode */
    }
    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseBrowserClient()
        await supabase.auth.signOut()
      } catch {
        /* ignore when Supabase is misconfigured */
      }
    }
    session.value = null
    user.value = null
    profile.value = null
    profileStatus.value = 'idle'
  }

  return {
    ready,
    session,
    user,
    profile,
    profileStatus,
    loadingProfile,
    error,
    isAuthenticated,
    onboardingCompleted,
    isAdmin,
    accessToken,
    devLoginEnabled,
    init,
    refreshProfile,
    signInAsTestUser,
    signInWithGoogle,
    signInWithMagicLink,
    handleAuthCallback,
    completeOnboarding,
    updatePreferences,
    signOut,
  }
})
