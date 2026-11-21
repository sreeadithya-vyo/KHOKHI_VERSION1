import type { Conversation, MatchStatus, Message, Stay } from '@/types'
import { mockConversations, mockMatchSeeds, mockMessages } from '@/lib/mock/social'

/*
 * Mutable mock state shared by the api modules, persisted to sessionStorage so it survives a
 * refresh for the session. Internal to src/lib/api: pages must never import this file.
 * The Supabase phase deletes it.
 */

export interface MatchSeed {
  id: string
  profileId: string
  status: MatchStatus
  createdAt: string
}

export interface StayEnquiry {
  id: string
  stayId: string
  message: string
  visitDate?: string
  createdAt: string
}

export interface Report {
  id: string
  kind: 'profile' | 'stay'
  targetId: string
  reason: string
  createdAt: string
}

interface DemoState {
  matches: MatchSeed[]
  passedProfileIds: string[]
  blockedProfileIds: string[]
  blockedStayIds: string[]
  conversations: Conversation[]
  messages: Message[]
  createdStays: Stay[]
  enquiries: StayEnquiry[]
  reports: Report[]
}

const KEY = 'khokhi.demo'

function initial(): DemoState {
  return {
    matches: mockMatchSeeds.map((m) => ({ ...m })),
    passedProfileIds: [],
    blockedProfileIds: [],
    blockedStayIds: [],
    conversations: mockConversations.map((c) => ({ ...c })),
    messages: mockMessages.map((m) => ({ ...m })),
    createdStays: [],
    enquiries: [],
    reports: [],
  }
}

function load(): DemoState {
  const raw = sessionStorage.getItem(KEY)
  return raw ? (JSON.parse(raw) as DemoState) : initial()
}

/** Mutate in place, then call persist(). */
export const demo: DemoState = load()

export const persist = () => sessionStorage.setItem(KEY, JSON.stringify(demo))

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
