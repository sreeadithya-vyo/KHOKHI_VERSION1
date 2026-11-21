export type City = 'Bengaluru' | 'Hyderabad' | 'Pune' | 'Mumbai' | 'Delhi NCR' | 'Chennai'

export type Plan = 'free' | 'premium'
export type UserType = 'student' | 'professional' | 'owner'

export type SleepSchedule = 'Early bird' | 'Flexible' | 'Night owl'
export type Cleanliness = 'Relaxed' | 'Tidy' | 'Spotless'
export type SocialCadence = 'Homebody' | 'Balanced' | 'Social butterfly'

export type VerificationBadge = 'identity' | 'institution' | 'employer'

export type CommunicationStyle = 'Direct' | 'Gentle' | 'In writing'
export type SmokingPreference = 'Smoke-free home' | 'Fine outside' | 'I smoke'

/** What the onboarding quiz collects. */
export interface OnboardingAnswers {
  cleanliness: Cleanliness
  sleepSchedule: SleepSchedule
  socialCadence: SocialCadence
  communication: CommunicationStyle
  smoking: SmokingPreference
  interests: string[]
  budgetMin: number // INR / month
  budgetMax: number
  city: City
}

export interface User {
  id: string
  name: string
  email: string
  userType: UserType
  plan: Plan
  onboarded: boolean
  avatarUrl?: string
  answers?: OnboardingAnswers
  compatibility?: CompatibilityResult
}

export interface CompatibilityResult {
  archetype: string
  score: number // 0-100
  summary: string
}

export interface CompatibilityBreakdown {
  lifestyle: number
  habits: number
  budget: number
  location: number
  personality: number
  accommodation: number
  interests: number
}

export interface RoommateProfile {
  id: string
  name: string
  age: number
  role: string // e.g. "MBA student", "Product designer"
  organisation: string // institution or company
  city: City
  budgetMin: number // INR / month
  budgetMax: number
  sleepSchedule: SleepSchedule
  cleanliness: Cleanliness
  socialCadence: SocialCadence
  smoker: boolean
  interests: string[]
  badges: VerificationBadge[]
  bio: string
  compatibilityScore: number // 0-100, relative to current user
  breakdown: CompatibilityBreakdown
  avatarUrl?: string
}

export type StayType = 'PG' | 'Private room' | 'Shared room' | 'Flat' | 'Co-living' | 'Hostel'
export type GenderPolicy = 'Men' | 'Women' | 'Unisex'

export interface RoomType {
  id: string
  name: string // e.g. "Single occupancy"
  occupancy: number
  rent: number // INR / month
}

export interface Stay {
  /** Set on stays created through "List your space"; absent on seed data. */
  ownerId?: string
  id: string
  title: string
  area: string
  city: City
  type: StayType
  genderPolicy: GenderPolicy
  rent: number // starting rent INR / month
  rating: number
  reviewCount: number
  verified: boolean
  amenities: string[]
  distanceNote: string
  description: string
  roomTypes: RoomType[]
}

export type MatchStatus = 'requested' | 'matched'

export interface Match {
  id: string
  profileId: string
  profile: RoommateProfile
  status: MatchStatus
  createdAt: string // ISO
}

export interface Conversation {
  id: string
  matchId: string
  participant: Pick<RoommateProfile, 'id' | 'name' | 'avatarUrl'>
  lastMessage: string
  lastMessageAt: string // ISO
  unread: boolean
}

export interface Message {
  id: string
  conversationId: string
  fromMe: boolean
  text: string
  sentAt: string // ISO
}

/** Input for creating a stay through the owner flow. New stays start unverified, rating 0, 0 reviews. */
export interface NewStayInput {
  title: string
  area: string
  city: City
  type: StayType
  genderPolicy: GenderPolicy
  description: string
  amenities: string[]
  distanceNote?: string
  roomTypes: Array<Pick<RoomType, 'name' | 'occupancy' | 'rent'>>
}

export interface MyListing extends Stay {
  enquiryCount: number
}

export interface StayEnquiryInput {
  message: string
  visitDate?: string // YYYY-MM-DD
}

export interface ReportTarget {
  kind: 'profile' | 'stay'
  id: string
}

/* Filters / inputs used by the api layer */
export interface ProfileFilters {
  city?: City | 'All'
  budgetMax?: number
  tags?: string[]
}

export interface StayFilters {
  city?: City | 'All'
  genderPolicy?: GenderPolicy | 'All'
  type?: StayType | 'All'
  rentMax?: number
}
