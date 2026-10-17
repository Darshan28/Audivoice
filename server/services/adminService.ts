import type { AdminUserDTO, ContactSubmissionDTO, LoginAuditDTO, LoginAuditMethod } from '../../shared/admin.js'
import { getStore } from '../store/index.js'
import type { CreateContactSubmissionInput, CreateLoginAuditInput } from '../store/types.js'

export async function submitContact(input: CreateContactSubmissionInput): Promise<ContactSubmissionDTO> {
  return getStore().createContactSubmission(input)
}

export async function listContacts(limit = 100, offset = 0): Promise<ContactSubmissionDTO[]> {
  return getStore().listContactSubmissions({ limit, offset })
}

export async function recordLoginAudit(input: CreateLoginAuditInput): Promise<LoginAuditDTO> {
  return getStore().createLoginAudit(input)
}

export async function listLoginAudits(options: {
  limit?: number
  offset?: number
  authUserId?: string
} = {}): Promise<LoginAuditDTO[]> {
  return getStore().listLoginAudits(options)
}

export async function listAdminUsers(limit = 100, offset = 0): Promise<AdminUserDTO[]> {
  const store = getStore()
  const users = await store.listUserProfiles({ limit, offset })
  const stats = await store.countLoginAuditsByAuthUserIds(users.map((u) => u.authUserId))

  return users.map((user) => {
    const login = stats.get(user.authUserId)
    return {
      id: user.id,
      authUserId: user.authUserId,
      email: user.email,
      role: user.role,
      useCases: user.useCases,
      audienceSize: user.audienceSize,
      onboardingCompleted: user.onboardingCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      loginCount: login?.count ?? 0,
      lastLoginAt: login?.lastLoginAt ?? null,
    }
  })
}

export function normalizeLoginMethod(provider: string | null | undefined): LoginAuditMethod {
  const value = (provider || '').toLowerCase()
  if (value === 'google') return 'google'
  if (value === 'dev') return 'dev'
  if (value === 'email' || value === 'magiclink' || value === 'magic_link') return 'magic_link'
  return 'magic_link'
}
