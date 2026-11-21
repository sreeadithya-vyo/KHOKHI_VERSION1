import { useEffect, useRef, useState } from 'react'
import type { City } from '@/types'
import { inr } from '@/lib/format'
import { Button, FilterChip } from '@/components/ui'
import { cn } from '@/lib/cn'
import { BUDGET_OPTIONS, TAG_GROUPS, toggleTag } from './filterOptions'

interface Props {
  cities: City[]
  city: City | 'All'
  onCity: (city: City | 'All') => void
  budgetMax: number | undefined
  onBudget: (budgetMax: number | undefined) => void
  tags: string[]
  onTags: (tags: string[]) => void
  onClear: () => void
}

/** Chip rows scroll sideways on phones (vertical padding leaves room for the focus ring). */
const chipRow =
  '-mx-1 -my-1.5 flex min-w-0 flex-1 gap-2 overflow-x-auto px-1 py-1.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible'

/** Height of the app header; the bar sticks just beneath it. */
const HEADER_PX = 64

/**
 * One sticky pill bar. A 1px sentinel sits just above it in the flow; when the sentinel scrolls
 * under the header the bar is "stuck" and gains its shadow. One IntersectionObserver, no scroll listener.
 */
export function FilterBar({ cities, city, onCity, budgetMax, onBudget, tags, onTags, onClear }: Props) {
  const filtered = city !== 'All' || budgetMax !== undefined || tags.length > 0
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        setStuck(!entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? HEADER_PX))
      },
      { rootMargin: `-${HEADER_PX}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="-mb-px h-px" />
      <section aria-label="Filters" className="sticky top-16 z-30 py-2">
        <div
          data-stuck={stuck}
          className={cn(
            'rounded-[1.75rem] border bg-canvas/90 p-3 backdrop-blur-md transition-[box-shadow,border-color] duration-300 motion-reduce:transition-none sm:px-4',
            stuck ? 'border-line shadow-lift' : 'border-line/70 shadow-none',
          )}
        >
          <div className="flex items-center gap-2">
            <div className="relative shrink-0">
              <label htmlFor="filter-budget" className="sr-only">
                Max monthly budget
              </label>
              <select
                id="filter-budget"
                value={budgetMax === undefined ? '' : String(budgetMax)}
                onChange={(e) => onBudget(e.target.value ? Number(e.target.value) : undefined)}
                className={cn(
                  'h-10 lg:h-9 appearance-none rounded-pill border pl-4 pr-9 text-caption font-semibold transition-colors',
                  '[&>option]:bg-surface [&>option]:text-ink',
                  budgetMax === undefined
                    ? 'border-line bg-surface text-ink-soft hover:border-brand-300 hover:text-ink'
                    : 'border-brand-600 bg-brand-600 text-white',
                )}
              >
                <option value="">Any budget</option>
                {BUDGET_OPTIONS.map((v) => (
                  <option key={v} value={String(v)}>
                    Up to {inr(v)}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2',
                  budgetMax === undefined ? 'text-muted' : 'text-white',
                )}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />

            <p id="filter-city" className="sr-only">
              City
            </p>
            <div role="group" aria-labelledby="filter-city" className={chipRow}>
              {['All', ...cities].map((c) => (
                <FilterChip key={c} active={city === c} onClick={() => onCity(c as City | 'All')} className="shrink-0 lg:h-9">
                  {c}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <p id="filter-lifestyle" className="sr-only">
              Lifestyle and interests
            </p>
            <div role="group" aria-labelledby="filter-lifestyle" className={cn(chipRow, 'sm:gap-x-5 sm:gap-y-2')}>
              {TAG_GROUPS.map((group, i) => (
                <div
                  key={group.id}
                  role="group"
                  aria-label={group.label}
                  className={cn(
                    'flex shrink-0 gap-2 sm:flex-wrap sm:shrink',
                    i > 0 && 'border-l border-line pl-3 sm:border-l-0 sm:pl-0',
                  )}
                >
                  {group.tags.map((t) => (
                    <FilterChip key={t} active={tags.includes(t)} onClick={() => onTags(toggleTag(tags, t))} className="shrink-0 lg:h-9">
                      {t}
                    </FilterChip>
                  ))}
                </div>
              ))}
            </div>
            {filtered && (
              <Button variant="ghost" size="sm" onClick={onClear} className="shrink-0 self-start">
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

