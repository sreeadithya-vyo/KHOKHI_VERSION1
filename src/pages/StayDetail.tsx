import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getStay } from '@/lib/api'
import { inr } from '@/lib/format'
import type { Stay } from '@/types'
import { Button, EmptyState, LinkButton, Skeleton } from '@/components/ui'
import { ReportBlockActions } from '@/components/ReportBlockActions'
import { StayGallery } from '@/components/stays/StayGallery'
import { Rating, VerificationStatus } from '@/components/stays/StayMeta'
import { VisitRequestModal } from '@/components/stays/VisitRequestModal'

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-12" aria-hidden="true">
      <div className="flex flex-col gap-4">
        <Skeleton className="h-7 w-40 rounded-pill!" />
        <Skeleton className="h-14 w-full sm:h-20" />
        <Skeleton className="h-14 w-2/3 sm:h-20" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <div className="arch overflow-hidden rounded-b-lg">
        <Skeleton className="aspect-square w-full rounded-none! sm:aspect-[5/6]" />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-8 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-8">
      <h2 className="text-h2 font-extrabold">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

export default function StayDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  // undefined = loading, null = not found
  const [stay, setStay] = useState<Stay | null | undefined>(undefined)
  const [visitOpen, setVisitOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    let live = true
    setStay(undefined)
    getStay(id).then((s) => live && setStay(s))
    return () => {
      live = false
    }
  }, [id])

  if (stay === null || !id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          title="We could not find this stay"
          description="It may have been removed, or the link is incorrect."
          action={<LinkButton to="/stays">Back to all stays</LinkButton>}
        />
      </div>
    )
  }

  const closeVisit = () => setVisitOpen(false)

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:pb-16">
      <Link
        to="/stays"
        className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-pill px-4 text-caption font-bold text-ink ring-1 ring-inset ring-ink/25 transition-colors hover:bg-surface hover:ring-ink"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 6-6 6 6 6" />
        </svg>
        All stays
      </Link>

      {stay === undefined ? (
        <DetailSkeleton />
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-end lg:gap-12">
            <header className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <VerificationStatus verified={stay.verified} />
                <Rating stay={stay} />
              </div>
              <h1 className="mt-5 text-display font-black text-balance [overflow-wrap:anywhere]">{stay.title}</h1>
              <p className="mt-4 text-h2 font-semibold text-ink-soft">
                {stay.area}, {stay.city}
              </p>
            </header>

            <StayGallery stay={stay} />
          </div>

          <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-14">
            <div className="flex min-w-0 flex-col">
              <Section title="About this place">
                <p className="max-w-prose text-ink-soft">{stay.description}</p>
                <dl className="mt-6 divide-y divide-line border-y border-line sm:max-w-md">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-caption text-muted">Property type</dt>
                    <dd className="font-bold">{stay.type}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <dt className="text-caption text-muted">Gender policy</dt>
                    <dd className="font-bold">{stay.genderPolicy === 'Unisex' ? 'Unisex' : `${stay.genderPolicy} only`}</dd>
                  </div>
                </dl>
              </Section>

              <Section title="Amenities">
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {stay.amenities.map((a) => (
                    <li key={a} className="flex items-center gap-3 border-b border-line py-3">
                      <span aria-hidden="true" className="arch h-5 w-3.5 shrink-0 rounded-b-sm bg-haldi" />
                      {a}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Room types">
                <ul className="divide-y divide-line border-b border-line">
                  {stay.roomTypes.map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-4 py-4 first:pt-0">
                      <div className="min-w-0">
                        <p className="text-h3 font-bold">{r.name}</p>
                        <p className="text-caption text-muted">
                          {r.occupancy} {r.occupancy === 1 ? 'person' : 'people'}
                        </p>
                      </div>
                      <p className="shrink-0 text-right text-h2 font-extrabold tabular-nums">
                        {inr(r.rent)}
                        <span className="block text-caption font-medium text-muted">a month</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Location">
                <p className="text-ink-soft">{stay.distanceNote}</p>
              </Section>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
                <p className="text-caption text-muted">Something wrong with this listing?</p>
                <ReportBlockActions target={{ kind: 'stay', id: stay.id }} name={stay.title} onBlocked={() => navigate('/stays')} />
              </div>
            </div>

            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <div className="on-dark rounded-card bg-ink p-7 text-white shadow-lift">
                <p className="text-caption text-white/75">Rent from</p>
                <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-h1 font-black tabular-nums text-haldi">
                  {inr(stay.rent)}
                  <span className="text-caption font-medium text-white/75">a month</span>
                </p>
                <Button variant="accent" size="lg" fullWidth className="mt-6" onClick={() => setVisitOpen(true)}>
                  Request visit
                </Button>
                <p className="mt-4 border-t border-white/15 pt-4 text-caption text-white/75">
                  {stay.verified
                    ? 'This stay has been checked by KHOKHI.'
                    : 'This listing is waiting for verification. Ask the owner for details when you visit.'}
                </p>
              </div>
            </aside>
          </div>
        </>
      )}

      {stay && (
        <>
          <div className="on-dark fixed inset-x-0 bottom-[3.5625rem] z-30 flex items-center justify-between gap-4 bg-ink px-4 py-3 text-white md:bottom-0 lg:hidden">
            <div>
              <p className="text-caption text-white/75">Rent from</p>
              <p className="font-extrabold tabular-nums text-haldi">
                {inr(stay.rent)}
                <span className="text-caption font-medium text-white/75"> a month</span>
              </p>
            </div>
            <Button variant="accent" onClick={() => setVisitOpen(true)}>
              Request visit
            </Button>
          </div>
          <VisitRequestModal open={visitOpen} onClose={closeVisit} stayId={stay.id} stayTitle={stay.title} />
        </>
      )}
    </div>
  )
}
