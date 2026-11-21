import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/useReducedMotion'

/**
 * True once the element has scrolled into view (and stays true). Reduced-motion users, and browsers
 * without IntersectionObserver, get `true` straight away so nothing is ever hidden or dimmed for good.
 */
export function useLitOnView<T extends Element>() {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSeen(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced])

  return { ref, lit: reduced || seen }
}
