import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getMatches, getProfile, passProfile } from '@/lib/api'
import { badgeLabel, inr, scoreLabel } from '@/lib/format'
import { useToast } from '@/context/ToastContext'
import type { RoommateProfile } from '@/types'
import { Avatar, Badge, Button, EmptyState, LinkButton, Tag } from '@/components/ui'
import { CheckIcon } from '@/components/icons'
import { ConnectButton } from '@/components/ConnectButton'
import { ReportBlockActions } from '@/components/ReportBlockActions'
import { ScoreRing } from '@/components/ScoreRing'
import { BreakdownBars } from '@/components/profile/BreakdownBars'
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton'

interface Loaded {
  profile: RoommateProfile | null
  connected: boolean
}

/** One row of the divided definition list: label on the left, value on the right. */
function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-t border-line py-4">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="min-w-0 text-right font-bold text-ink">{children}</dd>
    </div>
  )
}

/** Sits on the pink field, so it is ink (the safe pairing on gulabi). */
function BackLink() {
  return (
    <Link
      to="/discover"
      className="inline-flex min-h-11 items-center gap-1.5 pt-2 text-caption font-bold text-ink hover:underline"
    >
      <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 3 5 8l5 5" />
      </svg>
      Back to discover
    </Link>
  )
}

function ProfileView({ id }: { id: string }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [data, setData] = useState<Loaded | null>(null)
  const [passing, setPassing] = useState(false)

  useEffect(() => {
    let live = true
    Promise.all([getProfile(id), getMatches()]).then(([profile, matches]) => {
      if (live) setData({ profile, connected: matches.some((m) => m.profileId === id) })
    })
    return () => {
      live = false
    }
  }, [id])

  if (!data) return <ProfileSkeleton back={<BackLink />} />

  const { profile, connected } = data
  if (!profile) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <EmptyState
          title="Profile not found"
          description="This profile does not exist, or it is no longer available to you."
          action={<LinkButton to="/discover">Back to discover</LinkButton>}
        />
      </div>
    )
  }

  const firstName = profile.name.split(' ')[0]!

  async function pass() {
    setPassing(true)
    try {
      await passProfile(id)
      toast(`Passed on ${firstName}`)
      navigate('/discover')
    } catch {
      toast('Could not pass on this profile. Try again.', 'error')
      setPassing(false)
    }
  }

  return (
    <div>
      {/* The poster: a full-bleed pink wall, the arch rising from its bottom edge. */}
      <section className="bg-gulabi">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BackLink />
          <div className="grid grid-cols-[auto_1fr] items-end gap-x-5 pt-4 lg:grid-cols-[auto_1fr_auto] lg:gap-x-10 lg:pt-10">
            <Avatar
              name={profile.name}
              src={profile.avatarUrl}
              size="xl"
              className="order-2 h-44! w-32! rounded-b-none! bg-haldi! sm:h-60! sm:w-44! lg:order-none"
            />

            <div className="order-1 col-span-2 min-w-0 pb-8 lg:order-none lg:col-span-1 lg:pb-14">
              <h1 className="text-balance text-display font-black text-ink [overflow-wrap:anywhere]">
                {profile.name}
                <span className="font-extrabold">, {profile.age}</span>
              </h1>
              <p className="mt-4 text-h3 font-bold text-ink">
                {profile.role} at {profile.organisation}
              </p>
              <p className="text-body text-ink-soft">{profile.city}</p>
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
            </div>

            <div className="order-3 mb-6 flex flex-col items-center gap-2 justify-self-end rounded-card bg-surface px-5 pb-4 pt-5 shadow-card sm:px-7 lg:order-none lg:mb-12 lg:pb-5 lg:pt-6">
              <ScoreRing score={profile.compatibilityScore} large animate />
              <span className="font-extrabold text-ink">{scoreLabel(profile.compatibilityScore)} match</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <section aria-label="Actions" className="flex flex-wrap items-center gap-3 border-b border-line py-6">
          <ConnectButton
            profile={profile}
            connected={connected}
            onConnected={() => setData({ profile, connected: true })}
            className="sm:h-14 sm:px-8 sm:text-h3"
          />
          {!connected && (
            <Button variant="secondary" onClick={pass} disabled={passing} className="sm:h-14 sm:px-8 sm:text-h3">
              {passing ? 'Passing…' : 'Pass'}
            </Button>
          )}
          <div className="ml-auto">
            <ReportBlockActions
              target={{ kind: 'profile', id: profile.id }}
              name={profile.name}
              onBlocked={() => navigate('/discover')}
            />
          </div>
        </section>

        <div className="grid gap-12 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start lg:gap-16">
          <div className="flex flex-col gap-12">
            <section>
              <h2 className="text-h2 font-extrabold">About {firstName}</h2>
              <p className="mt-4 max-w-prose text-h3 font-normal leading-relaxed text-ink-soft">{profile.bio}</p>
            </section>

            <section>
              <h2 className="text-h2 font-extrabold">Lifestyle</h2>
              <dl className="mt-4 border-b border-line">
                <Detail label="Sleep">{profile.sleepSchedule}</Detail>
                <Detail label="Cleanliness">{profile.cleanliness}</Detail>
                <Detail label="Social life">{profile.socialCadence}</Detail>
                <Detail label="Smoker">{profile.smoker ? 'Yes' : 'No'}</Detail>
                <Detail label="Budget">
                  {inr(profile.budgetMin)} to {inr(profile.budgetMax)}
                  <span className="font-normal text-muted"> a month</span>
                </Detail>
                <Detail label="Looking in">{profile.city}</Detail>
              </dl>
              <h3 className="mt-8 font-bold text-ink">Interests</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {profile.interests.map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-card bg-surface p-6 shadow-card sm:p-8 lg:sticky lg:top-24">
            <h2 className="text-h2 font-extrabold">Why you match</h2>
            <p className="mb-7 mt-1 text-ink-soft">How {firstName} scores against you on each factor.</p>
            <BreakdownBars breakdown={profile.breakdown} />
          </section>
        </div>
      </div>
    </div>
  )
}

export default function ProfileDetail() {
  const { id } = useParams()

  return id ? (
    <ProfileView key={id} id={id} />
  ) : (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/discover"
        className="mb-6 inline-flex min-h-11 items-center text-caption font-bold text-ink-soft hover:text-ink"
      >
        Back to discover
      </Link>
      <EmptyState
        title="Profile not found"
        description="This profile does not exist, or it is no longer available to you."
        action={<LinkButton to="/discover">Back to discover</LinkButton>}
      />
    </div>
  )
}
