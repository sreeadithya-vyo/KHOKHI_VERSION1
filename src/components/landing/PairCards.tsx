import { useEffect, useState } from 'react'
import { getProfiles, getStays } from '@/lib/api'
import { badgeLabel, inr, scoreLabel } from '@/lib/format'
import type { RoomType, RoommateProfile, Stay } from '@/types'
import { Avatar, Badge, Skeleton, Tag } from '@/components/ui'
import { ScoreRing } from '@/components/ScoreRing'
import { CheckIcon } from '@/components/icons'

interface Pair {
  profile: RoommateProfile
  stay: Stay | null
  room: RoomType | null
}

/** The most expensive room in the stay that still fits the person's budget. */
function pickRoom(stay: Stay, budgetMax: number): RoomType | null {
  return stay.roomTypes.filter((r) => r.rent <= budgetMax).sort((a, b) => b.rent - a.rent)[0] ?? null
}

function useSamplePair() {
  const [pair, setPair] = useState<Pair | null>(null)

  useEffect(() => {
    let live = true
    Promise.all([getProfiles({ city: 'Bengaluru' }), getStays({ city: 'Bengaluru' })]).then(([profiles, stays]) => {
      const profile = profiles[0]
      if (!live || !profile) return
      const stay = stays.find((s) => s.verified && pickRoom(s, profile.budgetMax)) ?? null
      setPair({ profile, stay, room: stay ? pickRoom(stay, profile.budgetMax) : null })
    })
    return () => {
      live = false
    }
  }, [])

  return pair
}

/** A real match from the mock api and a verified stay that fits their budget, as two stacked cards. */
export function PairCards() {
  const pair = useSamplePair()

  if (!pair) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-3" aria-hidden="true">
        <Skeleton className="h-56 rounded-card bg-white/20" />
        <Skeleton className="ml-8 h-32 rounded-card bg-white/20" />
      </div>
    )
  }

  const { profile, stay, room } = pair
  const firstName = profile.name.split(' ')[0]!

  return (
    <div className="w-full max-w-sm text-ink">
      <div className="rounded-card bg-white p-5 shadow-lift">
        <div className="flex items-start gap-4">
          <Avatar name={profile.name} size="lg" />
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-h3 font-extrabold leading-tight">
              {profile.name}, {profile.age}
            </p>
            <p className="mt-1 text-caption text-muted">
              {profile.role} at {profile.organisation}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ScoreRing score={profile.compatibilityScore} />
            <span className="text-caption font-bold">{scoreLabel(profile.compatibilityScore)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.badges.map((b) => (
            <Badge key={b} tone="success">
              <CheckIcon className="size-3.5" />
              {badgeLabel[b]}
            </Badge>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Tag>{profile.sleepSchedule}</Tag>
          <Tag>{profile.cleanliness}</Tag>
          {profile.interests.slice(0, 1).map((i) => (
            <Tag key={i}>{i}</Tag>
          ))}
        </div>
      </div>

      {stay && (
        <div className="relative -mt-3 ml-8 rounded-card bg-ink p-5 text-white shadow-lift ring-1 ring-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-pill bg-haldi px-2.5 py-1 text-caption font-bold text-ink">
              <CheckIcon className="size-3.5" />
              Verified stay
            </span>
            {room && <span className="text-caption text-white/80">Fits {firstName}&rsquo;s budget</span>}
          </div>
          <p className="mt-3 text-h3 font-extrabold leading-tight">{stay.title}</p>
          <div className="mt-2 flex items-baseline justify-between gap-3">
            <p className="text-caption text-white/70">
              {stay.area}, {stay.city}
            </p>
            <p className="text-h3 font-black tabular-nums">
              {inr(room ? room.rent : stay.rent)}
              <span className="text-caption font-medium text-white/70"> a month</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
