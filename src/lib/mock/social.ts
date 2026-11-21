import type { Conversation, MatchStatus, Message, User } from '@/types'

export const mockCurrentUser: User = {
  id: 'u-me',
  name: 'Aditi Sharma',
  email: 'aditi@example.com',
  userType: 'professional',
  plan: 'free',
  onboarded: true,
  compatibility: {
    archetype: 'Zen Harmonizer',
    score: 86,
    summary: 'Calm, tidy and considerate. You thrive in a settled home with a friendly roommate.',
  },
}

/** Seed matches: profileId + status. The api layer joins these with profiles. */
export const mockMatchSeeds: { id: string; profileId: string; status: MatchStatus; createdAt: string }[] = [
  { id: 'm1', profileId: 'p1', status: 'matched', createdAt: '2026-11-18T09:30:00Z' },
  { id: 'm2', profileId: 'p5', status: 'matched', createdAt: '2026-11-19T14:10:00Z' },
  { id: 'm3', profileId: 'p11', status: 'requested', createdAt: '2026-11-20T18:45:00Z' },
]

export const mockConversations: Conversation[] = [
  {
    id: 'c1', matchId: 'm1',
    participant: { id: 'p1', name: 'Ananya Rao' },
    lastMessage: 'Sunday works! Shall we see the Koramangala flat at 11?',
    lastMessageAt: '2026-11-20T19:05:00Z', unread: true,
  },
  {
    id: 'c2', matchId: 'm2',
    participant: { id: 'p5', name: 'Meera Nair' },
    lastMessage: 'Great, I’ll share the listing link tonight.',
    lastMessageAt: '2026-11-19T21:40:00Z', unread: false,
  },
]

export const mockMessages: Message[] = [
  { id: 'msg1', conversationId: 'c1', fromMe: false, text: 'Hi Aditi! Saw we matched at 94%. Are you still looking in Bengaluru?', sentAt: '2026-11-18T10:00:00Z' },
  { id: 'msg2', conversationId: 'c1', fromMe: true, text: 'Hey Ananya! Yes, moving in January. Koramangala or Indiranagar ideally.', sentAt: '2026-11-18T10:12:00Z' },
  { id: 'msg3', conversationId: 'c1', fromMe: false, text: 'Same! I found a verified 2BHK on KHOKHI. Want to see it together this weekend?', sentAt: '2026-11-20T18:50:00Z' },
  { id: 'msg4', conversationId: 'c1', fromMe: false, text: 'Sunday works! Shall we see the Koramangala flat at 11?', sentAt: '2026-11-20T19:05:00Z' },
  { id: 'msg5', conversationId: 'c2', fromMe: true, text: 'Hi Meera, I’m also joining a Hyderabad office next month.', sentAt: '2026-11-19T21:00:00Z' },
  { id: 'msg6', conversationId: 'c2', fromMe: false, text: 'Great, I’ll share the listing link tonight.', sentAt: '2026-11-19T21:40:00Z' },
]
