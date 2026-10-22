<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import { contactPage } from '@/content/marketing/contact'
import { api, ApiClientError } from '@/services/api'

const route = useRoute()
const topicQuery = typeof route.query.topic === 'string' ? route.query.topic : ''
const topicMap: Record<string, string> = {
  product: 'Product Question',
  business: 'Business Enquiry',
  support: 'Account Support',
  feedback: 'Feedback',
}

const fullName = ref('')
const email = ref('')
const enquiryType = ref(topicMap[topicQuery] || contactPage.enquiryTypes[0])
const subject = ref('')
const message = ref('')
const privacyAck = ref(false)
const error = ref<string | null>(null)
const sent = ref(false)
const submitting = ref(false)
const enquiryOpen = ref(false)
const enquiryRoot = ref<HTMLElement | null>(null)
const enquiryTrigger = ref<HTMLButtonElement | null>(null)
const enquiryActive = ref(0)

function syncEnquiryActive() {
  const index = contactPage.enquiryTypes.indexOf(
    enquiryType.value as (typeof contactPage.enquiryTypes)[number],
  )
  enquiryActive.value = index < 0 ? 0 : index
}

function toggleEnquiry() {
  enquiryOpen.value = !enquiryOpen.value
  if (enquiryOpen.value) syncEnquiryActive()
}

function chooseEnquiry(value: string) {
  enquiryType.value = value
  enquiryOpen.value = false
  enquiryTrigger.value?.focus()
}

function onEnquiryPointerDown(event: PointerEvent) {
  if (!enquiryRoot.value?.contains(event.target as Node)) enquiryOpen.value = false
}

watch(enquiryOpen, (isOpen) => {
  if (isOpen) document.addEventListener('pointerdown', onEnquiryPointerDown)
  else document.removeEventListener('pointerdown', onEnquiryPointerDown)
})

onBeforeUnmount(() => document.removeEventListener('pointerdown', onEnquiryPointerDown))

function onEnquiryKeydown(event: KeyboardEvent) {
  const options = contactPage.enquiryTypes
  if (event.key === 'Escape') {
    enquiryOpen.value = false
    return
  }
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!enquiryOpen.value) {
      enquiryOpen.value = true
      syncEnquiryActive()
      return
    }
    const next = event.key === 'ArrowDown' ? 1 : -1
    enquiryActive.value = Math.min(Math.max(enquiryActive.value + next, 0), options.length - 1)
    return
  }
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    if (!enquiryOpen.value) {
      enquiryOpen.value = true
      syncEnquiryActive()
      return
    }
    chooseEnquiry(options[enquiryActive.value])
  }
}

async function submit() {
  error.value = null
  if (!fullName.value.trim() || !email.value.includes('@') || !subject.value.trim() || !message.value.trim()) {
    error.value = 'Please fill in all required fields.'
    return
  }
  if (!privacyAck.value) {
    error.value = 'Please acknowledge the privacy notice to continue.'
    return
  }

  submitting.value = true
  try {
    await api.submitContact({
      fullName: fullName.value.trim(),
      email: email.value.trim(),
      enquiryType: enquiryType.value,
      subject: subject.value.trim(),
      message: message.value.trim(),
    })
    sent.value = true
    fullName.value = ''
    email.value = ''
    subject.value = ''
    message.value = ''
    privacyAck.value = false
    enquiryType.value = contactPage.enquiryTypes[0]
  } catch (e) {
    if (e instanceof ApiClientError) {
      error.value = e.message
    } else {
      error.value = 'Could not send your message. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="mkt-form" @submit.prevent="submit">
    <Input v-model="fullName" label="Full Name" autocomplete="name" required />
    <Input v-model="email" type="email" label="Email Address" autocomplete="email" required />
    <div ref="enquiryRoot" class="relative space-y-2">
      <span id="enquiry-type-label" class="block text-sm font-medium">Enquiry Type</span>
      <button
        ref="enquiryTrigger"
        type="button"
        class="input flex items-center justify-between gap-3 text-left"
        aria-haspopup="listbox"
        aria-labelledby="enquiry-type-label"
        :aria-expanded="enquiryOpen"
        aria-controls="enquiry-type-list"
        @click="toggleEnquiry"
        @keydown="onEnquiryKeydown"
      >
        <span class="truncate">{{ enquiryType }}</span>
        <svg
          class="h-4 w-4 shrink-0 text-audivoice-muted transition-transform"
          :class="enquiryOpen ? 'rotate-180' : ''"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6.25 8 10.25 12 6.25"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <ul
        v-if="enquiryOpen"
        id="enquiry-type-list"
        role="listbox"
        aria-labelledby="enquiry-type-label"
        class="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-audivoice-border bg-white py-1.5 shadow-soft"
      >
        <li
          v-for="(option, index) in contactPage.enquiryTypes"
          :key="option"
          role="option"
          :aria-selected="option === enquiryType"
          class="flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-base text-audivoice-ink"
          :class="index === enquiryActive ? 'bg-audivoice-soft' : 'hover:bg-audivoice-soft'"
          @mouseenter="enquiryActive = index"
          @click="chooseEnquiry(option)"
        >
          <span>{{ option }}</span>
          <svg
            v-if="option === enquiryType"
            class="h-4 w-4 shrink-0 text-audivoice-purple"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3.5 8.25 6.5 11.25 12.5 4.75"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </li>
      </ul>
    </div>
    <Input v-model="subject" label="Subject" required />
    <label class="block space-y-2">
      <span class="text-sm font-medium">Message</span>
      <textarea v-model="message" class="input min-h-36" required />
    </label>
    <label class="flex items-start gap-3 text-sm text-audivoice-muted">
      <input v-model="privacyAck" type="checkbox" class="mt-1" />
      <span>
        I understand my message will be sent to Audivoice for the purpose of responding to this
        enquiry. See our
        <RouterLink to="/privacy/" class="underline">Privacy Policy</RouterLink>.
      </span>
    </label>
    <p v-if="error" class="text-sm text-audivoice-danger" role="alert">{{ error }}</p>
    <p v-if="sent" class="text-sm text-audivoice-success">
      Thanks — we received your message and will get back to you soon.
    </p>
    <Button type="submit" :disabled="submitting">
      {{ submitting ? 'Sending…' : 'Send Message' }}
    </Button>
  </form>
</template>
