import { useEffect, useRef, useState } from 'react'
import type { CompatibilityBreakdown } from '@/types'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { BREAKDOWN_FACTORS } from './breakdownFactors'

/**
 * The seven compatibility factors as thick labelled bars, each with its score and weight.
 * This is the screen's one scroll-linked moment: the bars fill (width transition, staggered) the first
 * time the list scrolls into view. Reduced-motion users see them filled instantly.
 */
export function BreakdownBars({ breakdown }: { breakdown: CompatibilityBreakdown }) {
  const reduced = useReducedMotion()
  const listRef = useRef<HTMLUListElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = listRef.current
    if (!el || reduced) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  const filled = seen || reduced

  return (
    <ul ref={listRef} className="flex flex-col gap-6">
      {BREAKDOWN_FACTORS.map(({ key, label, weight }, index) => {
        const score = breakdown[key]
        return (
          <li key={key}>
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <span className="block font-bold text-ink">{label}</span>
                <span className="block text-caption tabular-nums text-muted">weight {weight}%</span>
              </div>
              <span className="text-h2 font-black tabular-nums text-ink">{score}%</span>
            </div>
            <div
              role="meter"
              aria-label={`${label} compatibility`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score}
              className="mt-2 h-4 overflow-hidden rounded-pill bg-brand-100"
            >
              <div
                className="h-full rounded-pill bg-brand-600 transition-[width] duration-[1100ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
                style={{
                  width: filled ? `${score}%` : '0%',
                  transitionDelay: reduced ? '0ms' : `${index * 90}ms`,
                }}
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
