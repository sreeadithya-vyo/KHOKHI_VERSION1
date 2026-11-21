import { cn } from '@/lib/cn'

const sizes = { sm: 'size-8 text-caption', md: 'size-11 text-body', lg: 'h-20 w-16 text-h2', xl: 'h-32 w-24 text-display' }

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
  size?: keyof typeof sizes
  className?: string
}

/** Small sizes are circles; large sizes (lg, xl) are arches, the KHOKHI doorway shape. */
export function Avatar({ name, src, size = 'md', className }: Props) {
  const shape = size === 'lg' || size === 'xl' ? 'arch rounded-b-lg' : 'rounded-full'
  if (src) {
    return <img src={src} alt={name} className={cn('object-cover', shape, sizes[size], className)} />
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center bg-gulabi font-extrabold text-ink',
        shape,
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
