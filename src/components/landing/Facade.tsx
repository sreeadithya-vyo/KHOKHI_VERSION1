import { cn } from '@/lib/cn'

const COLS = 6
const ROWS = 6

/** Windows that light up as you scroll. */
const LIT = new Set([3, 5, 8, 10, 13, 15, 16, 19, 22, 24, 27, 29, 32])
/** Always lit: the first glimpse of the idea. */
const GLIMPSE = new Set([1, 4])
/** The window the camera pushes into; it is where the matched pair appears. */
const TARGET = 15
/** A few lit windows get a gulabi curtain. */
const CURTAIN = new Set([3, 10, 15, 22, 29])

interface Props {
  /** Show every lit window immediately (reduced-motion / static hero). */
  allLit?: boolean
  className?: string
}

/**
 * An apartment block at dusk: a grid of arch windows. The hero lights them one by one on scroll
 * (`.win-lit` elements are animated by GSAP) and zooms into `[data-target]`.
 */
export function Facade({ allLit, className }: Props) {
  return (
    <div
      className={cn(
        'grid w-[150vw] grid-cols-6 gap-2.5 sm:w-[118vw] sm:gap-4 lg:w-[104vw] lg:gap-5',
        className,
      )}
      style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => {
        const lit = LIT.has(i)
        const glimpse = GLIMPSE.has(i)
        return (
          <div
            key={i}
            data-target={i === TARGET ? '' : undefined}
            className="arch relative aspect-[3/4] overflow-hidden rounded-b-[0.45rem] bg-dusk"
          >
            {(lit || glimpse) && (
              <span
                className={cn(
                  'absolute inset-0 bg-haldi',
                  lit && !allLit && 'win-lit opacity-0',
                )}
              >
                {CURTAIN.has(i) && <span className="absolute inset-y-0 left-0 w-[34%] bg-gulabi" />}
              </span>
            )}
            {/* mullion + transom */}
            <span className={cn('absolute inset-y-0 left-1/2 w-[2px]', lit || glimpse ? 'bg-ink/35' : 'bg-dusk-deep')} />
            <span className={cn('absolute inset-x-0 top-[40%] h-[2px]', lit || glimpse ? 'bg-ink/35' : 'bg-dusk-deep')} />
          </div>
        )
      })}
    </div>
  )
}
