import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * Decorative "lit windows" composition for the auth screens: a skyline of arch doorways in indigo,
 * a few of which light up in haldi (one with someone standing in it). Purely ornamental, hidden from
 * assistive tech. Lit windows switch on one after another once on mount (instant for reduced motion).
 */

type Pane = 'dark' | 'lit' | 'person'

interface Building {
  /** Height as a share of the facade. */
  height: string
  tone: string
  panes: Pane[]
}

const BUILDINGS: Building[] = [
  { height: 'h-[54%]', tone: 'bg-dusk-deep', panes: ['dark', 'lit'] },
  { height: 'h-[84%]', tone: 'bg-dusk', panes: ['dark', 'person', 'dark'] },
  { height: 'h-[66%]', tone: 'bg-dusk-deep', panes: ['lit', 'dark'] },
  { height: 'h-[94%]', tone: 'bg-dusk', panes: ['dark', 'dark', 'lit', 'dark'] },
]

function useLightsOn() {
  const reduced = useReducedMotion()
  const [on, setOn] = useState(reduced)
  useEffect(() => {
    if (reduced) {
      setOn(true)
      return
    }
    const id = window.setTimeout(() => setOn(true), 350)
    return () => window.clearTimeout(id)
  }, [reduced])
  return on
}

function Window({ pane, on, delay }: { pane: Pane; on: boolean; delay: number }) {
  const lit = pane !== 'dark'
  return (
    <span
      style={{ transitionDelay: lit ? `${delay}ms` : undefined }}
      className={cn(
        'arch relative block aspect-[3/4] w-full max-w-16 overflow-hidden rounded-b-md transition-colors duration-700 motion-reduce:transition-none',
        lit && on ? 'bg-haldi' : 'bg-ink',
      )}
    >
      {pane === 'person' && (
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 flex flex-col items-center transition-opacity duration-700 motion-reduce:transition-none',
            on ? 'opacity-100' : 'opacity-0',
          )}
          style={{ transitionDelay: `${delay}ms` }}
        >
          <span className="aspect-square w-[30%] rounded-full bg-dusk" />
          <span className="arch mt-[4%] h-[26%] w-[62%] bg-dusk" />
        </span>
      )}
    </span>
  )
}

/** Tall skyline for the desktop panel. Fills the height of its parent and stands on its bottom edge. */
export function ArchFacade({ className }: { className?: string }) {
  const on = useLightsOn()
  let lit = 0
  return (
    <div aria-hidden="true" className={cn('flex h-full items-end gap-3 xl:gap-4', className)}>
      {BUILDINGS.map((b, i) => (
        <div
          key={i}
          className={cn(
            'arch flex flex-1 flex-col items-center gap-3 rounded-b-none px-2 pt-[18%] xl:gap-4',
            b.height,
            b.tone,
          )}
        >
          {b.panes.map((pane, j) => (
            <Window key={j} pane={pane} on={on} delay={pane === 'dark' ? 0 : 250 + 380 * lit++} />
          ))}
        </div>
      ))}
    </div>
  )
}

/** Slim strip version for small screens: a few low doorways with one or two lit. */
export function ArchStrip({ className }: { className?: string }) {
  const on = useLightsOn()
  const doors: Array<{ h: string; lit: boolean }> = [
    { h: 'h-6', lit: false },
    { h: 'h-10', lit: true },
    { h: 'h-8', lit: false },
    { h: 'h-12', lit: false },
    { h: 'h-9', lit: true },
  ]
  return (
    <div aria-hidden="true" className={cn('flex items-end gap-1.5', className)}>
      {doors.map((d, i) => (
        <span
          key={i}
          style={{ transitionDelay: d.lit ? `${300 + i * 200}ms` : undefined }}
          className={cn(
            'arch w-5 rounded-b-none transition-colors duration-700 motion-reduce:transition-none',
            d.h,
            d.lit && on ? 'bg-haldi' : i % 2 ? 'bg-dusk' : 'bg-dusk-deep',
          )}
        />
      ))}
    </div>
  )
}
