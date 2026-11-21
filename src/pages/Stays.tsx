import { useEffect, useState } from 'react'
import { getStays } from '@/lib/api'
import type { Stay } from '@/types'
import { Button, EmptyState } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { StayCard, StayCardSkeleton } from '@/components/stays/StayCard'
import { StayFilterBar } from '@/components/stays/StayFilterBar'
import { DEFAULT_FILTERS, toApiFilters, type StayFilterState } from '@/components/stays/options'

/** Three doorways, one of them lit: the street the headline looks onto. */
function Doorways() {
  return (
    <div aria-hidden="true" className="hidden shrink-0 items-end gap-2 pb-1 md:flex">
      <span className="arch h-28 w-14 rounded-b-lg bg-gulabi" />
      <span className="arch flex h-40 w-16 items-center justify-center rounded-b-lg bg-ink">
        <span className="arch h-10 w-7 rounded-b-sm bg-haldi" />
      </span>
      <span className="arch h-24 w-14 rounded-b-lg bg-haldi" />
    </div>
  )
}

export default function Stays() {
  const [filters, setFilters] = useState<StayFilterState>(DEFAULT_FILTERS)
  const [stays, setStays] = useState<Stay[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let live = true
    setStays(null)
    setFailed(false)
    getStays(toApiFilters(filters))
      .then((result) => live && setStays(result))
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [filters, attempt])

  const clear = () => setFilters(DEFAULT_FILTERS)

  return (
    <div className="pb-16">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-14">
        <header className="mb-8 flex items-end justify-between gap-8 sm:mb-10">
          <div className="max-w-2xl">
            <h1 className="text-display font-black text-balance">Find your place</h1>
            <p className="mt-4 max-w-xl text-ink-soft">
              Stays checked by KHOKHI carry a verified badge. New listings show as pending until the check is done.
            </p>
          </div>
          <Doorways />
        </header>
      </div>

      <StayFilterBar value={filters} onChange={setFilters} onClear={clear} />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p aria-live="polite" className="mb-6 mt-6 text-caption font-semibold text-muted">
          {stays ? `${stays.length} ${stays.length === 1 ? 'stay' : 'stays'}` : failed ? '' : 'Loading stays…'}
        </p>

        {failed ? (
          <EmptyState
            title="Could not load stays"
            description="Something went wrong on our side. Check your connection and try again."
            action={<Button onClick={() => setAttempt((n) => n + 1)}>Try again</Button>}
          />
        ) : !stays ? (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <StayCardSkeleton key={i} />
            ))}
          </div>
        ) : stays.length === 0 ? (
          <EmptyState
            title="No stays match these filters"
            description="Try a higher budget, another city, or remove a filter to see more places."
            action={<Button onClick={clear}>Clear filters</Button>}
          />
        ) : (
          <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {stays.map((s, i) => (
              <Reveal as="li" key={s.id} delay={(i % 3) * 90} className="h-full">
                <StayCard stay={s} />
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
