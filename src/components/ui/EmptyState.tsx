import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-line bg-surface px-6 py-14 text-center">
      <div aria-hidden="true" className="arch mb-5 flex h-20 w-14 items-end justify-center rounded-b-lg bg-haldi-soft pb-3">
        <span className="size-3 rounded-full bg-haldi" />
      </div>
      <h3 className="text-h3 font-semibold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-ink-soft">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
