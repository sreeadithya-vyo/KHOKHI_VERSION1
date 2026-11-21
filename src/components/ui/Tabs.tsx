import { cn } from '@/lib/cn'

interface Props<T extends string> {
  tabs: Array<{ id: T; label: string }>
  value: T
  onChange: (id: T) => void
  label: string
}

export function Tabs<T extends string>({ tabs, value, onChange, label }: Props<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex gap-1 border-b border-line">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          type="button"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            '-mb-px h-12 border-b-[3px] px-4 text-body font-bold transition-colors',
            value === t.id
              ? 'border-haldi text-ink'
              : 'border-transparent text-muted hover:text-ink',
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
