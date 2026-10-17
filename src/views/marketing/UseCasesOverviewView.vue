<script setup lang="ts">
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { useCaseCards, useCasesOverview, useCasesOverviewSeo } from '@/content/marketing/useCases'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(useCasesOverviewSeo)

const items = useCaseCards.map((c) => ({
  title: c.shortTitle,
  body: c.body,
  to: c.to,
}))
</script>

<template>
  <div>
    <MarketingHero
      eyebrow="Use cases"
      :title="useCasesOverview.h1"
      :body="useCasesOverview.intro"
      wide
    />

    <section class="mkt-section">
      <div class="mkt-usecase-list">
        <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="mkt-usecase-link">
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
          <span class="mkt-usecase-go">Explore <span aria-hidden="true">→</span></span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
