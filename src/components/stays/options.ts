import type { City, GenderPolicy, StayFilters, StayType } from '@/types'

/** Filter option lists for the stays screen. Values mirror the union types in `@/types`. */

export const GENDER_OPTIONS: Array<{ value: GenderPolicy | 'All'; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Unisex', label: 'Unisex' },
]

export const BUDGET_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'Any budget' },
  { value: '8000', label: 'Under ₹8,000' },
  { value: '12000', label: 'Under ₹12,000' },
  { value: '18000', label: 'Under ₹18,000' },
  { value: '25000', label: 'Under ₹25,000' },
]

const TYPES: Array<StayType | 'All'> = ['All', 'PG', 'Private room', 'Shared room', 'Flat', 'Co-living', 'Hostel']
export const TYPE_OPTIONS = TYPES.map((t) => ({ value: t, label: t === 'All' ? 'All types' : t }))

const CITIES: Array<City | 'All'> = ['All', 'Bengaluru', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi NCR', 'Chennai']
export const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c === 'All' ? 'All cities' : c }))

export interface StayFilterState {
  gender: GenderPolicy | 'All'
  budget: string // '' means any
  type: StayType | 'All'
  city: City | 'All'
}

export const DEFAULT_FILTERS: StayFilterState = { gender: 'All', budget: '', type: 'All', city: 'All' }

export const isDefaultFilters = (f: StayFilterState) =>
  f.gender === 'All' && f.budget === '' && f.type === 'All' && f.city === 'All'

export function toApiFilters(f: StayFilterState): StayFilters {
  return {
    city: f.city,
    genderPolicy: f.gender,
    type: f.type,
    rentMax: f.budget ? Number(f.budget) : undefined,
  }
}
