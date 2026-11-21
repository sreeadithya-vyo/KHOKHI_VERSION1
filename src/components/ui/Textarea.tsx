import { useId, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: string
}

export function Textarea({ label, hint, className, id, rows = 4, ...rest }: Props) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-caption font-semibold text-ink-soft">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        className={cn(
          'w-full resize-y rounded-control border border-line bg-surface px-3.5 py-2.5 text-body text-ink placeholder:text-muted',
          'transition-colors focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/25',
          className,
        )}
        {...rest}
      />
      {hint && <p className="text-caption text-muted">{hint}</p>}
    </div>
  )
}
