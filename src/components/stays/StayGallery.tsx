import { useEffect, useRef, useState } from 'react'
import type { Stay } from '@/types'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/useReducedMotion'
import { StayCover, WindowPanel, coverFor, toneBg } from './StayCover'

const DESKTOP = '(min-width: 1024px)'

/** Pixels of scroll over which the layers travel to their full offset. */
const TRAVEL = 600

/**
 * Illustrated stand-in for the photo gallery: a large arch composition built from the stay's cover.
 * Real photos replace it once listings carry images. On desktop the layers drift a few percent as
 * the page scrolls (the one scroll-linked moment here); reduced-motion and mobile stay static.
 */
export function StayGallery({ stay }: { stay: Pick<Stay, 'type' | 'title'> }) {
  const cfg = coverFor(stay.type)
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [desktop, setDesktop] = useState(() => window.matchMedia(DESKTOP).matches)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP)
    const onChange = () => setDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const layers = Array.from(el.querySelectorAll<HTMLElement | SVGElement>('[data-depth]'))
    const reset = () => layers.forEach((l) => (l.style.transform = ''))
    if (reduced || !desktop) {
      reset()
      return
    }
    let frame = 0
    const apply = () => {
      frame = 0
      const p = Math.min(Math.max(window.scrollY / TRAVEL, 0), 1)
      for (const l of layers) {
        const depth = Number(l.dataset.depth)
        const scale = l.dataset.scale ? ` scale(${l.dataset.scale})` : ''
        l.style.transform = `translate3d(0, ${(p * depth * 100).toFixed(2)}%, 0)${scale}`
      }
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      reset()
    }
  }, [reduced, desktop])

  return (
    <div ref={root} role="img" aria-label={`Photos of ${stay.title} are not available yet`} className="w-full sm:mx-auto sm:max-w-sm lg:mx-0 lg:max-w-none">
      <div className="relative aspect-square w-full sm:aspect-[5/6]">
        <span
          data-depth="-0.3"
          className={cn('absolute left-[6%] top-[9%] aspect-square w-[19%] rounded-full will-change-transform', toneBg(cfg.sun))}
        />
        <div className="absolute bottom-0 left-0 h-[46%] w-[36%]">
          <WindowPanel type={stay.type} depth="-0.08" className="size-full will-change-transform" />
        </div>
        <div className="absolute right-0 top-0 h-[90%] w-[68%]">
          <StayCover type={stay.type} parallax className="size-full" />
        </div>
      </div>
      <p className="mt-3 flex flex-wrap items-center gap-x-2 text-caption">
        <span className="font-bold text-ink">{stay.type}</span>
        <span className="text-ink-soft">Photos coming soon</span>
      </p>
    </div>
  )
}
