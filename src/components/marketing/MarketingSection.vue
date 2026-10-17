<script setup lang="ts">
defineProps<{
  title: string
  body?: string
  closer?: string
  id?: string
}>()
</script>

<template>
  <section class="mkt-section" :id="id">
    <h2 class="mkt-h2">{{ title }}</h2>
    <p v-if="body" class="mkt-body">{{ body }}</p>
    <p v-if="closer" class="mkt-body mkt-body--tight">{{ closer }}</p>
    <div v-if="$slots.default" class="mkt-section-content">
      <slot />
    </div>
  </section>
</template>
