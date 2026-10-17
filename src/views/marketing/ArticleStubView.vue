<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import FinalCta from '@/components/marketing/FinalCta.vue'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { startForFreeTo } from '@/content/marketing/site'
import { getArticleBySlug } from '@/content/marketing/blogs'
import { usePageSeo } from '@/composables/usePageSeo'

const route = useRoute()
const page = computed(() => getArticleBySlug(String(route.params.slug || '')))

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
    <MarketingHero eyebrow="Blog" :title="page.h1" :body="page.intro" wide />

    <section class="mkt-section mkt-prose">
      <h2 class="mkt-h2">{{ page.richer ? 'A practical approach' : 'Key points' }}</h2>
      <div class="mkt-section-content">
        <ul class="mkt-check-list">
          <li v-for="(item, i) in page.outline" :key="i">{{ item }}</li>
        </ul>
      </div>
      <p class="mkt-note">
        This is a practical outline. Full guidance will expand over time.
        <RouterLink to="/blogs/" class="underline">Browse more articles</RouterLink>.
      </p>
    </section>

    <FinalCta
      v-if="page.richer"
      title="Ready to make your next review interactive?"
      body="Invite reviewers to respond with live polls, Q&A, surveys, and ratings."
      label="Get started"
      :to="startForFreeTo"
    />
  </div>
  <div v-else class="mkt-section">
    <h1 class="mkt-h1">Article not found</h1>
    <RouterLink class="btn-secondary" to="/blogs/">Back to Blogs</RouterLink>
  </div>
</template>
