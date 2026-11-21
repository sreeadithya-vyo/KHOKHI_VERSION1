import type { CompatibilityBreakdown } from '@/types'

export interface BreakdownFactor {
  key: keyof CompatibilityBreakdown
  label: string
  /** Share of the overall score, in percent. The seven weights sum to 100. */
  weight: number
}

// TODO(client): placeholder weights, replace with the deck figures
export const BREAKDOWN_FACTORS: BreakdownFactor[] = [
  { key: 'lifestyle', label: 'Lifestyle', weight: 25 },
  { key: 'habits', label: 'Habits', weight: 20 },
  { key: 'budget', label: 'Budget', weight: 15 },
  { key: 'location', label: 'Location', weight: 15 },
  { key: 'personality', label: 'Personality', weight: 10 },
  { key: 'accommodation', label: 'Accommodation', weight: 10 },
  { key: 'interests', label: 'Interests', weight: 5 },
]
