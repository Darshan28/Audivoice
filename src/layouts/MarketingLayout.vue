<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MarketingNav from '@/components/marketing/MarketingNav.vue'
import { footerColumns, SITE_NAME, SITE_TAGLINE } from '@/content/marketing/site'

const route = useRoute()
/** Home owns its own above-the-fold chrome (original landing composition). */
const isHome = computed(() => route.name === 'landing')
</script>

<template>
  <div class="mkt" :class="{ 'mkt--home': isHome }">
    <div v-if="!isHome" class="mkt-bg" aria-hidden="true">
      <div class="mkt-orb mkt-orb--a" />
      <div class="mkt-orb mkt-orb--b" />
    </div>

    <div v-if="!isHome" class="mkt-nav-wrap">
      <MarketingNav />
    </div>

    <main class="mkt-main" :class="{ 'mkt-main--home': isHome }">
      <RouterView />
    </main>

    <footer class="mkt-footer">
      <div class="mkt-footer-shell">
        <div class="mkt-footer-top">
          <div class="mkt-footer-brand">
            <img src="/logo.svg" alt="Audivoice" class="mkt-footer-logo" width="140" height="29" />
            <p class="mkt-footer-tag">{{ SITE_TAGLINE }}</p>
          </div>
          <div class="mkt-footer-cols">
            <div v-for="col in footerColumns" :key="col.title" class="mkt-footer-col">
              <p class="mkt-footer-col-title">{{ col.title }}</p>
              <RouterLink v-for="link in col.links" :key="link.to" :to="link.to" class="mkt-footer-link">
                {{ link.label }}
              </RouterLink>
            </div>
          </div>
        </div>
        <p class="mkt-footer-copy">© {{ new Date().getFullYear() }} {{ SITE_NAME }}. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
.mkt {
  --mkt-ink: #0b1220;
  --mkt-muted: #5b6b73;
  --mkt-teal: #0F766E;
  --mkt-teal-deep: #115E59;
  --mkt-line: #CCE8E3;
  position: relative;
  min-height: 100vh;
  color: var(--mkt-ink);
  background: #f5f8f7;
  overflow-x: hidden;
}

.mkt-bg {
  pointer-events: none;
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.mkt-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(48px);
  opacity: 0.55;
}

.mkt-orb--a {
  width: 42vw;
  height: 42vw;
  max-width: 520px;
  max-height: 520px;
  top: -8%;
  right: -6%;
  background: radial-gradient(circle, rgba(15, 118, 110, 0.35), transparent 70%);
}

.mkt-orb--b {
  width: 36vw;
  height: 36vw;
  max-width: 420px;
  max-height: 420px;
  top: 18%;
  left: -10%;
  background: radial-gradient(circle, rgba(52, 211, 153, 0.28), transparent 70%);
}

.mkt-nav-wrap,
.mkt-main,
.mkt-footer {
  position: relative;
  z-index: 1;
}

.mkt-main {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 1.25rem 4rem;
}

.mkt--home {
  background: #f5f8f7;
}

.mkt-main--home {
  max-width: none;
  margin: 0;
  padding: 0 0 4rem;
}

.mkt-footer {
  border-top: 1px solid var(--mkt-line);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(8px);
  padding: 2.5rem 0 1.5rem;
}

.mkt-footer-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding-inline: 1.25rem;
  box-sizing: border-box;
  width: 100%;
}

.mkt-footer-top {
  display: grid;
  gap: 2rem;
}

.mkt-footer-logo {
  display: block;
  height: 1.5rem;
  width: auto;
  object-fit: contain;
}

.mkt-footer-tag {
  margin-top: 0.35rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
}

.mkt-footer-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.mkt-footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.mkt-footer-col-title {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--mkt-muted);
  margin-bottom: 0.25rem;
}

.mkt-footer-link {
  color: var(--mkt-ink);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 400;
}

.mkt-footer-link:hover {
  color: var(--mkt-teal-deep);
}

.mkt-footer-copy {
  margin: 2rem 0 0;
  padding-top: 1.25rem;
  border-top: 1px solid var(--mkt-line);
  color: var(--mkt-muted);
  font-size: 0.85rem;
}

/* —— Full-bleed bands —— */
.mkt-band {
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: 4rem 1.25rem;
  animation: mkt-fade-up 0.7s ease-out both;
}

.mkt-band-inner {
  max-width: 1120px;
  margin: 0 auto;
}

.mkt-band--soft {
  background:
    radial-gradient(ellipse 50% 60% at 20% 40%, rgba(52, 211, 153, 0.12), transparent 70%),
    radial-gradient(ellipse 40% 50% at 90% 20%, rgba(15, 118, 110, 0.08), transparent 65%),
    linear-gradient(180deg, #eef6f4 0%, #f5f8f7 100%);
}

.mkt-band--teal {
  background:
    radial-gradient(ellipse 60% 70% at 80% 30%, rgba(20, 184, 166, 0.22), transparent 65%),
    linear-gradient(135deg, #0f766e 0%, #115e59 55%, #0d4f4a 100%);
  color: #f0fdfa;
}

.mkt-band--teal .mkt-h2,
.mkt-band--teal .mkt-body {
  color: inherit;
  max-width: 36rem;
}

.mkt-band--teal .mkt-body {
  color: rgba(240, 253, 250, 0.82);
}

.mkt-band--ink {
  background:
    radial-gradient(ellipse 50% 60% at 10% 80%, rgba(15, 118, 110, 0.35), transparent 60%),
    linear-gradient(160deg, #0b1220 0%, #12202a 100%);
  color: #f8fafc;
}

.mkt-band--ink .mkt-h2,
.mkt-band--ink .mkt-body {
  color: inherit;
}

.mkt-band--ink .mkt-body {
  color: rgba(248, 250, 252, 0.75);
}

.mkt-band--statement {
  text-align: center;
  padding: 5rem 1.25rem;
}

.mkt-band--statement .mkt-h2 {
  max-width: 28rem;
  margin: 0 auto;
  font-size: clamp(1.75rem, 3.5vw, 2.4rem);
  line-height: 1.2;
}

.mkt-band--statement .mkt-body {
  max-width: 34rem;
  margin-left: auto;
  margin-right: auto;
}

/* —— Hero —— */
.mkt-hero {
  position: relative;
  padding: 2.75rem 0 2.25rem;
  max-width: 42rem;
  animation: mkt-fade-up 0.7s ease-out both;
}

.mkt-hero--wide {
  max-width: 48rem;
}

.mkt-hero-accent {
  display: block;
  width: 3rem;
  height: 3px;
  margin-bottom: 1.25rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, var(--mkt-teal), #34d399);
}

.mkt-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--mkt-teal-deep);
  margin-bottom: 1rem;
}

.mkt-h1 {
  font-size: clamp(2rem, 4.5vw, 3.1rem);
  line-height: 1.1;
  letter-spacing: -0.035em;
  font-weight: 700;
}

.mkt-subhead {
  margin-top: 1rem;
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--mkt-ink);
}

.mkt-lede,
.mkt-body {
  margin-top: 1rem;
  color: var(--mkt-muted);
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.7;
  max-width: 40rem;
}

.mkt-body--tight {
  margin-top: 0.65rem;
}

.mkt-pullquote {
  margin: 2.5rem 0 0;
  padding: 1.5rem 0 0;
  border-top: 1px solid var(--mkt-line);
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.3;
  color: var(--mkt-teal-deep);
  max-width: 28rem;
}

.mkt-cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.mkt-section {
  padding: 2.75rem 0 0.5rem;
  animation: mkt-fade-up 0.7s ease-out both;
}

.mkt-h2 {
  font-size: clamp(1.45rem, 2.8vw, 1.85rem);
  letter-spacing: -0.03em;
  font-weight: 600;
  max-width: 36rem;
}

.mkt-section-content {
  margin-top: 1.5rem;
}

.mkt-section-head {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

/* —— Editorial numbered links (home use cases) —— */
.mkt-editorial-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--mkt-line);
}

.mkt-editorial-list > li {
  border-bottom: 1px solid var(--mkt-line);
}

.mkt-editorial-link {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  gap: 1rem;
  align-items: baseline;
  padding: 1.35rem 0.15rem;
  text-decoration: none;
  color: inherit;
  transition: color 0.15s ease;
}

.mkt-editorial-link:hover {
  color: var(--mkt-teal-deep);
}

.mkt-editorial-num {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--mkt-teal);
  font-variant-numeric: tabular-nums;
}

.mkt-editorial-link h3 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mkt-editorial-link p {
  margin-top: 0.35rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.55;
  max-width: 36rem;
}

.mkt-editorial-arrow {
  color: var(--mkt-teal);
  font-size: 1.1rem;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.mkt-editorial-link:hover .mkt-editorial-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* —— Horizontal timeline —— */
.mkt-timeline {
  display: grid;
  gap: 2rem;
  counter-reset: timeline;
  margin-top: 0.5rem;
}

.mkt-timeline-step {
  position: relative;
  padding-left: 3.25rem;
}

.mkt-timeline-step::before {
  counter-increment: timeline;
  content: counter(timeline);
  position: absolute;
  left: 0;
  top: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  background: var(--mkt-teal);
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  z-index: 1;
}

.mkt-timeline-step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 1.05rem;
  top: 2.25rem;
  bottom: -2rem;
  width: 1px;
  background: linear-gradient(180deg, var(--mkt-teal), var(--mkt-line));
}

.mkt-timeline-step h3 {
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
}

.mkt-timeline-step p {
  margin-top: 0.4rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 28rem;
}

@media (min-width: 900px) {
  .mkt-timeline {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 1.5rem;
  }

  .mkt-timeline-step {
    padding-left: 0;
    padding-top: 3.5rem;
  }

  .mkt-timeline-step::before {
    left: 0;
    top: 0;
  }

  .mkt-timeline-step:not(:last-child)::after {
    left: 2.25rem;
    right: -1.5rem;
    top: 1.05rem;
    bottom: auto;
    width: auto;
    height: 1px;
    background: linear-gradient(90deg, var(--mkt-teal), var(--mkt-line));
  }
}

/* —— Benefit stack (home why) —— */
.mkt-benefits {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0;
}

.mkt-benefit {
  display: grid;
  grid-template-columns: 2.5rem 1fr;
  gap: 1rem;
  padding: 1.35rem 0;
  border-bottom: 1px solid var(--mkt-line);
}

.mkt-benefit:first-child {
  border-top: 1px solid var(--mkt-line);
}

.mkt-benefit-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: grid;
  place-items: center;
  background: rgba(15, 118, 110, 0.1);
  color: var(--mkt-teal-deep);
  flex-shrink: 0;
}

.mkt-benefit h3 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mkt-benefit p {
  margin-top: 0.35rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.6;
  max-width: 40rem;
}

@media (min-width: 800px) {
  .mkt-benefits {
    grid-template-columns: 1fr 1fr;
    gap: 0 2.5rem;
  }

  .mkt-benefit:nth-child(1),
  .mkt-benefit:nth-child(2) {
    border-top: 1px solid var(--mkt-line);
  }
}

/* —— Feature index rows —— */
.mkt-feature-rows {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--mkt-line);
}

.mkt-feature-row {
  display: grid;
  grid-template-columns: 2.75rem 1fr auto;
  gap: 1.15rem;
  align-items: center;
  padding: 1.4rem 0.1rem;
  border-bottom: 1px solid var(--mkt-line);
  text-decoration: none;
  color: inherit;
  transition: background 0.15s ease;
}

.mkt-feature-row:hover {
  background: rgba(15, 118, 110, 0.04);
}

.mkt-feature-row-icon {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.85rem;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, rgba(15, 118, 110, 0.14), rgba(52, 211, 153, 0.1));
  color: var(--mkt-teal-deep);
}

.mkt-feature-row h3 {
  font-size: 1.15rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mkt-feature-row p {
  margin-top: 0.3rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.mkt-feature-row-arrow {
  color: var(--mkt-teal);
  font-size: 1.15rem;
  font-weight: 500;
}

/* —— Use-case large title list —— */
.mkt-usecase-list {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--mkt-line);
}

.mkt-usecase-link {
  display: block;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--mkt-line);
  text-decoration: none;
  color: inherit;
}

.mkt-usecase-link h3 {
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 600;
  letter-spacing: -0.03em;
  transition: color 0.15s ease;
}

.mkt-usecase-link:hover h3 {
  color: var(--mkt-teal-deep);
}

.mkt-usecase-link p {
  margin-top: 0.5rem;
  color: var(--mkt-muted);
  font-size: 1rem;
  line-height: 1.6;
  max-width: 36rem;
}

.mkt-usecase-link .mkt-usecase-go {
  display: inline-block;
  margin-top: 0.65rem;
  color: var(--mkt-teal-deep);
  font-size: 0.9rem;
  font-weight: 500;
}

/* —— Article list —— */
.mkt-article-list {
  display: grid;
  gap: 0;
  border-top: 1px solid var(--mkt-line);
}

.mkt-article-link {
  display: grid;
  gap: 0.35rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--mkt-line);
  text-decoration: none;
  color: inherit;
}

.mkt-article-link:hover h3 {
  color: var(--mkt-teal-deep);
}

.mkt-article-link h3 {
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: color 0.15s ease;
}

.mkt-article-link p {
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.55;
  max-width: 40rem;
}

/* —— Checklist / open ways —— */
.mkt-check-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
  max-width: 40rem;
}

.mkt-check-list li {
  position: relative;
  padding-left: 1.85rem;
  color: var(--mkt-muted);
  font-size: 1.05rem;
  line-height: 1.55;
}

.mkt-check-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45rem;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 0.2rem;
  border: 2px solid var(--mkt-teal);
  background: rgba(15, 118, 110, 0.08);
}

.mkt-list {
  margin: 0;
  padding-left: 1.15rem;
  color: var(--mkt-muted);
  line-height: 1.7;
}

.mkt-list li + li {
  margin-top: 0.35rem;
}

/* —— Help category list —— */
.mkt-help-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--mkt-line);
}

.mkt-help-item {
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--mkt-line);
}

.mkt-help-item h3 {
  font-size: 1.05rem;
  font-weight: 600;
}

.mkt-help-item p {
  margin-top: 0.35rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.55;
  max-width: 40rem;
}

/* —— Legacy card grid (kept for rare use) —— */
.mkt-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.mkt-link-card {
  display: block;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid var(--mkt-line);
  border-radius: 1.25rem;
  padding: 1.25rem 1.2rem 1.35rem;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.mkt-link-card:hover {
  transform: translateY(-2px);
  border-color: #A8D5CC;
  box-shadow: 0 14px 36px rgba(15, 39, 42, 0.07);
}

.mkt-link-card h3 {
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mkt-link-card p {
  margin-top: 0.55rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.6;
}

.mkt-link-card-arrow {
  display: inline-block;
  margin-top: 0.85rem;
  color: var(--mkt-teal-deep);
  font-weight: 500;
}

/* —— FAQ divider style —— */
.mkt-faq {
  display: grid;
  gap: 0;
  margin-top: 1.5rem;
  border-top: 1px solid var(--mkt-line);
}

.mkt-faq-item {
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--mkt-line);
  border-radius: 0;
  padding: 1rem 0;
}

.mkt-faq-item summary {
  cursor: pointer;
  font-weight: 500;
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.mkt-faq-item summary::-webkit-details-marker {
  display: none;
}

.mkt-faq-item summary::after {
  content: '+';
  color: var(--mkt-teal);
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1;
}

.mkt-faq-item[open] summary::after {
  content: '−';
}

.mkt-faq-item p {
  margin-top: 0.75rem;
  color: var(--mkt-muted);
  line-height: 1.6;
  font-size: 0.95rem;
  max-width: 40rem;
}

/* —— Final CTA —— */
.mkt-final-cta {
  margin-top: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  text-align: left;
}

.mkt-final-cta.mkt-band {
  margin-top: 3rem;
}

.mkt-final-cta.mkt-band--ink {
  background:
    radial-gradient(ellipse 50% 60% at 10% 80%, rgba(15, 118, 110, 0.35), transparent 60%),
    linear-gradient(160deg, #0b1220 0%, #12202a 100%);
  color: #f8fafc;
}

.mkt-final-cta.mkt-band--teal {
  background:
    radial-gradient(ellipse 55% 70% at 85% 25%, rgba(52, 211, 153, 0.28), transparent 60%),
    linear-gradient(145deg, #0f766e 0%, #115e59 50%, #0d4f4a 100%);
  color: #f0fdfa;
}

.mkt-final-cta .btn-primary {
  margin-top: 1.5rem;
}

.mkt-band--ink .btn-primary {
  background: #f0fdfa;
  color: var(--mkt-teal-deep);
}

.mkt-band--ink .btn-primary:hover {
  background: white;
}

.mkt-band--teal .btn-primary {
  background: #f0fdfa;
  color: var(--mkt-teal-deep);
}

.mkt-band--teal .btn-primary:hover {
  background: white;
}

/* —— Pricing —— */
.mkt-pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
  align-items: stretch;
}

.mkt-price-card {
  background: transparent;
  border: 1px solid var(--mkt-line);
  border-radius: 0;
  padding: 1.75rem 1.35rem 1.65rem;
  display: flex;
  flex-direction: column;
}

.mkt-price-card--featured {
  background: linear-gradient(160deg, rgba(15, 118, 110, 0.08), rgba(52, 211, 153, 0.06));
  border-color: var(--mkt-teal);
  border-width: 2px;
}

.mkt-price-card--featured .mkt-price-badge {
  display: inline-block;
  margin-bottom: 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--mkt-teal-deep);
}

.mkt-price-card h3 {
  font-size: 1.35rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mkt-price-card .blurb {
  margin-top: 0.35rem;
  font-weight: 500;
  color: var(--mkt-ink);
}

.mkt-price-card .body {
  margin: 0.85rem 0 1.35rem;
  color: var(--mkt-muted);
  font-size: 0.95rem;
  line-height: 1.55;
  flex: 1;
}

.mkt-form {
  display: grid;
  gap: 1rem;
  max-width: 36rem;
}

.mkt-contact-layout {
  display: grid;
  gap: 2.5rem;
  margin-top: 0.5rem;
}

@media (min-width: 880px) {
  .mkt-contact-layout {
    grid-template-columns: 1fr 1.15fr;
    gap: 3.5rem;
    align-items: start;
  }
}

.mkt-contact-aside {
  padding-top: 0.25rem;
}

.mkt-contact-aside .mkt-body {
  margin-top: 0;
}

.mkt-note {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--mkt-muted);
  line-height: 1.55;
}

.mkt-legal-section + .mkt-legal-section {
  margin-top: 1.75rem;
}

.mkt-legal-section h2 {
  font-size: 1.15rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.mkt-prose {
  max-width: 38rem;
}

.mkt-prose .mkt-body + .mkt-body {
  margin-top: 1.15rem;
}

@keyframes mkt-fade-up {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .mkt-editorial-link {
    grid-template-columns: 2.5rem 1fr;
  }

  .mkt-editorial-arrow {
    display: none;
  }
}

@media (min-width: 800px) {
  .mkt-footer-top {
    grid-template-columns: 1.1fr 2fr;
  }

  .mkt-footer-cols {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (prefers-reduced-motion: reduce) {
  .mkt-hero,
  .mkt-section,
  .mkt-band,
  .mkt-link-card {
    animation: none;
    transition: none;
  }
}
</style>
