import { Link } from 'react-router-dom'
import type { User } from '@/types'

const textLink = 'font-bold text-ink underline decoration-ink/40 underline-offset-4 hover:decoration-ink'

/** Shows whose lifestyle answers rank the feed, or a calm prompt to set that up. */
export function LifestyleMatch({ user }: { user: User | null }) {
  const compatibility = user?.onboarded ? user.compatibility : undefined

  if (compatibility) {
    return (
      <div className="on-dark inline-flex max-w-full items-center gap-3.5 rounded-pill bg-ink py-3 pl-5 pr-6 text-white">
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 rounded-full bg-haldi ring-4 ring-haldi/25"
        />
        <div className="min-w-0">
          <p className="text-caption font-bold leading-tight text-white">Lifestyle match active</p>
          <p className="mt-0.5 text-caption leading-tight text-white/80">
            {compatibility.archetype} &middot; score{' '}
            <span className="font-bold text-haldi">{compatibility.score}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="inline-flex max-w-full items-center rounded-pill border border-line bg-surface px-5 py-3 text-caption text-ink-soft">
      <p>
        {user ? (
          <>
            <Link to="/onboarding" className={textLink}>
              Take the lifestyle quiz
            </Link>{' '}
            to rank people by how well your habits fit.
          </>
        ) : (
          <>
            <Link to="/login" className={textLink}>
              Log in
            </Link>{' '}
            to rank people by how well your habits fit.
          </>
        )}
      </p>
    </div>
  )
}
