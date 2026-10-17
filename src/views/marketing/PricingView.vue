<script setup lang="ts">
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { pricingPage, pricingSeo } from '@/content/marketing/pricing'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(pricingSeo)
</script>

<template>
  <div>
    <MarketingHero eyebrow="Pricing" :title="pricingPage.h1" :body="pricingPage.intro" wide />
    <p class="mkt-note">{{ pricingPage.note }}</p>

    <section class="mkt-section">
      <div class="mkt-pricing-grid">
        <article
          v-for="(plan, i) in pricingPage.plans"
          :key="plan.name"
          class="mkt-price-card"
          :class="{ 'mkt-price-card--featured': i === 1 }"
        >
          <span v-if="i === 1" class="mkt-price-badge">Most popular</span>
          <h3>{{ plan.name }}</h3>
          <p class="blurb">{{ plan.blurb }}</p>
          <p class="body">{{ plan.body }}</p>
          <RouterLink
            :class="i === 1 ? 'btn-primary' : 'btn-secondary'"
            :to="plan.cta.to"
          >
            {{ plan.cta.label }}
          </RouterLink>
        </article>
      </div>
    </section>
  </div>
</template>
