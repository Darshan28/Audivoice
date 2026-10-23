<script setup lang="ts">
import { useRouter } from 'vue-router'
import { setAuthIntent } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()

// The rise keeps each bubble off-screen until about 54% of the 16.2s cycle.
// Lead by 11s so one message is already on screen at first paint.
const feedStaggerMs = 2400
const feedVisibleLeadMs = 11000

const feedbackBubbles = [
  {
    src: '/illustration/Friendly%20Chat%20Bubble%20UI%20Illustration.png',
    alt: 'Could we compare one more option?',
  },
  {
    src: '/illustration/Glossy%20UI%20Comment%20Bubble.png',
    alt: 'Love this direction! The UI feels much more intuitive now.',
  },
  {
    src: '/illustration/Looks%20Perfect%20Feedback%20Bubble.png',
    alt: "Looks perfect! Let's go ahead with this design.",
  },
  {
    src: '/illustration/Mobile%20Feedback%20Chat%20Bubble.png',
    alt: 'This looks great! Can we also explore a mobile version?',
  },
  {
    src: '/illustration/Cheerful%20Team%20Feedback%20Bubble.png',
    alt: 'This would be super helpful for our team!',
  },
  {
    src: '/illustration/Analytics%20feedback%20chat%20bubble.png',
    alt: 'Can we also look at the analytics for this feature?',
  },
]

async function startCreateSession() {
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
</script>

<template>
  <div class="landing">
    <div class="landing-bg" aria-hidden="true">
      <div class="landing-orb landing-orb--a" />
      <div class="landing-orb landing-orb--b" />
      <svg class="landing-orbit" viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <ellipse cx="1180" cy="280" rx="520" ry="300" stroke="url(#og)" stroke-width="1" opacity="0.28" />
        <ellipse cx="1120" cy="320" rx="360" ry="210" stroke="url(#og)" stroke-width="0.9" opacity="0.18" />
        <path
          d="M-40 620 C300 420, 520 700, 800 520 S1240 300, 1500 480"
          stroke="url(#og)"
          stroke-width="1"
          opacity="0.22"
        />
        <defs>
          <linearGradient id="og" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#94A3B8" stop-opacity="0.15" />
            <stop offset="45%" stop-color="#0F766E" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#A5B4FC" stop-opacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <main class="landing-hero">
      <div class="landing-copy landing-fade">
        <div class="landing-badge">
          <span class="landing-badge-dot" aria-hidden="true" />
          Audience engagement made simple
        </div>

        <h1 class="landing-title">
          Give every audience
          <span class="landing-title-accent">a voice.</span>
        </h1>

        <p class="landing-desc">
          Turn presentations, meetings, classes, and events into interactive experiences. Ask
          questions, get real-time responses, and understand what your audience thinks.
        </p>

        <div class="landing-ctas">
          <button
            type="button"
            class="landing-btn-primary landing-btn-hero"
            @click="startCreateSession"
          >
            Get started <span aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            class="landing-btn-secondary landing-btn-hero"
            @click="router.push('/join')"
          >
            Join a session
          </button>
        </div>
      </div>

      <div class="landing-stage landing-fade landing-fade--delay">
        <div class="landing-scene">
          <img
            class="landing-stage-img"
            src="/illustration/landing_illustration.png"
            width="1603"
            height="981"
            alt="A presenter leading a live Audivoice session while the audience answers on their phones"
          />
          <img
            class="landing-qr"
            src="/illustration/qr_illustration.png"
            width="1303"
            height="1207"
            alt="Join this session at audivoice.com/join with code 72941"
          />
          <div class="landing-feed" aria-label="Live audience feedback">
            <div
              v-for="(bubble, index) in feedbackBubbles"
              :key="bubble.src"
              class="landing-feed-item"
              :style="{ animationDelay: `${index * feedStaggerMs - feedVisibleLeadMs}ms` }"
            >
              <img :src="bubble.src" :alt="bubble.alt" width="1774" height="887" />
            </div>
          </div>
        </div>
      </div>

      <ul class="landing-features landing-fade">
        <li>
          <span class="landing-feature-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="3.25" stroke="currentColor" stroke-width="1.75" />
              <path
                d="M5.5 19.5c1.6-3 3.9-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </svg>
          </span>
          No account required for participants
        </li>
        <li>
          <span class="landing-feature-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4.5" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.75" />
              <path d="M8 20.5h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
          </span>
          Works on any device
        </li>
        <li>
          <span class="landing-feature-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 18V11M11 18V7M17 18V13"
                stroke="currentColor"
                stroke-width="1.75"
                stroke-linecap="round"
              />
            </svg>
          </span>
          Live responses in real time
        </li>
      </ul>
    </main>
  </div>
</template>

<style scoped>
.landing {
  --teal: #0F766E;
  --teal-deep: #115E59;
  --ink: #0b1220;
  --muted: #64748b;
  --soft: #F0FDFA;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  overflow: hidden;
  color: var(--ink);
  background: #f7f8fb;
}

.landing-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(ellipse 55% 45% at 12% 18%, rgba(52, 211, 153, 0.14), transparent 68%),
    radial-gradient(ellipse 48% 40% at 88% 10%, rgba(15, 118, 110, 0.1), transparent 70%),
    radial-gradient(ellipse 42% 36% at 78% 88%, rgba(52, 211, 153, 0.12), transparent 72%),
    linear-gradient(180deg, #fbfcfe 0%, #f6f8fb 48%, #f3f6f5 100%);
}

.landing-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(40px);
  animation: landing-drift 18s ease-in-out infinite;
  opacity: 0.7;
}

.landing-orb--a {
  width: min(28vw, 320px);
  height: min(28vw, 320px);
  top: 8%;
  right: 10%;
  background: radial-gradient(circle at 35% 35%, rgba(15, 118, 110, 0.22), transparent 70%);
}

.landing-orb--b {
  width: min(18vw, 200px);
  height: min(18vw, 200px);
  bottom: 14%;
  left: 4%;
  background: radial-gradient(circle at 40% 40%, rgba(52, 211, 153, 0.2), transparent 72%);
  animation-delay: -6s;
}

.landing-orbit {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.landing-hero {
  position: relative;
  z-index: 10;
  flex: 1;
  display: grid;
  align-items: center;
  gap: 1.75rem;
  width: 100%;
  min-height: 0;
  /* Top padding clears the floating rounded nav */
  padding: 5.75rem 1.25rem 1.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 960px) {
  .landing-hero {
    grid-template-columns: minmax(17rem, 0.72fr) minmax(0, 1.28fr);
    grid-template-rows: auto auto;
    align-content: center;
    column-gap: clamp(1.5rem, 3vw, 3rem);
    row-gap: clamp(1.25rem, 3vh, 2rem);
    /* Both sides match the marketing layout inset */
    padding-top: 6rem;
    padding-bottom: clamp(1.25rem, 3vh, 2.5rem);
    padding-inline: max(1.25rem, calc((100% - var(--mkt-max, 1360px)) / 2 + 1.25rem));
  }

  .landing-features {
    grid-column: 1 / -1;
    margin-top: 0;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 1.25rem 2rem;
  }
}

.landing-copy {
  max-width: 36rem;
}

@media (min-width: 960px) {
  .landing-copy {
    max-width: min(34rem, 100%);
    padding-right: 0.5rem;
  }
}

.landing-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid rgba(203, 213, 225, 0.9);
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  border-radius: 9999px;
  padding: 0.45rem 0.9rem;
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #64748b;
}

.landing-badge-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 9999px;
  background: var(--teal);
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.14);
}

.landing-title {
  margin-top: clamp(1.1rem, 2.2vh, 1.6rem);
  font-size: clamp(2.55rem, 5.2vw, 4.35rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.038em;
  color: var(--ink);
}

.landing-title-accent {
  display: inline;
  white-space: nowrap;
  background: none;
  color: var(--teal-deep);
  font-weight: 700;
}

.landing-desc {
  margin-top: clamp(1rem, 2vh, 1.35rem);
  max-width: 32rem;
  font-size: clamp(1rem, 1.2vw, 1.125rem);
  font-weight: 400;
  line-height: 1.7;
  color: var(--muted);
}

.landing-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: clamp(1.5rem, 3vh, 2.1rem);
}

.landing-btn-primary,
.landing-btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border-radius: 9999px;
  font-weight: 500;
  transition:
    background 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.landing-btn-primary {
  background: var(--teal);
  color: #fff;
  font-size: 0.95rem;
  padding: 0.7rem 1.25rem;
  min-height: 2.75rem;
  box-shadow: 0 8px 20px rgba(15, 118, 110, 0.18);
}

.landing-btn-primary:hover {
  background: var(--teal-deep);
  transform: translateY(-1px);
}

.landing-btn-secondary {
  background: #fff;
  color: var(--ink);
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;
  padding: 0.7rem 1.25rem;
  min-height: 2.75rem;
}

.landing-btn-secondary:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.landing-btn-hero {
  min-height: 3.25rem;
  padding: 0.85rem 1.5rem;
  font-size: 1.02rem;
}

.landing-features {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem 1.5rem;
  margin-top: clamp(1.75rem, 3.5vh, 2.5rem);
  font-size: clamp(0.88rem, 1.05vw, 0.95rem);
  font-weight: 400;
  color: #64748b;
}

.landing-features li {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.landing-feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  color: var(--teal-deep);
  background: rgba(240, 253, 250, 0.95);
  border: 1px solid rgba(204, 232, 227, 0.9);
}

.landing-stage {
  width: 100%;
  min-width: 0;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: clamp(0.75rem, 2vh, 1.5rem) 0;
}

@media (min-width: 960px) {
  .landing-stage {
    padding: clamp(0.5rem, 1.5vh, 1.25rem) 0;
    justify-content: stretch;
  }
}

.landing-scene {
  position: relative;
  width: min(100%, calc(min(82vh, 760px) * 1603 / 981));
  aspect-ratio: 1603 / 981;
  animation: landing-stage-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
}

.landing-stage-img,
.landing-qr {
  display: block;
  height: auto;
}

.landing-stage-img {
  width: 100%;
}

.landing-qr {
  position: absolute;
  z-index: 2;
  /* Rests on the left plant, in front of the leaves, with the presenter left clear */
  left: -7%;
  top: 5%;
  width: 24%;
  pointer-events: none;
  filter: drop-shadow(0 14px 22px rgba(15, 23, 42, 0.16));
}

.landing-feed {
  position: absolute;
  z-index: 3;
  top: 0;
  right: 0;
  bottom: 0;
  width: 44%;
  overflow: hidden;
  pointer-events: none;
  /* Audience heads start just under this line. Bubbles stay hidden on the
     characters and only fade in once they have cleared them. */
  mask-image: linear-gradient(to bottom, transparent 0%, #000 8%, #000 50%, transparent 58%);
}

.landing-feed-item {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  animation: landing-feed-rise 16.2s linear infinite both;
}

.landing-feed-item img {
  width: 62%;
  height: auto;
  margin-right: 2%;
  filter: drop-shadow(0 10px 16px rgba(15, 23, 42, 0.14));
}

@keyframes landing-feed-rise {
  0% {
    transform: translateY(104%);
    opacity: 0;
  }
  8% {
    opacity: 1;
  }
  88% {
    opacity: 1;
  }
  100% {
    transform: translateY(-88%);
    opacity: 0;
  }
}

.landing-fade {
  animation: landing-fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.landing-fade--delay {
  animation-delay: 120ms;
}

@keyframes landing-fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes landing-stage-in {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes landing-drift {
  0%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(10px, -8px, 0);
  }
}

@media (max-width: 959px) {
  .landing-hero {
    align-content: center;
    justify-items: center;
    padding-top: 5.5rem;
    text-align: left;
  }

  .landing-copy {
    width: 100%;
    max-width: 24rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .landing-title {
    font-size: clamp(2.35rem, 9.5vw, 3.25rem);
  }

  .landing-desc {
    max-width: none;
  }

  .landing-ctas {
    flex-direction: column;
    width: 100%;
  }

  .landing-btn-hero {
    width: 100%;
  }

  .landing-features {
    width: 100%;
    max-width: 24rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }

  .landing-stage {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .landing-fade,
  .landing-fade--delay,
  .landing-scene,
  .landing-stage-img,
  .landing-qr,
  .landing-feed-item,
  .landing-orb {
    animation: none !important;
  }

  .landing-feed {
    mask-image: none;
  }

  .landing-feed-item {
    inset: auto;
    right: 0;
    left: 0;
    align-items: flex-start;
    opacity: 1;
    transform: none;
  }

  .landing-feed-item:nth-child(1) {
    top: 8%;
  }

  .landing-feed-item:nth-child(2) {
    top: 34%;
  }

  .landing-feed-item:nth-child(n + 3) {
    display: none;
  }
}
</style>
