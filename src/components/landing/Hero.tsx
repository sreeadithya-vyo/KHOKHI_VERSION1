import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { LinkButton } from '@/components/ui'
import { Facade } from './Facade'
import { PairCards } from './PairCards'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

function HeroCopy() {
  return (
    <>
      <h1 className="text-hero font-black text-white">
        <span className="block">Right People.</span>
        <span className="block">Right Place.</span>
      </h1>
      <p className="mt-6 max-w-xl text-h3 font-normal text-white/80">
        Moving to a new city for college or work? KHOKHI matches you with roommates whose habits fit yours, and stays
        that have been checked.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <LinkButton to="/signup" size="lg" variant="accent">
          Find your people
        </LinkButton>
        <LinkButton to="/stays" size="lg" variant="outline-light">
          Find your place
        </LinkButton>
      </div>
    </>
  )
}

/**
 * Pinned scroll sequence: the headline clears, windows light up in the facade, the camera pushes into one
 * lit window and the matched pair (real data from the api) appears inside it.
 */
function PinnedHero() {
  const root = useRef<HTMLElement>(null)
  const facade = useRef<HTMLDivElement>(null)
  const geo = useRef({ S: 2.6, ox: 0, oy: 0, dx: 0, dy: 0 })

  useGSAP(
    () => {
      const rootEl = root.current!
      const f = facade.current!
      const target = f.querySelector<HTMLElement>('[data-target]')!
      const lit = gsap.utils.toArray<HTMLElement>('.win-lit', f)

      // Where the target window is, relative to the facade and the hero, with the facade at rest.
      const measure = () => {
        gsap.set(f, { clearProps: 'transform' })
        const fr = f.getBoundingClientRect()
        const tr = target.getBoundingClientRect()
        const hr = rootEl.getBoundingClientRect()
        const g = geo.current
        g.ox = tr.left - fr.left + tr.width / 2
        g.oy = tr.top - fr.top + tr.height / 2
        g.dx = hr.left + hr.width / 2 - (tr.left + tr.width / 2)
        g.dy = hr.top + hr.height / 2 - (tr.top + tr.height / 2)
        g.S = clamp((hr.height * 0.85) / tr.height, 2, 4.5)
        gsap.set(f, { transformOrigin: `${g.ox}px ${g.oy}px` })
      }
      measure()
      gsap.set('.pair-wrap', { autoAlpha: 0, scale: 0.88, y: 40 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: rootEl,
          start: 'top 64px',
          end: '+=230%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefreshInit: measure,
        },
      })

      tl.to('.hero-copy', { autoAlpha: 0, y: -70, duration: 0.16, ease: 'power1.in' }, 0)
        .to(lit, { opacity: 1, duration: 0.08, stagger: { amount: 0.42, from: 'random' } }, 0.06)
        .to(
          f,
          { scale: () => geo.current.S, x: () => geo.current.dx, y: () => geo.current.dy, duration: 0.42, ease: 'power2.inOut' },
          0.5,
        )
        .to('.pair-wrap', { autoAlpha: 1, scale: 1, y: 0, duration: 0.26, ease: 'power2.out' }, 0.78)
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      aria-label="Introduction"
      className="on-dark relative isolate overflow-hidden bg-ink text-white"
      style={{ height: 'calc(100dvh - 4rem)', minHeight: '36rem' }}
    >
      <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
        <div ref={facade} className="will-change-transform">
          <Facade />
        </div>
      </div>

      <div className="hero-copy absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-6xl px-4 pb-[calc(2.5rem+var(--banner-h,0px))] sm:px-6 sm:pb-[calc(3.5rem+var(--banner-h,0px))]">
          <HeroCopy />
        </div>
      </div>

      <div className="pair-wrap absolute inset-0 z-20 grid place-items-center px-4">
        <PairCards />
      </div>
    </section>
  )
}

/** Reduced motion: the same ideas, laid out still. */
function StaticHero() {
  return (
    <section aria-label="Introduction" className="on-dark relative isolate overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 grid place-items-center opacity-40" aria-hidden="true">
        <Facade allLit />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-24">
        <div>
          <HeroCopy />
        </div>
        <div className="mx-auto w-full max-w-sm">
          <PairCards />
        </div>
      </div>
    </section>
  )
}

export function Hero() {
  return useReducedMotion() ? <StaticHero /> : <PinnedHero />
}
