import type { Plan } from '@/types'

/** Free members cannot connect with profiles at or above this compatibility score. Premium unlocks them. */
export const PREMIUM_MATCH_THRESHOLD = 80

/** Free members can hold at most this many connections (matches + requests). Premium is unlimited. */
export const FREE_CONNECTION_LIMIT = 5

export const isPremiumLocked = (plan: Plan, score: number) => plan === 'free' && score >= PREMIUM_MATCH_THRESHOLD

/** Thrown by api mutations when the member's plan does not allow the action. UI should link to /premium. */
export class PlanLimitError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PlanLimitError'
  }
}
