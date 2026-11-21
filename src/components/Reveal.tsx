import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface Props {
  as?: ElementType
  /** Stagger delay in ms; use `index * 70` for grids and lists. */
  delay?: number
  className?: string
  children: ReactNode
}

/**
 * One calm rise as an element enters the viewport (once). For lists and grids in the app screens:
 * wrap each card, not every element on the page. Reduced-motion users see the content immediately.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      data-shown={shown}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  )
}
