import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/cn'
import { LinkButton } from '@/components/ui'
import { RevealLines } from './RevealLines'

/** Skyline of ink arches that grows out of the footer. Some windows are lit. */
const SKYLINE = [
  { h: 7, lit: false },
  { h: 11.5, lit: true },
  { h: 8.5, lit: false },
  { h: 14, lit: true },
  { h: 9.5, lit: false },
  { h: 12.5, lit: false },
  { h: 7.5, lit: true },
  { h: 10.5, lit: false },
]

export function FinalCta() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.sky', {
          y: 120,
          ease: 'none',
          stagger: 0.04,
          scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom bottom', scrub: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="overflow-hidden bg-gulabi">
      <div className="mx-auto max-w-6xl px-4 pt-24 sm:px-6 lg:pt-36">
        <RevealLines lines={['Find your people.', 'Find your place.']} className="text-hero font-black" />
        <div className="mt-10 flex flex-wrap gap-3">
          <LinkButton to="/signup" size="lg">
            Create your account
          </LinkButton>
          <LinkButton to="/stays" size="lg" variant="secondary">
            Browse verified stays
          </LinkButton>
        </div>
      </div>

      <div className="mx-auto mt-20 flex max-w-6xl items-end gap-2 px-4 sm:gap-4 sm:px-6" aria-hidden="true">
        {SKYLINE.map((b, i) => (
          <div
            key={i}
            className={cn('sky arch relative flex-1 bg-ink', i > 4 && 'hidden sm:block')}
            style={{ height: `${b.h}rem` }}
          >
            {b.lit && <span className="arch absolute left-1/2 top-[20%] h-[28%] w-[44%] -translate-x-1/2 bg-haldi" />}
          </div>
        ))}
      </div>
    </section>
  )
}
