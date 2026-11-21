import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
}

export function FilterChip({ active, className, type = 'button', ...rest }: Props) {
  return (
    <button
      type={type}
      aria-pressed={active}
      className={cn(
        'inline-flex h-10 items-center rounded-pill border px-4 text-caption font-semibold transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-line bg-surface text-ink-soft hover:border-brand-300 hover:text-brand-700',
        className,
      )}
      {...rest}
    />
  )
}
