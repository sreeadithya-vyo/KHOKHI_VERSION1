import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { getMessages, markConversationRead, sendMessage } from '@/lib/api'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/lib/cn'
import type { Conversation, Message } from '@/types'
import { Avatar, Button, Skeleton } from '@/components/ui'
import { ArchAvatar } from './ArchAvatar'
import { clockTime, dayLabel, sameDay } from './formatTime'

const MAX_COMPOSER_HEIGHT = 128

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  )
}

export function ThreadSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-1 flex-col justify-end gap-3 p-4">
      <Skeleton className="h-10 w-3/5 self-start rounded-[1.375rem] bg-surface" />
      <Skeleton className="h-10 w-2/5 self-end rounded-[1.375rem] bg-surface" />
      <Skeleton className="h-14 w-1/2 self-start rounded-[1.375rem] bg-surface" />
    </div>
  )
}

interface Props {
  conversation: Conversation
  /** Called once when the thread opens, so the list can clear its unread dot. */
  onRead: (conversationId: string) => void
  /** Called after a message is sent, so the list can update its preview and order. */
  onSent: (message: Message) => void
}

/** One open conversation. The parent keys it by conversation id so state resets when switching. */
export function ChatThread({ conversation, onRead, onSent }: Props) {
  const toast = useToast()
  const { id, participant } = conversation
  const firstName = participant.name.split(' ')[0]!
  const [messages, setMessages] = useState<Message[] | null>(null)
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const scroller = useRef<HTMLDivElement>(null)
  const composer = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    let live = true
    getMessages(id).then((list) => live && setMessages(list))
    markConversationRead(id)
    onRead(id)
    return () => {
      live = false
    }
  }, [id, onRead])

  // Keep the newest message in view.
  useLayoutEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  // Grow the composer with its content, up to a cap.
  useLayoutEffect(() => {
    const el = composer.current
    if (!el) return
    el.style.height = 'auto'
    const borders = el.offsetHeight - el.clientHeight
    el.style.height = `${Math.min(el.scrollHeight + borders, MAX_COMPOSER_HEIGHT)}px`
  }, [draft])

  const canSend = draft.trim() !== '' && !sending && messages !== null

  async function submit() {
    if (!canSend) return
    setSending(true)
    try {
      const sent = await sendMessage(id, draft)
      setMessages((list) => [...(list ?? []), sent])
      onSent(sent)
      setDraft('')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Your message was not sent. Try again.', 'error')
    } finally {
      setSending(false)
      composer.current?.focus()
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void submit()
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      void submit()
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-2 border-b border-ink/10 px-2 py-2 md:px-4">
        <Link
          to="/messages"
          aria-label="Back to conversations"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-soft hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 md:hidden"
        >
          <BackIcon />
        </Link>
        <Link
          to={`/profile/${participant.id}`}
          className="flex min-w-0 items-center gap-3 rounded-control py-1 pr-3 hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 md:pl-0"
        >
          <ArchAvatar name={participant.name} src={participant.avatarUrl} className="h-10 w-8" />
          <span className="truncate text-body font-bold text-ink">{participant.name}</span>
        </Link>
      </header>

      {messages === null ? (
        <ThreadSkeleton />
      ) : (
        <div
          ref={scroller}
          role="log"
          data-lenis-prevent
          aria-label={`Messages with ${participant.name}`}
          className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overscroll-contain px-4 py-5 md:px-6"
        >
          {messages.length === 0 ? (
            <div className="m-auto flex max-w-xs flex-col items-center py-8 text-center">
              <Avatar name={participant.name} src={participant.avatarUrl} size="lg" className="shrink-0" />
              <p className="mt-4 text-h3 font-semibold text-ink">Say hello to {firstName}</p>
              <p className="mt-1.5 text-ink-soft">
                A short intro about where you are looking and when you could move is a good start.
              </p>
            </div>
          ) : (
            messages.map((m, i) => {
              const prev = messages[i - 1]
              return (
                <div key={m.id} className="contents">
                  {(!prev || !sameDay(prev.sentAt, m.sentAt)) && (
                    <p className={cn('self-center rounded-pill bg-surface/70 px-3 py-0.5 text-caption font-medium text-ink-soft', i > 0 && 'mt-3', 'mb-1')}>
                      {dayLabel(m.sentAt)}
                    </p>
                  )}
                  <div className={cn('flex max-w-[82%] flex-col sm:max-w-[75%]', m.fromMe ? 'items-end self-end' : 'items-start self-start')}>
                    <p
                      className={cn(
                        'whitespace-pre-wrap break-words rounded-[1.375rem] px-4 py-2.5 text-body',
                        m.fromMe
                          ? 'rounded-br-md bg-ink text-white'
                          : 'rounded-bl-md border border-line bg-surface text-ink',
                      )}
                    >
                      <span className="sr-only">{m.fromMe ? 'You: ' : `${firstName}: `}</span>
                      {m.text}
                    </p>
                    <time dateTime={m.sentAt} className="mt-1 px-1 text-[0.6875rem] text-muted">
                      {clockTime(m.sentAt)}
                    </time>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-ink/10 p-3 md:px-4">
        <label htmlFor="message-composer" className="sr-only">
          Message to {firstName}
        </label>
        <textarea
          id="message-composer"
          ref={composer}
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={`Message ${firstName}`}
          className="min-h-11 flex-1 resize-none rounded-3xl border border-line bg-surface px-5 py-2.5 text-base leading-normal text-ink placeholder:text-muted transition-colors focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/25"
        />
        <Button type="submit" disabled={!canSend}>
          Send
        </Button>
      </form>
    </div>
  )
}
