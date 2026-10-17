<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { getLegalBySlug } from '@/content/marketing/legal'
import { usePageSeo } from '@/composables/usePageSeo'

const props = defineProps<{ slug?: string }>()
const route = useRoute()
const page = computed(() => getLegalBySlug(props.slug || String(route.params.slug || '')))

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
    <MarketingHero eyebrow="Legal" :title="page.h1" :body="page.updatedNote" />
    <section class="mkt-section mkt-prose">
      <article v-for="section in page.sections" :key="section.title" class="mkt-legal-section">
        <h2>{{ section.title }}</h2>
        <p class="mkt-body">{{ section.body }}</p>
      </article>
    </section>
  </div>
  <div v-else class="mkt-section">
    <h1 class="mkt-h1">Page not found</h1>
    <RouterLink class="btn-secondary" to="/">Back home</RouterLink>
  </div>
</template>
