import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const TEXT =
  'Moving across India is easy. Living with a stranger is the hard part. KHOKHI matches how you live, before you ever share a key.'

/** The words fill from faint to solid as you scroll past. Fully solid for reduced motion. */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.word',
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.12,
            scrollTrigger: { trigger: ref.current, start: 'top 82%', end: 'bottom 48%', scrub: true },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-28 sm:px-6 lg:py-44">
      <h2 className="sr-only">What KHOKHI does</h2>
      <p ref={ref} className="max-w-5xl text-display font-extrabold" style={{ fontStretch: '112%' }}>
        {TEXT.split(' ').map((word, i) => (
          <span key={i}>
            <span className="word">{word}</span>{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
