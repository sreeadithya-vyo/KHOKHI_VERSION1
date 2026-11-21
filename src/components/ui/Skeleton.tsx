import { cn } from '@/lib/cn'

/** Shimmering placeholder block. Size it with className (e.g. "h-4 w-32"). */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden rounded-control bg-line/70',
        "after:absolute after:inset-0 after:-translate-x-full after:animate-[khokhi-shimmer_1.4s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/60 after:to-transparent after:content-['']",
        className,
      )}
    />
  )
}
