<script setup lang="ts">
import type { FaqItem } from '@/content/marketing/types'

defineProps<{ items: FaqItem[]; title?: string }>()
</script>

<template>
  <section class="mkt-section">
    <h2 v-if="title" class="mkt-h2">{{ title }}</h2>
    <div class="mkt-faq">
      <details v-for="(item, i) in items" :key="i" class="mkt-faq-item">
        <summary>{{ item.question }}</summary>
        <p>{{ item.answer }}</p>
      </details>
    </div>
  </section>
</template>
