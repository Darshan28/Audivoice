<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    body?: string
    label: string
    to: string
    variant?: 'ink' | 'teal'
  }>(),
  { variant: 'ink' },
)
</script>

<template>
  <section class="mkt-final-cta mkt-band" :class="variant === 'teal' ? 'mkt-band--teal' : 'mkt-band--ink'">
    <div class="mkt-band-inner">
      <h2 class="mkt-h2">{{ title }}</h2>
      <p v-if="body" class="mkt-body">{{ body }}</p>
      <RouterLink class="btn-primary" :to="to">
        {{ label }} <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </section>
</template>
