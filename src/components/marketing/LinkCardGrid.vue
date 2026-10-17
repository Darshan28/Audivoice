<script setup lang="ts">
defineProps<{
  items: { title: string; body: string; to: string }[]
}>()
</script>

<template>
  <div class="mkt-card-grid">
    <RouterLink v-for="item in items" :key="item.to" :to="item.to" class="mkt-link-card">
      <h3>{{ item.title }}</h3>
      <p>{{ item.body }}</p>
      <span class="mkt-link-card-arrow" aria-hidden="true">→</span>
    </RouterLink>
  </div>
</template>
