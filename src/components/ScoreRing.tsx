import type { CSSProperties } from 'react'
import { cn } from '@/lib/cn'

const R = 30
const C = 2 * Math.PI * R

interface Props {
  score: number // 0-100
  animate?: boolean
  large?: boolean
  className?: string
}

/** Circular compatibility score. `animate` sweeps the arc in on mount (respects reduced motion). */
export function ScoreRing({ score, animate, large, className }: Props) {
  const target = C * (1 - score / 100)
  return (
    <div
      className={cn('relative shrink-0', large ? 'size-32' : 'size-[4.5rem]', className)}
      role="img"
      aria-label={`${score}% compatible`}
    >
      <svg viewBox="0 0 72 72" className="size-full -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r={R} fill="none" strokeWidth="6" className="stroke-brand-100" />
        <circle
          cx="36"
          cy="36"
          r={R}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          className={cn('stroke-brand-600', animate && 'hero-ring')}
          strokeDasharray={C}
          strokeDashoffset={target}
          style={{ '--ring-full': C } as CSSProperties}
        />
      </svg>
      <span
        className={cn(
          'absolute inset-0 flex items-center justify-center font-extrabold tabular-nums text-ink',
          large ? 'text-h1' : 'text-h3',
        )}
      >
        {score}%
      </span>
    </div>
  )
}
