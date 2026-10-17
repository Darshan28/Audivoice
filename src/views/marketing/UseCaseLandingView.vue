<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import FinalCta from '@/components/marketing/FinalCta.vue'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { startForFreeTo } from '@/content/marketing/site'
import { getUseCaseBySlug } from '@/content/marketing/useCases'
import { usePageSeo } from '@/composables/usePageSeo'

const route = useRoute()
const page = computed(() => getUseCaseBySlug(String(route.params.slug || '')))

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
    <MarketingHero eyebrow="Use case" :title="page.h1" :body="page.intro" wide />

    <section class="mkt-section">
      <h2 class="mkt-h2">{{ page.waysTitle }}</h2>
      <div class="mkt-section-content">
        <ul class="mkt-check-list">
          <li v-for="(way, i) in page.ways" :key="i">{{ way }}</li>
        </ul>
      </div>
    </section>

    <section v-if="page.whyTitle && page.whyBody" class="mkt-band mkt-band--soft">
      <div class="mkt-band-inner">
        <h2 class="mkt-h2">{{ page.whyTitle }}</h2>
        <p class="mkt-body">{{ page.whyBody }}</p>
      </div>
    </section>

    <FinalCta title="Start your next session." label="Get started" :to="startForFreeTo" variant="teal" />
  </div>
  <div v-else class="mkt-section">
    <h1 class="mkt-h1">Use case not found</h1>
    <RouterLink class="btn-secondary" to="/use-cases/">Back to Use Cases</RouterLink>
  </div>
</template>
