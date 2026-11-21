import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getConversations } from '@/lib/api'
import { cn } from '@/lib/cn'
import type { Conversation, Message } from '@/types'
import { EmptyState, LinkButton } from '@/components/ui'
import { ChatThread, ThreadSkeleton } from '@/components/messages/ChatThread'
import { ConversationList, ConversationListSkeleton } from '@/components/messages/ConversationList'

export default function Messages() {
  const { id } = useParams()
  const [conversations, setConversations] = useState<Conversation[] | null>(null)

  useEffect(() => {
    let live = true
    // Copy: the api hands back live records that it mutates when messages are sent or read.
    getConversations().then((list) => live && setConversations(list.map((c) => ({ ...c }))))
    return () => {
      live = false
    }
  }, [])

  const handleRead = useCallback((conversationId: string) => {
    setConversations((list) =>
      list?.some((c) => c.id === conversationId && c.unread)
        ? list.map((c) => (c.id === conversationId ? { ...c, unread: false } : c))
        : list,
    )
  }, [])

  const handleSent = useCallback((message: Message) => {
    setConversations((list) =>
      (list ?? [])
        .map((c) =>
          c.id === message.conversationId ? { ...c, lastMessage: message.text, lastMessageAt: message.sentAt } : c,
        )
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt)),
    )
  }, [])

  const active = conversations?.find((c) => c.id === id)

  if (conversations?.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 md:py-10">
        <h1 className="sr-only">Messages</h1>
        <EmptyState
          title="No conversations yet"
          description="Once you connect with someone, you can message them here. Find people whose habits fit yours."
          action={<LinkButton to="/matches">See your matches</LinkButton>}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pt-3 sm:px-6 md:py-6">
      <h1 className="sr-only">Messages</h1>
      <div className="flex h-[calc(100dvh_-_9.75rem_-_var(--banner-h,0px)_-_1px)] gap-4 overflow-hidden md:h-[calc(100dvh_-_7rem_-_var(--banner-h,0px)_-_1px)]">
        <section
          aria-label="Your conversations"
          className={cn('min-h-0 w-full shrink-0 flex-col md:flex md:w-80 lg:w-96', id ? 'hidden' : 'flex')}
        >
          <p className="px-3 pb-3 pt-1 text-h1 font-black" style={{ fontStretch: '112%' }}>
            Messages
          </p>
          <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {conversations ? (
              <ConversationList conversations={conversations} activeId={id} />
            ) : (
              <ConversationListSkeleton />
            )}
          </div>
        </section>

        <section
          aria-label="Conversation"
          className={cn(
            'min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-card bg-brand-100 md:flex',
            id ? 'flex' : 'hidden',
          )}
        >
          {!id ? (
            <div className="m-auto flex max-w-xs flex-col items-center px-6 text-center">
              <div
                aria-hidden="true"
                className="arch mb-5 flex h-24 w-[4.5rem] items-end justify-center rounded-b-lg bg-surface pb-4"
              >
                <span className="size-3.5 rounded-full bg-haldi ring-[1.5px] ring-ink" />
              </div>
              <p className="text-ink-soft">Pick a conversation to read it or reply.</p>
            </div>
          ) : !conversations ? (
            <ThreadSkeleton />
          ) : active ? (
            <ChatThread key={active.id} conversation={active} onRead={handleRead} onSent={handleSent} />
          ) : (
            <div className="m-auto w-full max-w-md p-4">
              <EmptyState
                title="We could not find that conversation"
                description="It may have been removed, or the link is out of date."
                action={<LinkButton to="/messages">Back to messages</LinkButton>}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
