import { Link } from 'react-router-dom'
import { PREMIUM_MATCH_THRESHOLD } from '@/lib/plan'

/** One slim line for free members. The profiles themselves stay fully visible. */
export function PremiumNote() {
  return (
    <div className="flex flex-col gap-1 rounded-[1.25rem] bg-haldi-soft px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:rounded-pill">
      <p className="text-body text-ink">
        <span className="font-bold">Premium unlocks connections with {PREMIUM_MATCH_THRESHOLD}%+ matches.</span>{' '}
        You can still view every profile.
      </p>
      <Link
        to="/premium"
        className="shrink-0 text-body font-bold text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink"
      >
        See Premium
      </Link>
    </div>
  )
}
