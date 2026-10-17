<script setup lang="ts">
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { helpPage, helpSeo } from '@/content/marketing/help'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(helpSeo)
</script>

<template>
  <div>
    <MarketingHero eyebrow="Help" :title="helpPage.h1" :body="helpPage.intro" wide />
    <p class="mkt-note">{{ helpPage.note }}</p>

    <section class="mkt-section">
      <h2 class="mkt-h2">Help Categories</h2>
      <div class="mkt-section-content">
        <ul class="mkt-help-list">
          <li v-for="cat in helpPage.categories" :key="cat.title" class="mkt-help-item">
            <h3>{{ cat.title }}</h3>
            <p>{{ cat.body }}</p>
          </li>
        </ul>
      </div>
    </section>

    <p class="mkt-note">
      Still stuck?
      <RouterLink to="/contact/?topic=support" class="underline">Contact support</RouterLink>.
    </p>
  </div>
</template>
