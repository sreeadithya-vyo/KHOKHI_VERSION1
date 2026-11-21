import type { Stay } from '@/types'
import { inr } from '@/lib/format'
import { LinkButton, Skeleton, Tag } from '@/components/ui'
import { Rating, VerificationStatus } from './StayMeta'
import { StayCover } from './StayCover'

const VISIBLE_AMENITIES = 4

/** A poster of the place: illustrated arch cover, then the facts, with rent as the hero number. */
export function StayCard({ stay }: { stay: Stay }) {
  const extra = stay.amenities.length - VISIBLE_AMENITIES
  const roomCount = stay.roomTypes.length

  return (
    <article className="relative flex h-full flex-col">
      <div className="relative">
        <StayCover type={stay.type} className="aspect-[5/4] w-full" />
        <div className="absolute -bottom-3 left-4 rounded-pill bg-canvas p-1">
          <VerificationStatus verified={stay.verified} />
        </div>
      </div>

      <div className="flex flex-1 flex-col pt-8">
        <h2 className="text-h3 font-extrabold leading-tight">{stay.title}</h2>
        <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="font-medium text-ink-soft">
            {stay.area}, {stay.city}
          </p>
          <Rating stay={stay} />
        </div>
        <p className="mt-1 text-caption text-muted">
          {stay.type} · {stay.genderPolicy === 'Unisex' ? 'Unisex' : `${stay.genderPolicy} only`}
        </p>
        <p className="mt-1 text-caption text-ink-soft">{stay.distanceNote}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {stay.amenities.slice(0, VISIBLE_AMENITIES).map((a) => (
            <Tag key={a}>{a}</Tag>
          ))}
          {extra > 0 && <Tag className="text-muted">+{extra} more</Tag>}
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 pt-6">
          <div>
            <p className="text-caption text-muted">Rent from</p>
            <p className="text-h1 font-black leading-none tabular-nums">{inr(stay.rent)}</p>
            <p className="mt-1.5 text-caption text-muted">
              a month · {roomCount} room {roomCount === 1 ? 'type' : 'types'}
            </p>
          </div>
          <LinkButton
            to={`/stays/${stay.id}`}
            variant="secondary"
            aria-label={`View details for ${stay.title}`}
            className="after:absolute after:inset-0"
          >
            View details
          </LinkButton>
        </div>
      </div>
    </article>
  )
}

export function StayCardSkeleton() {
  return (
    <div className="flex flex-col" aria-hidden="true">
      <div className="arch overflow-hidden rounded-b-lg">
        <Skeleton className="aspect-[5/4] w-full rounded-none!" />
      </div>
      <div className="flex flex-col gap-3 pt-8">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-16 rounded-pill!" />
          <Skeleton className="h-7 w-20 rounded-pill!" />
          <Skeleton className="h-7 w-14 rounded-pill!" />
        </div>
        <div className="flex items-end justify-between pt-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-11 w-28 rounded-pill!" />
        </div>
      </div>
    </div>
  )
}
