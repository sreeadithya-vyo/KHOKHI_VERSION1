import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { CheckIcon } from '@/components/icons'
import { RevealLines } from './RevealLines'

const TODAY = [
  'Roommates found through a group chat',
  'Listings nobody can vouch for',
  'Habits you learn about after you sign',
]
const WITH_KHOKHI = [
  'People ranked by lifestyle fit',
  'Stays marked as verified',
  'Habits compared before you meet',
]

/** The dark band rises into the page as an arch (an ellipse that opens as you scroll). */
export function ProblemSolution() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          ref.current,
          { clipPath: 'ellipse(62% 40% at 50% 100%)' },
          {
            clipPath: 'ellipse(150% 150% at 50% 100%)',
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top 95%', end: 'top 12%', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section ref={ref} className="on-dark bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-36">
        <div>
          <RevealLines lines={['Moving is easy.', 'Living together', 'is hard.']} className="text-display font-black text-white" />
          <p className="mt-8 max-w-md text-h3 font-normal text-white/80">
            The boxes and the train ticket are the easy part. Whether your roommate keeps your hours and the place
            matches its listing decides how the year goes.
          </p>
        </div>

        <div className="grid content-center gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-body font-bold text-white/80">Today</h3>
            <ul className="mt-4 space-y-4 text-white/75">
              {TODAY.map((t) => (
                <li key={t} className="border-l-2 border-white/25 pl-4">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-card bg-dusk p-6 ring-1 ring-white/10">
            <h3 className="text-body font-bold text-haldi">With KHOKHI</h3>
            <ul className="mt-4 space-y-4">
              {WITH_KHOKHI.map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckIcon className="mt-0.5 size-5 shrink-0 text-haldi" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
