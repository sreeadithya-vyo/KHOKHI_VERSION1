import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  neutral: 'bg-canvas text-ink-soft border border-line',
}

interface Props extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

/** Status / verification label. */
export function Badge({ tone = 'brand', className, ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-pill px-2.5 py-1 text-caption font-semibold',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
