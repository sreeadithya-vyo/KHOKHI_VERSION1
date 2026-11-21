import { FREE_CONNECTION_LIMIT, PREMIUM_MATCH_THRESHOLD } from '@/lib/plan'

export interface PlanCell {
  text: string
  included: boolean
}

export interface ComparisonRow {
  feature: string
  detail: string
  free: PlanCell
  premium: PlanCell
}

export const COMPARISON: ComparisonRow[] = [
  {
    feature: `Matches at ${PREMIUM_MATCH_THRESHOLD}% and above`,
    detail: 'Your most compatible people.',
    free: { text: 'Locked', included: false },
    premium: { text: 'Unlocked', included: true },
  },
  {
    feature: 'Advanced filters',
    detail: 'Narrow matches by habits and interests, not only city and budget.',
    free: { text: 'Basic filters', included: false },
    premium: { text: 'All filters', included: true },
  },
  {
    feature: 'Connections',
    detail: 'People you can hold in your matches and requests at once.',
    free: { text: `Up to ${FREE_CONNECTION_LIMIT}`, included: false },
    premium: { text: 'Unlimited', included: true },
  },
  {
    feature: 'Priority visibility',
    detail: 'Your profile is shown ahead of others in search results.',
    free: { text: 'Standard order', included: false },
    premium: { text: 'Shown first', included: true },
  },
  {
    feature: 'Early access',
    detail: 'Try new features before everyone else.',
    free: { text: 'Not included', included: false },
    premium: { text: 'Included', included: true },
  },
]
