import { useEffect, useState } from 'react'
import { getMyListings } from '@/lib/api'
import { Reveal } from '@/components/Reveal'
import { Badge, Button, EmptyState, LinkButton, Skeleton } from '@/components/ui'
import { cn } from '@/lib/cn'
import { inr } from '@/lib/format'
import type { MyListing, StayType } from '@/types'

/** Each property type gets one of three flat fills, so a list reads at a glance. */
const SWATCH: Record<StayType, string> = {
  PG: 'bg-haldi-soft',
  'Private room': 'bg-gulabi',
  'Shared room': 'bg-brand-100',
  Flat: 'bg-gulabi',
  'Co-living': 'bg-brand-100',
  Hostel: 'bg-haldi-soft',
}

function ListingSkeleton() {
  return (
    <div aria-hidden="true" className="divide-y divide-line border-y border-line">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-5 py-6">
          <Skeleton className="h-16 w-12 !rounded-b-md rounded-t-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function MyListings({ onAdd }: { onAdd: () => void }) {
  const [listings, setListings] = useState<MyListing[] | null>(null)

  useEffect(() => {
    let live = true
    getMyListings().then((l) => live && setListings(l))
    return () => {
      live = false
    }
  }, [])

  if (!listings) return <ListingSkeleton />

  if (listings.length === 0) {
    return (
      <EmptyState
        title="You have not listed a space yet"
        description="Add your first listing and it will show up in Stays for renters to find."
        action={<Button onClick={onAdd}>Add your first listing</Button>}
      />
    )
  }

  return (
    <ul className="divide-y divide-line border-y-2 border-ink">
      {listings.map((l, i) => (
        <Reveal
          as="li"
          key={l.id}
          delay={i * 70}
          className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-4 py-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-x-8"
        >
          <span
            aria-hidden="true"
            className={cn(
              'arch row-span-1 flex h-20 w-14 items-end justify-center rounded-b-md pb-3 md:h-24 md:w-16',
              SWATCH[l.type] ?? 'bg-brand-100',
            )}
          >
            <span className="size-3 rounded-full bg-surface" />
          </span>

          <div className="min-w-0">
            <h3 className="text-h2 font-extrabold">{l.title}</h3>
            <p className="mt-1 text-ink-soft">
              {l.area}, {l.city} · {l.type}
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-soft">
              <span>
                From <span className="text-h3 font-black text-ink">{inr(l.rent)}</span> a month
              </span>
              <span
                className={cn(
                  'rounded-pill px-3 py-1 text-caption font-semibold',
                  l.enquiryCount > 0 ? 'bg-haldi-soft text-ink' : 'border border-line bg-surface text-ink-soft',
                )}
              >
                {l.enquiryCount} {l.enquiryCount === 1 ? 'enquiry' : 'enquiries'}
              </span>
            </p>
          </div>

          <div className="col-span-2 flex flex-wrap items-center justify-between gap-3 md:col-span-1 md:flex-col md:items-end">
            {l.verified ? <Badge tone="success">Verified</Badge> : <Badge tone="warning">Pending verification</Badge>}
            <LinkButton to={`/stays/${l.id}`} variant="secondary" size="sm">
              View listing
            </LinkButton>
          </div>
        </Reveal>
      ))}
    </ul>
  )
}
