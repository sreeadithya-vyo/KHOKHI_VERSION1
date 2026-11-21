import { cn } from '@/lib/cn'

/** Height of each window, and whether it starts out lit. A deliberately uneven facade. */
const WINDOWS: Array<{ h: string; lit: boolean }> = [
  { h: 'h-24', lit: false },
  { h: 'h-32', lit: true },
  { h: 'h-20', lit: false },
  { h: 'h-28', lit: false },
  { h: 'h-36', lit: true },
  { h: 'h-24', lit: false },
  { h: 'h-32', lit: false },
]

/**
 * Decorative facade of arch windows standing on a ledge. A few are lit in haldi; with `litAll`
 * (Premium is active) every window lights up in a slow stagger. Purely decorative, hidden from assistive tech.
 */
export function ArchWindows({ litAll = false, className }: { litAll?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex items-end gap-2.5', className)}>
      {WINDOWS.map((w, i) => {
        const lit = litAll || w.lit
        return (
          <span
            key={i}
            style={{ transitionDelay: litAll ? `${i * 110}ms` : '0ms' }}
            className={cn(
              'arch relative block flex-1 rounded-b-md transition-colors duration-700 motion-reduce:transition-none',
              w.h,
              lit ? 'bg-haldi' : 'bg-ink ring-1 ring-inset ring-brand-500/40',
            )}
          >
            {/* the mullion */}
            <span
              style={{ transitionDelay: litAll ? `${i * 110}ms` : '0ms' }}
              className={cn(
                'absolute inset-x-0 top-[58%] h-px transition-colors duration-700 motion-reduce:transition-none',
                lit ? 'bg-haldi-deep' : 'bg-brand-500/40',
              )}
            />
          </span>
        )
      })}
    </div>
  )
}
