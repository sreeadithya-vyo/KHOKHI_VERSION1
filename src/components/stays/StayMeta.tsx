import type { Stay } from '@/types'
import { Badge } from '@/components/ui'
import { CheckIcon } from '@/components/icons'

/** Verified badge for checked stays, a quiet pending badge for the rest. */
export function VerificationStatus({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge tone="success">
      <CheckIcon className="size-3.5" />
      Verified
    </Badge>
  ) : (
    <Badge tone="warning">Pending verification</Badge>
  )
}

/** Rating and review count, or "New" for stays without reviews. */
export function Rating({ stay }: { stay: Pick<Stay, 'rating' | 'reviewCount'> }) {
  if (stay.reviewCount === 0) {
    return <span className="text-caption font-semibold text-ink-soft">New</span>
  }
  return (
    <span className="inline-flex items-center gap-1 text-caption text-ink-soft">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 fill-warning text-warning">
        <path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.5 6.6 19.5l1.2-6L3.3 9.3l6.1-.7L12 3Z" />
      </svg>
      <span className="font-semibold text-ink">{stay.rating.toFixed(1)}</span>
      <span className="text-muted">
        ({stay.reviewCount} {stay.reviewCount === 1 ? 'review' : 'reviews'})
      </span>
    </span>
  )
}
