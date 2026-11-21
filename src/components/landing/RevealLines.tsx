import { useRef, type RefObject } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

interface Props {
  lines: string[]
  as?: 'h1' | 'h2'
  className?: string
}

/** Headline whose lines rise out of a mask, once, as it enters the viewport. Static for reduced motion. */
export function RevealLines({ lines, as: Tag = 'h2', className }: Props) {
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.rl-inner', {
          yPercent: 115,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: 'top 88%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: ref as RefObject<HTMLElement> },
  )

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line) => (
        <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
          <span className="rl-inner block">{line}</span>
        </span>
      ))}
    </Tag>
  )
}
