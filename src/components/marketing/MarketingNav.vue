<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { navLinks } from '@/content/marketing/site'
import { setAuthIntent } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const signedIn = ref(false)
const menuOpen = ref(false)
const scrolled = ref(false)
/** Dark bands sit under the bar. Teal ones need an all-white mark; brand teal disappears on them. */
const onDark = ref(false)
const onTeal = ref(false)
let bandObserver: MutationObserver | null = null

function updateNavChrome() {
  scrolled.value = window.scrollY > 8
  const bar = document.querySelector('.mkt-nav-bar')
  if (!bar) {
    onDark.value = false
    onTeal.value = false
    return
  }
  const { top, bottom } = bar.getBoundingClientRect()
  const mid = (top + bottom) / 2
  const band = Array.from(document.querySelectorAll('.mkt-band--ink, .mkt-band--teal, .home-block--teal')).find(
    (node) => {
      const rect = node.getBoundingClientRect()
      return rect.top <= mid && rect.bottom >= mid
    },
  )
  onDark.value = Boolean(band)
  onTeal.value = Boolean(band?.classList.contains('mkt-band--teal') || band?.classList.contains('home-block--teal'))
}

onMounted(async () => {
  updateNavChrome()
  window.addEventListener('scroll', updateNavChrome, { passive: true })
  window.addEventListener('resize', updateNavChrome, { passive: true })
  const main = document.querySelector('.mkt-main')
  if (main) {
    bandObserver = new MutationObserver(() => updateNavChrome())
    bandObserver.observe(main, { childList: true, subtree: true })
  }
  await auth.init()
  signedIn.value = auth.isAuthenticated
})

onUnmounted(() => {
  bandObserver?.disconnect()
  window.removeEventListener('scroll', updateNavChrome)
  window.removeEventListener('resize', updateNavChrome)
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
  <header
    class="mkt-nav"
    :class="{
      'mkt-nav--scrolled': scrolled,
      'mkt-nav--menu-open': menuOpen,
      'mkt-nav--on-dark': onDark,
      'mkt-nav--on-teal': onTeal,
    }"
  >
    <div class="mkt-nav-bar">
      <RouterLink to="/" class="mkt-nav-brand" aria-label="Audivoice home" @click="closeMenu">
        <span class="mkt-nav-logos">
          <img src="/logo.svg" alt="" class="mkt-nav-logo mkt-nav-logo--for-light" width="160" height="33" />
          <img
            src="/logo-on-dark.svg"
            alt=""
            class="mkt-nav-logo mkt-nav-logo--for-dark"
            width="160"
            height="33"
          />
          <img
            src="/logo-on-teal.svg"
            alt=""
            class="mkt-nav-logo mkt-nav-logo--for-teal"
            width="160"
            height="33"
          />
        </span>
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
    </div>
  </header>
</template>

<style scoped>
.mkt-nav {
  --nav-ink: #0b1220;
  --nav-muted: #64748b;
  --nav-teal: #0f766e;
  --nav-teal-deep: #115e59;
  position: fixed;
  top: max(0.7rem, env(safe-area-inset-top, 0px));
  left: 0;
  right: 0;
  z-index: 50;
  padding-inline: max(0.75rem, env(safe-area-inset-left, 0px))
    max(0.75rem, env(safe-area-inset-right, 0px));
  pointer-events: none;
}

.mkt-nav-bar {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.5rem 0.75rem;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 0.4rem 0.45rem 0.4rem 0.95rem;
  box-sizing: border-box;
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 999px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.65),
    0 10px 28px rgba(15, 39, 42, 0.08);
  transition:
    background 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease,
    border-radius 0.22s ease,
    backdrop-filter 0.22s ease,
    -webkit-backdrop-filter 0.22s ease;
}

/* Frost the bar once page content passes behind it. */
.mkt-nav--scrolled .mkt-nav-bar {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(22px) saturate(1.8);
  -webkit-backdrop-filter: blur(22px) saturate(1.8);
  border-color: rgba(255, 255, 255, 0.55);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 12px 36px rgba(15, 39, 42, 0.1);
}

.mkt-nav--menu-open .mkt-nav-bar {
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(20px) saturate(1.45);
  -webkit-backdrop-filter: blur(20px) saturate(1.45);
  border-color: rgba(204, 232, 227, 0.95);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.75),
    0 16px 40px rgba(15, 39, 42, 0.12);
}

.mkt-nav--menu-open .mkt-nav-bar {
  border-radius: 1.35rem;
}

/* Dark bands show through the frost, so flip to a dark glass with light type. */
.mkt-nav--on-dark {
  --nav-ink: #f8fafc;
  --nav-muted: rgba(248, 250, 252, 0.86);
}

.mkt-nav--on-dark .mkt-nav-bar,
.mkt-nav--on-dark.mkt-nav--scrolled .mkt-nav-bar,
.mkt-nav--on-dark.mkt-nav--menu-open .mkt-nav-bar {
  background: rgba(8, 15, 28, 0.58);
  backdrop-filter: blur(22px) saturate(1.35);
  -webkit-backdrop-filter: blur(22px) saturate(1.35);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    0 12px 36px rgba(0, 0, 0, 0.28);
}

@media (min-width: 960px) {
  .mkt-nav-bar {
    grid-template-columns: auto auto auto;
    width: max-content;
    max-width: 100%;
    justify-content: center;
    gap: 0.35rem 1.15rem;
    padding: 0.4rem 0.45rem 0.4rem 1.15rem;
  }
}

.mkt-nav-brand {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  justify-self: start;
}

.mkt-nav-logos {
  display: grid;
}

.mkt-nav-logo {
  display: block;
  height: 1.85rem;
  width: auto;
  object-fit: contain;
  grid-area: 1 / 1;
  transition: opacity 0.2s ease;
}

.mkt-nav-logo--for-dark,
.mkt-nav-logo--for-teal {
  opacity: 0;
}

.mkt-nav--on-dark .mkt-nav-logo--for-light {
  opacity: 0;
}

.mkt-nav--on-dark .mkt-nav-logo--for-dark {
  opacity: 1;
}

.mkt-nav--on-teal .mkt-nav-logo--for-dark {
  opacity: 0;
}

.mkt-nav--on-teal .mkt-nav-logo--for-teal {
  opacity: 1;
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
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}

.mkt-nav--on-dark .mkt-nav-menu-btn {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.28);
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
  gap: 0.35rem;
  border: 0;
  border-radius: 9999px;
  background: var(--nav-teal);
  color: #fff;
  font-size: 0.92rem;
  font-weight: 500;
  padding: 0.55rem 1.05rem;
  min-height: 2.45rem;
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

.mkt-nav--on-dark .mkt-nav-cta {
  background: #f0fdfa;
  color: #115e59;
  box-shadow: none;
}

.mkt-nav--on-dark .mkt-nav-cta:hover {
  background: #fff;
  color: #115e59;
}

.mkt-nav-mobile {
  display: none;
  grid-column: 1 / -1;
  flex-direction: column;
  align-items: stretch;
  gap: 0.15rem;
  margin-top: 0.35rem;
  padding: 0.55rem 0.2rem 0.25rem;
  border-top: 1px solid rgba(204, 232, 227, 0.9);
}

.mkt-nav--on-dark .mkt-nav-mobile {
  border-top-color: rgba(255, 255, 255, 0.16);
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

.mkt-nav--on-dark .mkt-nav-mobile-link:hover,
.mkt-nav--on-dark .mkt-nav-mobile-link.router-link-active {
  background: rgba(255, 255, 255, 0.08);
}

.mkt-nav-mobile-cta {
  margin-top: 0.35rem;
  width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  .mkt-nav-bar,
  .mkt-nav-cta,
  .mkt-nav-logo,
  .mkt-nav-menu-btn {
    transition: none;
  }

  .mkt-nav-cta:hover {
    transform: none;
  }
}
</style>
