/** Platform admin — Google sign-in only for this mailbox. */
export const ADMIN_EMAIL = 'support@audivoice.com'

export type LoginAuditMethod = 'google' | 'magic_link' | 'dev'

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return email.trim().toLowerCase() === ADMIN_EMAIL
}

export interface ContactSubmissionDTO {
  id: string
  fullName: string
  email: string
  enquiryType: string
  subject: string
  message: string
  userAgent: string | null
  ip: string | null
  createdAt: string
}

export interface LoginAuditDTO {
  id: string
  authUserId: string
  email: string | null
  method: LoginAuditMethod
  userAgent: string | null
  ip: string | null
  createdAt: string
}

export interface AdminUserDTO {
  id: string
  authUserId: string
  email: string | null
  role: string | null
  useCases: string[]
  audienceSize: string | null
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
  loginCount: number
  lastLoginAt: string | null
}
