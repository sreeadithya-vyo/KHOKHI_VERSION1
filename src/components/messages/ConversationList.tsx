import { Link } from 'react-router-dom'
import type { Conversation } from '@/types'
import { cn } from '@/lib/cn'
import { Skeleton } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { ArchAvatar } from './ArchAvatar'
import { relativeTime } from './formatTime'

export function ConversationListSkeleton() {
  return (
    <ul aria-hidden="true" className="space-y-1 p-2">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center gap-3 px-3 py-3">
          <Skeleton className="arch h-12 w-10 shrink-0 rounded-b-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
        </li>
      ))}
    </ul>
  )
}

interface Props {
  conversations: Conversation[]
  activeId?: string
}

export function ConversationList({ conversations, activeId }: Props) {
  return (
    <nav aria-label="Conversations">
      <ul className="space-y-1 p-2">
        {conversations.map((c, i) => {
          const active = c.id === activeId
          const empty = c.lastMessage === ''
          return (
            <Reveal as="li" key={c.id} delay={i * 70}>
              <Link
                to={`/messages/${c.id}`}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[4.75rem] items-center gap-3.5 rounded-2xl px-3 py-3 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-600',
                  active ? 'bg-surface shadow-card' : 'hover:bg-brand-100',
                )}
              >
                <ArchAvatar name={c.participant.name} src={c.participant.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className={cn('truncate text-ink', c.unread ? 'font-black' : 'font-bold')}>
                      {c.participant.name}
                    </span>
                    {!empty && (
                      <time dateTime={c.lastMessageAt} className="shrink-0 text-caption text-muted">
                        {relativeTime(c.lastMessageAt)}
                      </time>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p
                      className={cn(
                        'min-w-0 flex-1 truncate text-caption',
                        c.unread ? 'font-semibold text-ink' : 'text-muted',
                      )}
                    >
                      {empty ? 'No messages yet' : c.lastMessage}
                    </p>
                    {c.unread && (
                      <span
                        role="img"
                        aria-label="Unread messages"
                        className="size-3 shrink-0 rounded-full bg-haldi ring-[1.5px] ring-ink"
                      />
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          )
        })}
      </ul>
    </nav>
  )
}
