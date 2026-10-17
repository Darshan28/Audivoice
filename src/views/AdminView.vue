<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { AdminUserDTO, ContactSubmissionDTO, LoginAuditDTO } from '@shared/admin'
import BrandMark from '@/components/ui/BrandMark.vue'
import Button from '@/components/ui/Button.vue'
import { api, ApiClientError } from '@/services/api'
import { useAuthStore } from '@/stores/authStore'

type Tab = 'contacts' | 'users' | 'logins'

const auth = useAuthStore()
const router = useRouter()

const tab = ref<Tab>('contacts')
const loading = ref(false)
const error = ref<string | null>(null)

const contacts = ref<ContactSubmissionDTO[]>([])
const users = ref<AdminUserDTO[]>([])
const audits = ref<LoginAuditDTO[]>([])
const selectedAuthUserId = ref<string | null>(null)
const expandedContactId = ref<string | null>(null)

const selectedUser = computed(() =>
  users.value.find((u) => u.authUserId === selectedAuthUserId.value) ?? null,
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function preview(text: string, max = 80) {
  const trimmed = text.replace(/\s+/g, ' ').trim()
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed
}

async function loadContacts() {
  const res = await api.adminListContacts()
  contacts.value = res.contacts
}

async function loadUsers() {
  const res = await api.adminListUsers()
  users.value = res.users
}

async function loadAudits(authUserId?: string | null) {
  const res = await api.adminListLoginAudits({
    authUserId: authUserId || undefined,
  })
  audits.value = res.audits
}

async function refresh() {
  loading.value = true
  error.value = null
  try {
    if (tab.value === 'contacts') {
      await loadContacts()
    } else if (tab.value === 'users') {
      await loadUsers()
      if (selectedAuthUserId.value) {
        await loadAudits(selectedAuthUserId.value)
      }
    } else {
      await loadAudits(null)
    }
  } catch (e) {
    error.value =
      e instanceof ApiClientError ? e.message : e instanceof Error ? e.message : 'Failed to load'
  } finally {
    loading.value = false
  }
}

function selectUser(user: AdminUserDTO) {
  selectedAuthUserId.value = user.authUserId
  tab.value = 'users'
}

async function logout() {
  await auth.signOut()
  await router.push('/')
}

watch(tab, () => {
  void refresh()
})

watch(selectedAuthUserId, (id) => {
  if (tab.value === 'users' && id) {
    void loadAudits(id)
  }
})

onMounted(async () => {
  await auth.init()
  if (!auth.isAdmin) {
    await router.replace('/app/sessions')
    return
  }
  await refresh()
})
</script>

<template>
  <div class="app-shell">
    <div class="app-shell-bg" aria-hidden="true" />

    <header class="relative z-10 border-b border-audivoice-border/80 bg-white/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-6">
        <BrandMark to="/app/sessions" />
        <div class="flex flex-wrap items-center gap-2">
          <Button variant="ghost" @click="router.push('/app/sessions')">Sessions</Button>
          <Button variant="ghost" @click="router.push('/app/settings')">Settings</Button>
          <Button variant="secondary" @click="logout">Log out</Button>
        </div>
      </div>
    </header>

    <main class="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-6">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Admin</h1>
      <p class="mt-2 text-audivoice-muted">Contacts, signed-up users, and login history.</p>

      <div class="mt-8 flex flex-wrap gap-2 border-b border-audivoice-border pb-3">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
          :class="
            tab === 'contacts'
              ? 'bg-audivoice-soft text-audivoice-magenta'
              : 'text-audivoice-muted hover:text-audivoice-ink'
          "
          @click="tab = 'contacts'"
        >
          Contacts
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
          :class="
            tab === 'users'
              ? 'bg-audivoice-soft text-audivoice-magenta'
              : 'text-audivoice-muted hover:text-audivoice-ink'
          "
          @click="tab = 'users'"
        >
          Users
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-medium transition"
          :class="
            tab === 'logins'
              ? 'bg-audivoice-soft text-audivoice-magenta'
              : 'text-audivoice-muted hover:text-audivoice-ink'
          "
          @click="
            selectedAuthUserId = null
            tab = 'logins'
          "
        >
          Login audit
        </button>
      </div>

      <p v-if="error" class="mt-6 text-sm text-audivoice-danger" role="alert">{{ error }}</p>
      <p v-else-if="loading" class="mt-6 text-audivoice-muted">Loading…</p>

      <section v-else-if="tab === 'contacts'" class="mt-6">
        <p v-if="!contacts.length" class="text-audivoice-muted">No contact submissions yet.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr class="border-b border-audivoice-border text-audivoice-muted">
                <th class="py-2 pr-3 font-medium">When</th>
                <th class="py-2 pr-3 font-medium">Name</th>
                <th class="py-2 pr-3 font-medium">Email</th>
                <th class="py-2 pr-3 font-medium">Type</th>
                <th class="py-2 font-medium">Subject / message</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="c in contacts"
                :key="c.id"
                class="border-b border-audivoice-border/60 align-top"
              >
                <td class="py-3 pr-3 whitespace-nowrap text-audivoice-muted">
                  {{ formatDate(c.createdAt) }}
                </td>
                <td class="py-3 pr-3 font-medium">{{ c.fullName }}</td>
                <td class="py-3 pr-3">
                  <a class="underline" :href="`mailto:${c.email}`">{{ c.email }}</a>
                </td>
                <td class="py-3 pr-3">{{ c.enquiryType }}</td>
                <td class="py-3">
                  <button
                    type="button"
                    class="text-left"
                    @click="expandedContactId = expandedContactId === c.id ? null : c.id"
                  >
                    <span class="font-medium">{{ c.subject }}</span>
                    <span class="mt-1 block text-audivoice-muted">
                      {{
                        expandedContactId === c.id ? c.message : preview(c.message)
                      }}
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-else-if="tab === 'users'" class="mt-6 space-y-8">
        <div>
          <p v-if="!users.length" class="text-audivoice-muted">No signed-up users yet.</p>
          <div v-else class="overflow-x-auto">
            <table class="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr class="border-b border-audivoice-border text-audivoice-muted">
                  <th class="py-2 pr-3 font-medium">Signed up</th>
                  <th class="py-2 pr-3 font-medium">Email</th>
                  <th class="py-2 pr-3 font-medium">Role</th>
                  <th class="py-2 pr-3 font-medium">Onboarded</th>
                  <th class="py-2 pr-3 font-medium">Logins</th>
                  <th class="py-2 font-medium">Last login</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="u in users"
                  :key="u.id"
                  class="border-b border-audivoice-border/60 cursor-pointer transition hover:bg-audivoice-soft/40"
                  :class="{ 'bg-audivoice-soft/50': selectedAuthUserId === u.authUserId }"
                  @click="selectUser(u)"
                >
                  <td class="py-3 pr-3 whitespace-nowrap text-audivoice-muted">
                    {{ formatDate(u.createdAt) }}
                  </td>
                  <td class="py-3 pr-3 font-medium">{{ u.email || '—' }}</td>
                  <td class="py-3 pr-3">{{ u.role || '—' }}</td>
                  <td class="py-3 pr-3">{{ u.onboardingCompleted ? 'Yes' : 'No' }}</td>
                  <td class="py-3 pr-3">{{ u.loginCount }}</td>
                  <td class="py-3 text-audivoice-muted">
                    {{ u.lastLoginAt ? formatDate(u.lastLoginAt) : '—' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="selectedUser" class="card p-5 sm:p-6">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold">Logins for {{ selectedUser.email || selectedUser.authUserId }}</h2>
              <p class="mt-1 text-sm text-audivoice-muted">
                {{ selectedUser.loginCount }} total · click another user to switch
              </p>
            </div>
            <Button variant="ghost" @click="selectedAuthUserId = null; audits = []">Clear</Button>
          </div>
          <p v-if="!audits.length" class="mt-4 text-sm text-audivoice-muted">No logins recorded yet.</p>
          <ul v-else class="mt-4 space-y-2 text-sm">
            <li
              v-for="a in audits"
              :key="a.id"
              class="flex flex-wrap gap-x-4 gap-y-1 border-b border-audivoice-border/50 py-2"
            >
              <span class="text-audivoice-muted whitespace-nowrap">{{ formatDate(a.createdAt) }}</span>
              <span class="font-medium">{{ a.method }}</span>
              <span class="text-audivoice-muted">{{ a.ip || '—' }}</span>
            </li>
          </ul>
        </div>
      </section>

      <section v-else class="mt-6">
        <p v-if="!audits.length" class="text-audivoice-muted">No login events yet.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr class="border-b border-audivoice-border text-audivoice-muted">
                <th class="py-2 pr-3 font-medium">When</th>
                <th class="py-2 pr-3 font-medium">Email</th>
                <th class="py-2 pr-3 font-medium">Method</th>
                <th class="py-2 pr-3 font-medium">IP</th>
                <th class="py-2 font-medium">Auth user</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="a in audits"
                :key="a.id"
                class="border-b border-audivoice-border/60"
              >
                <td class="py-3 pr-3 whitespace-nowrap text-audivoice-muted">
                  {{ formatDate(a.createdAt) }}
                </td>
                <td class="py-3 pr-3 font-medium">{{ a.email || '—' }}</td>
                <td class="py-3 pr-3">{{ a.method }}</td>
                <td class="py-3 pr-3 text-audivoice-muted">{{ a.ip || '—' }}</td>
                <td class="py-3 font-mono text-xs text-audivoice-muted">{{ a.authUserId }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>
