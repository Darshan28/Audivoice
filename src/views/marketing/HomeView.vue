<script setup lang="ts">
import FaqAccordion from '@/components/marketing/FaqAccordion.vue'
import FinalCta from '@/components/marketing/FinalCta.vue'
import HomeAboveFold from '@/components/marketing/HomeAboveFold.vue'
import {
  homeEasy,
  homeFaqs,
  homeFinalCta,
  homeHowItWorks,
  homePricingTeaser,
  homeSeo,
  homeUseCases,
  homeWhy,
} from '@/content/marketing/home'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(homeSeo)
</script>

<template>
  <div class="home-page">
    <HomeAboveFold />

    <!-- Statement — Mentimeter-style bold moment -->
    <section class="home-block home-block--mint">
      <div class="home-shell home-statement">
        <h2 class="home-display">{{ homeEasy.title }}</h2>
        <p class="home-lead">{{ homeEasy.body }}</p>
        <p class="home-lead home-lead--tight">{{ homeEasy.closer }}</p>
      </div>
    </section>

    <!-- Use cases — large showcase grid -->
    <section class="home-block">
      <div class="home-shell">
        <div class="home-block-head">
          <h2 class="home-title">{{ homeUseCases.title }}</h2>
          <RouterLink class="home-text-link" :to="homeUseCases.cta.to">
            {{ homeUseCases.cta.label }} <span aria-hidden="true">→</span>
          </RouterLink>
        </div>
        <div class="home-showcase-grid">
          <RouterLink
            v-for="item in homeUseCases.items"
            :key="item.to"
            :to="item.to"
            class="home-showcase"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
            <span class="home-showcase-go" aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- How it works — open numbered track -->
    <section class="home-block home-block--soft">
      <div class="home-shell">
        <h2 class="home-title">{{ homeHowItWorks.title }}</h2>
        <div class="home-steps">
          <div v-for="(step, i) in homeHowItWorks.steps" :key="step.title" class="home-step">
            <span class="home-step-num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why — feature panels -->
    <section class="home-block">
      <div class="home-shell">
        <h2 class="home-title">{{ homeWhy.title }}</h2>
        <div class="home-why-grid">
          <article v-for="(item, i) in homeWhy.items" :key="item.title" class="home-why">
            <span class="home-why-icon" aria-hidden="true">
              <svg v-if="i === 0" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.25" stroke="currentColor" stroke-width="1.75" />
                <path
                  d="M5.5 19.5c1.6-3 3.9-4.5 6.5-4.5s4.9 1.5 6.5 4.5"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                />
              </svg>
              <svg v-else-if="i === 1" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.75" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.75" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="1.75" />
                <path
                  d="M14 14h3v3M20 14v3h-3M14 20h3M20 17v3"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                />
              </svg>
              <svg v-else-if="i === 2" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.75" />
                <path
                  d="M8.5 12.5 11 15l4.5-5"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg v-else-if="i === 3" width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 18V11M11 18V7M17 18V13"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                />
              </svg>
              <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 7h16M4 12h10M4 17h14"
                  stroke="currentColor"
                  stroke-width="1.75"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- Pricing teaser -->
    <section class="home-block home-block--teal">
      <div class="home-shell home-pricing">
        <h2 class="home-display home-display--light">{{ homePricingTeaser.title }}</h2>
        <p class="home-lead home-lead--light">{{ homePricingTeaser.body }}</p>
        <p class="home-lead home-lead--light home-lead--tight">{{ homePricingTeaser.closer }}</p>
        <RouterLink class="home-cta-light" :to="homePricingTeaser.cta.to">
          {{ homePricingTeaser.cta.label }} <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>

    <section class="home-block">
      <div class="home-shell">
        <FaqAccordion title="Frequently Asked Questions" :items="homeFaqs" />
      </div>
    </section>

    <div class="home-final">
      <FinalCta
        :title="homeFinalCta.title"
        :body="homeFinalCta.body"
        :label="homeFinalCta.cta.label"
        :to="homeFinalCta.cta.to"
      />
    </div>
  </div>
</template>

<style scoped>
/* Match interior marketing pages (1120px) — not the above-fold hero gutters */
.home-page {
  background: #f7f8fb;
}

.home-shell {
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
  padding-inline: 1.25rem;
  box-sizing: border-box;
}

.home-block {
  padding-block: clamp(4.5rem, 10vw, 7.5rem);
}

.home-block--mint {
  background:
    radial-gradient(ellipse 50% 55% at 15% 30%, rgba(52, 211, 153, 0.16), transparent 70%),
    radial-gradient(ellipse 45% 50% at 90% 70%, rgba(15, 118, 110, 0.1), transparent 68%),
    #eef7f4;
}

.home-block--soft {
  background:
    radial-gradient(ellipse 40% 50% at 80% 20%, rgba(15, 118, 110, 0.08), transparent 65%),
    #f3f6f8;
}

.home-block--teal {
  background:
    radial-gradient(ellipse 55% 70% at 85% 25%, rgba(52, 211, 153, 0.28), transparent 60%),
    linear-gradient(145deg, #0f766e 0%, #115e59 50%, #0d4f4a 100%);
  color: #f0fdfa;
}

.home-block-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: clamp(2.75rem, 5vw, 4rem);
}

.home-display {
  font-size: clamp(2.35rem, 5.2vw, 4rem);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.04em;
  color: #0b1220;
  max-width: 14ch;
}

.home-display--light {
  color: #f0fdfa;
  max-width: 14ch;
}

.home-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.036em;
  color: #0b1220;
  max-width: min(20ch, 100%);
  text-align: left;
}

.home-lead {
  margin-top: 1.35rem;
  max-width: 38rem;
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  line-height: 1.7;
  color: #5b6b73;
  font-weight: 400;
}

.home-lead--tight {
  margin-top: 0.75rem;
}

.home-lead--light {
  color: rgba(240, 253, 250, 0.85);
}

.home-statement {
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.home-statement .home-display {
  max-width: min(14ch, 100%);
}

.home-statement .home-lead {
  max-width: 40rem;
}

.home-text-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 1rem;
  font-weight: 500;
  color: #115e59;
  text-decoration: none;
  white-space: nowrap;
}

.home-text-link:hover {
  color: #0f766e;
}

/* Use-case showcase tiles — open, not boxed cards */
.home-showcase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid rgba(15, 118, 110, 0.15);
}

@media (min-width: 720px) {
  .home-showcase-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.home-showcase {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: clamp(2.25rem, 4vw, 3.25rem) 0;
  text-decoration: none;
  color: inherit;
  border-bottom: 1px solid rgba(15, 118, 110, 0.15);
  transition: background 0.2s ease;
}

@media (min-width: 720px) {
  .home-showcase {
    padding: clamp(2.5rem, 4.5vw, 3.5rem) clamp(2rem, 4vw, 3.25rem);
  }

  .home-showcase:nth-child(odd) {
    padding-left: 0;
    border-right: 1px solid rgba(15, 118, 110, 0.12);
  }

  .home-showcase:nth-child(even) {
    padding-right: 0;
  }
}

.home-showcase:hover {
  background: rgba(15, 118, 110, 0.03);
}

.home-showcase h3 {
  font-size: clamp(1.25rem, 2vw, 1.55rem);
  font-weight: 600;
  letter-spacing: -0.025em;
  color: #0b1220;
  padding-right: 2.5rem;
}

.home-showcase p {
  color: #5b6b73;
  font-size: 1rem;
  line-height: 1.65;
  max-width: 30rem;
}

.home-showcase-go {
  position: absolute;
  top: clamp(2.25rem, 4vw, 3.25rem);
  right: 0;
  color: #0f766e;
  font-size: 1.25rem;
  opacity: 0;
  transform: translateX(-6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

@media (min-width: 720px) {
  .home-showcase-go {
    top: clamp(2.5rem, 4.5vw, 3.5rem);
  }

  .home-showcase:nth-child(odd) .home-showcase-go {
    right: clamp(2rem, 4vw, 3.25rem);
  }
}

.home-showcase:hover .home-showcase-go {
  opacity: 1;
  transform: translateX(0);
}

/* How it works — open showcase track */
.home-steps {
  display: grid;
  gap: 0;
  margin-top: clamp(2.75rem, 5vw, 4rem);
  border-top: 1px solid rgba(15, 118, 110, 0.14);
}

@media (min-width: 900px) {
  .home-steps {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.home-step {
  padding: clamp(1.75rem, 3vw, 2.5rem) 0;
  border-bottom: 1px solid rgba(15, 118, 110, 0.14);
}

@media (min-width: 900px) {
  .home-step {
    padding: clamp(2rem, 3vw, 2.75rem) clamp(1rem, 2vw, 1.75rem);
    border-bottom: 0;
    border-right: 1px solid rgba(15, 118, 110, 0.14);
  }

  .home-step:first-child {
    padding-left: 0;
  }

  .home-step:last-child {
    padding-right: 0;
    border-right: 0;
  }
}

.home-step-num {
  display: block;
  font-size: clamp(2.75rem, 4.5vw, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1;
  color: rgba(15, 118, 110, 0.2);
  margin-bottom: 1.25rem;
}

.home-step h3 {
  font-size: clamp(1.15rem, 1.6vw, 1.3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0b1220;
}

.home-step p {
  margin-top: 0.65rem;
  color: #5b6b73;
  font-size: 1rem;
  line-height: 1.65;
}

/* Why panels */
.home-why-grid {
  display: grid;
  gap: 1.25rem;
  margin-top: clamp(2.5rem, 5vw, 3.5rem);
}

@media (min-width: 720px) {
  .home-why-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
}

@media (min-width: 1100px) {
  .home-why-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .home-why:nth-child(1),
  .home-why:nth-child(2),
  .home-why:nth-child(3) {
    grid-column: span 2;
  }

  .home-why:nth-child(4),
  .home-why:nth-child(5) {
    grid-column: span 3;
  }
}

.home-why {
  padding: clamp(1.5rem, 2.5vw, 2rem);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-radius: 1.25rem;
}

.home-why-icon {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 1.15rem;
  border-radius: 0.85rem;
  background: rgba(15, 118, 110, 0.1);
  color: #115e59;
}

.home-why h3 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: #0b1220;
}

.home-why p {
  margin-top: 0.5rem;
  color: #5b6b73;
  font-size: 0.98rem;
  line-height: 1.6;
}

/* Pricing */
.home-pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.home-cta-light {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 2rem;
  padding: 0.85rem 1.4rem;
  border-radius: 9999px;
  background: #f0fdfa;
  color: #115e59;
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, background 0.2s ease;
}

.home-cta-light:hover {
  background: #fff;
  transform: translateY(-1px);
}

/* Align nested FAQ / FinalCta to home gutters */
.home-page :deep(.mkt-section) {
  padding: 0;
  animation: none;
}

.home-page :deep(.mkt-h2) {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.036em;
  max-width: min(20ch, 100%);
  text-align: left;
}

.home-page :deep(.mkt-final-cta.mkt-band) {
  width: 100%;
  margin-left: 0;
  margin-top: 0;
  padding: clamp(4.5rem, 10vw, 7.5rem) 0;
}

.home-page :deep(.mkt-final-cta.mkt-band--ink) {
  background:
    radial-gradient(ellipse 50% 60% at 10% 80%, rgba(15, 118, 110, 0.35), transparent 60%),
    linear-gradient(160deg, #0b1220 0%, #12202a 100%);
  color: #f8fafc;
}

.home-page :deep(.mkt-band-inner) {
  max-width: 1120px;
  margin: 0 auto;
  width: 100%;
  padding-inline: 1.25rem;
  box-sizing: border-box;
  text-align: left;
}

.home-page :deep(.mkt-final-cta .mkt-h2) {
  font-size: clamp(2.35rem, 5.2vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  max-width: min(14ch, 100%);
  line-height: 1.06;
  color: #f8fafc;
}

.home-page :deep(.mkt-final-cta .mkt-body) {
  font-size: clamp(1.05rem, 1.4vw, 1.2rem);
  max-width: 36rem;
  color: rgba(248, 250, 252, 0.78);
}

@media (prefers-reduced-motion: reduce) {
  .home-showcase,
  .home-showcase-go,
  .home-cta-light {
    transition: none;
  }
}
</style>
