<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    size?: 'sm' | 'md'
    /** Icon-only mark (no wordmark). */
    markOnly?: boolean
  }>(),
  { to: '/', size: 'md', markOnly: false },
)
</script>

<template>
  <RouterLink
    :to="to"
    class="brand-mark"
    :class="[
      size === 'sm' ? 'brand-mark--sm' : 'brand-mark--md',
      markOnly ? 'brand-mark--mark' : 'brand-mark--logo',
    ]"
  >
    <img
      v-if="markOnly"
      src="/logo-mark.svg"
      alt="Audivoice"
      class="brand-mark-img brand-mark-img--mark"
      width="36"
      height="36"
    />
    <img
      v-else
      src="/logo.svg"
      alt="Audivoice"
      class="brand-mark-img brand-mark-img--logo"
      width="160"
      height="33"
    />
  </RouterLink>
</template>
