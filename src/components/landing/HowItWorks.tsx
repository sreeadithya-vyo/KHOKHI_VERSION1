import { useRef, type ReactNode } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { Badge } from '@/components/ui'
import { Reveal } from '@/components/Reveal'
import { CheckIcon } from '@/components/icons'

/* Small illustrations drawn with currentColor so they read on every panel colour. */
const Line = ({ w, strong }: { w: string; strong?: boolean }) => (
  <span className={cn('block h-2.5 rounded-pill bg-current', strong ? 'opacity-80' : 'opacity-25')} style={{ width: w }} />
)

const ART: Record<string, ReactNode> = {
  profile: (
    <div className="flex items-center gap-3">
      <span className="grid size-11 place-items-center rounded-full bg-ink text-body font-extrabold text-white">Y</span>
      <div className="space-y-2">
        <Line w="6.5rem" strong />
        <Line w="4.5rem" />
      </div>
    </div>
  ),
  lifestyle: (
    <div className="flex flex-wrap justify-center gap-2 text-caption font-bold">
      <span className="rounded-pill bg-ink px-3.5 py-1.5 text-white">Early bird</span>
      <span className="rounded-pill px-3.5 py-1.5 ring-1 ring-current/50">Tidy</span>
      <span className="rounded-pill px-3.5 py-1.5 ring-1 ring-current/50">Night owl</span>
    </div>
  ),
  people: (
    <div className="w-44 space-y-3">
      {[94, 88, 81].map((n) => (
        <div key={n} className="flex items-center gap-3">
          <span className="h-2.5 flex-1 overflow-hidden rounded-pill bg-current/15">
            <span className="block h-full rounded-pill bg-current" style={{ width: `${n}%` }} />
          </span>
          <span className="w-9 text-caption font-black tabular-nums">{n}%</span>
        </div>
      ))}
    </div>
  ),
  stays: (
    <div className="flex items-center gap-3">
      <span className="arch h-14 w-11 rounded-b-md bg-current/20" />
      <div className="space-y-2">
        <Badge tone="success">
          <CheckIcon className="size-3.5" />
          Verified
        </Badge>
        <Line w="5.5rem" strong />
      </div>
    </div>
  ),
  connect: (
    <div className="w-44 space-y-2 text-caption font-semibold">
      <p className="w-fit rounded-2xl rounded-bl-sm bg-white/15 px-3.5 py-2 text-white">Hi, we matched!</p>
      <p className="ml-auto w-fit rounded-2xl rounded-br-sm bg-haldi px-3.5 py-2 text-ink">See the flat Sunday?</p>
    </div>
  ),
}

const STEPS = [
  { key: 'profile', title: 'Profile', body: 'Tell us who you are, your city and what you can spend.', tone: 'bg-gulabi text-ink' },
  { key: 'lifestyle', title: 'Lifestyle match', body: 'Answer a short quiz on sleep, cleanliness and how social you are.', tone: 'bg-haldi text-ink' },
  { key: 'people', title: 'Compatible people', body: 'See roommates ranked by how well your habits line up.', tone: 'bg-surface text-ink' },
  { key: 'stays', title: 'Verified stays', body: 'Browse places filtered by budget, area and who they are for.', tone: 'bg-gulabi-soft text-ink' },
  { key: 'connect', title: 'Connect', body: 'Message your matches and plan the move together.', tone: 'bg-ink text-white' },
]

/**
 * Five steps = a real sequence, so they are numbered. On desktop the section pins and the steps travel
 * sideways as you scroll; on phones and for reduced motion they stack.
 */
export function HowItWorks() {
  const isMd = useMediaQuery('(min-width: 768px)')
  const reduced = useReducedMotion()
  const horizontal = isMd && !reduced

  const section = useRef<HTMLElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!horizontal) return
      const t = track.current!
      const dist = () => t.scrollWidth - window.innerWidth + 48
      const st = {
        trigger: section.current!,
        start: 'top 64px',
        end: () => `+=${dist()}`,
        scrub: 0.6,
        invalidateOnRefresh: true,
      }
      gsap.to(t, { x: () => -dist(), ease: 'none', scrollTrigger: { ...st, pin: true, anticipatePin: 1 } })
      gsap.to(bar.current, { scaleX: 1, ease: 'none', scrollTrigger: st })
    },
    { scope: section, dependencies: [horizontal] },
  )

  return (
    <section
      ref={section}
      className={cn(horizontal ? 'flex flex-col justify-center overflow-hidden' : 'py-20 sm:py-28')}
      style={horizontal ? { height: 'calc(100dvh - 4rem)', minHeight: '40rem' } : undefined}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <h2 className="max-w-4xl text-display font-black">From a new city to a new home in five steps</h2>
      </div>

      <ol
        ref={track}
        className={cn(
          horizontal
            ? 'mt-8 flex w-max gap-6 pl-[max(1rem,calc((100vw-72rem)/2+1.5rem))] pr-6 will-change-transform'
            : 'mx-auto mt-12 grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3',
        )}
      >
        {STEPS.map((s, i) => {
          const className = cn(
            'arch relative flex flex-col rounded-b-card p-7',
            horizontal ? 'h-[min(27rem,50dvh)]' : 'h-[27rem]',
            horizontal ? 'w-[min(80vw,23rem)] shrink-0' : 'mx-auto w-full max-w-sm',
            s.tone,
          )
          const content = (
            <>
              <div className={cn('flex flex-1 items-start justify-center', horizontal ? 'mt-[min(4rem,6dvh)]' : 'mt-16')}>
                {ART[s.key]}
              </div>
              <span className="text-display font-black tabular-nums leading-none">{i + 1}</span>
              <h3 className="mt-2 text-h1 font-extrabold">{s.title}</h3>
              <p className="mt-2 max-w-[17rem] opacity-80">{s.body}</p>
            </>
          )
          return horizontal ? (
            <li key={s.key} className={className}>
              {content}
            </li>
          ) : (
            <Reveal key={s.key} as="li" delay={(i % 3) * 90} className={className}>
              {content}
            </Reveal>
          )
        })}
      </ol>

      {horizontal && (
        <div className="mx-auto mt-8 w-full max-w-6xl px-4 sm:px-6" aria-hidden="true">
          <span className="block h-[3px] overflow-hidden rounded-pill bg-ink/15">
            <span ref={bar} className="block h-full origin-left scale-x-0 rounded-pill bg-ink" />
          </span>
        </div>
      )}
    </section>
  )
}
