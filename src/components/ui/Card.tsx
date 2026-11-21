import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export function Card({ interactive, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface p-6 shadow-card',
        interactive && 'transition-shadow hover:shadow-lift',
        className,
      )}
      {...rest}
    />
  )
}
