import { useId, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

const control =
  'h-11 w-full rounded-control border border-line bg-surface px-3.5 text-body text-ink placeholder:text-muted ' +
  'transition-colors focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600/25'

function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-caption font-semibold text-ink-soft">
        {label}
      </label>
      {children}
      {hint && <p className="text-caption text-muted">{hint}</p>}
    </div>
  )
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
}

export function Input({ label, hint, className, id, ...rest }: InputProps) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <Field id={fieldId} label={label} hint={hint}>
      <input id={fieldId} className={cn(control, className)} {...rest} />
    </Field>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: string
  options: Array<{ value: string; label: string }>
}

export function Select({ label, hint, options, className, id, ...rest }: SelectProps) {
  const auto = useId()
  const fieldId = id ?? auto
  return (
    <Field id={fieldId} label={label} hint={hint}>
      <div className="relative">
        <select id={fieldId} className={cn(control, 'appearance-none pr-10', className)} {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </Field>
  )
}
