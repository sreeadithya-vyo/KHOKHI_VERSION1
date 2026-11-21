import { useEffect, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useReducedMotion } from '@/lib/useReducedMotion'

interface Props {
  /** Position in the entrance sequence; each step waits 110ms longer. */
  index: number
  className?: string
  children: ReactNode
}

/**
 * Mount-once entrance: one calm rise, staggered by `index`. Used for the result screen only.
 * Reduced-motion users get the content in place immediately.
 */
export function Rise({ index, className, children }: Props) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced)

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const id = window.setTimeout(() => setShown(true), 60)
    return () => window.clearTimeout(id)
  }, [reduced])

  return (
    <div
      style={{ transitionDelay: reduced ? undefined : `${index * 110}ms` }}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none',
        shown ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
