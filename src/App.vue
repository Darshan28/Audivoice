<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

const PRIVATE_PREFIXES = ['/app', '/participant', '/auth', '/demo', '/onboarding', '/join']

const route = useRoute()

function isPrivatePath(path: string) {
  return PRIVATE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

useHead({
  meta: () =>
    isPrivatePath(route.path) ? [{ name: 'robots', content: 'noindex' }] : [],
})
</script>

<template>
  <RouterView />
</template>
