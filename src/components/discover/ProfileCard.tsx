import { useState } from 'react'
import { badgeLabel, inr, scoreLabel } from '@/lib/format'
import { cn } from '@/lib/cn'
import type { RoommateProfile } from '@/types'
import { Avatar, Badge, Button, LinkButton, Skeleton, Tag } from '@/components/ui'
import { ConnectButton } from '@/components/ConnectButton'
import { ScoreRing } from '@/components/ScoreRing'
import { CheckIcon } from '@/components/icons'

interface Props {
  profile: RoommateProfile
  connected: boolean
  onConnected: (profileId: string) => void
  onPass: (profile: RoommateProfile) => Promise<void>
}

/** A person as a small poster: colour field up top with the score, an arch rising out of it, then the details. */
export function ProfileCard({ profile, connected, onConnected, onPass }: Props) {
  const [passing, setPassing] = useState(false)
  const firstName = profile.name.split(' ')[0]!
  const exceptional = profile.compatibilityScore >= 90

  async function pass() {
    setPassing(true)
    try {
      await onPass(profile)
    } finally {
      setPassing(false)
    }
  }

  return (
    <article
      aria-label={profile.name}
      className="flex h-full w-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card"
    >
      <div
        className={cn(
          'flex items-start justify-between gap-4 px-5 pb-6 pt-5 sm:px-6',
          exceptional ? 'bg-haldi-soft' : 'bg-brand-50',
        )}
      >
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-caption font-bold',
            exceptional ? 'bg-ink text-white' : 'bg-surface text-ink',
          )}
        >
          {exceptional && <span aria-hidden="true" className="size-2 rounded-full bg-haldi" />}
          {scoreLabel(profile.compatibilityScore)}
        </span>
        <div className="rounded-full bg-surface p-1.5">
          <ScoreRing score={profile.compatibilityScore} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 sm:px-6 sm:pb-6">
        <Avatar
          name={profile.name}
          src={profile.avatarUrl}
          size="lg"
          className="-mt-14 ring-4 ring-surface"
        />

        <h3 className="mt-4 text-h2 font-extrabold [font-stretch:112%]">
          {profile.name}, {profile.age}
        </h3>
        <p className="mt-1 text-body text-ink-soft">
          {profile.role} at {profile.organisation}
        </p>

        {profile.badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.badges.map((b) => (
              <Badge key={b} tone="success">
                <CheckIcon className="size-3.5" />
                {badgeLabel[b]}
              </Badge>
            ))}
          </div>
        )}

        <p className="mt-4 line-clamp-3 text-body text-ink-soft">{profile.bio}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Tag>{profile.sleepSchedule}</Tag>
          <Tag>{profile.cleanliness}</Tag>
          <Tag>{profile.smoker ? 'Smoker' : 'Non-smoker'}</Tag>
          {profile.interests.slice(0, 2).map((i) => (
            <Tag key={i}>{i}</Tag>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <p className="border-t border-line pt-4 text-caption text-ink-soft">
            <span className="font-semibold text-ink">
              {inr(profile.budgetMin)} to {inr(profile.budgetMax)}
            </span>{' '}
            a month, looking in {profile.city}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
            <ConnectButton
              profile={profile}
              connected={connected}
              onConnected={() => onConnected(profile.id)}
              fullWidth
              className="order-first col-span-2 sm:order-last sm:w-auto"
            />
            <Button
              variant="ghost"
              onClick={pass}
              disabled={passing}
              aria-label={`Pass on ${firstName}`}
              className="sm:mr-auto"
            >
              {passing ? 'Passing…' : 'Pass'}
            </Button>
            <LinkButton to={`/profile/${profile.id}`} variant="secondary" aria-label={`View ${firstName}'s profile`}>
              View profile
            </LinkButton>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ProfileCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface shadow-card" aria-hidden="true">
      <div className="flex items-start justify-between bg-brand-50 px-5 pb-6 pt-5 sm:px-6">
        <Skeleton className="h-8 w-24 rounded-pill" />
        <Skeleton className="size-[5.25rem] rounded-full" />
      </div>
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <Skeleton className="arch -mt-14 h-20 w-16 rounded-b-lg ring-4 ring-surface" />
        <Skeleton className="mt-4 h-7 w-3/5" />
        <Skeleton className="mt-2 h-4 w-4/5" />
        <Skeleton className="mt-4 h-6 w-40 rounded-pill" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
        <div className="mt-4 flex gap-2">
          <Skeleton className="h-7 w-20 rounded-pill" />
          <Skeleton className="h-7 w-16 rounded-pill" />
          <Skeleton className="h-7 w-24 rounded-pill" />
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-pill" />
      </div>
    </div>
  )
}
