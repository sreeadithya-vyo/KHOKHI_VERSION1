/** Fixed filter options for the discovery feed. Every tag here exists in the profile data. */

export interface TagGroup {
  id: string
  label: string
  /** Only one tag from an exclusive group can be active (a person has one sleep schedule). */
  exclusive: boolean
  tags: string[]
}

export const TAG_GROUPS: TagGroup[] = [
  { id: 'sleep', label: 'Sleep schedule', exclusive: true, tags: ['Early bird', 'Flexible', 'Night owl'] },
  { id: 'clean', label: 'Cleanliness', exclusive: true, tags: ['Relaxed', 'Tidy', 'Spotless'] },
  { id: 'social', label: 'Social', exclusive: true, tags: ['Homebody', 'Balanced', 'Social butterfly'] },
  { id: 'interests', label: 'Interests', exclusive: false, tags: ['Cooking', 'Travel', 'Football', 'Baking', 'Gaming', 'Coffee'] },
]

/** Max monthly budget choices (INR). The filter keeps people whose range starts at or below the value. */
export const BUDGET_OPTIONS = [8000, 12000, 16000, 20000, 25000]

export function toggleTag(active: string[], tag: string): string[] {
  if (active.includes(tag)) return active.filter((t) => t !== tag)
  const group = TAG_GROUPS.find((g) => g.tags.includes(tag))
  const base = group?.exclusive ? active.filter((t) => !group.tags.includes(t)) : active
  return [...base, tag]
}
