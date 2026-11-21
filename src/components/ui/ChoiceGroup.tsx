import { cn } from '@/lib/cn'
import { CheckIcon } from '@/components/icons'

export interface Option<T extends string> {
  value: T
  label: string
  hint?: string
}

interface Props<T extends string> {
  legend: string
  name: string
  options: Option<T>[]
  value: T | undefined
  onChange: (value: T) => void
}

/** Single-choice question rendered as selectable cards (real radio inputs underneath). */
export function ChoiceGroup<T extends string>({ legend, name, options, value, onChange }: Props<T>) {
  return (
    <fieldset>
      <legend className="text-h3 font-bold">{legend}</legend>
      <div className={cn('mt-3 grid gap-3', options.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              'relative flex cursor-pointer flex-col rounded-control border border-line bg-surface p-4 pr-9 transition-colors',
              'hover:border-brand-300 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50',
              'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600',
            )}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            <span className="font-semibold">{o.label}</span>
            {o.hint && <span className="mt-1 text-caption text-ink-soft">{o.hint}</span>}
            {value === o.value && <CheckIcon className="absolute right-3 top-4 size-4 text-brand-700" />}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
