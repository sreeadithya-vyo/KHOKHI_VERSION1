import { cn } from '@/lib/cn'

const initials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

interface Props {
  name: string
  src?: string
  className?: string
}

/** Small doorway-shaped avatar for the chat list and header (the shared Avatar is a circle at small sizes). */
export function ArchAvatar({ name, src, className }: Props) {
  const shape = 'arch h-12 w-10 shrink-0 rounded-b-lg'
  if (src) return <img src={src} alt={name} className={cn('object-cover', shape, className)} />
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center bg-gulabi text-caption font-extrabold text-ink',
        shape,
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
