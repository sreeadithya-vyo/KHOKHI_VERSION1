import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/** Quiet descriptive label (lifestyle, interests, amenities). */
export function Tag({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border border-line bg-surface px-3 py-1 text-caption font-medium text-ink-soft',
        className,
      )}
      {...rest}
    />
  )
}
