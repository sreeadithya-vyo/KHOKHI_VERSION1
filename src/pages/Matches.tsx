import { useEffect, useState } from 'react'
import { getMatches } from '@/lib/api'
import type { Match } from '@/types'
import { EmptyState, LinkButton } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { MatchRow } from '@/components/matches/MatchRow'
import { MatchesSkeleton } from '@/components/matches/MatchesSkeleton'

export default function Matches() {
  const [matches, setMatches] = useState<Match[] | null>(null)

  useEffect(() => {
    let live = true
    getMatches().then((result) => {
      if (live) setMatches(result)
    })
    return () => {
      live = false
    }
  }, [])

  const count = matches?.length ?? 0

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
      <div className="flex items-end gap-4 sm:gap-6">
        <h1 className="text-display font-black text-ink">
          Matches
          {count > 0 && <span className="sr-only">, {count} connected</span>}
        </h1>
        {count > 0 && (
          <span
            aria-hidden="true"
            className="arch mb-1 flex h-16 w-12 shrink-0 items-center justify-center rounded-b-lg bg-haldi pt-3 text-h1 font-black tabular-nums text-ink sm:mb-2 sm:h-24 sm:w-[4.5rem]"
          >
            {count}
          </span>
        )}
      </div>
      <p className="mb-10 mt-4 max-w-prose text-h3 font-normal text-ink-soft sm:mb-12">
        People you have connected with. Open a chat to say hello.
      </p>

      {!matches ? (
        <MatchesSkeleton />
      ) : matches.length === 0 ? (
        <EmptyState
          title="No connections yet"
          description="When you connect with someone on Discover, they will show up here."
          action={<LinkButton to="/discover">Find people to connect with</LinkButton>}
        />
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {matches.map((m, index) => (
            <Reveal key={m.id} as="li" delay={index * 70}>
              <MatchRow match={m} />
            </Reveal>
          ))}
        </ul>
      )}
    </div>
  )
}
