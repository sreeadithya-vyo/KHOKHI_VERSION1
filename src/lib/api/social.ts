import type { Conversation, Match, Message } from '@/types'
import { mockProfiles } from '@/lib/mock/profiles'
import { FREE_CONNECTION_LIMIT, PlanLimitError, isPremiumLocked } from '@/lib/plan'
import { delay } from './delay'
import { getCurrentUser } from './auth'
import { demo, newId, persist } from './state'

const profileOf = (id: string) => mockProfiles.find((p) => p.id === id)

/** Connections (requested + matched), newest first. Blocked people are excluded. */
export async function getMatches(): Promise<Match[]> {
  const matches = demo.matches.flatMap((seed) => {
    const profile = profileOf(seed.profileId)
    return profile && !demo.blockedProfileIds.includes(profile.id) ? [{ ...seed, profile }] : []
  })
  return delay(matches.sort((a, b) => b.createdAt.localeCompare(a.createdAt)))
}

/**
 * Connect with a profile: creates a Match with status 'requested'. Idempotent per profile.
 * Throws PlanLimitError when a free member tries an 80%+ match or exceeds the connection limit.
 */
export async function connectWithProfile(profileId: string): Promise<Match> {
  const profile = profileOf(profileId)
  if (!profile) throw new Error('That profile no longer exists.')
  const existing = demo.matches.find((m) => m.profileId === profileId)
  if (existing) return delay({ ...existing, profile }, 200)

  const user = await getCurrentUser()
  if (!user) throw new Error('Log in to connect with people.')
  if (isPremiumLocked(user.plan, profile.compatibilityScore)) {
    throw new PlanLimitError('Connecting with 80%+ matches is a Premium feature.')
  }
  if (user.plan === 'free' && demo.matches.length >= FREE_CONNECTION_LIMIT) {
    throw new PlanLimitError(`Free members can have ${FREE_CONNECTION_LIMIT} connections. Upgrade for unlimited.`)
  }

  const seed = { id: newId('m'), profileId, status: 'requested' as const, createdAt: new Date().toISOString() }
  demo.matches.push(seed)
  persist()
  return delay({ ...seed, profile }, 400)
}

/** Pass on a profile: it stops appearing in getProfiles. */
export async function passProfile(profileId: string): Promise<void> {
  if (!demo.passedProfileIds.includes(profileId)) demo.passedProfileIds.push(profileId)
  persist()
  return delay(undefined, 150)
}

export async function getConversations(): Promise<Conversation[]> {
  const result = demo.conversations
    .filter((c) => !demo.blockedProfileIds.includes(c.participant.id))
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
  return delay(result)
}

/** The conversation for a match, created empty on first use. Matches open chat through this. */
export async function getOrCreateConversation(matchId: string): Promise<Conversation> {
  const existing = demo.conversations.find((c) => c.matchId === matchId)
  if (existing) return delay(existing, 150)
  const seed = demo.matches.find((m) => m.id === matchId)
  const profile = seed && profileOf(seed.profileId)
  if (!seed || !profile) throw new Error('That match no longer exists.')
  const conversation: Conversation = {
    id: newId('c'),
    matchId,
    participant: { id: profile.id, name: profile.name, avatarUrl: profile.avatarUrl },
    lastMessage: '',
    lastMessageAt: new Date().toISOString(),
    unread: false,
  }
  demo.conversations.push(conversation)
  persist()
  return delay(conversation, 250)
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  return delay(
    demo.messages.filter((m) => m.conversationId === conversationId).sort((a, b) => a.sentAt.localeCompare(b.sentAt)),
  )
}

/** Appends a message from the current member and updates the conversation preview. */
export async function sendMessage(conversationId: string, text: string): Promise<Message> {
  const conversation = demo.conversations.find((c) => c.id === conversationId)
  if (!conversation) throw new Error('That conversation no longer exists.')
  const message: Message = {
    id: newId('msg'),
    conversationId,
    fromMe: true,
    text: text.trim(),
    sentAt: new Date().toISOString(),
  }
  demo.messages.push(message)
  conversation.lastMessage = message.text
  conversation.lastMessageAt = message.sentAt
  persist()
  return delay(message, 250)
}

/** Clears the unread dot. Call when a conversation is opened. */
export async function markConversationRead(conversationId: string): Promise<void> {
  const conversation = demo.conversations.find((c) => c.id === conversationId)
  if (conversation) {
    conversation.unread = false
    persist()
  }
  return delay(undefined, 50)
}
