import { createRouter, createWebHistory } from 'vue-router'
import { authCallbackRedirect, safeAppPath } from '@/lib/authPaths'
import { setAuthIntent } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const marketingMeta = { public: true, marketing: true }

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MarketingLayout.vue'),
      meta: marketingMeta,
      children: [
        {
          path: '',
          name: 'landing',
          component: () => import('@/views/marketing/HomeView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'features/',
          name: 'features',
          component: () => import('@/views/marketing/FeaturesOverviewView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'live-polls/',
          name: 'feature-live-polls',
          component: () => import('@/views/marketing/FeatureLandingView.vue'),
          props: { slug: 'live-polls' },
          meta: marketingMeta,
        },
        {
          path: 'qa/',
          name: 'feature-qa',
          component: () => import('@/views/marketing/FeatureLandingView.vue'),
          props: { slug: 'qa' },
          meta: marketingMeta,
        },
        {
          path: 'quizzes/',
          name: 'feature-quizzes',
          component: () => import('@/views/marketing/FeatureLandingView.vue'),
          props: { slug: 'quizzes' },
          meta: marketingMeta,
        },
        {
          path: 'surveys/',
          name: 'feature-surveys',
          component: () => import('@/views/marketing/FeatureLandingView.vue'),
          props: { slug: 'surveys' },
          meta: marketingMeta,
        },
        {
          path: 'ratings/',
          name: 'feature-ratings',
          component: () => import('@/views/marketing/FeatureLandingView.vue'),
          props: { slug: 'ratings' },
          meta: marketingMeta,
        },
        {
          path: 'use-cases/',
          name: 'use-cases',
          component: () => import('@/views/marketing/UseCasesOverviewView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'use-cases/:slug/',
          name: 'use-case',
          component: () => import('@/views/marketing/UseCaseLandingView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'pricing/',
          name: 'pricing',
          component: () => import('@/views/marketing/PricingView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'about/',
          name: 'about',
          component: () => import('@/views/marketing/AboutView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'contact/',
          name: 'contact',
          component: () => import('@/views/marketing/ContactView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'help/',
          name: 'help',
          component: () => import('@/views/marketing/HelpView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'blogs/',
          name: 'blogs',
          component: () => import('@/views/marketing/BlogsView.vue'),
          meta: marketingMeta,
        },
        {
          path: 'blogs/:slug/',
          name: 'blog-article',
          component: () => import('@/views/marketing/ArticleStubView.vue'),
          meta: marketingMeta,
        },
        // Legacy /resources → /blogs
        { path: 'resources/', redirect: '/blogs/' },
        {
          path: 'resources/:slug/',
          redirect: (to) => `/blogs/${to.params.slug}/`,
        },
        {
          path: 'privacy/',
          name: 'privacy',
          component: () => import('@/views/marketing/LegalPageView.vue'),
          props: { slug: 'privacy' },
          meta: marketingMeta,
        },
        {
          path: 'terms/',
          name: 'terms',
          component: () => import('@/views/marketing/LegalPageView.vue'),
          props: { slug: 'terms' },
          meta: marketingMeta,
        },
        {
          path: 'cookies/',
          name: 'cookies',
          component: () => import('@/views/marketing/LegalPageView.vue'),
          props: { slug: 'cookies' },
          meta: marketingMeta,
        },
        // Slashless nested redirects for dynamic segments
        { path: 'use-cases/:slug', redirect: (to) => `/use-cases/${to.params.slug}/` },
        { path: 'blogs/:slug', redirect: (to) => `/blogs/${to.params.slug}/` },
        { path: 'resources/:slug', redirect: (to) => `/blogs/${to.params.slug}/` },
      ],
    },
    // Trailing-slash redirects for marketing paths without slash
    { path: '/features', redirect: '/features/' },
    { path: '/live-polls', redirect: '/live-polls/' },
    { path: '/qa', redirect: '/qa/' },
    { path: '/quizzes', redirect: '/quizzes/' },
    { path: '/surveys', redirect: '/surveys/' },
    { path: '/ratings', redirect: '/ratings/' },
    { path: '/use-cases', redirect: '/use-cases/' },
    { path: '/pricing', redirect: '/pricing/' },
    { path: '/about', redirect: '/about/' },
    { path: '/contact', redirect: '/contact/' },
    { path: '/help', redirect: '/help/' },
    { path: '/blogs', redirect: '/blogs/' },
    { path: '/resources', redirect: '/blogs/' },
    { path: '/privacy', redirect: '/privacy/' },
    { path: '/terms', redirect: '/terms/' },
    { path: '/cookies', redirect: '/cookies/' },
    {
      path: '/join',
      name: 'join',
      component: () => import('@/views/JoinView.vue'),
      meta: { public: true },
    },
    {
      path: '/join/:code',
      name: 'join-code',
      component: () => import('@/views/JoinView.vue'),
      props: true,
      meta: { public: true },
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { guest: true },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: { guest: true },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      meta: { requiresAuth: true, skipOnboardingGate: true },
    },
    {
      path: '/app',
      redirect: '/app/sessions',
    },
    {
      path: '/app/sessions',
      name: 'sessions',
      component: () => import('@/views/SessionsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/app/sessions/new',
      name: 'sessions-new',
      component: () => import('@/views/NewSessionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/app/sessions/:sessionId',
      name: 'session-editor',
      component: () => import('@/views/SessionEditorView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/app/sessions/:sessionId/present',
      name: 'session-present',
      component: () => import('@/views/PresentView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/app/sessions/:sessionId/results',
      name: 'session-results',
      meta: { requiresAuth: true },
      redirect: (to) => ({
        path: `/app/sessions/${to.params.sessionId}`,
        query: { ...to.query, tab: 'results' },
      }),
    },
    {
      path: '/app/settings',
      name: 'settings',
      component: () => import('@/views/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/app/admin',
      name: 'admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true, skipOnboardingGate: true },
    },
    {
      path: '/participant/:sessionId',
      name: 'participant',
      component: () => import('@/views/ParticipantView.vue'),
      meta: { public: true },
    },
    {
      path: '/demo',
      name: 'demo',
      component: () => import('@/views/DemoView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach(async (to) => {
  const authReturn = authCallbackRedirect(to.path, to.query, to.hash)
  if (authReturn) return authReturn

  const auth = useAuthStore()
  await auth.init()

  if (to.meta.public || to.meta.marketing) return true

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    const next = safeAppPath(to.fullPath)
    setAuthIntent(next)
    return { path: '/auth', query: { next } }
  }

  if (
    to.meta.requiresAuth &&
    auth.isAuthenticated &&
    (auth.profileStatus === 'idle' || auth.profileStatus === 'loading')
  ) {
    try {
      await auth.refreshProfile()
    } catch {
      /* profileStatus set to error */
    }
  }

  if (
    to.meta.requiresAuth &&
    auth.isAuthenticated &&
    !to.meta.skipOnboardingGate &&
    auth.profileStatus === 'ready' &&
    !auth.onboardingCompleted
  ) {
    return { path: '/onboarding', query: { next: safeAppPath(to.fullPath) } }
  }

  if (to.meta.requiresAdmin) {
    if (!auth.isAuthenticated) {
      const next = safeAppPath(to.fullPath)
      setAuthIntent(next)
      return { path: '/auth', query: { next } }
    }
    if (auth.profileStatus !== 'ready') {
      try {
        await auth.refreshProfile()
      } catch {
        return { path: '/app/sessions' }
      }
    }
    if (!auth.isAdmin) {
      return { path: '/app/sessions' }
    }
  }

  if (to.meta.guest && auth.isAuthenticated && to.name === 'auth') {
    const next = safeAppPath(to.query.next)
    if (auth.profileStatus !== 'ready') {
      try {
        await auth.refreshProfile()
      } catch {
        return true
      }
    }
    if (auth.profileStatus === 'ready' && !auth.onboardingCompleted) {
      return { path: '/onboarding', query: { next } }
    }
    return next
  }

  return true
})

export default router
