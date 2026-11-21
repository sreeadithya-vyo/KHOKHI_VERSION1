import type { VerificationBadge } from '@/types'

export const inr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`

export const badgeLabel: Record<VerificationBadge, string> = {
  identity: 'ID verified',
  institution: 'College verified',
  employer: 'Work verified',
}

export const scoreLabel = (score: number) => (score >= 90 ? 'Exceptional' : 'Good')
