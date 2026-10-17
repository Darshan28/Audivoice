<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import FaqAccordion from '@/components/marketing/FaqAccordion.vue'
import FinalCta from '@/components/marketing/FinalCta.vue'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { getFeatureBySlug } from '@/content/marketing/features'
import { startForFreeTo } from '@/content/marketing/site'
import { usePageSeo } from '@/composables/usePageSeo'

const props = defineProps<{ slug?: string }>()
const route = useRoute()
const page = computed(() =>
  getFeatureBySlug(props.slug || String(route.params.slug || '')),
)

watchEffect(() => {
  if (page.value) {
    usePageSeo({
      title: page.value.title,
      description: page.value.description,
      path: page.value.path,
    })
  }
})
</script>

<template>
  <div v-if="page">
    <MarketingHero eyebrow="Feature" :title="page.h1" :body="page.intro" wide />

    <section class="mkt-band mkt-band--soft">
      <div class="mkt-band-inner">
        <h2 class="mkt-h2">{{ page.waysTitle }}</h2>
        <div class="mkt-section-content">
          <ul class="mkt-check-list">
            <li v-for="(way, i) in page.ways" :key="i">{{ way }}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mkt-section">
      <h2 class="mkt-h2">{{ page.howTitle }}</h2>
      <div class="mkt-section-content">
        <div class="mkt-timeline">
          <div v-for="(step, i) in page.how" :key="i" class="mkt-timeline-step">
            <h3>Step {{ i + 1 }}</h3>
            <p>{{ step }}</p>
          </div>
        </div>
      </div>
    </section>

    <FaqAccordion title="FAQs" :items="page.faqs" />
    <FinalCta title="Start collecting responses." label="Get started" :to="startForFreeTo" />
  </div>
  <div v-else class="mkt-section">
    <h1 class="mkt-h1">Feature not found</h1>
    <RouterLink class="btn-secondary" to="/features/">Back to Features</RouterLink>
  </div>
</template>
