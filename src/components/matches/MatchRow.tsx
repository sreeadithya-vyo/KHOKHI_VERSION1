import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getOrCreateConversation } from '@/lib/api'
import { scoreLabel } from '@/lib/format'
import { useToast } from '@/context/ToastContext'
import type { Match } from '@/types'
import { Avatar, Badge, Button } from '@/components/ui'

/**
 * One connection as a large divided row: arch avatar, name link, compatibility as a number,
 * status and an Open chat pill. The parent supplies the list item (and its Reveal) around it.
 */
export function MatchRow({ match }: { match: Match }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [opening, setOpening] = useState(false)
  const { profile } = match

  async function openChat() {
    setOpening(true)
    try {
      const conversation = await getOrCreateConversation(match.id)
      navigate(`/messages/${conversation.id}`)
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not open the chat. Try again.', 'error')
      setOpening(false)
    }
  }

  return (
    <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:gap-8 sm:py-8">
      <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
        <Avatar name={profile.name} src={profile.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <Link
            to={`/profile/${profile.id}`}
            className="block text-h2 font-extrabold text-ink [overflow-wrap:anywhere] hover:underline"
          >
            {profile.name}
          </Link>
          <p className="mt-1 text-ink-soft">
            {profile.role} at {profile.organisation}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-8">
        <p className="shrink-0 sm:text-right">
          <span className="block text-h1 font-black tabular-nums text-ink">{profile.compatibilityScore}%</span>
          <span className="block text-caption font-semibold text-ink-soft">
            {scoreLabel(profile.compatibilityScore)} match
          </span>
        </p>
        <Badge tone={match.status === 'matched' ? 'success' : 'info'}>
          {match.status === 'matched' ? 'Matched' : 'Requested'}
        </Badge>
        <Button onClick={openChat} disabled={opening} className="shrink-0">
          {opening ? 'Opening…' : 'Open chat'}
        </Button>
      </div>
    </div>
  )
}
