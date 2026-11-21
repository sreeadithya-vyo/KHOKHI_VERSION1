import type { MyListing, NewStayInput, Stay, StayEnquiryInput, StayFilters } from '@/types'
import { mockStays } from '@/lib/mock/stays'
import { delay } from './delay'
import { getCurrentUser } from './auth'
import { demo, newId, persist } from './state'

const allStays = (): Stay[] => [...mockStays, ...demo.createdStays].filter((s) => !demo.blockedStayIds.includes(s.id))

export async function getStays(filters: StayFilters = {}): Promise<Stay[]> {
  const { city, genderPolicy, type, rentMax } = filters
  const result = allStays()
    .filter((s) => !city || city === 'All' || s.city === city)
    .filter((s) => !genderPolicy || genderPolicy === 'All' || s.genderPolicy === genderPolicy)
    .filter((s) => !type || type === 'All' || s.type === type)
    .filter((s) => rentMax === undefined || s.rent <= rentMax)
  return delay(result)
}

export async function getStay(id: string): Promise<Stay | null> {
  return delay(allStays().find((s) => s.id === id) ?? null)
}

/** Creates an unverified stay owned by the current member. It appears in getStays straight away. */
export async function createStay(input: NewStayInput): Promise<Stay> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Log in to list your space.')
  const id = newId('s')
  const stay: Stay = {
    id,
    ownerId: user.id,
    title: input.title.trim(),
    area: input.area.trim(),
    city: input.city,
    type: input.type,
    genderPolicy: input.genderPolicy,
    rent: Math.min(...input.roomTypes.map((r) => r.rent)),
    rating: 0,
    reviewCount: 0,
    verified: false,
    amenities: input.amenities,
    distanceNote: input.distanceNote?.trim() || 'Location details to be added',
    description: input.description.trim(),
    roomTypes: input.roomTypes.map((r, i) => ({ id: `${id}r${i + 1}`, ...r })),
  }
  demo.createdStays.push(stay)
  persist()
  return delay(stay, 500)
}

/** The current member's own listings, newest first, with how many enquiries each has received. */
export async function getMyListings(): Promise<MyListing[]> {
  const user = await getCurrentUser()
  const mine = user ? demo.createdStays.filter((s) => s.ownerId === user.id && !demo.blockedStayIds.includes(s.id)) : []
  const result = mine
    .map((s) => ({ ...s, enquiryCount: demo.enquiries.filter((e) => e.stayId === s.id).length }))
    .reverse()
  return delay(result)
}

/** Mock enquiry / visit request. Nothing is sent anywhere; it is only counted. */
export async function sendStayEnquiry(stayId: string, input: StayEnquiryInput): Promise<void> {
  demo.enquiries.push({ id: newId('enq'), stayId, createdAt: new Date().toISOString(), ...input })
  persist()
  return delay(undefined, 500)
}
