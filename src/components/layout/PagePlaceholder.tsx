import { Card } from '@/components/ui'

interface Props {
  title: string
  note: string
}

/** Temporary body for routes that are built in later phases. */
export function PagePlaceholder({ title, note }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-h1 font-bold">{title}</h1>
      <Card className="mt-6">
        <p className="text-ink-soft">{note}</p>
      </Card>
    </div>
  )
}
