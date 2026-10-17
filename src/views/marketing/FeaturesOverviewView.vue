<script setup lang="ts">
import FinalCta from '@/components/marketing/FinalCta.vue'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { featureCards, featuresOverview, featuresOverviewSeo } from '@/content/marketing/features'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(featuresOverviewSeo)

const icons = [
  // poll bars
  'bars',
  // q&a chat
  'chat',
  // quiz check
  'check',
  // survey list
  'list',
  // rating star
  'star',
] as const
</script>

<template>
  <div>
    <MarketingHero
      eyebrow="Features"
      :title="featuresOverview.h1"
      :body="featuresOverview.intro"
      :primary-label="featuresOverview.cta.label"
      :primary-to="featuresOverview.cta.to"
      wide
    />

    <section class="mkt-section">
      <div class="mkt-feature-rows">
        <RouterLink
          v-for="(item, i) in featureCards"
          :key="item.to"
          :to="item.to"
          class="mkt-feature-row"
        >
          <span class="mkt-feature-row-icon" aria-hidden="true">
            <svg v-if="icons[i] === 'bars'" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 18V11M11 18V7M17 18V13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
            <svg v-else-if="icons[i] === 'chat'" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-4 3.5V6.5Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="icons[i] === 'check'" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="1.75" />
              <path d="M8 12.5 10.5 15 16 9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else-if="icons[i] === 'list'" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M8 7h12M8 12h12M8 17h8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
              <circle cx="4.5" cy="7" r="1" fill="currentColor" />
              <circle cx="4.5" cy="12" r="1" fill="currentColor" />
              <circle cx="4.5" cy="17" r="1" fill="currentColor" />
            </svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="m12 4 2.2 4.5 5 .7-3.6 3.5.9 5L12 15.4 7.5 17.7l.9-5L4.8 9.2l5-.7L12 4Z" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" />
            </svg>
          </span>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
          </div>
          <span class="mkt-feature-row-arrow" aria-hidden="true">→</span>
        </RouterLink>
      </div>
    </section>

    <FinalCta
      title="Ready to collect better feedback?"
      body="Create a session and invite people to participate."
      :label="featuresOverview.cta.label"
      :to="featuresOverview.cta.to"
    />
  </div>
</template>
