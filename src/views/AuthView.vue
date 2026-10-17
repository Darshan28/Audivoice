<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandMark from '@/components/ui/BrandMark.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { friendlyAuthError } from '@/lib/authErrors'
import {
  consumeAuthIntent,
  isSupabaseConfigured,
  peekAuthIntent,
  safeAppPath,
  setAuthIntent,
} from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

const email = ref('')
const loading = ref(false)
const magicSent = ref(false)
const error = ref<string | null>(null)
const supabaseReady = isSupabaseConfigured()

onMounted(async () => {
  await auth.init()
  const next = safeAppPath(
    typeof route.query.next === 'string' ? route.query.next : peekAuthIntent(),
  )
  setAuthIntent(next)

  if (auth.isAuthenticated) {
    await continueAfterAuth()
  }
})

async function continueAfterAuth() {
  if (auth.profileStatus !== 'ready') {
    try {
      await auth.refreshProfile()
    } catch {
      error.value = 'Could not load your profile. Refresh and try again.'
      return
    }
  }
  const intent = consumeAuthIntent(route.query.next)
  if (!auth.onboardingCompleted) {
    await router.replace({ path: '/onboarding', query: { next: intent } })
    return
  }
  await router.replace(intent)
}

async function google() {
  loading.value = true
  error.value = null
  try {
    await auth.signInWithGoogle()
  } catch (e) {
    error.value = friendlyAuthError(e, 'Google sign-in failed. Please try again.')
    loading.value = false
  }
}

async function sendMagicLink() {
  if (!email.value.trim() || !email.value.includes('@')) {
    error.value = 'Enter a valid email address.'
    return
  }
  loading.value = true
  error.value = null
  try {
    await auth.signInWithMagicLink(email.value)
    magicSent.value = true
  } catch (e) {
    error.value = friendlyAuthError(e, 'Could not send magic link. Please try again.')
  } finally {
    loading.value = false
  }
}

async function continueAsTestUser() {
  loading.value = true
  error.value = null
  try {
    await auth.signInAsTestUser()
    await continueAfterAuth()
  } catch (e) {
    error.value = friendlyAuthError(e, 'Test login failed. Is the API running?')
    loading.value = false
  }
}
</script>

<template>
  <div class="app-shell flex items-center justify-center px-4 py-10">
    <div class="app-shell-bg" aria-hidden="true" />
    <div class="relative z-10 w-full max-w-md card p-8 sm:p-10">
      <BrandMark to="/" size="sm" />
      <h1 class="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">Continue to Audivoice</h1>
      <p class="mt-2 text-sm text-audivoice-muted">
        New here? Your first sign-in creates an account. Returning hosts can pick up where they left
        off.
      </p>

      <div v-if="magicSent" class="mt-8 rounded-2xl bg-audivoice-soft px-4 py-5 text-sm text-audivoice-ink">
        Check your email for a magic link to finish signing in.
      </div>

      <div v-else class="mt-8 space-y-4">
        <Button
          v-if="auth.devLoginEnabled"
          class="w-full"
          variant="secondary"
          :disabled="loading"
          @click="continueAsTestUser"
        >
          Continue as test user
        </Button>

        <template v-if="supabaseReady">
          <div
            v-if="auth.devLoginEnabled"
            class="flex items-center gap-3 text-xs uppercase tracking-wide text-audivoice-muted"
          >
            <span class="h-px flex-1 bg-audivoice-border" />
            or
            <span class="h-px flex-1 bg-audivoice-border" />
          </div>

          <Button class="w-full" variant="secondary" :disabled="loading" @click="google">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.3h6.44c-.28 1.41-1.12 2.6-2.38 3.4v2.82h3.84c2.25-2.07 3.59-5.12 3.59-8.25z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.84-2.82c-1.07.72-2.44 1.15-4.09 1.15-3.14 0-5.8-2.12-6.76-4.97H1.28v2.91C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.24 14.45c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V7H1.28A11.96 11.96 0 0 0 0 12.17c0 1.93.46 3.75 1.28 5.36l3.96-3.08z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.28 6.64L5.24 9.55C6.2 6.7 8.86 4.75 12 4.75z"
              />
            </svg>
            Continue with Google
          </Button>

          <div class="flex items-center gap-3 text-xs uppercase tracking-wide text-audivoice-muted">
            <span class="h-px flex-1 bg-audivoice-border" />
            or
            <span class="h-px flex-1 bg-audivoice-border" />
          </div>

          <form class="space-y-3" @submit.prevent="sendMagicLink">
            <Input
              v-model="email"
              type="email"
              label="Email address"
              placeholder="you@company.com"
            />
            <Button type="submit" class="w-full" :disabled="loading">Send magic link</Button>
          </form>
        </template>

        <p
          v-else-if="auth.devLoginEnabled"
          class="text-center text-xs text-audivoice-muted"
        >
          Local test login — Supabase is not configured.
        </p>
      </div>

      <p v-if="error" class="mt-4 text-sm text-audivoice-danger">{{ error }}</p>
      <p class="mt-6 text-center text-xs text-audivoice-muted">
        By continuing you agree to our
        <RouterLink to="/terms/" class="underline hover:text-audivoice-ink">Terms</RouterLink>
        and
        <RouterLink to="/privacy/" class="underline hover:text-audivoice-ink">Privacy Policy</RouterLink>.
      </p>
    </div>
  </div>
</template>
