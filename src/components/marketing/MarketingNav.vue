<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { navLinks } from '@/content/marketing/site'
import { setAuthIntent } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const signedIn = ref(false)
const menuOpen = ref(false)

onMounted(async () => {
  await auth.init()
  signedIn.value = auth.isAuthenticated
})

function closeMenu() {
  menuOpen.value = false
}

async function startCreateSession() {
  closeMenu()
  await auth.init()
  setAuthIntent('/app/sessions/new')
  if (!auth.isAuthenticated) {
    await router.push({ path: '/auth', query: { next: '/app/sessions/new' } })
    return
  }
  if (!auth.onboardingCompleted) {
    await router.push({ path: '/onboarding', query: { next: '/app/sessions/new' } })
    return
  }
  await router.push('/app/sessions/new')
}

async function goSignIn() {
  closeMenu()
  setAuthIntent('/app/sessions')
  await router.push({ path: '/auth', query: { next: '/app/sessions' } })
}

async function goDashboard() {
  closeMenu()
  await router.push('/app/sessions')
}
</script>

<template>
  <header class="mkt-nav-bar">
    <RouterLink to="/" class="mkt-nav-brand" aria-label="Audivoice home" @click="closeMenu">
      <img src="/logo.svg" alt="Audivoice" class="mkt-nav-logo" width="160" height="33" />
    </RouterLink>

    <nav class="mkt-nav-links" aria-label="Primary">
      <RouterLink v-for="link in navLinks" :key="link.to" :to="link.to" class="mkt-nav-item">
        {{ link.label }}
      </RouterLink>
    </nav>

    <div class="mkt-nav-actions">
      <button
        type="button"
        class="mkt-nav-menu-btn"
        :aria-expanded="menuOpen"
        aria-controls="mkt-nav-mobile"
        @click="menuOpen = !menuOpen"
      >
        Menu
      </button>
      <button v-if="signedIn" type="button" class="mkt-nav-auth" @click="goDashboard">
        Dashboard
      </button>
      <button v-else type="button" class="mkt-nav-auth" @click="goSignIn">Log in</button>
      <button type="button" class="mkt-nav-cta" @click="startCreateSession">
        Get started <span aria-hidden="true">→</span>
      </button>
    </div>

    <nav
      id="mkt-nav-mobile"
      class="mkt-nav-mobile"
      :class="{ 'mkt-nav-mobile--open': menuOpen }"
      aria-label="Mobile"
    >
      <RouterLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="mkt-nav-mobile-link"
        @click="closeMenu"
      >
        {{ link.label }}
      </RouterLink>
      <button v-if="signedIn" type="button" class="mkt-nav-mobile-link" @click="goDashboard">
        Dashboard
      </button>
      <button v-else type="button" class="mkt-nav-mobile-link" @click="goSignIn">Log in</button>
      <button type="button" class="mkt-nav-cta mkt-nav-mobile-cta" @click="startCreateSession">
        Get started <span aria-hidden="true">→</span>
      </button>
    </nav>
  </header>
</template>

<style scoped>
.mkt-nav-bar {
  --nav-ink: #0b1220;
  --nav-muted: #64748b;
  --nav-teal: #0f766e;
  --nav-teal-deep: #115e59;
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.75rem 1rem;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 1.25rem 0.5rem;
  box-sizing: border-box;
}

@media (min-width: 960px) {
  .mkt-nav-bar {
    grid-template-columns: auto 1fr auto;
    padding: 1.35rem 1.25rem 0.75rem;
  }
}

.mkt-nav-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  justify-self: start;
}

.mkt-nav-logo {
  display: block;
  height: 1.85rem;
  width: auto;
  object-fit: contain;
}

.mkt-nav-links {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0.15rem 0.35rem;
  flex-wrap: wrap;
}

@media (min-width: 960px) {
  .mkt-nav-links {
    display: flex;
  }
}

.mkt-nav-item {
  padding: 0.45rem 0.7rem;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--nav-muted);
  text-decoration: none;
  transition: color 0.15s ease;
}

.mkt-nav-item:hover,
.mkt-nav-item.router-link-active {
  color: var(--nav-ink);
}

.mkt-nav-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}

.mkt-nav-menu-btn {
  display: inline-flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 9999px;
  padding: 0.5rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--nav-ink);
  cursor: pointer;
}

@media (min-width: 960px) {
  .mkt-nav-menu-btn {
    display: none;
  }
}

.mkt-nav-auth {
  display: none;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--nav-muted);
  background: none;
  border: 0;
  cursor: pointer;
  transition: color 0.15s ease;
}

.mkt-nav-auth:hover {
  color: var(--nav-ink);
}

@media (min-width: 640px) {
  .mkt-nav-auth {
    display: inline-flex;
  }
}

.mkt-nav-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 0;
  border-radius: 9999px;
  background: var(--nav-teal);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.7rem 1.25rem;
  min-height: 2.75rem;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.18);
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.mkt-nav-cta:hover {
  background: var(--nav-teal-deep);
  transform: translateY(-1px);
}

.mkt-nav-mobile {
  display: none;
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: stretch;
  gap: 0.25rem;
  margin-top: 0.35rem;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e2e8f0;
  border-radius: 1.15rem;
  box-shadow: 0 16px 36px rgba(15, 39, 42, 0.08);
}

.mkt-nav-mobile--open {
  display: flex;
}

@media (min-width: 960px) {
  .mkt-nav-mobile {
    display: none !important;
  }
}

.mkt-nav-mobile-link {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.75rem 0.85rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--nav-ink);
  text-decoration: none;
  background: none;
  border: 0;
  border-radius: 0.75rem;
  cursor: pointer;
}

.mkt-nav-mobile-link:hover,
.mkt-nav-mobile-link.router-link-active {
  background: rgba(15, 118, 110, 0.06);
}

.mkt-nav-mobile-cta {
  margin-top: 0.35rem;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .mkt-nav-cta {
    transition: none;
  }

  .mkt-nav-cta:hover {
    transform: none;
  }
}
</style>
