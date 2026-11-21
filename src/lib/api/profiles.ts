import type { City, ProfileFilters, RoommateProfile } from '@/types'
import { mockProfiles } from '@/lib/mock/profiles'
import { delay } from './delay'
import { demo } from './state'

const hidden = (id: string) => demo.blockedProfileIds.includes(id)

/** Profiles ranked by compatibility. Excludes profiles the member passed on or blocked. */
export async function getProfiles(filters: ProfileFilters = {}): Promise<RoommateProfile[]> {
  const { city, budgetMax, tags } = filters
  const result = mockProfiles
    .filter((p) => !hidden(p.id) && !demo.passedProfileIds.includes(p.id))
    .filter((p) => !city || city === 'All' || p.city === city)
    .filter((p) => budgetMax === undefined || p.budgetMin <= budgetMax)
    .filter(
      (p) =>
        !tags?.length ||
        tags.every((t) => [p.sleepSchedule, p.cleanliness, p.socialCadence, ...p.interests].includes(t)),
    )
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
  return delay(result)
}

/** A single profile, or null if it does not exist or was blocked. A passed profile is still viewable. */
export async function getProfile(id: string): Promise<RoommateProfile | null> {
  return delay(mockProfiles.find((p) => p.id === id && !hidden(p.id)) ?? null)
}

export async function getCities(): Promise<City[]> {
  return delay([...new Set(mockProfiles.map((p) => p.city))], 100)
}
