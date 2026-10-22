<script setup lang="ts">
import ContactForm from '@/components/marketing/ContactForm.vue'
import MarketingHero from '@/components/marketing/MarketingHero.vue'
import { contactPage, contactSeo } from '@/content/marketing/contact'
import { usePageSeo } from '@/composables/usePageSeo'

usePageSeo(contactSeo)
</script>

<template>
  <div class="mkt-contact-layout">
    <div>
      <MarketingHero eyebrow="Contact" :title="contactPage.h1" wide />
      <aside class="mkt-contact-aside">
        <p class="mkt-body">{{ contactPage.intro }}</p>
        <p class="mkt-note">
          Prefer email?
          <a class="underline" :href="`mailto:${contactPage.mailto}`">{{ contactPage.mailto }}</a>
        </p>
      </aside>
    </div>
    <section class="mkt-contact-form">
      <ContactForm />
    </section>
  </div>
</template>
