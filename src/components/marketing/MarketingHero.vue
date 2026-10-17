<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subhead?: string
  body?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  wide?: boolean
}>()
</script>

<template>
  <section class="mkt-hero" :class="{ 'mkt-hero--wide': wide }">
    <span class="mkt-hero-accent" aria-hidden="true" />
    <p v-if="eyebrow" class="mkt-eyebrow">{{ eyebrow }}</p>
    <h1 class="mkt-h1">{{ title }}</h1>
    <p v-if="subhead" class="mkt-subhead">{{ subhead }}</p>
    <p v-if="body" class="mkt-lede">{{ body }}</p>
    <div v-if="primaryLabel || secondaryLabel" class="mkt-cta-row">
      <RouterLink v-if="primaryLabel && primaryTo" class="btn-primary" :to="primaryTo">
        {{ primaryLabel }} <span aria-hidden="true">→</span>
      </RouterLink>
      <RouterLink
        v-if="secondaryLabel && secondaryTo"
        class="btn-secondary"
        :to="secondaryTo"
      >
        {{ secondaryLabel }}
      </RouterLink>
    </div>
  </section>
</template>
