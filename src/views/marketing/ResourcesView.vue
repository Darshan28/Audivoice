<script setup lang="ts">
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { articles, resourcesPage, resourcesSeo } from '@/content/marketing/resources'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(resourcesSeo)
</script>

<template>
  <div>
    <MarketingHero
      eyebrow="Resources"
      :title="resourcesPage.h1"
      :body="resourcesPage.intro"
      wide
    />

    <section class="mkt-section">
      <h2 class="mkt-h2">Recommended Articles</h2>
      <div class="mkt-section-content">
        <div class="mkt-article-list">
          <RouterLink
            v-for="article in articles"
            :key="article.path"
            :to="article.path"
            class="mkt-article-link"
          >
            <h3>{{ article.h1 }}</h3>
            <p>{{ article.intro }}</p>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
