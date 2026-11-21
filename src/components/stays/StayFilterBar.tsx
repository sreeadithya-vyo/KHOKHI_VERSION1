import { useEffect, useRef, useState } from 'react'
import type { City, GenderPolicy, StayType } from '@/types'
import { cn } from '@/lib/cn'
import { Button, Select } from '@/components/ui'
import {
  BUDGET_OPTIONS,
  CITY_OPTIONS,
  GENDER_OPTIONS,
  TYPE_OPTIONS,
  isDefaultFilters,
  type StayFilterState,
} from './options'

interface Props {
  value: StayFilterState
  onChange: (next: StayFilterState) => void
  onClear: () => void
}

/** Header is h-16; the bar sticks right under it. */
const HEADER = 64

const pill = 'rounded-pill! pl-5! font-semibold'

/**
 * Full-bleed sticky filter strip. It sits flat on the page, then picks up a blur, border and
 * indigo shadow once it is stuck under the header (the one scroll moment on this screen).
 */
export function StayFilterBar({ value, onChange, onClear }: Props) {
  const sentinel = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!!entry && !entry.isIntersecting && entry.boundingClientRect.top < HEADER),
      { rootMargin: `-${HEADER}px 0px 0px 0px`, threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px" />
      <div
        className={cn(
          'sticky top-16 z-30 border-b transition-[background-color,box-shadow,border-color] duration-300',
          stuck ? 'border-line bg-canvas/90 shadow-card backdrop-blur-md' : 'border-transparent bg-transparent',
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div
            role="group"
            aria-label="Filter stays"
            className="-mx-4 flex items-end gap-3 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <div className="w-44 shrink-0 lg:w-auto lg:min-w-0 lg:flex-1">
              <Select
                label="Gender policy"
                options={GENDER_OPTIONS}
                value={value.gender}
                className={cn(pill, value.gender !== 'All' && 'border-ink!')}
                onChange={(e) => onChange({ ...value, gender: e.target.value as GenderPolicy | 'All' })}
              />
            </div>
            <div className="w-44 shrink-0 lg:w-auto lg:min-w-0 lg:flex-1">
              <Select
                label="Budget"
                options={BUDGET_OPTIONS}
                value={value.budget}
                className={cn(pill, value.budget !== '' && 'border-ink!')}
                onChange={(e) => onChange({ ...value, budget: e.target.value })}
              />
            </div>
            <div className="w-44 shrink-0 lg:w-auto lg:min-w-0 lg:flex-1">
              <Select
                label="Property type"
                options={TYPE_OPTIONS}
                value={value.type}
                className={cn(pill, value.type !== 'All' && 'border-ink!')}
                onChange={(e) => onChange({ ...value, type: e.target.value as StayType | 'All' })}
              />
            </div>
            <div className="w-44 shrink-0 lg:w-auto lg:min-w-0 lg:flex-1">
              <Select
                label="City"
                options={CITY_OPTIONS}
                value={value.city}
                className={cn(pill, value.city !== 'All' && 'border-ink!')}
                onChange={(e) => onChange({ ...value, city: e.target.value as City | 'All' })}
              />
            </div>
            <Button variant="secondary" onClick={onClear} disabled={isDefaultFilters(value)} className="shrink-0">
              Clear filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
