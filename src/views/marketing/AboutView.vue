<script setup lang="ts">
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { aboutPage, aboutSeo } from '@/content/marketing/about'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(aboutSeo)
</script>

<template>
  <div>
    <MarketingHero eyebrow="About" :title="aboutPage.h1" :body="aboutPage.paragraphs[0]" wide />

    <section class="mkt-section mkt-prose">
      <p v-for="(p, i) in aboutPage.paragraphs.slice(1)" :key="i" class="mkt-body">{{ p }}</p>
      <p class="mkt-pullquote">{{ aboutPage.tagline }}</p>
    </section>
  </div>
</template>
