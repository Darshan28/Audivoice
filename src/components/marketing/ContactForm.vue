<script setup lang="ts">
import { ref } from 'vue'
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
    <label class="block space-y-2">
      <span class="text-sm font-medium">Enquiry Type</span>
      <select v-model="enquiryType" class="input">
        <option v-for="t in contactPage.enquiryTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </label>
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
